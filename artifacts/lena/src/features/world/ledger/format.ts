import type { AppLocale } from "@/providers/preferences";
import { publicSystems, type SystemId } from "@/content/systems";
import { evidenceFor } from "@/features/world/content/evidence";

/**
 * House Ledger formatting helpers.
 *
 * Pure presentation logic for the ledger direction. Every number rendered by
 * the ledger surfaces is derived from canonical data here — nothing is
 * hard-coded in components and nothing claims lifecycle status.
 *
 * Digit convention follows the repository's content convention: Arabic copy
 * uses Arabic-Indic digits (the products' own receipts and the Arabic content
 * in `content/systems.ts` do the same), English copy uses Latin digits.
 */

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

/** Convert a number (or numeric string) to locale-appropriate digits. */
export function toLedgerDigits(value: number | string, locale: AppLocale): string {
  const text = String(value);
  if (locale !== "ar") return text;
  return text.replace(/\d/g, (digit) => ARABIC_INDIC[Number(digit)]);
}

/** Zero-padded tabular numeral, locale-digit-aware. */
export function ledgerPad(value: number, width: number, locale: AppLocale): string {
  return toLedgerDigits(String(value).padStart(width, "0"), locale);
}

/** «الشكل ٠٣ من ٠٧» / "Figure 03 of 07" — deterministic plate numbering. */
export function figureLabel(
  zeroBasedIndex: number,
  total: number,
  locale: AppLocale,
): { number: string; of: string } {
  const position = ledgerPad(zeroBasedIndex + 1, 2, locale);
  const of = ledgerPad(total, 2, locale);
  return { number: position, of };
}

/** Entry number from the canonical owner order field. */
export function entryNumberFor(order: number, locale: AppLocale): string {
  return ledgerPad(order, 2, locale);
}

/**
 * Record status is evidence-based and public-safe.
 *
 * The internal canonical lifecycle stage (`in-use` / `trial`) is never
 * surfaced publicly; what the ledger shows instead is the *documentation
 * state* of the record: documented when verified evidence surfaces exist in
 * the canonical evidence registry, pending otherwise.
 */
export type LedgerRecordStatus = "documented" | "pending";

export const RECORD_STATUS_LABEL: Record<LedgerRecordStatus, Record<AppLocale, string>> = {
  documented: { ar: "موثّق", en: "DOCUMENTED" },
  pending: { ar: "قيد التوثيق", en: "RECORD PENDING" },
};

export function recordStatusFor(systemId: string): LedgerRecordStatus {
  return (evidenceFor(systemId)?.length ?? 0) > 0 ? "documented" : "pending";
}

/** Verified figure count — the length of the canonical evidence registry. */
export function figureCountFor(systemId: string): number {
  return evidenceFor(systemId)?.length ?? 0;
}

export function figureCountLabel(count: number, locale: AppLocale): string {
  if (count <= 0) {
    return locale === "ar" ? "لا لوحات بعد" : "No figures yet";
  }
  const n = toLedgerDigits(count, locale);
  return locale === "ar" ? `${n} لوحات موثّقة` : `${count} documented figures`;
}

/** Whole-register totals, derived from the public systems + evidence. */
export function registerTotals(): {
  total: number;
  documented: number;
  pending: number;
} {
  const systems = publicSystems();
  const documented = systems.filter((system) => figureCountFor(system.id) > 0).length;
  return {
    total: systems.length,
    documented,
    pending: systems.length - documented,
  };
}

export function registerTotalsLabel(locale: AppLocale): string {
  const totals = registerTotals();
  const total = toLedgerDigits(totals.total, locale);
  const documented = toLedgerDigits(totals.documented, locale);
  const pending = toLedgerDigits(totals.pending, locale);
  return locale === "ar"
    ? `المجموع: ${total} أنظمة — ${documented} بمواد موثّقة، ${pending} قيد التوثيق`
    : `Total: ${totals.total} systems — ${totals.documented} documented, ${totals.pending} records pending`;
}

/** First evidence figure for a system, when one exists (used for card previews). */
export function firstFigureFor(systemId: SystemId) {
  return evidenceFor(systemId)?.[0] ?? null;
}

export type { SystemId };
