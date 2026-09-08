import type { WorldEntity } from "@/features/world/content/world";
import { worldSystem } from "@/features/world/content/world";
import { usePreferences } from "@/providers/preferences";
import LedgerEntryCard, { type LedgerEnterHandler } from "./LedgerEntryCard";
import { registerTotalsLabel } from "./format";

/**
 * The World as ledger index.
 *
 * Six real systems, kept in the owner's canonical order, each rendered as a
 * ruled record entry inside one house register. The sheet opens with its
 * index label and closes with a data-derived totals line (documented vs.
 * records pending) — the register's honest account of itself.
 */
export default function LedgerIndex({
  entities,
  rememberedSystemId,
  onEnter,
}: {
  entities: WorldEntity[];
  rememberedSystemId: string | null;
  onEnter: LedgerEnterHandler;
}) {
  const { locale } = usePreferences();

  return (
    <section className="ledger-sheet ledger-index" aria-label={locale === "ar" ? "فهرس أنظمة LENA" : "LENA systems index"}>
      <header className="ledger-sheet-head">
        <p className="ledger-sheet-label">
          {locale === "ar" ? "فهرس الأنظمة — عالم LENA" : "SYSTEMS INDEX — LENA WORLD"}
        </p>
        <p className="ledger-sheet-note">
          {locale === "ar"
            ? "كل قيد يفتح غرفة النظام: صفحة السجل الكاملة"
            : "Each entry opens the system chamber: the record's full leaf"}
        </p>
      </header>

      <div className="ledger-index-grid">
        {entities.map((entity) => {
          const system = worldSystem(entity);
          if (!system) return null;
          return (
            <LedgerEntryCard
              key={entity.systemId}
              entity={entity}
              system={system}
              remembered={entity.systemId === rememberedSystemId}
              onEnter={onEnter}
            />
          );
        })}
      </div>

      <footer className="ledger-total">
        <span className="ledger-total-line" aria-hidden="true" />
        <p>{registerTotalsLabel(locale)}</p>
      </footer>
    </section>
  );
}
