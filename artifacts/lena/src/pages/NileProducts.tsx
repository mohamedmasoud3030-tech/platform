import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import LenaCta from "@/components/LenaCta";
import SeoHead from "@/components/SeoHead";
import { NILE_SYSTEMS_META, NILE_WINDOWS_PROGRAMS } from "@/content/nile-systems";
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
            ? "سبعة أنظمة ويب، وخمسة برامج ويندوز، وسبعة مواقع أنشطة — كلها تعمل. كل صورة في هذه الصفحة لقطة من الشاشة نفسها وهي تعمل، لا رسم تخيلي ولا واجهة مقترحة. تفتح النظام فترى شاشاته واحدة واحدة، وما يديره، ولمن يصلح، ثم تدخل الغرفة الحيّة وتجرّبه بنفسك."
            : "Seven web systems, five Windows programs and seven trade sites — all of them running. Every picture here is a capture of the screen itself while it works, not an illustration or a proposed interface. Open a system to see its screens one by one, what it runs and who it suits, then step into the live room and try it yourself."}
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
        </div>
      </section>


      <section className="lena-section" id="nile-windows">
        <div className="lena-container">
          <header className="lena-nile-head">
            <p className="lena-kicker">{isAr ? "برامج ويندوز" : "Windows programs"}</p>
            <h2 className="lena-section-title">
              {isAr ? "خمسة برامج تعمل على جهاز بلا إنترنت" : "Five programs that run on a machine without a network"}
            </h2>
            <p className="lena-lead">
              {isAr
                ? "هذه ليست الأنظمة السبعة: دي برامج مثبَّتة على جهاز واحد في المحل أو المخزن أو المطبخ، تشتغل والشبكة مقطوعة. كل برنامج له شاشة واحدة واضحة، وصورها هنا من التشغيل الفعلي."
                : "These are not the seven web systems: these are programs installed on a single machine in the shop, the store or the kitchen, working with the network down. Each has one clear screen, and the pictures are captures of it running."}
            </p>
          </header>

          <div className="lena-nile-grid">
            {NILE_WINDOWS_PROGRAMS.map((program) => (
              <article className="lena-glass lena-nile-card" key={program.id} data-program={program.id}>
                <h3>{program.name[locale]}</h3>
                <p className="lena-system-tagline">{program.line[locale]}</p>
                <a className="lena-nile-plate" href={program.runUrl} target="_blank" rel="noopener noreferrer">
                  <span className="lena-nile-plate-shot">
                    <img src={withBase(program.src)} alt={program.alt[locale]} loading="lazy" decoding="async" />
                  </span>
                  <span className="lena-nile-plate-cap">{program.capability[locale]}</span>
                </a>
                <a className="lena-secondary" href={program.runUrl} target="_blank" rel="noopener noreferrer">
                  {isAr ? "افتح البرنامج" : "Open the program"}
                  <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LenaCta />
    </PublicShell>
  );
}
