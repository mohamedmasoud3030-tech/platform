/**
 * World signal transport — the wire → runtime boundary.
 *
 * The server (`worldSignals.snapshot`) is the only producer of `available`
 * observations, and it validates upstream payloads itself. This module still
 * re-validates the response before it can touch the runtime store, because a
 * boundary that trusts its own transport is not a boundary:
 *
 * - anything structurally unusable becomes `unavailable`, never a partial room;
 * - a signal for a world that is not published by `publicSystems()` is dropped
 *   (the client owns the registry, the source owns only observations);
 * - a `targetPath` is kept only when it is exactly this world's canonical
 *   chamber path, so the room can never render a link the product does not own;
 * - a failure to reach our own API clears any previous observation instead of
 *   leaving a stale "live" room on screen.
 */

import { WORLD_ENTITIES, worldPathFor } from "../content/world";
import type { SystemId } from "@/content/systems";
import type {
  WireSignalKind,
  WireSignalLifecycle,
  WireSignalSeverity,
} from "../../../../../api-server/src/lib/world-signals/contract";
import {
  UNAVAILABLE_SIGNAL_SOURCE,
  type SignalLifecycle,
  type SignalSeverity,
  type SignalSourceState,
  type SignalSourceUnavailableReason,
  type WorldSignal,
} from "./types";
import { worldSignalStore } from "./runtime";

/** Mirrors the server contract. `satisfies` keeps the three lists from drifting. */
const KINDS = ["activity", "operational-change", "attention-needed", "milestone", "degraded", "resolved"] as const satisfies readonly WireSignalKind[];
const SEVERITIES = ["ambient", "information", "attention", "critical"] as const satisfies readonly WireSignalSeverity[];
const LIFECYCLES = ["new", "active", "acknowledged", "resolved"] as const satisfies readonly WireSignalLifecycle[];

// Compile-time exhaustiveness: a kind added to the server contract without a
// matching client value list fails the typecheck here.
type MissingKind = Exclude<WireSignalKind, (typeof KINDS)[number]>;
type MissingSeverity = Exclude<WireSignalSeverity, (typeof SEVERITIES)[number]>;
type MissingLifecycle = Exclude<WireSignalLifecycle, (typeof LIFECYCLES)[number]>;
const _contractCoversKinds: MissingKind[] = [];
const _contractCoversSeverities: MissingSeverity[] = [];
const _contractCoversLifecycles: MissingLifecycle[] = [];
void _contractCoversKinds;
void _contractCoversSeverities;
void _contractCoversLifecycles;

const ID_MAX = 64;
const TEXT_MAX = 600;
const CONTEXT_MAX_KEYS = 8;
const CONTEXT_MAX_VALUE = 120;

const WORLD_IDS = new Set<string>(WORLD_ENTITIES.map((entity) => entity.systemId));

const SERVER_REASONS: Record<string, SignalSourceUnavailableReason> = {
  "not-configured": "not-configured",
  unreachable: "unreachable",
  timeout: "timeout",
  rejected: "rejected",
  "too-large": "too-large",
  "invalid-payload": "invalid-payload",
};

export type WorldSignalRuntimeSnapshot = {
  source: SignalSourceState;
  signals: WorldSignal[];
};

export function unavailableSignalSource(
  reason: SignalSourceUnavailableReason,
): SignalSourceState {
  return {
    availability: "unavailable",
    reason,
    observedAt: null,
    writable: false,
    coversWorlds: [],
  };
}

/** A small, total reader: any non-string or empty string is `null`. */
function readString(value: unknown, max = TEXT_MAX): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > max) return null;
  return trimmed;
}

function readInstant(value: unknown): string | null {
  const text = readString(value, 40);
  if (!text || Number.isNaN(Date.parse(text))) return null;
  return text;
}

function readLocalized(value: unknown): { ar: string; en: string } | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  const ar = readString(record.ar);
  const en = readString(record.en);
  if (!ar || !en) return null;
  return { ar, en };
}

function readContext(value: unknown): Record<string, string> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0 || entries.length > CONTEXT_MAX_KEYS) return undefined;
  const context: Record<string, string> = {};
  for (const [key, raw] of entries) {
    if (key.length === 0 || key.length > 32) return undefined;
    const signalValue = readString(raw, CONTEXT_MAX_VALUE);
    if (!signalValue) return undefined;
    context[key] = signalValue;
  }
  return context;
}

function toRuntimeSignal(raw: unknown): WorldSignal | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;

  const id = readString(record.id, ID_MAX);
  const world = readString(record.world, 32);
  if (!id || !world || !WORLD_IDS.has(world)) return null;

  const kind = readString(record.kind, 32);
  const severity = readString(record.severity, 32);
  const lifecycle = readString(record.lifecycle, 32);
  if (!kind || !(KINDS as readonly string[]).includes(kind)) return null;
  if (!severity || !(SEVERITIES as readonly string[]).includes(severity)) return null;
  if (!lifecycle || !(LIFECYCLES as readonly string[]).includes(lifecycle)) return null;

  const timestamp = readInstant(record.timestamp);
  const title = readLocalized(record.title);
  const description = readLocalized(record.description);
  if (!timestamp || !title || !description) return null;

  const systemId = world as SystemId;
  const canonicalPath = worldPathFor(systemId);
  const targetPath = record.targetPath === canonicalPath ? canonicalPath : undefined;
  const context = readContext(record.context);

  return {
    id,
    sourceWorld: systemId,
    kind: kind as WorldSignal["kind"],
    severity: severity as SignalSeverity,
    timestamp,
    title,
    description,
    ...(targetPath ? { targetPath } : {}),
    ...(context ? { context } : {}),
    lifecycle: lifecycle as SignalLifecycle,
  };
}

/**
 * Validate a server snapshot. Returns `null` when the response cannot be
 * trusted at all; the caller must then treat the source as unavailable.
 */
export function validateWorldSignalSnapshot(raw: unknown): WorldSignalRuntimeSnapshot | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;

  if (record.availability === "unavailable") {
    const reasonText = typeof record.reason === "string" ? record.reason : "";
    // An unknown reason is still a refusal to answer: keep the room closed and
    // describe it with the closest transport truth rather than guessing.
    const reason = SERVER_REASONS[reasonText] ?? "unreachable";
    return { source: unavailableSignalSource(reason), signals: [] };
  }

  if (record.availability !== "available") return null;

  const observedAt = readInstant(record.observedAt);
  if (!observedAt) return null;

  const declared = Array.isArray(record.coversWorlds)
    ? record.coversWorlds.filter(
        (world): world is SystemId => typeof world === "string" && WORLD_IDS.has(world),
      )
    : [];

  const signals: WorldSignal[] = [];
  if (Array.isArray(record.signals)) {
    for (const candidate of record.signals) {
      const signal = toRuntimeSignal(candidate);
      if (signal) signals.push(signal);
    }
  }

  const covers = new Set<SystemId>(declared);
  for (const signal of signals) covers.add(signal.sourceWorld);

  // The source answered but observes nothing LENA publishes: there is no room
  // to show, and saying "calm" would invent an observation.
  if (covers.size === 0) {
    return { source: unavailableSignalSource("uncovered-worlds"), signals: [] };
  }

  return {
    source: {
      availability: "available",
      observedAt,
      // The product contract has no write path, so readiness to mutate is
      // always false; the room never offers an action it cannot persist.
      writable: false,
      coversWorlds: [...covers],
    },
    signals,
  };
}

/**
 * Apply a server snapshot to the production store. Returns whether the payload
 * was usable; an unusable payload fails closed.
 */
export function applyWorldSignalSnapshot(raw: unknown): boolean {
  const validated = validateWorldSignalSnapshot(raw);
  if (!validated) {
    worldSignalStore.hydrate({
      source: unavailableSignalSource("invalid-payload"),
      signals: [],
    });
    return false;
  }
  worldSignalStore.hydrate(validated);
  return true;
}

/** Called when the Command API itself cannot be reached. Clears any stale room. */
export function markWorldSignalSourceUnreachable(): void {
  worldSignalStore.hydrate({
    source: unavailableSignalSource("unreachable"),
    signals: [],
  });
}
