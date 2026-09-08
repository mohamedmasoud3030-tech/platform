import { useMemo } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import LenaCta from "@/components/LenaCta";
import SeoHead from "@/components/SeoHead";
import SystemGrid from "@/components/SystemGrid";
import DigitalHouseFrontage from "@/features/home/DigitalHouseFrontage";
import ProcessSection from "@/features/home/ProcessSection";
import { useGatewayToWorld } from "@/features/home/HomeGatewayTransition";
import WorldContinuation from "@/features/world/spatial/WorldContinuation";
import { worldRegistry } from "@/features/world/registry";
import { FOUNDER } from "@/content/founder";
import { withBase } from "@/lib/base-path";
import PublicShell from "@/layouts/PublicShell";
import { pageSeo } from "@/content/seo";
import { organizationJsonLd } from "@/lib/seo";
import {
  resolveContinuation,
  resolveRememberedFocus,
  useWorldMemory,
} from "@/lib/spatial";
import { usePreferences } from "@/providers/preferences";

export default function Home() {
  const { locale } = usePreferences();
  const gateway = useGatewayToWorld();
  const seo = pageSeo("home", locale);

  // World Memory: the gateway reads the visitor's last journey so a returning
  // visitor finds a continuation seam — never a forced redirect.
  const memory = useWorldMemory();
  const continuation = useMemo(
    () => resolveContinuation(memory, worldRegistry),
    [memory],
  );
  const rememberedSystemId = useMemo(
    () => resolveRememberedFocus(memory, worldRegistry),
    [memory],
  );
  const isReturning = memory !== null;

  return (
    <PublicShell>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path="/"
        jsonLd={organizationJsonLd(locale)}
      />
      <section className="lena-hero lena-container">
        <div className="lena-hero-copy">
          <p className="lena-kicker">LENA DIGITAL HOUSE</p>
          {isReturning ? (
            <p className="lena-return-line">
              {locale === "ar" ? "مرحبًا بعودتك إلى البيت." : "Welcome back to the house."}
            </p>
          ) : null}
          <h1>
            {locale === "ar" ? (
              <>
                أنظمة تشغيل حقيقية لأعمال حقيقية — <span>في بيت رقمي واحد</span>
              </>
            ) : (
              <>
                Real operating systems for real businesses —{" "}
                <span>inside one digital house</span>
              </>
            )}
          </h1>
          <p className="lena-lead">
            {locale === "ar"
              ? "كل غرفة في هذا البيت نظام مبني على عمل يومي حقيقي؛ وحيث وُثّق النظام، تُعرض واجهته الفعلية — لا شرائح ولا مفاهيم."
              : "Every room in this house is a system built on real daily work. Where a system is documented, you see its actual interface — no slides, no concepts."}
          </p>
          <div className="lena-actions">
            <Link
              className="lena-primary"
              to="/world"
              onClick={(event) => {
                event.preventDefault();
                gateway();
              }}
            >
              {locale === "ar" ? "ادخل العالم" : "Enter the world"}
              <ArrowUpRight size={16} />
            </Link>
            <Link className="lena-secondary" to="/world">
              {locale === "ar" ? "شاهد الأنظمة" : "See the systems"}
            </Link>
            {continuation ? (
              <WorldContinuation continuation={continuation} />
            ) : null}
          </div>
          <a className="lena-scroll" href="#solutions">
            <ArrowDown size={15} />
            {locale === "ar" ? "اختر غرفة… ثم ادخل" : "Pick a room… then step in"}
          </a>
        </div>
        <DigitalHouseFrontage />
      </section>
      <section className="lena-section" id="solutions">
        <div className="lena-container">
          <p className="lena-kicker">{locale === "ar" ? "عوالم التشغيل" : "Operating worlds"}</p>
          <h2 className="lena-section-title">
            {locale === "ar"
              ? "أنظمة مختلفة. جذور تشغيلية تتكرر. عالم واحد يربطها."
              : "Different systems. Repeated operating roots. One world connecting them."}
          </h2>
          <p className="lena-section-lead">
            {locale === "ar"
              ? "جذور التشغيل: أنماط العمل التي تتكرر بين الأنظمة — العلاقات، الوقت، المال، الأصول. لا نسمّي الجذر مشتركًا حتى يثبته نظامان فعليان. والبطاقات الموثّقة تعرض نافذة حقيقية من داخل النظام."
              : "Operating roots: the work patterns that repeat across systems — relationships, time, money, assets. A root is only called shared once two real systems prove it. Documented cards show a real window into the system."}
          </p>
          <SystemGrid visitedSystemId={rememberedSystemId} />

          <aside className="lena-founder-strip" aria-label={locale === "ar" ? "عن المؤسس" : "About the founder"}>
            <img
              className="lena-founder-strip-photo"
              src={withBase(FOUNDER.photo)}
              alt={FOUNDER.photoAlt[locale]}
              loading="lazy"
              decoding="async"
              width={52}
              height={52}
            />
            <p className="lena-founder-strip-line">
              {locale === "ar"
                ? "هذا البيت يبنيه مؤسس يعمل مع أصحاب المشاريع مباشرة."
                : "This house is built by a founder who works directly with business owners."}
            </p>
            <p className="lena-founder-strip-byline">
              <strong>{FOUNDER.name[locale]}</strong>
              <span aria-hidden="true"> — </span>
              <Link to="/about">{locale === "ar" ? "عن المؤسس" : "About the founder"}</Link>
            </p>
          </aside>
        </div>
      </section>
      <ProcessSection />
      <LenaCta />
    </PublicShell>
  );
}
