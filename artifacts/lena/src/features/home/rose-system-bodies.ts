import type { AppLocale } from "@/providers/preferences";
import type { SystemId } from "@/content/systems";
import { frontageRooms, type FrontageRoom } from "./frontage-rooms";

/**
 * OWNER DIRECTIVE — Rose hero only, temporary.
 *
 * Owner-declared ready in real operation; evidence captures land later.
 * Terranex (~70%) and Kayyal (~85%) join Carmen Gallery and hospitality so
 * they gild now, not last. The reading card keeps the honest distinction
 * (موثّق for evidence-backed systems, جاهز for these). Every other surface
 * keeps the strict evidence-only rule.
 */
export const ROSE_OWNER_READY: readonly SystemId[] = [
  "rental",
  "hospitality",
  "investment",
  "recycling",
];

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
