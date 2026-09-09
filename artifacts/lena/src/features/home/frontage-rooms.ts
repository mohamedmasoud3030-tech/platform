import { publicSystems, type SystemId } from "@/content/systems";
import { evidenceFor } from "@/features/world/content/evidence";

/**
 * The six public systems in owner order, mapped onto the Home frontage's six
 * windows (House Ledger hero: "a house you can see from the street at night,
 * with lights on where systems actually run").
 *
 * A window is lit iff the canonical evidence registry documents the system —
 * the exact same rule the card windows use (`SystemGrid.windowFor`). Stage
 * words (in-use/trial) are internal canonical truth and are never consulted
 * here: a dim window states documentation status, never a lifecycle claim.
 */
export type FrontageRoom = {
  system: ReturnType<typeof publicSystems>[number];
  documented: boolean;
};

export function frontageRooms(): FrontageRoom[] {
  return publicSystems().map((system) => ({
    system,
    documented: isFrontageWindowLit(system.id),
  }));
}

/** Evidence-presence rule shared with the card windows. */
export function isFrontageWindowLit(systemId: string): boolean {
  return (evidenceFor(systemId as SystemId)?.length ?? 0) > 0;
}
