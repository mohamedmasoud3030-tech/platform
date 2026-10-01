/**
 * LENA World — authorized product signal contract (v1).
 *
 * This file defines the ONLY shape a product may use to publish operational
 * signals into World Command. It is a wire contract, not a product registry:
 * worlds stay owned by the client's canonical `content/systems.ts`, and this
 * module never decides which worlds exist — it decides which payloads are
 * structurally truthful enough to be shown at all.
 *
 * Rules:
 * - Every field is validated. A payload that does not match is rejected as a
 *   whole (`invalid-payload`) — the room then reports "unavailable" and shows
 *   nothing, because a partially-understood payload can silently understate a
 *   critical state.
 * - `worlds` is the source's declared coverage. A world the source does not
 *   declare is "unavailable", never "quiet": absence of observation is not
 *   evidence of calm.
 * - No text from this contract is ever rendered as trusted markup; the client
 *   renders it as plain localized strings on fixed elements.
 * - Nothing in the payload is stored. Snapshots are held in memory for one TTL
 *   window and replaced wholesale.
 */

import { z } from "zod";

/** Handshake value. A source that speaks a different protocol is rejected. */
export const WORLD_SIGNAL_PROTOCOL = "lena.world-signals/1";

export const WORLD_SIGNAL_LIMITS = {
  /** Hard cap on the upstream response body, checked before parsing. */
  maxBodyBytes: 262_144,
  maxSignals: 64,
  maxWorlds: 16,
  maxIdLength: 64,
  maxWorldIdLength: 32,
  maxTitleLength: 200,
  maxDescriptionLength: 600,
  maxTargetPathLength: 96,
  maxContextKeys: 8,
  maxContextKeyLength: 32,
  maxContextValueLength: 120,
} as const;

export const SIGNAL_KINDS = [
  "activity",
  "operational-change",
  "attention-needed",
  "milestone",
  "degraded",
  "resolved",
] as const;

export const SIGNAL_SEVERITIES = ["ambient", "information", "attention", "critical"] as const;

export const SIGNAL_LIFECYCLES = ["new", "active", "acknowledged", "resolved"] as const;

export type WireSignalKind = (typeof SIGNAL_KINDS)[number];
export type WireSignalSeverity = (typeof SIGNAL_SEVERITIES)[number];
export type WireSignalLifecycle = (typeof SIGNAL_LIFECYCLES)[number];

export type WireLocalizedText = { ar: string; en: string };

export type WireWorldSignal = {
  id: string;
  world: string;
  kind: WireSignalKind;
  severity: WireSignalSeverity;
  timestamp: string;
  title: WireLocalizedText;
  description: WireLocalizedText;
  targetPath?: string;
  context?: Record<string, string>;
  lifecycle: WireSignalLifecycle;
};

export type WireWorldSignalPayload = {
  protocol: typeof WORLD_SIGNAL_PROTOCOL;
  observedAt: string;
  worlds: string[];
  signals: WireWorldSignal[];
};

export type NormalizedSourceSnapshot = {
  observedAt: string;
  coversWorlds: string[];
  signals: WireWorldSignal[];
};

export type PayloadRejection =
  | "not-an-object"
  | "protocol-mismatch"
  | "missing-observed-at"
  | "invalid-observed-at"
  | "missing-worlds"
  | "invalid-signal";

export type PayloadResult =
  | { ok: true; snapshot: NormalizedSourceSnapshot }
  | { ok: false; reason: PayloadRejection };

const WORLD_ID_PATTERN = /^[a-z][a-z0-9-]*$/;
const SIGNAL_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/;

const isoInstant = z
  .string()
  .max(40)
  .refine((value) => {
    const parsed = Date.parse(value);
    return !Number.isNaN(parsed);
  }, "must be an ISO 8601 instant");

const localizedText = z.object({
  ar: z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxDescriptionLength),
  en: z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxDescriptionLength),
});

const tick = z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxTitleLength);

const contextMap = z
  .record(z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxContextValueLength))
  .refine(
    (value) =>
      Object.keys(value).length <= WORLD_SIGNAL_LIMITS.maxContextKeys &&
      Object.keys(value).every((key) => key.length <= WORLD_SIGNAL_LIMITS.maxContextKeyLength),
    "context is too large",
  );

const signalSchema = z.object({
  id: z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxIdLength).regex(SIGNAL_ID_PATTERN),
  world: z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxWorldIdLength).regex(WORLD_ID_PATTERN),
  kind: z.enum(SIGNAL_KINDS),
  severity: z.enum(SIGNAL_SEVERITIES),
  timestamp: isoInstant,
  title: z.object({ ar: tick, en: tick }),
  description: localizedText,
  targetPath: z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxTargetPathLength).optional(),
  context: contextMap.optional(),
  lifecycle: z.enum(SIGNAL_LIFECYCLES),
});

const payloadSchema = z.object({
  protocol: z.string().trim(),
  observedAt: isoInstant,
  worlds: z.array(z.string().trim().min(1).max(WORLD_SIGNAL_LIMITS.maxWorldIdLength).regex(WORLD_ID_PATTERN)).max(WORLD_SIGNAL_LIMITS.maxWorlds),
  signals: z.array(signalSchema).max(WORLD_SIGNAL_LIMITS.maxSignals),
});

/**
 * A source may only point a signal at its own canonical chamber path. Anything
 * else (an external URL, another world, a relative path) is dropped rather
 * than rendered as a link the product does not own.
 */
function normalizeTargetPath(world: string, targetPath: string | undefined): string | undefined {
  if (!targetPath) return undefined;
  const expected = `/world/${world}`;
  return targetPath === expected ? expected : undefined;
}

/**
 * Validate an upstream payload and normalize it into the canonical snapshot.
 *
 * Normalization is deliberately conservative:
 * - unknown fields are dropped (forward compatibility for additive fields);
 * - `worlds` is widened by the worlds actually observed in `signals`, because a
 *   signal is itself proof of observation;
 * - duplicate ids keep the most recent signal so a stale repeat cannot mask a
 *   newer state.
 */
export function normalizeSourcePayload(raw: unknown): PayloadResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, reason: "not-an-object" };
  }

  const envelope = raw as Record<string, unknown>;
  if (typeof envelope.protocol !== "string") return { ok: false, reason: "protocol-mismatch" };
  if (envelope.protocol.trim() !== WORLD_SIGNAL_PROTOCOL) return { ok: false, reason: "protocol-mismatch" };
  if (!("observedAt" in envelope)) return { ok: false, reason: "missing-observed-at" };
  if (typeof envelope.observedAt !== "string") return { ok: false, reason: "invalid-observed-at" };
  if (!("worlds" in envelope)) return { ok: false, reason: "missing-worlds" };

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.join(".") ?? "";
    if (path.startsWith("observedAt")) return { ok: false, reason: "invalid-observed-at" };
    if (path === "protocol") return { ok: false, reason: "protocol-mismatch" };
    if (path === "worlds") return { ok: false, reason: "missing-worlds" };
    return { ok: false, reason: "invalid-signal" };
  }

  const byId = new Map<string, WireWorldSignal>();
  for (const signal of parsed.data.signals) {
    const normalized: WireWorldSignal = {
      id: signal.id,
      world: signal.world,
      kind: signal.kind,
      severity: signal.severity,
      timestamp: signal.timestamp,
      title: signal.title,
      description: signal.description,
      lifecycle: signal.lifecycle,
    };
    const targetPath = normalizeTargetPath(signal.world, signal.targetPath);
    if (targetPath) normalized.targetPath = targetPath;
    if (signal.context) normalized.context = { ...signal.context };

    const existing = byId.get(normalized.id);
    if (!existing || Date.parse(normalized.timestamp) >= Date.parse(existing.timestamp)) {
      byId.set(normalized.id, normalized);
    }
  }

  const signals = [...byId.values()].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
  );

  const covers = new Set(parsed.data.worlds);
  for (const signal of signals) covers.add(signal.world);

  return {
    ok: true,
    snapshot: {
      observedAt: parsed.data.observedAt,
      coversWorlds: [...covers].sort(),
      signals,
    },
  };
}
