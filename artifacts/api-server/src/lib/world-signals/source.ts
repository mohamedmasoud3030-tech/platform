/**
 * LENA World — authorized product source adapter.
 *
 * One file owns the outbound call to a founder-authorized product endpoint and
 * turns its payload into the canonical snapshot the Command room reads. Like
 * the model adapter (`lib/assistant/gemini.ts`), it is fail-closed and never
 * throws provider detail at a caller:
 *
 * - No endpoint configured  → `not-configured` (the room stays exactly as it is
 *   today: read-only, empty, explicit about the absence).
 * - Unreachable / slow / non-2xx / oversized / malformed → a coarse failure
 *   reason. No partial snapshot is ever produced from a failed read.
 * - No request is ever made to a host that is not the configured one, and the
 *   URL and token never appear in logs, responses, or errors.
 *
 * A snapshot is cached in memory for one TTL window (and single-flighted, so a
 * burst of visitors cannot multiply upstream load). Nothing is persisted.
 */

import { createHash } from "node:crypto";
import {
  WORLD_SIGNAL_LIMITS,
  normalizeSourcePayload,
  type WireWorldSignal,
} from "./contract";

export type WorldSignalSourceReason =
  | "not-configured"
  | "unreachable"
  | "timeout"
  | "rejected"
  | "too-large"
  | "invalid-payload";

export type WorldSignalSourceSnapshot = {
  observedAt: string;
  coversWorlds: string[];
  signals: WireWorldSignal[];
};

export type WorldSignalSourceRead =
  | { status: "available"; snapshot: WorldSignalSourceSnapshot }
  | { status: "unavailable"; reason: WorldSignalSourceReason };

export type WorldSignalSourceConfig = {
  url: string;
  token: string | null;
  timeoutMs: number;
  ttlMs: number;
};

const DEFAULT_TIMEOUT_MS = 4_000;
const DEFAULT_TTL_MS = 60_000;
/** A failing upstream is re-tried sooner than a healthy one, but not per request. */
const FAILURE_TTL_MS = 15_000;
const MAX_TIMEOUT_MS = 15_000;
const MAX_TTL_MS = 5 * 60_000;

function readPositiveInt(raw: string | undefined, fallback: number, max: number): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

/** Read the deployment configuration. Never logs or echoes the token. */
export function worldSignalSourceConfig(env: NodeJS.ProcessEnv = process.env): WorldSignalSourceConfig | null {
  const url = env.LENA_WORLD_SIGNAL_SOURCE_URL?.trim();
  if (!url) return null;
  const token = env.LENA_WORLD_SIGNAL_TOKEN?.trim();
  return {
    url,
    token: token && token.length > 0 ? token : null,
    timeoutMs: readPositiveInt(env.LENA_WORLD_SIGNAL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, MAX_TIMEOUT_MS),
    ttlMs: readPositiveInt(env.LENA_WORLD_SIGNAL_TTL_MS, DEFAULT_TTL_MS, MAX_TTL_MS),
  };
}

export function worldSignalSourceConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return worldSignalSourceConfig(env) !== null;
}

type CacheEntry = { key: string; at: number; read: WorldSignalSourceRead };

let cache: CacheEntry | null = null;
let inFlight: { key: string; promise: Promise<WorldSignalSourceRead> } | null = null;

/**
 * Cache identity is the endpoint plus its budget — never the token itself. A
 * token is hashed so a changed credential cannot serve a stale snapshot, while
 * the value never lands in a string that could be logged by accident.
 */
function cacheKey(config: WorldSignalSourceConfig): string {
  const credential = config.token
    ? createHash("sha256").update(config.token).digest("hex").slice(0, 12)
    : "anonymous";
  return `${config.url}|${config.timeoutMs}|${config.ttlMs}|${credential}`;
}

/** Test seam. Production never calls this. */
export function resetWorldSignalSourceCache(): void {
  cache = null;
  inFlight = null;
}

export type ReadOptions = {
  config?: WorldSignalSourceConfig | null;
  fetchImpl?: typeof fetch;
  now?: () => number;
  /** Bypass the cache (used by the operator status probe). */
  fresh?: boolean;
};

async function performRead(
  config: WorldSignalSourceConfig,
  fetchImpl: typeof fetch,
): Promise<WorldSignalSourceRead> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await fetchImpl(config.url, {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(config.token ? { authorization: `Bearer ${config.token}` } : {}),
      },
      signal: controller.signal,
      // Never forward cookies or referrer to a product endpoint.
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
    });

    if (!response.ok) return { status: "unavailable", reason: "rejected" };

    const body = await response.text();
    if (body.length > WORLD_SIGNAL_LIMITS.maxBodyBytes) {
      return { status: "unavailable", reason: "too-large" };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      return { status: "unavailable", reason: "invalid-payload" };
    }

    const normalized = normalizeSourcePayload(parsed);
    if (!normalized.ok) return { status: "unavailable", reason: "invalid-payload" };

    return {
      status: "available",
      snapshot: {
        observedAt: normalized.snapshot.observedAt,
        coversWorlds: normalized.snapshot.coversWorlds,
        signals: normalized.snapshot.signals,
      },
    };
  } catch (error) {
    const aborted =
      (error instanceof Error && error.name === "AbortError") ||
      (typeof error === "object" && error !== null && (error as { name?: string }).name === "AbortError");
    return { status: "unavailable", reason: aborted ? "timeout" : "unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Read the authorized source. Cached for one TTL window; concurrent callers
 * share a single upstream request.
 */
export async function readWorldSignalSource(options: ReadOptions = {}): Promise<WorldSignalSourceRead> {
  const config = options.config === undefined ? worldSignalSourceConfig() : options.config;
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? (() => Date.now());

  if (!config) return { status: "unavailable", reason: "not-configured" };

  const key = cacheKey(config);
  const timestamp = now();
  const hit = cache && cache.key === key ? cache : null;
  const ttl = hit ? (hit.read.status === "available" ? config.ttlMs : FAILURE_TTL_MS) : 0;
  if (!options.fresh && hit && timestamp - hit.at < ttl) return hit.read;
  if (!options.fresh && inFlight && inFlight.key === key) return inFlight.promise;

  const pending = performRead(config, fetchImpl)
    .then((read) => {
      cache = { key, at: now(), read };
      return read;
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = { key, promise: pending };
  return pending;
}
