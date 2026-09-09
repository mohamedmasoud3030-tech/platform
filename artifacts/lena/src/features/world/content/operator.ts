import type { AppLocale } from "@/providers/preferences";
import type { SystemId } from "@/content/systems";

/**
 * Operator records — decision D6 ("Speak to the operator, not only the buyer"),
 * roadmap R7, and OPEN_DECISIONS B-10 (execution checklist T2-1).
 *
 * Each record answers, in one short passage, who runs the system day to day and
 * what changes in the daily work for those staff. The passage is composed
 * STRICTLY from fragments already documented in the founder-registered register
 * (`content/systems.ts`: beneficiaries, usage, does, workflowCycle) — the B2
 * per-product content. No capability, role, or behaviour is invented here.
 *
 * Evidence gate: a record may exist only for a system that has real registered
 * evidence in `SYSTEM_EVIDENCE`. The remaining public systems gain their
 * operator record in the same tranche that registers their evidence (Tier 1);
 * until then their chamber already carries the honest pending state.
 *
 * The D6 aspects that are NOT yet documented by the founder (offline
 * behaviour, how corrections are made, training effort) are listed in `open`
 * and rendered as an explicit, honest gap — never guessed.
 */

export type OperatorAspectId = "offline" | "corrections" | "training";

/** Documented label per open aspect, for the honest gap line. */
export const OPERATOR_ASPECT_LABELS: Record<OperatorAspectId, Record<AppLocale, string>> = {
  offline: { en: "offline behaviour", ar: "السلوك دون اتصال" },
  corrections: { en: "how corrections are made", ar: "طريقة تصحيح الأخطاء" },
  training: { en: "training effort", ar: "جهد التدريب" },
};

export type OperatorRecord = {
  systemId: SystemId;
  /**
   * Short operator answer (EN ≤ 80 words), composed verbatim from the
   * system's own registered fields. AR mirrors the same fragments.
   */
  summary: Record<AppLocale, string>;
  /** D6/R7 aspects awaiting founder documentation — never invented. */
  open: OperatorAspectId[];
};

export const OPERATOR_RECORDS: Partial<Record<SystemId, OperatorRecord>> = {
  property: {
    systemId: "property",
    summary: {
      // Operated-by roles: property.beneficiaries.en[1] / ar[1] (verbatim).
      // Daily-work clause: property.usage.en / ar (verbatim fragment).
      ar: "يشغّلها يوميًا مدير المكتب الذي يشغّل الأصول للغير — تواريخ التجديد والتحصيل تُتابَع من النظام لا من الذاكرة، وطلبات الصيانة تُسجَّل وتُتابَع حتى الإغلاق، وتقرير المالك يخرج جاهزًا بدل تجميعه يدويًا آخر الشهر.",
      en: "Run day to day by the office manager operating assets for others — renewal and collection dates are tracked by the system rather than from memory, maintenance requests are logged and followed to closure, and the owner report comes out ready instead of being assembled by hand at month end.",
    },
    open: ["offline", "corrections", "training"],
  },
  wellness: {
    systemId: "wellness",
    summary: {
      // Operated-by roles: wellness.beneficiaries.en / ar (verbatim).
      // Daily-work clause: wellness.usage.en / ar + wellness.workflowCycle
      // last-step detail ("Instant review of day revenue and staff sales" /
      // "مراجعة إجمالي دخل اليوم ومبيعات كل موظفة فور الإغلاق").
      ar: "يشغّلها يوميًا صاحبة المركز أو مديرته، وموظفة الاستقبال، والمعالِجات ومقدّمات الخدمة — المواعيد ونقطة البيع والعملاء والمخزون والموظفون في مكان واحد، مخصص لفريق المركز ليس موقع حجز للعميلات، مع مراجعة إجمالي دخل اليوم ومبيعات كل موظفة فور الإغلاق.",
      en: "Run day to day by the centre owner or manager, the receptionist, and the therapists — appointments, point of sale, clients, inventory and staff scheduling in one place, built for the centre's team not a customer booking site, with an instant review of day revenue and staff sales at close.",
    },
    open: ["offline", "corrections", "training"],
  },
};

export function operatorRecordFor(systemId?: string): OperatorRecord | undefined {
  if (!systemId) return undefined;
  return OPERATOR_RECORDS[systemId as SystemId];
}
