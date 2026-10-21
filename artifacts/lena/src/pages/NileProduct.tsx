import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router";
import LenaCta from "@/components/LenaCta";
import SeoHead from "@/components/SeoHead";
import { NILE_SYSTEMS_META, nileMetaFor, PRIMITIVE_LABEL } from "@/content/nile-systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import type { SystemId } from "@/content/systems";
import { OperatingSurfaces } from "@/features/world/components/OperatingSurfaces";
import NotFound from "@/pages/NotFound";
import PublicShell from "@/layouts/PublicShell";
import { usePreferences } from "@/providers/preferences";
import { withBase } from "@/lib/base-path";

/**
 * /nile/:productId — صفحة نظام واحد من بيت نيل.
 *
 * الطبقات، بنفس ترتيب دفتر البيت:
 *   1. ما هو + لمن + ما المشكلة.
 *   2. ما الذي يديره وما الذي يمنعه (ضمانات التشغيل).
 *   3. الأدلة: `OperatingSurfaces` نفسها التي يستخدمها دفتر البيت — لوحات مرقّمة،
 *      كل واحدة لقطة حقيقية من واجهته أثناء العمل، بتسمية عربية وإنجليزية.
 *   4. غرفة الحساب التجريبي: رابط تشغيل حقيقي، **خارج سجل الإثبات** وباسم صريح،
 *      لأن الدخول بحساب تجريبي ليس دليل استخدام تجاري.
 */
export default function NileProduct() {
  const { productId } = useParams<{ productId: string }>();
  const { locale } = usePreferences();
  const isAr = locale === "ar";
  const product = productId ? nileMetaFor(productId) : undefined;

  if (!product) return <NotFound />;

  const index = NILE_SYSTEMS_META.findIndex((entry) => entry.id === product.id);
  const next = NILE_SYSTEMS_META[(index + 1) % NILE_SYSTEMS_META.length];
  const hero = product.surfaces[0];

  return (
    <PublicShell>
      <SeoHead
        title={`${product.name[locale]} — ${product.industry[locale]}`}
        description={product.tagline[locale]}
        path={`/nile/${product.id}`}
      />

      <section className="lena-page lena-container">
        <p className="lena-kicker">
          <Link to="/nile">{isAr ? "بيت نيل سيستمز" : "The Nile house"}</Link>
          {isAr ? " · نظام " : " · system "}
          {String(index + 1).padStart(2, "0")}
          {" / "}
          {String(NILE_SYSTEMS_META.length).padStart(2, "0")}
        </p>

        <div className="lena-nile-hero">
          <div>
            <div className="lena-nile-card-top" style={{ marginBottom: 12 }}>
              <SystemLogo systemId={product.id as SystemId} size={42} />
              <span className="lena-roots-chip">
                {product.operatingPrimitives.length}{" "}
                {isAr ? "جذور تشغيل" : "operating roots"}
              </span>
            </div>

            <h1 className="lena-page-title">{product.name[locale]}</h1>
            <p className="lena-lead">{product.tagline[locale]}</p>

            <dl className="lena-nile-stats">
              <div className="lena-nile-stat">
                <dt>{isAr ? "القطاع" : "Trade"}</dt>
                <dd>{product.industry[locale]}</dd>
              </div>
              <div className="lena-nile-stat">
                <dt>{isAr ? "لوحات موثّقة" : "Documented plates"}</dt>
                <dd>{product.surfaces.length}</dd>
              </div>
              <div className="lena-nile-stat">
                <dt>{isAr ? "معايير القبول" : "Acceptance criteria"}</dt>
                <dd>{isAr ? "مكتوبة ومقيسة" : "Written and measured"}</dd>
              </div>
            </dl>

            <ul className="lena-nile-roots">
              {product.operatingPrimitives.map((primitive) => (
                <li key={primitive}>{PRIMITIVE_LABEL[primitive][locale]}</li>
              ))}
            </ul>
          </div>

          {hero ? (
            <figure className="lena-nile-hero-plate">
              <img src={withBase(hero.src)} alt={hero.alt[locale]} decoding="async" />
            </figure>
          ) : null}
        </div>

        <div className="lena-nile-rows">
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "المشكلة التي يحلها" : "The problem it solves"}</dt>
              <dd>{product.problem[locale]}</dd>
            </dl>
          </div>
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "كيف يُستخدم فعلاً" : "How it is actually used"}</dt>
              <dd>{product.usage[locale]}</dd>
            </dl>
          </div>
        </div>

        <div className="lena-nile-rows">
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "ما الذي يديره" : "What it runs"}</dt>
              <dd>
                <span className="lena-system-lists" style={{ gridTemplateColumns: "1fr" }}>
                  <span>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                      {product.does[locale].map((item) => (
                        <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <CheckCircle2 size={15} style={{ flex: "0 0 auto", marginTop: 3, color: "var(--lena-accent)" }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </span>
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "ضمانات التشغيل" : "Operational guarantees"}</dt>
              <dd>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                  {product.trustHighlights[locale].map((point) => (
                    <li key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <ShieldCheck size={15} style={{ flex: "0 0 auto", marginTop: 3, color: "var(--lena-accent)" }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        </div>

        <div className="lena-nile-rows" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "شاشات النظام كما هي في شريطه الجانبي" : "The system's screens, as they sit in its own sidebar"}</dt>
              <dd>
                <ul className="lena-nile-roots" style={{ marginTop: 10 }}>
                  {product.screens[locale].map((screen) => (
                    <li key={screen}>{screen}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        </div>

        <div className="lena-nile-rows" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <dl style={{ margin: 0 }}>
              <dt>{isAr ? "من يستخدمه" : "Who uses it"}</dt>
              <dd>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                  {product.beneficiaries[locale].map((who) => (
                    <li key={who} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <CheckCircle2 size={15} style={{ flex: "0 0 auto", marginTop: 3, color: "var(--lena-accent)" }} />
                      <span>{who}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        </div>

        {/* غرفة الحساب التجريبي — خارج سجل الإثبات، باسمها الصريح. */}
        <div className="lena-nile-room">
          <div>
            <h3>{isAr ? "غرفة الحساب التجريبي" : "The guest account room"}</h3>
            <p>
              {isAr
                ? "تدخل بحساب تجريبي جاهز وترى النظام يعمل بنفسه: تسجّل، وتحصّل، وتغلق وردية أو ترسل طلباً للمطبخ. هذا الحساب للاستعراض وليس سجل استخدام تجاري — ولذلك يُذكر هنا صريحاً ولا يُحسب من أدلة النظام."
                : "Sign in with a ready guest account and watch the system work for itself: sell, take payment, close a shift, or send an order to the kitchen. This account exists for inspection, not as evidence of commercial use — so it is stated plainly here and is not counted among the system's plates."}
            </p>
          </div>
          <div className="lena-nile-room-actions">
            <a
              className="lena-primary"
              href={product.trialRoom}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isAr ? "جرّبه الآن" : "Try it now"}
              <ArrowUpRight size={14} />
            </a>
            <a
              className="lena-secondary"
              href={product.criteria}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isAr ? "معايير القبول" : "Acceptance criteria"}
              <ArrowUpRight size={14} />
            </a>
            <Link className="lena-secondary" to={`/contact?service=${product.id}`}>
              {isAr ? "تحدث عن نظام لقطاعك" : "Talk about a system for your trade"}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <p className="lena-nile-room-note">
          {isAr
            ? "الغرفة الحيّة تُفتح في نافذة جديدة على بيئة العرض، ولا تُعدّ دليلاً على استخدام تجاري. الأدلة هي اللوحات أدناه فقط، وكلها لقطات حقيقية من واجهة النظام أثناء العمل."
            : "The live room opens in a new window against the preview deployment and is not counted as evidence of commercial use. Evidence is the plates below only, and every one of them is a real capture of the system interface at work."}
        </p>

        <section style={{ marginTop: 30 }}>
          <OperatingSurfaces systemId={product.id as SystemId} brand={product.name[locale]} />
        </section>

        <div className="lena-nile-foot">
          <Link className="lena-secondary" to="/nile">
            <ArrowRight size={14} />
            {isAr ? "كل الأنظمة" : "All systems"}
          </Link>
          <Link className="lena-primary" to={`/nile/${next.id}`}>
            {isAr ? `التالي: ${next.name.ar}` : `Next: ${next.name.en}`}
            <ArrowLeft size={14} />
          </Link>
        </div>
      </section>

      <LenaCta />
    </PublicShell>
  );
}
