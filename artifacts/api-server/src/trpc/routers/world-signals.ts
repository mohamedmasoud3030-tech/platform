/**
 * World signals — the read surface for World Command.
 *
 * `snapshot` is public and read-only. It returns either an `available`
 * observation from the founder-authorized product source or an explicit
 * `unavailable` with a coarse reason; it never fabricates a quiet world, and it
 * never exposes the endpoint, the token, or upstream error text.
 *
 * `probe` is the operator side of the same adapter: admin-only, cache-bypassing,
 * and still content-free — it reports whether the configured source answers
 * right now, so an operator can tell "not configured" from "configured but
 * down" without opening the product.
 */

import { createRouter, publicQuery, adminQuery } from "../middleware";
import { logger } from "../../lib/logger";
import type { WireWorldSignal } from "../../lib/world-signals/contract";
import {
  readWorldSignalSource,
  worldSignalSourceConfigured,
  type WorldSignalSourceReason,
} from "../../lib/world-signals/source";

export type WorldSignalsSnapshot =
  | {
      availability: "unavailable";
      reason: WorldSignalSourceReason;
      observedAt: null;
      writable: false;
      coversWorlds: [];
      signals: [];
    }
  | {
      availability: "available";
      reason: null;
      observedAt: string;
      writable: false;
      coversWorlds: string[];
      signals: WireWorldSignal[];
    };

/**
 * LENA is a reader of product operations, never a writer back into a product:
 * the source contract has no write path, so `writable` is always false and the
 * room will not offer a mutation it cannot persist.
 */
const WRITABLE = false as const;

export const worldSignalsRouter = createRouter({
  snapshot: publicQuery.query(async () => {
    const startedAt = Date.now();
    const read = await readWorldSignalSource();
    logger.info(
      {
        route: "worldSignals.snapshot",
        status: read.status,
        reason: read.status === "unavailable" ? read.reason : null,
        signals: read.status === "available" ? read.snapshot.signals.length : 0,
        worlds: read.status === "available" ? read.snapshot.coversWorlds.length : 0,
        latencyMs: Date.now() - startedAt,
      },
      "world signal snapshot read",
    );

    if (read.status === "unavailable") {
      return {
        availability: "unavailable" as const,
        reason: read.reason,
        observedAt: null,
        writable: WRITABLE,
        coversWorlds: [] as [],
        signals: [] as [],
      };
    }

    return {
      availability: "available" as const,
      reason: null,
      observedAt: read.snapshot.observedAt,
      writable: WRITABLE,
      coversWorlds: read.snapshot.coversWorlds,
      signals: read.snapshot.signals,
    };
  }),

  /** Operator freshness probe: bypasses the cache and reports shape, not content. */
  probe: adminQuery.query(async () => {
    const read = await readWorldSignalSource({ fresh: true });
    return {
      configured: worldSignalSourceConfigured(),
      status: read.status,
      reason: read.status === "unavailable" ? read.reason : null,
      observedAt: read.status === "available" ? read.snapshot.observedAt : null,
      signals: read.status === "available" ? read.snapshot.signals.length : 0,
      worlds: read.status === "available" ? read.snapshot.coversWorlds : [],
    };
  }),
});
