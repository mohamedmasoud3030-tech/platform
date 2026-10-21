import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { NILE_SYSTEMS_META } from "@/content/nile-systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import type { SystemId } from "@/content/systems";
import { usePreferences } from "@/providers/preferences";
import { withBase } from "@/lib/base-path";

/**
 * شريط «بيت نيل سيستمز» — يُستخدم في صفحتي الخدمات والأعمال.
 *
 * يعرض الخطّ كاملاً بلا تفاصيل: الاسم والصناعة ولوحة واحدة حقيقية، ومخرجه
 * صفحة منتج مفردة. لا شارات حالة ولا ادّعاء حجم — الصور من التشغيل الفعلي.
 */
export function NileHouseBand({
  limit,
  showPlates = true,
}: {
  limit?: number;
  showPlates?: boolean;
}) {
  const { locale } = usePreferences();
  const isAr = locale === "ar";
  const products = limit ? NILE_SYSTEMS_META.slice(0, limit) : NILE_SYSTEMS_META;

  return (
    <section className="lena-section" id="nile-products">
      <div className="lena-container">
        <header className="lena-nile-head">
          <p className="lena-kicker">
            {isAr ? "من ورشتنا — بيت نيل سيستمز" : "From our own workshop — the Nile house"}
          </p>
          <h2 className="lena-section-title">
            {isAr
              ? "سبعة أنظمة نبنيناها ونشغّلها بأنفسنا"
              : "Seven systems we built and run ourselves"}
          </h2>
          <p className="lena-lead">
            {isAr
              ? "هذه الأنظمة ليست عروضاً ولا تصاميم: كل واحد منها مبنيّ على معايير قبول مكتوبة، وكل صورة هنا لقطة من واجهته أثناء العمل. تفتح صفحة النظام فترى ما يديره، وما يمنعه، ومن يستخدمه — ثم تدخل الغرفة الحيّة لتجربته بنفسك."
              : "These are not decks or mockups: each is built against written acceptance criteria, and every picture here is a capture of its interface at work. Open a system to see what it runs, what it refuses and who uses it — then step into the live room and try it yourself."}
          </p>
        </header>

        <div className="lena-nile-grid">
          {products.map((product) => {
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

                {showPlates && plate ? (
                  <Link className="lena-nile-plate" to={`/nile/${product.id}`}>
                    <span className="lena-nile-plate-shot">
                      <img
                        src={withBase(plate.src)}
                        alt={plate.alt[locale]}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
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

        <div className="lena-nile-foot">
          <Link className="lena-primary" to="/nile">
            {isAr ? "كل أنظمة بيت نيل" : "The whole Nile house"}
            <ArrowUpRight size={14} />
          </Link>
          <Link className="lena-secondary" to="/contact?service=nile-house">
            {isAr ? "تحدث عن نظام لقطاعك" : "Talk about a system for your trade"}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
