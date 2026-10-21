import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import LenaCta from "@/components/LenaCta";
import SeoHead from "@/components/SeoHead";
import { NILE_SYSTEMS_META } from "@/content/nile-systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import type { SystemId } from "@/content/systems";
import PublicShell from "@/layouts/PublicShell";
import { usePreferences } from "@/providers/preferences";
import { withBase } from "@/lib/base-path";

/**
 * /products — بيت نيل سيستمز.
 *
 * صفحة الخطّ كاملاً، مفصولة عن دفتر البيت (`/world`): هنا منتجات بُنيت في ورشتنا،
 * وكل بطاقة تحمل لوحة حقيقية من واجهة النظام أثناء العمل. لا شارات حالة، ولا
 * أرقام عملاء، ولا ادّعاء إيراد — نفس قاعدة الأدلة التي تحكم بقية الموقع.
 */
export default function NileProducts() {
  const { locale } = usePreferences();
  const isAr = locale === "ar";

  return (
    <PublicShell>
      <SeoHead
        title={
          isAr
            ? "أنظمة نيل سيستمز — منتجات مبنية ومُختبَرة"
            : "Nile Systems — built and tested products"
        }
        description={
          isAr
            ? "سبعة أنظمة تشغيل بنيناها ونشغّلها: كاشير ومخازن ومطعم وعيادة وملاعب وموارد بشرية ومواقع — كل واحد بمعايير قبول مكتوبة ولقطات حقيقية من واجهته."
            : "Seven operating systems we built and run: point of sale, inventory, restaurant, clinic, courts, HR and sites — each with written acceptance criteria and real captures of its interface."
        }
        path="/nile"
      />

      <section className="lena-page lena-container">
        <p className="lena-kicker">
          {isAr ? "من ورشتنا" : "From our workshop"}
        </p>
        <h1 className="lena-page-title">
          {isAr
            ? "بيت نيل سيستمز: سبعة أنظمة مبنية ومُختبَرة"
            : "The Nile house: seven systems built and tested"}
        </h1>
        <p className="lena-lead">
          {isAr
            ? "هذه ليست أفكاراً ولا عروضاً تقديمية. كل نظام هنا له معايير قبول مكتوبة، وله واجهة تعمل، ولقطة واحدة على الأقل مأخوذة منه وهو يعمل — وتُعرض كما هي. تفتح النظام فترى ما يديره، وما يمنعه، ولمن يصلح، ثم تدخل الغرفة الحيّة وتجرّبه بنفسك."
            : "These are not ideas or slide decks. Each system has written acceptance criteria, a working interface, and at least one capture taken from it while running — shown as it is. Open a system to see what it runs, what it refuses and who it suits, then step into the live room and try it yourself."}
        </p>
      </section>

      <section className="lena-section">
        <div className="lena-container">
          <div className="lena-nile-grid">
            {NILE_SYSTEMS_META.map((product) => {
              const plate = product.surfaces[0];
              return (
                <article className="lena-glass lena-nile-card" key={product.id} data-product={product.id}>
                  <div className="lena-nile-card-top">
                    <SystemLogo systemId={product.id as SystemId} size={30} />
                    <span className="lena-roots-chip">
                      {product.operatingPrimitives.length}{" "}
                      {isAr ? "جذور تشغيل" : "operating roots"}
                    </span>
                  </div>
                  <h3>{product.name[locale]}</h3>
                  <p className="lena-system-industry">{product.industry[locale]}</p>
                  <p className="lena-system-tagline">{product.tagline[locale]}</p>
                  {plate ? (
                    <Link
                      className="lena-nile-plate"
                      to={`/nile/${product.id}`}
                      aria-label={`${product.name[locale]} — ${plate.capability[locale]}`}
                    >
                      <img
                        src={withBase(plate.src)}
                        alt={plate.alt[locale]}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="lena-nile-plate-cap">{plate.capability[locale]}</span>
                    </Link>
                  ) : null}
                  <Link className="lena-secondary" to={`/nile/${product.id}`}>
                    {isAr ? "افتح النظام" : "Open the system"}
                    <ArrowUpRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <LenaCta />
    </PublicShell>
  );
}
