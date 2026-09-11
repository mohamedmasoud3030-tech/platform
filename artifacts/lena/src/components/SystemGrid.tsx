import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { publicSystems } from "@/content/systems";
import { SystemLogo } from "@/design-system/brand/SystemLogo";
import { withBase } from "@/lib/base-path";
import { dashboardEvidenceFor } from "@/features/world/content/evidence";
import { usePreferences } from "@/providers/preferences";

/** Industry-first entry points, as decided in PRODUCT_DECISIONS.md D4. */
export default function SystemGrid({
  limit,
  visitedSystemId,
}: {
  limit?: number;
  /** The system the visitor was last in, when world memory says so.
   *  Renders a quiet "remembered" mark; no behavior change. */
  visitedSystemId?: string | null;
}) {
  const { locale } = usePreferences();
  const systems = limit ? publicSystems().slice(0, limit) : publicSystems();

  return (
    <div className="lena-bento lena-showcase-grid">
      {systems.map((system, index) => {
        const dashboard = dashboardEvidenceFor(system.id);
        const highlights = system.trustHighlights?.[locale] ?? [];
        const shown = highlights.slice(0, 3);
        const extra = highlights.length - shown.length;
        const flagship = system.id === "property";
        const blurb = system.tagline?.[locale] ?? system.problem[locale];

        return (
          <article
            className={`lena-glass lena-service-card${
              system.id === visitedSystemId ? " is-visited" : ""
            }`}
            key={system.id}
            data-system={system.id}
            data-flagship={flagship ? "true" : "false"}
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <header className="lena-opus-head">
              <span className="lena-opus-mark" aria-hidden="true">
                <SystemLogo systemId={system.id} size={36} />
              </span>
              <h3 className="lena-opus-name">{system.name[locale]}</h3>
              <div className="lena-opus-meta">
                {flagship ? (
                  <span className="lena-flagship">{locale === "ar" ? "الرائد" : "FLAGSHIP"}</span>
                ) : null}
                <p className="lena-system-industry">{system.industry[locale]}</p>
              </div>
            </header>

            {system.id === visitedSystemId ? (
              <span className="lena-visited-mark">
                {locale === "ar" ? "آخر نظام زرتَه" : "LAST VISITED"}
              </span>
            ) : null}

            <p className="lena-opus-blurb">{blurb}</p>

            <div className={`lena-opus-main${dashboard ? " has-dash" : ""}`}>
              {shown.length > 0 ? (
                <div
                  className="lena-system-highlights"
                  aria-label={locale === "ar" ? "ضمانات التشغيل" : "Operational highlights"}
                >
                  {shown.slice(0, -1).map((item) => (
                    <span key={item} className="lena-trust-chip">
                      {item}
                    </span>
                  ))}
                  <div className="lena-chip-row">
                    <span className="lena-trust-chip">{shown[shown.length - 1]}</span>
                    {extra > 0 ? <span className="lena-trust-chip is-more">+{extra}</span> : null}
                  </div>
                </div>
              ) : null}

              {dashboard ? (
                <figure className="lena-opus-dash">
                  <img
                    src={withBase(dashboard.src)}
                    alt={dashboard.alt[locale]}
                    width={1440}
                    height={system.id === "property" ? 1000 : 900}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ) : null}
            </div>

            <footer className="lena-opus-foot">
              <Link className="lena-more" to={`/world/${system.id}`}>
                {locale === "ar" ? "افتح النظام" : "Open system"}
                <ArrowUpRight size={15} />
              </Link>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
