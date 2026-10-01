import type { SystemId } from "@/content/systems";
import type { AppLocale } from "@/providers/preferences";

/** Lifecycle of a world-level signal. */
export type SignalLifecycle = "new" | "active" | "acknowledged" | "resolved";

/** Importance of a signal — spatial energy, not a badge colour. */
export type SignalSeverity = "ambient" | "information" | "attention" | "critical";

/** What kind of event this is, independent of product internals. */
export type SignalKind =
  | "activity"
  | "operational-change"
  | "attention-needed"
  | "milestone"
  | "degraded"
  | "resolved";

export type LocalizedText = Record<AppLocale, string>;

export type WorldSignal = {
  id: string;
  sourceWorld: SystemId;
  kind: SignalKind;
  severity: SignalSeverity;
  timestamp: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Existing spatial destination, typically `/world/:systemId`. */
  targetPath?: string;
  context?: Record<string, string>;
  lifecycle: SignalLifecycle;
};

/**
 * Source authority for the signal snapshot.
 *
 * An empty array is not evidence of a quiet world. Consumers must inspect this
 * state first. The unavailable value is the production default until an
 * authorized product source exists; fixtures may explicitly provide an
 * available source in tests or a named demo harness.
 */
/**
 * Why nothing is observable.
 *
 * `no-authorized-product-source` is the production default: no product endpoint
 * is configured, so the room is explicitly blind. The remaining values describe
 * a configured source that did not answer: they are coarse transport facts, never
 * upstream error text, and they exist so the room can say *which* absence it is
 * looking at instead of pretending the source was never plugged in.
 *
 * `uncovered-worlds` is derived locally: the source answered, but covers no world
 * that LENA publishes, so there is still nothing to observe.
 */
export type SignalSourceUnavailableReason =
  | "no-authorized-product-source"
  | "not-configured"
  | "unreachable"
  | "timeout"
  | "rejected"
  | "too-large"
  | "invalid-payload"
  | "uncovered-worlds";

export type SignalSourceState =
  | {
      availability: "unavailable";
      reason: SignalSourceUnavailableReason;
      observedAt: null;
      writable: false;
      /** Coverage is only meaningful for an available source. */
      coversWorlds: readonly SystemId[];
    }
  | {
      availability: "available";
      observedAt: string;
      writable: boolean;
      /**
       * The worlds this source actually observes. A world outside this list is
       * `unavailable`, never `quiet`: an unobserved world is not a calm one.
       */
      coversWorlds: readonly SystemId[];
    };

export const UNAVAILABLE_SIGNAL_SOURCE: SignalSourceState = {
  availability: "unavailable",
  reason: "no-authorized-product-source",
  observedAt: null,
  writable: false,
  coversWorlds: [],
};



/** An observation-derived per-world state. `unavailable` is not `quiet`. */
export type WorldPresence = "unavailable" | "quiet" | "active" | "attention" | "critical";

export type GlobalWorldState = "calm" | "active" | "attention" | "critical";

export const SEVERITY_RANK: Record<SignalSeverity, number> = {
  ambient: 0,
  information: 1,
  attention: 2,
  critical: 3,
};

export const PRESENCE_RANK: Record<WorldPresence, number> = {
  unavailable: -1,
  quiet: 0,
  active: 1,
  attention: 2,
  critical: 3,
};
