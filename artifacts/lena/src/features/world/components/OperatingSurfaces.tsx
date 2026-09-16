import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { usePreferences } from "@/providers/preferences";
import { withBase } from "@/lib/base-path";
import { evidenceFor, type EvidenceSurface } from "@/features/world/content/evidence";
import type { SystemId } from "@/content/systems";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";
import { figureLabel, figureCountLabel, toLedgerDigits } from "@/features/world/ledger/format";

/**
 * Evidence plates — Chamber Layer C in the House Ledger.
 *
 * Real application surfaces of a system, rendered as numbered, captioned
 * plates pasted into the record: each plate carries a deterministic figure
 * number («الشكل ٠١»), the canonical bilingual capability caption, a root
 * cross-reference when the evidence registry tags one, and a source note.
 * One plate is in focus at a time; visitors step through with the plate
 * index or the arrow controls.
 *
 * Evidence integrity is unchanged: every plate maps to a real capture in the
 * canonical evidence registry. Systems without evidence do not get a fake
 * gallery — they get an honest "record pending" block.
 */
const motionQuery = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function OperatingSurfaces({
  systemId,
  brand,
  evidence,
}: {
  systemId: SystemId;
  /** Canonical product brand shown in the window chrome, e.g. "MALEK". */
  brand?: string;
  /** Optional ProductContractV1 projection; the authority remains evidence.ts. */
  evidence?: readonly EvidenceSurface[];
}) {
  const { locale } = usePreferences();
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(motionQuery());
  /**
   * The viewer holds the same plate, larger. It is a reading state, not a
   * second gallery: the same figure number, the same caption and the same
   * source note travel with it, so opening a plate never claims more than the
   * leaf already did.
   */
  const [viewerOpen, setViewerOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const surfaces = evidence ?? evidenceFor(systemId) ?? [];
  const total = surfaces.length;

  if (total === 0) {
    return (
      <section className="ledger-plates is-pending" aria-labelledby="lena-plates-heading">
        <header className="ledger-plates-head">
          <p className="ledger-section-label">
            {locale === "ar" ? "أدلة السجل" : "RECORD EVIDENCE"}
          </p>
          <h3 id="lena-plates-heading">
            {locale === "ar" ? "لوحات موثّقة من داخل النظام" : "Verified plates from inside the system"}
          </h3>
          <p className="ledger-plates-note">
            {locale === "ar"
              ? "لا لوحات في هذا السجل بعد. تُنشر اللقطات الموثّقة من داخل النظام فور توفّرها — لا نعرض صورًا مفترضة."
              : "No plates in this record yet. Verified captures from inside the system will be published as they become available — no fabricated imagery is shown."}
          </p>
        </header>
      </section>
    );
  }

  const current = (surfaces[active] ?? surfaces[0]) as EvidenceSurface;

  const step = (dir: 1 | -1) => {
    if (reduced !== motionQuery()) setReduced(motionQuery());
    setActive((prev) => (prev + dir + total) % total);
  };

  const go = (index: number) => setActive(index);

  const closeViewer = () => {
    setViewerOpen(false);
    // A reader returns to the plate she opened, not to the top of the record.
    openerRef.current?.focus();
  };

  // The viewer behaves like a document being read: the page behind it holds
  // still, Escape closes, the arrow keys step between plates (mirrored in
  // Arabic), and Tab stays inside while it is open.
  useEffect(() => {
    if (!viewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerOpen(false);
        openerRef.current?.focus();
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const forward = locale === "ar" ? event.key === "ArrowLeft" : event.key === "ArrowRight";
        event.preventDefault();
        setActive((prev) => (prev + (forward ? 1 : -1) + total) % total);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [viewerOpen, locale, total]);

  const primitive = current.primitive
    ? OPERATING_PRIMITIVES.find((entry) => entry.id === current.primitive)
    : null;
  const figure = figureLabel(active, total, locale);

  return (
    <section
      className="ledger-plates"
      aria-labelledby="lena-plates-heading"
      data-count={total}
      data-reduced-motion={reduced || undefined}
    >
      <header className="ledger-plates-head">
        <p className="ledger-section-label">
          {locale === "ar"
            ? "لوحات موثّقة — لقطات من واجهة النظام الفعلية"
            : "DOCUMENTED PLATES — CAPTURES OF THE REAL SYSTEM INTERFACE"}
        </p>
        <h3 id="lena-plates-heading">
          {locale === "ar" ? "أدلة من داخل النظام" : "Evidence from inside the system"}
        </h3>
          <p className="ledger-plates-note">
            {locale === "ar"
              ? "كل لوحة لقطة حقيقية من واجهة النظام الفعلية، مرقّمة وموثّقة، وتوثّق قدرة تشغيلية مختلفة داخل النظام."
              : "Every plate is a real capture of the actual system interface, numbered and documented; each records a different operating capability inside the system."}
          </p>
      </header>

      <div className="ledger-plates-body">
        <div
          className="ledger-plate-index"
          role="tablist"
          aria-label={locale === "ar" ? "فهرس اللوحات" : "Plate index"}
        >
          {surfaces.map((surface, index) => (
            <button
              key={surface.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="ledger-plate-window"
              aria-label={surface.capability[locale]}
              title={surface.capability[locale]}
              className={`ledger-plate-tab${index === active ? " is-active" : ""}`}
              onClick={() => go(index)}
            >
              {figureLabel(index, total, locale).number}
            </button>
          ))}
        </div>

        <div className="ledger-plate-window" id="ledger-plate-window" role="tabpanel" aria-live="polite">
          <figure className="ledger-plate" key={current.id}>
            <div className="ledger-plate-frame">
              <div className="ledger-plate-bar" aria-hidden="true">
                <span className="ledger-plate-bar-brand">{brand ?? systemId}</span>
                <span className="ledger-plate-bar-fig">
                  {locale === "ar" ? "الشكل" : "Figure"} {figure.number}
                  <i /> {figure.of}
                </span>
              </div>
              <button
                type="button"
                ref={openerRef}
                className="ledger-plate-open"
                onClick={() => setViewerOpen(true)}
                aria-label={
                  locale === "ar"
                    ? `اعرض الشكل ${figure.number} بالحجم الكامل`
                    : `View figure ${figure.number} full size`
                }
              >
                <img
                  src={withBase(current.src)}
                  alt={current.alt[locale]}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => event.currentTarget.classList.add("is-missing")}
                />
                <span className="ledger-plate-open-hint" aria-hidden="true">
                  <Maximize2 size={12} />
                  {locale === "ar" ? "اعرض بالحجم الكامل" : "View full size"}
                </span>
              </button>
            </div>
            <figcaption>
              <p className="ledger-plate-numline">
                <span className="ledger-plate-num">
                  {locale === "ar" ? "الشكل" : "Figure"} {figure.number} {locale === "ar" ? "من" : "of"} {figure.of}
                </span>
                {primitive ? (
                  <span className="ledger-rootref">
                    {locale === "ar" ? "الجذر الموثّق:" : "Verified root:"} {primitive.label[locale]}
                  </span>
                ) : null}
              </p>
              <strong className="ledger-plate-capability">{current.capability[locale]}</strong>
              <span className="ledger-plate-alt">{current.alt[locale]}</span>
              <span className="ledger-plate-source">
                {locale === "ar"
                  ? "أصل اللوحة: لقطة من واجهة النظام الفعلية — أرشيف أدلة LENA"
                  : "Plate source: capture of the real system interface — LENA evidence archive"}
                {locale === "ar" ? ` · ${toLedgerDigits(total, locale)} لوحات` : ` · ${total} plates`}
              </span>
            </figcaption>
          </figure>

          <div className="ledger-plates-arrows">
            <button
              type="button"
              className="ledger-plate-arrow is-prev"
              onClick={() => step(-1)}
              aria-label={locale === "ar" ? "اللوحة السابقة" : "Previous plate"}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <span className="ledger-plates-count" aria-hidden="true">
              {figure.number} / {figure.of}
            </span>
            <button
              type="button"
              className="ledger-plate-arrow is-next"
              onClick={() => step(1)}
              aria-label={locale === "ar" ? "اللوحة التالية" : "Next plate"}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>

      <p className="ledger-plates-total">
        {figureCountLabel(total, locale)} · {locale === "ar" ? "لا تُنشر لوحة غير حقيقية" : "no unreal plate is ever published"}
      </p>

      {viewerOpen ? (
        <div className="ledger-viewer">
          <button
            type="button"
            className="ledger-viewer-scrim"
            aria-label={locale === "ar" ? "إغلاق العرض" : "Close the viewer"}
            tabIndex={-1}
            onClick={closeViewer}
          />
          <div
            className="ledger-viewer-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ledger-viewer-caption"
            data-reduced-motion={reduced || undefined}
          >
            <header className="ledger-viewer-head">
              <p className="ledger-viewer-title">
                <span className="ledger-viewer-brand">{brand ?? systemId}</span>
                <span className="ledger-plate-bar-fig">
                  {locale === "ar" ? "الشكل" : "Figure"} {figure.number}
                  <i /> {figure.of}
                </span>
              </p>
              <button
                type="button"
                ref={closeRef}
                className="ledger-viewer-close"
                onClick={closeViewer}
                aria-label={locale === "ar" ? "إغلاق اللوحة" : "Close the plate"}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>

            <figure className="ledger-viewer-figure">
              <div className="ledger-viewer-frame">
                <img src={withBase(current.src)} alt={current.alt[locale]} decoding="async" />
              </div>
              <figcaption id="ledger-viewer-caption" className="ledger-viewer-caption">
                <strong className="ledger-plate-capability">{current.capability[locale]}</strong>
                <span className="ledger-plate-alt">{current.alt[locale]}</span>
                {primitive ? (
                  <span className="ledger-rootref">
                    {locale === "ar" ? "الجذر الموثّق:" : "Verified root:"} {primitive.label[locale]}
                  </span>
                ) : null}
                <span className="ledger-plate-source">
                  {locale === "ar"
                    ? "أصل اللوحة: لقطة من واجهة النظام الفعلية — أرشيف أدلة LENA"
                    : "Plate source: capture of the real system interface — LENA evidence archive"}
                  {locale === "ar" ? ` · ${toLedgerDigits(total, locale)} لوحات` : ` · ${total} plates`}
                </span>
              </figcaption>
            </figure>

            <div className="ledger-viewer-controls">
              <button
                type="button"
                className="ledger-plate-arrow is-prev"
                onClick={() => step(-1)}
                aria-label={locale === "ar" ? "اللوحة السابقة" : "Previous plate"}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <span className="ledger-plates-count" aria-hidden="true">
                {figure.number} / {figure.of}
              </span>
              <button
                type="button"
                className="ledger-plate-arrow is-next"
                onClick={() => step(1)}
                aria-label={locale === "ar" ? "اللوحة التالية" : "Next plate"}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
