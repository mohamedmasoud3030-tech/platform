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
 * How far each system is complete, 0–1. The loom paints solid light from
 * the start of the thread up to this ratio; the last lit point blinks.
 * Documented systems are 1. Terranex ~70%, Kayyal ~85%.
 */
export const SYSTEM_COMPLETION: Record<SystemId, number> = {
  property: 1,
  investment: 0.7,
  wellness: 1,
  rental: 1,
  hospitality: 0.92,
  recycling: 0.85,
  materials: 0,
  // أنظمة نيل: مبنية ومُختبَرة مع أدلة تشغيل حقيقية — لا تُرسم في الوردة (الوردة ستة بيوت).
  "nile-pos": 1,
  "nile-inventory": 1,
  "nile-restaurant": 1,
  "nile-clinic": 1,
  "nile-courts": 1,
  "nile-hr": 1,
  "nile-sites": 1,
};

export function completionFor(id: SystemId): number {
  const value = SYSTEM_COMPLETION[id];
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

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
