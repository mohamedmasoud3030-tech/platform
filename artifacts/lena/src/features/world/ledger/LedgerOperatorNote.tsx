import type { BusinessSystem } from "@/content/systems";
import { usePreferences } from "@/providers/preferences";
import { OPERATOR_ASPECT_LABELS, operatorRecordFor } from "@/features/world/content/operator";

/**
 * Operator record — D6: speaks to the people who run the system day to day,
 * not only the buyer (roadmap R7, OPEN_DECISIONS B-10 / checklist T2-1).
 *
 * Renders only when a content record exists (evidence-gated in
 * `features/world/content/operator.ts`); chambers without a record are
 * unchanged and keep their own honest pending state.
 */
export default function LedgerOperatorNote({ system }: { system: BusinessSystem }) {
  const { locale } = usePreferences();
  const record = operatorRecordFor(system.id);
  if (!record) return null;

  const isArabic = locale === "ar";
  const aspects = record.open.map((aspect) => OPERATOR_ASPECT_LABELS[aspect][locale]);

  return (
    <section className="ledger-operator" aria-label={isArabic ? "سجل المشغّل" : "Operator record"}>
      <header className="ledger-sectionhead">
        <small>
          {isArabic ? "سجل المشغّل — لمن يديره يوميًا" : "OPERATOR RECORD — FOR THE PEOPLE WHO RUN IT"}
        </small>
        <h2>{isArabic ? "ما الذي يتغيّر في العمل اليومي" : "What changes in the day-to-day work"}</h2>
      </header>
      <p className="ledger-operator-answer">{record.summary[locale]}</p>
      {aspects.length ? (
        <p className="ledger-operator-open">
          {isArabic ? "غير موثّقة بعد من التشغيل الفعلي:" : "Not yet documented from real operation:"}{" "}
          {isArabic
            ? aspects.join("، و") + "."
            : `${aspects.slice(0, -1).join(", ")}${aspects.length > 1 ? ", and " : ""}${aspects[aspects.length - 1]}.`}
        </p>
      ) : null}
    </section>
  );
}
