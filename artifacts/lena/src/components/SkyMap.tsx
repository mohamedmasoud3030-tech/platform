import { Link } from "react-router";
import { usePreferences } from "@/providers/preferences";
import { skyRows } from "./sky-model";

const rowY = (i: number) => 30 + i * 60;
const rowTopPct = (i: number) => `${((30 + i * 60) / 360) * 100}%`;
/** A thread bows almost imperceptibly — hung wire, not drawn line. */
const threadPath = (y: number) => `M 8 ${y} Q 300 ${y + 10} 592 ${y}`;
const weavePath = (x: number) => `M ${x} 8 C ${x - 14} 120, ${x + 14} 240, ${x - 6} 352`;
const WEAVE_X = [110, 205, 300, 395, 490];

/** Deterministic node scatter — the same sky on every render. */
function dotsFor(row: number, lit: boolean): { x: number; y: number; delay: string }[] {
  const n = lit ? 7 : 4;
  return Array.from({ length: n }, (_, k) => ({
    x: Math.round(70 + (k * 460) / (n - 1) + (((row * 7 + k * 13) % 11) - 5)),
    y: rowY(row) + (((row * 5 + k * 7) % 9) - 4),
    delay: `${(row * 0.5 + k * 0.35).toFixed(2)}s`,
  }));
}

/**
 * The documentation sky: six threads (one per system, owner order) woven
 * by five verticals. A thread burns gold iff the system is documented with
 * real interfaces; the rest wait in dim dashed blue. The chips are the real
 * links to the chambers; the SVG is pure luminescence (aria-hidden).
 */
export default function SkyMap() {
  const { locale } = usePreferences();
  const rows = skyRows();

  return (
    <section className="lena-section" aria-labelledby="sky-map-title">
      <div className="lena-container">
        <p className="lena-kicker">
          {locale === "ar" ? "خريطة التوثيق" : "The documentation map"}
        </p>
        <h2 id="sky-map-title" className="lena-section-title">
          {locale === "ar"
            ? "النواة هادئة — والنور من حولها هو التوثيق"
            : "The core is calm — and the light around it is documentation"}
        </h2>
        <div className="sky-panel">
          <svg
            className="sky-threads"
            viewBox="0 0 600 360"
            aria-hidden="true"
            focusable="false"
          >
            {WEAVE_X.map((x) => (
              <path key={x} className="sky-weave" d={weavePath(x)} />
            ))}
            {rows.map((row, i) => (
              <g key={row.id}>
                <path
                  className={`sky-thread${row.documented ? " lit" : ""}`}
                  d={threadPath(rowY(i))}
                />
                {dotsFor(i, row.documented).map((dot, k) =>
                  row.documented ? (
                    <g key={k} className="sky-dot" style={{ animationDelay: dot.delay }}>
                      <circle cx={dot.x} cy={dot.y} r={7} className="sky-dot-halo" />
                      <circle cx={dot.x} cy={dot.y} r={2.6} className="sky-dot-core" />
                    </g>
                  ) : (
                    <circle
                      key={k}
                      cx={dot.x}
                      cy={dot.y}
                      r={2}
                      className="sky-dot-dim"
                    />
                  ),
                )}
              </g>
            ))}
          </svg>
          {rows.map((row, i) => (
            <Link
              key={row.id}
              to={row.href}
              className="sky-chip"
              data-documented={row.documented}
              style={{ top: rowTopPct(i) }}
            >
              {row.name[locale]}
            </Link>
          ))}
        </div>
        <div className="sky-legend">
          <span className="sky-legend-item">
            <span className="sky-legend-dot lit" aria-hidden="true" />
            {locale === "ar" ? "موثّق بواجهات حقيقية" : "Documented with real interfaces"}
          </span>
          <span className="sky-legend-item">
            <span className="sky-legend-dot" aria-hidden="true" />
            {locale === "ar" ? "لم يُوثَّق بعد" : "Not yet documented"}
          </span>
        </div>
      </div>
    </section>
  );
}
