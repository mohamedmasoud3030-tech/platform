import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import SeoHead from "@/components/SeoHead";
import { pageSeo } from "@/content/seo";
import PublicShell from "@/layouts/PublicShell";
import { usePreferences } from "@/providers/preferences";
import LedgerIndex from "@/features/world/ledger/LedgerIndex";
import { worldEntities } from "@/features/world/content/world";
import { useWorldPortalTransition } from "@/features/world/WorldPortalTransition";
import { worldRegistry } from "@/features/world/registry";
import { useSpatialContext, useSpatialNavigate, useWorldMemory } from "@/lib/spatial";
import {
  clampRegisterPosition,
  readRegisterPosition,
  saveRegisterPosition,
} from "./../features/world/spatial/register-position";

/**
 * LENA World — the house register, open at its systems index.
 *
 * The six products remain in the owner's canonical order, each entry a ruled
 * record in the House Ledger. The World is still the organizing layer: every
 * entry belongs to one house, opens into its own chamber leaf, and carries
 * only what the canonical data supports — a documentation seal, a verified
 * figure count, and shared operating-root references. Nothing here claims
 * lifecycle status and nothing is invented.
 *
 * Spatial continuity is preserved:
 *   - a returning visitor finds their last system quietly marked and can
 *     resume with one action;
 *   - a back move (browser or visible) is an outward settle, never a replay
 *     of the entrance;
 *   - a direct URL entry simply opens the register.
 */
export default function WorldPage() {
  const { locale } = usePreferences();
  const seo = pageSeo("world", locale);
  const entities = useMemo(() => worldEntities(), []);

  const { direction, arrivalIntent } = useSpatialContext();
  const memory = useWorldMemory();
  const { back } = useSpatialNavigate();
  const enterPortal = useWorldPortalTransition();

  const rememberedSystemId = useMemo(() => {
    if (!memory) return null;
    const id =
      memory.lastSpace === "world" || memory.lastSpace === "chamber"
        ? memory.lastSystemId
        : null;
    return id && worldRegistry.isKnownSystem(id) ? id : null;
  }, [memory]);

  const isOutwardArrival = direction === "back" || arrivalIntent === "emerge";

  // The register remembers where the visitor was reading: the position is kept
  // while the sheet is open, and a return (the browser's Back or the record's
  // own back control) lands on the same line instead of the masthead. A direct
  // URL entry is untouched, and nothing scrolls under reduced motion — the
  // restore is instant, never an animated travel.
  useEffect(() => {
    const onScroll = () => saveRegisterPosition(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      saveRegisterPosition(window.scrollY);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isOutwardArrival) return;
    const remembered = readRegisterPosition();
    if (remembered === null || remembered < 40) return;

    const restore = () => {
      const y = clampRegisterPosition(remembered, document.body.scrollHeight, window.innerHeight);
      window.scrollTo(0, y);
    };
    const frame = window.requestAnimationFrame(restore);
    // Lazy plates can grow the sheet a moment after mount; one settle keeps the
    // line the visitor left without fighting her if she scrolls first.
    const settle = window.setTimeout(() => {
      if (Math.abs(window.scrollY - remembered) < 4 || window.scrollY < 4) restore();
    }, 240);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [isOutwardArrival]);
  const rememberedName = rememberedSystemId
    ? worldRegistry.nameFor(rememberedSystemId, locale)
    : null;

  return (
    <PublicShell>
      <SeoHead title={seo.title} description={seo.description} path="/world" />

      <section
        className={`lena-world-page lena-container ledger-scope${isOutwardArrival ? " is-returning" : ""}`}
      >
        <header className="ledger-masthead">
          <p className="ledger-eyebrow">
            {locale === "ar" ? "دفتر البيت · LENA DIGITAL HOUSE" : "THE HOUSE LEDGER · LENA DIGITAL HOUSE"}
          </p>
          <h1 className="ledger-headline">
            {locale === "ar"
              ? "عالم LENA: ستة أنظمة تشغيل حقيقية في بيت واحد."
              : "LENA World: six real operating systems in one house."}
          </h1>
          <p className="ledger-intro">
            {locale === "ar"
              ? "كل نظام صفحة في هذا الدفتر: رقم القيد، والصناعة، والجذور التشغيلية المشتركة، وحالة التوثيق. ما له لقطات حقيقية من داخل النظام يُعرَض هنا كما هو؛ وما لم يُوثّق بعد يُعلَّم «قيد التوثيق» — لا شيء في هذا الدفتر مختلَق."
              : "Each system is a page in this register: entry number, industry, shared operating roots, and documentation state. Real captures from inside a system are shown as they are; what is not yet documented is marked “record pending” — nothing in this register is invented."}
          </p>
        </header>

        <LedgerIndex
          entities={entities}
          rememberedSystemId={rememberedSystemId}
          onEnter={(destination, systemId, event) => enterPortal(destination, systemId, event)}
        />

        <p className="ledger-hint" aria-live="polite">
          {locale === "ar"
            ? rememberedName
              ? `أهلًا بعودتك — قيد ${rememberedName} بانتظارك.`
              : "اختر أي قيد لفتح سجلّه الكامل داخل الغرفة."
            : rememberedName
              ? `Welcome back — the entry for ${rememberedName} is ready.`
              : "Choose an entry to open its full record in the chamber."}
        </p>

        <p className="ledger-appendices">
          <Link className="lena-world-command-entry" to="/world/command">
            {locale === "ar" ? "ادخل غرفة قيادة العالم" : "Enter World Command"}
          </Link>
          <Link className="lena-world-atlas-entry" to="/world/atlas">
            {locale === "ar" ? "افتح أطلس العالم" : "Open the World Atlas"}
          </Link>
        </p>

        <button type="button" className="lena-world-back" onClick={() => back()}>
          <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
          <span>{locale === "ar" ? "العودة إلى البيت" : "Back to the house"}</span>
        </button>
      </section>
    </PublicShell>
  );
}
