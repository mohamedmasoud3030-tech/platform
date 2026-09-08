import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import SeoHead from "@/components/SeoHead";
import type { OperatingPrimitiveId } from "@/content/systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import { OperatingSurfaces } from "@/features/world/components/OperatingSurfaces";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";
import { productContractFor } from "@/features/world/content/product-contract";
import { findWorldEntity, worldSystem } from "@/features/world/content/world";
import LedgerSeal from "@/features/world/ledger/LedgerSeal";
import {
  entryNumberFor,
  figureCountFor,
  figureCountLabel,
  ledgerPad,
  recordStatusFor,
} from "@/features/world/ledger/format";
import PublicShell from "@/layouts/PublicShell";
import { useSpatialContext, useSpatialNavigate, worldMemory } from "@/lib/spatial";
import { usePreferences } from "@/providers/preferences";

/**
 * System Chamber — the ledger leaf.
 *
 * The chamber is the full record page of one system entry: a ruled leaf that
 * opens from the World index. Every meaningful sentence comes from the
 * canonical BusinessSystem record; the leaf adds only record grammar —
 * entry number, documentation seal, verified figure count, workflow rows,
 * root index references and evidence plates.
 *
 * Arrival is semantic, not a single animation:
 *   - `descend` (from the World index)  → the leaf arrival choreography
 *   - a back move (browser or visible)  → an outward settle
 *   - a direct URL entry                → a calm neutral arrival
 * The URL remains canonical in all three cases.
 */
type ChamberArrival = "arrival" | "return" | "neutral";

export default function WorldSystem() {
  const { systemId } = useParams();
  const { locale } = usePreferences();
  const entity = findWorldEntity(systemId);
  const system = entity ? worldSystem(entity) : undefined;
  const { navState, direction, isDirectEntry } = useSpatialContext();
  const { back } = useSpatialNavigate();

  const chamberPath = `/world/${systemId}`;

  useEffect(() => {
    if (!entity) return;
    worldMemory.remember({
      space: "chamber",
      systemId: entity.systemId,
      chamberPath,
      ...(isDirectEntry ? { entryContext: "deep-link" as const } : {}),
    });
  }, [entity, systemId, chamberPath, isDirectEntry]);

  if (!entity || !system) return <Navigate to="/world" replace />;

  const isArabic = locale === "ar";

  const arrival: ChamberArrival =
    direction === "back"
      ? "return"
      : navState?.spatial.intent === "descend" && navState.spatial.mode === "forward"
        ? "arrival"
        : navState?.spatial.intent === "emerge"
          ? "return"
          : "neutral";

  const description = system.tagline?.[locale] ?? system.problem[locale];
  const productContract = productContractFor(system.id);
  const status = recordStatusFor(system.id);
  const figureCount = figureCountFor(system.id);
  const entryNo = entryNumberFor(system.order, locale);
  const rootLabels = OPERATING_PRIMITIVES.filter((root) =>
    (system.operatingPrimitives as OperatingPrimitiveId[]).includes(root.id),
  );

  const leafClass = `ledger-leaf${arrival === "arrival" ? " is-opening" : arrival === "return" ? " is-returning" : ""}`;

  return (
    <PublicShell>
      <SeoHead
        title={`${system.name[locale]} — LENA World`}
        description={description}
        path={`/world/${system.id}`}
      />

      <main
        className={`lena-system-chamber ledger-scope dna-${entity.dna} state-${entity.state}${
          arrival === "arrival"
            ? " is-arrival"
            : arrival === "return"
              ? " is-return"
              : ""
        }`}
      >
        <div className="lena-container">
          <button
            type="button"
            className="lena-chamber-back"
            onClick={() => back()}
            aria-label={isArabic ? "العودة إلى عالم LENA" : "Back to LENA World"}
          >
            <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
            <span>{isArabic ? "العودة إلى عالم LENA" : "Back to LENA World"}</span>
          </button>

          <div className={leafClass}>
            <header className="ledger-leaf-head">
              <p className="ledger-kicker">
                {isArabic ? "غرفة النظام · عالم LENA" : "SYSTEM CHAMBER · LENA WORLD"}
              </p>

              <div className="ledger-leaf-idline">
                <span className="ledger-entrytag">
                  {isArabic ? `القيد ${entryNo}` : `ENTRY ${entryNo}`}
                </span>
                <LedgerSeal status={status} />
                <span className="ledger-leaf-figs">{figureCountLabel(figureCount, locale)}</span>
              </div>

              <div className="ledger-leaf-title">
                <SystemLogo systemId={system.id} size={42} />
                <div>
                  <h1>{system.name[locale]}</h1>
                  <p className="ledger-industry">{system.industry[locale]}</p>
                </div>
              </div>

              {system.tagline ? <p className="ledger-leaf-tagline">{system.tagline[locale]}</p> : null}

              <p className="ledger-rootsline">
                <span className="ledger-label">
                  {isArabic ? "الجذور المسجّلة في هذا النظام" : "ROOTS RECORDED IN THIS SYSTEM"}
                </span>
                {rootLabels.map((root) => root.label[locale]).join(" · ")}
              </p>
            </header>

            <section className="ledger-record" aria-label={isArabic ? "سجل النظام" : "System record"}>
              <article className="ledger-record-block">
                <small>{isArabic ? "المشكلة الواقعية" : "THE REAL PROBLEM"}</small>
                <p className="ledger-statement">{system.problem[locale]}</p>
              </article>

              <article className="ledger-record-block">
                <small>{isArabic ? "كيف يعيش في العمل اليومي" : "HOW IT LIVES IN DAILY WORK"}</small>
                <p>{system.usage[locale]}</p>
              </article>

              <article className="ledger-record-block ledger-lines">
                <small>{isArabic ? "ما الذي يديره" : "WHAT IT RUNS"}</small>
                <ol>
                  {system.does[locale].map((item, index) => (
                    <li key={item}>
                      <span className="ledger-line-no">{ledgerPad(index + 1, 2, locale)}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </article>

              <article className="ledger-record-block ledger-lines">
                <small>{isArabic ? "لمن بُني" : "WHO IT IS BUILT FOR"}</small>
                <ol>
                  {system.beneficiaries[locale].map((person, index) => (
                    <li key={person}>
                      <span className="ledger-line-no">{ledgerPad(index + 1, 2, locale)}</span>
                      <span>{person}</span>
                    </li>
                  ))}
                </ol>
              </article>

              {system.trustHighlights ? (
                <article
                  className="ledger-record-block ledger-lines is-full"
                  aria-label={isArabic ? "ضمانات التشغيل" : "Operational guarantees"}
                >
                  <small>{isArabic ? "ضمانات التشغيل" : "OPERATIONAL GUARANTEES"}</small>
                  <ol>
                    {system.trustHighlights[locale].map((point, index) => (
                      <li key={point}>
                        <span className="ledger-line-no">{ledgerPad(index + 1, 2, locale)}</span>
                        <span className="ledger-guarantee">
                          <ShieldCheck size={13} aria-hidden="true" />
                          {point}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              ) : null}
            </section>

            {system.workflowCycle ? (
              <section className="ledger-cycle" aria-label={isArabic ? "دورة التشغيل اليومي" : "Daily operational workflow"}>
                <header className="ledger-sectionhead">
                  <small>{isArabic ? "دورة التشغيل اليومي" : "DAILY OPERATIONAL WORKFLOW"}</small>
                  <h2>{isArabic ? "كيف تتحرك دورة العمل من البداية حتى الإغلاق" : "How the cycle moves from intake to close"}</h2>
                </header>
                <ol className="ledger-cycle-list">
                  {system.workflowCycle.map((step, index) => (
                    <li className="ledger-cycle-row" key={step.label[locale]}>
                      <span className="ledger-cycle-no" aria-hidden="true">
                        {ledgerPad(index + 1, 2, locale)}
                      </span>
                      <div className="ledger-cycle-copy">
                        <strong>{step.label[locale]}</strong>
                        <p>{step.detail[locale]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <section className="ledger-roots-index" aria-label={isArabic ? "جذور التشغيل" : "Operating roots"}>
              <header className="ledger-sectionhead">
                <small>{isArabic ? "فهرس الجذور — داخل هذا النظام" : "ROOTS INDEX — INSIDE THIS SYSTEM"}</small>
                <h2>{isArabic ? "القدرات التشغيلية المتكررة عبر أنظمة LENA" : "The operating capabilities that repeat across LENA systems"}</h2>
              </header>
              <ul className="ledger-roots-list">
                {system.operatingPrimitives.map((primitiveId: OperatingPrimitiveId) => {
                  const root = OPERATING_PRIMITIVES.find((entry) => entry.id === primitiveId);
                  if (!root) return null;
                  return (
                    <li key={primitiveId} className="ledger-root-item">
                      <strong>{root.label[locale]}</strong>
                      <p>{root.meaning[locale]}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="ledger-roots-note">
                {isArabic
                  ? "هذه الجذور تتكرر في أنظمة أخرى داخل عالم LENA — لا نعدّها مشتركة حتى يثبتها نظامان فعليان."
                  : "These roots repeat in other systems inside LENA World — we only call a root shared once two real systems prove it."}
              </p>
            </section>

            <OperatingSurfaces
              systemId={entity.systemId}
              brand={system.name[locale]}
              evidence={productContract?.evidence}
            />

            {productContract?.handoff ? (
              <section
                className="ledger-boundary"
                aria-label={isArabic ? "حدود اتصال المنتج" : "Product connection boundary"}
              >
                <small>{isArabic ? "اتصال المنتج" : "PRODUCT CONNECTION"}</small>
                <p>
                  {isArabic
                    ? "يفتح MALEK الفعلي في جلسة مستقلة. المصادقة تبقى لدى MALEK، ولا تشارك LENA أي بيانات تشغيلية أو بيانات عملاء."
                    : "The real MALEK product opens in its own session. Authentication stays with MALEK; LENA shares no operational or customer data."}
                </p>
                <span>
                  {isArabic
                    ? "المراقبة التشغيلية الحية غير متصلة بـ LENA حاليًا."
                    : "Live operational observation is not connected to LENA yet."}
                </span>
              </section>
            ) : null}

            <section className="ledger-actions">
              {productContract?.handoff ? (
                <a
                  className="ledger-cta"
                  href={productContract.handoff.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    isArabic
                      ? `افتح ${system.name[locale]} الفعلي — سجّل الدخول لدى المنتج`
                      : `Open the real ${system.name[locale]} product — sign in there`
                  }
                  data-testid="malek-product-handoff"
                >
                  {isArabic
                    ? `افتح ${system.name[locale]} الفعلي — سجّل الدخول هناك`
                    : `Open the real ${system.name[locale]} product — sign in there`}
                </a>
              ) : (
                <Link className="ledger-cta" to={`/contact?service=${system.id}`}>
                  {isArabic ? "طلب تشغيل هذا النظام" : "Request this system"}
                </Link>
              )}
              <Link className="ledger-cta is-ghost" to={`/services#${system.id}`}>
                {isArabic ? "المواصفات والخدمات" : "Specs & services"}
              </Link>
              <Link className="ledger-cta is-ghost" to={`/contact?service=${system.id}`}>
                {isArabic ? "تحدث معنا عن هذا النظام" : "Talk to us about this system"}
              </Link>
            </section>

            <footer className="ledger-leaf-close">
              <span className="ledger-close-rule" aria-hidden="true" />
              <p>
                {isArabic
                  ? `إقفال سجل ${system.name[locale]} — لا يُسجَّل في هذا الدفتر إلا ما هو حقيقي وموثّق.`
                  : `Record close for ${system.name[locale]} — nothing is entered in this register unless it is real and documented.`}
              </p>
            </footer>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}
