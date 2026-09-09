import type { AppLocale } from "@/providers/preferences";
import type { SystemId } from "@/content/systems";
import { frontageRooms, type FrontageRoom } from "./frontage-rooms";

/**
 * OWNER DIRECTIVE — Rose hero only, temporary.
 *
 * Rental (Carmen Gallery) and hospitality are declared ready in real
 * operation; their evidence captures land later. Until then the Rose gilds
 * them as READY: the petal and chip light up, but the reading card keeps the
 * honest distinction (موثّق for evidence-backed systems, جاهز for these two,
 * قيد التوثيق for the rest). Every other surface keeps the strict
 * evidence-only rule. Remove entries here as evidence lands — never add a
 * system the owner has not declared ready.
 */
export const ROSE_OWNER_READY: readonly SystemId[] = ["rental", "hospitality"];

export const ROSE_READY_LABEL: Record<AppLocale, string> = { ar: "جاهز", en: "READY" };

/**
 * The six public systems in owner order, mapped onto the Rose Engine's six
 * petals (the R5 hero: "a window the master masons drew with compasses").
 *
 * `documented` stays purely evidence-based (the canonical rule every other
 * surface uses). `lit` is the Rose's wider flame: evidence-backed gilding
 * plus the temporary owner-ready directive above.
 */
export type RoseBody = FrontageRoom & {
  ownerIndex: number;
  ownerReady: boolean;
  lit: boolean;
};

export function roseBodies(): RoseBody[] {
  return frontageRooms().map((room, ownerIndex) => {
    const ownerReady =
      !room.documented && (ROSE_OWNER_READY as readonly string[]).includes(room.system.id);
    return { ...room, ownerIndex, ownerReady, lit: room.documented || ownerReady };
  });
}
