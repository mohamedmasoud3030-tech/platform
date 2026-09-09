import { frontageRooms, type FrontageRoom } from "./frontage-rooms";

/**
 * The six public systems in owner order, mapped onto the Rose Engine's six
 * petals (the R5 hero: "a window the master masons drew with compasses").
 *
 * A petal gilds iff the canonical evidence registry documents the system —
 * the exact same rule the frontage windows and card windows use. Stage words
 * (in-use/trial) are internal canonical truth and are never consulted here:
 * a stonework petal states documentation status, never a lifecycle claim.
 */
export type RoseBody = FrontageRoom & { ownerIndex: number };

export function roseBodies(): RoseBody[] {
  return frontageRooms().map((room, ownerIndex) => ({ ...room, ownerIndex }));
}
