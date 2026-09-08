import { usePreferences } from "@/providers/preferences";
import { RECORD_STATUS_LABEL, type LedgerRecordStatus } from "./format";

/**
 * The record seal — the ledger's status device.
 *
 * State is encoded three ways (shape, border style, text) so it never depends
 * on color alone: documented = solid brass square dot + solid frame;
 * pending = hollow dot + dashed frame. The seal states documentation status
 * only; it never claims lifecycle maturity.
 */
export default function LedgerSeal({
  status,
  compact = false,
}: {
  status: LedgerRecordStatus;
  compact?: boolean;
}) {
  const { locale } = usePreferences();
  const label = RECORD_STATUS_LABEL[status][locale];

  return (
    <span
      className={`ledger-seal is-${status}${compact ? " is-compact" : ""}`}
      role="status"
      aria-label={
        locale === "ar"
          ? status === "documented"
            ? "السجل موثّق بلقطات حقيقية"
            : "السجل قيد التوثيق — لا لقطات منشورة بعد"
          : status === "documented"
            ? "Record documented with real captures"
            : "Record pending — no captures published yet"
      }
    >
      <i aria-hidden="true" />
      {label}
    </span>
  );
}
