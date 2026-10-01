import type { WorldSignal, SignalSourceState } from "./types.ts";
import { UNAVAILABLE_SIGNAL_SOURCE } from "./types.ts";
import { acknowledgeSignal, resolveSignal } from "./derive.ts";

export type SignalStore = {
  getSnapshot: () => WorldSignal[];
  getSource: () => SignalSourceState;
  subscribe: (listener: () => void) => () => void;
  emit: (signal: WorldSignal) => void;
  acknowledge: (id: string) => void;
  resolve: (id: string) => void;
  reset: (signals?: WorldSignal[]) => void;
  /**
   * Replace the whole observation with a server-validated snapshot.
   *
   * This is the only path by which a production runtime can become `available`,
   * and it is total: an unavailable snapshot clears the signals as well as the
   * source, so a source that goes down can never leave a stale "live" room
   * behind. Hydration is refused for a writable source state that the caller
   * cannot have obtained from the read-only server contract.
   */
  hydrate: (snapshot: { source: SignalSourceState; signals: readonly WorldSignal[] }) => void;
};

/**
 * Client-only signal store.
 *
 * The default is intentionally an empty, unavailable source. Demo signals are
 * never imported here, so a fresh production runtime cannot present simulated
 * activity or attention. Tests and an explicitly named harness can pass both a
 * seed and an available source contract.
 */
export function createSignalStore(
  seed: WorldSignal[] = [],
  source: SignalSourceState = UNAVAILABLE_SIGNAL_SOURCE,
): SignalStore {
  const initialSeed = seed.map((s) => ({ ...s }));
  let signals = initialSeed.map((s) => ({ ...s }));
  let currentSource: SignalSourceState = source;
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    getSnapshot: () => signals,
    getSource: () => currentSource,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit: (signal) => {
      if (!currentSource.writable) return;
      const rest = signals.filter((s) => s.id !== signal.id);
      signals = [signal, ...rest];
      notify();
    },
    acknowledge: (id) => {
      if (!currentSource.writable) return;
      let changed = false;
      signals = signals.map((s) => {
        if (s.id !== id) return s;
        changed = true;
        return acknowledgeSignal(s);
      });
      if (changed) notify();
    },
    resolve: (id) => {
      if (!currentSource.writable) return;
      let changed = false;
      signals = signals.map((s) => {
        if (s.id !== id) return s;
        changed = true;
        return resolveSignal(s);
      });
      if (changed) notify();
    },
    reset: (next = initialSeed) => {
      if (!currentSource.writable) return;
      signals = next.map((s) => ({ ...s }));
      notify();
    },
    hydrate: (snapshot) => {
      // The read surface never returns a writable source. Refusing it here keeps
      // a future mistake from turning hydration into a mutation authority.
      if (snapshot.source.writable) return;
      const previousSource = currentSource;
      const previousSignals = signals;
      const next =
        snapshot.source.availability === "available"
          ? snapshot.signals.map((s) => ({ ...s }))
          : [];

      currentSource = snapshot.source;
      signals = next;

      const unchanged =
        sameSource(previousSource, snapshot.source) &&
        next.length === previousSignals.length &&
        next.every((signal, index) => sameSignal(signal, previousSignals[index]));
      if (!unchanged) notify();
    },
  };
}

function sameSource(a: SignalSourceState, b: SignalSourceState): boolean {
  if (a.availability !== b.availability) return false;
  if (a.observedAt !== b.observedAt) return false;
  if (a.writable !== b.writable) return false;
  if (a.coversWorlds.length !== b.coversWorlds.length) return false;
  if (a.coversWorlds.some((world, index) => world !== b.coversWorlds[index])) return false;
  if (a.availability === "unavailable" && b.availability === "unavailable") {
    return a.reason === b.reason;
  }
  return true;
}

/** Value comparison for one signal; signals are small, flat, JSON-shaped data. */
function sameSignal(a: WorldSignal, b: WorldSignal | undefined): boolean {
  if (!b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Production composition: no seed and no authorized source. */
export const worldSignalStore = createSignalStore();
