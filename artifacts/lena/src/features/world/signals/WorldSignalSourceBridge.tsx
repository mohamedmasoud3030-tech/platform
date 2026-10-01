import { useEffect } from "react";
import { trpc } from "@/providers/trpc";
import {
  applyWorldSignalSnapshot,
  markWorldSignalSourceUnreachable,
} from "./transport";

/**
 * Production composition for the world signal source.
 *
 * Rendered once, inside `TRPCProvider`, and renders nothing: it reads the
 * server's validated snapshot and hydrates the client store. It is deliberately
 * NOT exported from the signals barrel — the domain modules stay free of
 * transport concerns, and only the application entry point composes them.
 *
 * Failure policy is fail-closed:
 * - no data yet  → the store keeps its unavailable default;
 * - payload that cannot be trusted → `invalid-payload`, signals cleared;
 * - our own API unreachable → `unreachable`, signals cleared, so a room that
 *   was live one minute ago cannot keep claiming to be live from stale state.
 */
export function WorldSignalSourceBridge() {
  const snapshot = trpc.worldSignals.snapshot.useQuery(undefined, {
    // A pulse does not need sub-minute resolution, and the server caches
    // upstream reads for a TTL window anyway.
    refetchInterval: 60_000,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const { data, isError } = snapshot;

  useEffect(() => {
    if (data) {
      applyWorldSignalSnapshot(data);
      return;
    }
    if (isError) markWorldSignalSourceUnreachable();
  }, [data, isError]);

  return null;
}
