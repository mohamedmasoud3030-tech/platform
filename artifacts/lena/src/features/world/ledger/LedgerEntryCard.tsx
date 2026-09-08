import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { BusinessSystem, OperatingPrimitiveId } from "@/content/systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";
import { withBase } from "@/lib/base-path";
import { usePreferences } from "@/providers/preferences";
import type { WorldEntity } from "@/features/world/content/world";
import LedgerSeal from "./LedgerSeal";
import {
  entryNumberFor,
  figureCountFor,
  figureCountLabel,
  firstFigureFor,
  figureLabel,
  recordStatusFor,
  toLedgerDigits,
} from "./format";

export type LedgerEnterHandler = (
  destination: string,
  systemId: string,
  event?: MouseEvent<HTMLElement>,
) => void;

/**
 * The ledger entry card — the House Ledger's product card.
 *
 * It adapts the existing LENA product-card grammar (number, identity mark,
 * name, industry, problem, roots reference, chamber CTA) into a ruled record
 * entry. Every number on the card is derived from canonical data: entry
 * number from the owner order, figure count and record seal from the
 * evidence registry. Evidence-bearing systems show their first real figure
 * as a restrained preview; others honestly show no preview.
 */
export default function LedgerEntryCard({
  entity,
  system,
  remembered = false,
  onEnter,
}: {
  entity: WorldEntity;
  system: BusinessSystem;
  remembered?: boolean;
  onEnter: LedgerEnterHandler;
}) {
  const { locale } = usePreferences();
  const status = recordStatusFor(system.id);
  const count = figureCountFor(system.id);
  // The index preview is the direction's exemplar treatment — it stays with
  // MALEK (the one documented system called out) until the direction is
  // extended. Other evidence-bearing systems show their figures in their
  // own chamber, not on the index.
  const showPreview = system.id === "property";
  const first = showPreview ? firstFigureFor(system.id) : null;
  const roots = OPERATING_PRIMITIVES.filter((root) =>
    (system.operatingPrimitives as OperatingPrimitiveId[]).includes(root.id),
  );
  const shownRoots = roots.slice(0, 4);
  const hiddenRoots = roots.length - shownRoots.length;

  return (
    <article
      className={`ledger-entry${remembered ? " is-remembered" : ""}`}
      data-system={system.id}
      data-dna={entity.dna}
      data-state={entity.state}
    >
      {remembered ? (
        <p className="ledger-remembered">
          {locale === "ar" ? "آخر نظام زرتَه — تابع من حيث توقفت" : "LAST VISITED — resume where you left off"}
        </p>
      ) : null}

      <header className="ledger-entry-top">
        <span className="ledger-entry-no" aria-hidden="true">
          {entryNumberFor(system.order, locale)}
        </span>
        <SystemLogo systemId={system.id} size={30} />
        <div className="ledger-entry-id">
          <h3>{system.name[locale]}</h3>
          <p className="ledger-industry">{system.industry[locale]}</p>
        </div>
        <LedgerSeal status={status} compact />
      </header>

      <p className="ledger-entry-subject">
        <span className="ledger-label">{locale === "ar" ? "مسجَّل بخصوص" : "RECORDED ON"}</span>
        {system.problem[locale]}
      </p>

      <p className="ledger-rootsline">
        <span className="ledger-label">{locale === "ar" ? "الجذور التشغيلية" : "OPERATING ROOTS"}</span>
        {shownRoots.map((root) => root.label[locale]).join(" · ")}
        {hiddenRoots > 0 ? ` · +${toLedgerDigits(hiddenRoots, locale)}` : null}
      </p>

      {first ? (
        <figure className="ledger-preview" data-testid="ledger-preview">
          <div className="ledger-preview-bar">
            <span>
              {locale === "ar" ? "الشكل" : "Figure"} {figureLabel(0, count, locale).number}
            </span>
            <span className="ledger-preview-brand">{system.name[locale]}</span>
          </div>
          <img
            src={withBase(first.src)}
            alt={first.alt[locale]}
            loading="lazy"
            decoding="async"
            onError={(event) => event.currentTarget.classList.add("is-missing")}
          />
          <figcaption>{first.capability[locale]}</figcaption>
        </figure>
      ) : count > 0 ? (
        <p className="ledger-plates-inline-note">
          {locale === "ar"
            ? "اللوحات الموثّقة معروضة في غرفة النظام."
            : "The documented plates are displayed in the system chamber."}
        </p>
      ) : (
        <p className="ledger-nofigure">
          {locale === "ar"
            ? "لا لقطات منشورة بعد — تُضاف اللوحات الموثّقة من داخل النظام فور توفرها."
            : "No captures published yet — verified plates from inside the system will be added as they become available."}
        </p>
      )}

      <footer className="ledger-entry-foot">
        <span className="ledger-figcount">{figureCountLabel(count, locale)}</span>
        <Link
          className="ledger-open"
          to={entity.detailPath}
          onClick={(event) => onEnter(entity.detailPath, entity.systemId, event)}
        >
          <span>{locale === "ar" ? "افتح غرفة النظام" : "Open system chamber"}</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}
