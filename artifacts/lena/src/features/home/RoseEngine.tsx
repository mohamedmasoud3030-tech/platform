import { useEffect, useState } from "react";
import { Link } from "react-router";
import sacredCoreUrl from "@/assets/lena-sacred-core.webp?url";
import { ledgerPad, RECORD_STATUS_LABEL } from "@/features/world/ledger/format";
import { usePreferences } from "@/providers/preferences";
import { roseBodies } from "./rose-system-bodies";

/**
 * R5 — THE ROSE ENGINE (وردة الباني).
 *
 * Sacred geometry as a builder's rite: a six-fold rose window draws itself
 * the way master masons did — first the construction circles (compass arcs,
 * scribing in sequence), then the petals resolve from their intersections,
 * then gilding settles into the work that earned it. Nothing here is a
 * planet or an orbit: this is a WINDOW, architecture made of pure geometry.
 *
 * Six petals = the six systems in owner order. Documented systems gild in
 * flowing brass; the others remain clean stonework linework with the
 * documentation micro-legend. Hovering a chip extends its construction proof
 * (its compass circle and petal re-ink in brass).
 *
 * The whole window turns slowly like a great wheel; the six system chips ride
 * a second, slower ring around it — threaded on a rope of light with one
 * hairline spoke tying each chip back to the core. Rotation pauses while the
 * visitor reads (hover / keyboard focus) and under `prefers-reduced-motion`
 * the window appears complete and still. Chips are real links to chambers.
 */
const CX = 300;
const CY = 300;
const R = 150;
/** Chip ring radius, as a percentage of the stage edge. */
const ORBIT_RADIUS_WIDE = 39;
const ORBIT_RADIUS_NARROW = 33;

function useOrbitRadius(): number {
  const [radius, setRadius] = useState(ORBIT_RADIUS_WIDE);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 480px)");
    const sync = () => setRadius(media.matches ? ORBIT_RADIUS_NARROW : ORBIT_RADIUS_WIDE);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return radius;
}

export default function RoseEngine() {
  const { locale, direction } = usePreferences();
  const bodies = roseBodies();
  const mirror = direction === "rtl" ? -1 : 1;
  const orbitRadius = useOrbitRadius();
  const [focusId, setFocusId] = useState<string | null>(null);

  const petalPath = (i: number) => {
    const a1 = ((i * 60 - 90) * mirror * Math.PI) / 180;
    const a2 = (((i + 1) * 60 - 90) * mirror * Math.PI) / 180;
    const tip = CX + Math.cos((a1 + a2) / 2) * (R * 1.02);
    const tipY = CY + Math.sin((a1 + a2) / 2) * (R * 1.02);
    const p1x = CX + Math.cos(a1) * (R * 0.62);
    const p1y = CY + Math.sin(a1) * (R * 0.62);
    const p2x = CX + Math.cos(a2) * (R * 0.62);
    const p2y = CY + Math.sin(a2) * (R * 0.62);
    const ctr = CX + Math.cos((a1 + a2) / 2) * (R * 1.28);
    const ctrY = CY + Math.sin((a1 + a2) / 2) * (R * 1.28);
    return `M ${CX} ${CY} Q ${p1x * 1.2 - CX * 0.2} ${p1y * 1.2 - CY * 0.2} ${tip} ${tipY} M ${tip} ${tipY} Q ${ctr} ${ctrY} ${CX} ${CY}`;
  };

  /** Petal-centre angle for chip *i*, in radians (mirrored for RTL). */
  const chipAngle = (i: number) => (((i * 60 - 90 + 30) * mirror * Math.PI) / 180);

  const orbitUnits = (orbitRadius / 100) * 600;
  const focused = focusId ? (bodies.find((b) => b.system.id === focusId) ?? null) : null;

  return (
    <div className="night-wrap">
      <div
        className={`rose${focusId ? " is-focus" : ""}`}
        role="group"
        aria-label={
          locale === "ar"
            ? "وردة الباني: الأنظمة الستة حول نواة لينا"
            : "The Rose Engine: six systems around the LENA core"
        }
      >
        <div className="rose-stage">
          {/* the turning window — construction, rings, petals */}
          <div className="rose-geometry">
            <svg
              className="rose-svg"
              viewBox="0 0 600 600"
              aria-hidden="true"
              style={direction === "rtl" ? { transform: "scaleX(-1)" } : undefined}
            >
              <defs>
                <radialGradient id="rose-gild" cx="50%" cy="40%" r="75%">
                  <stop offset="0%" stopColor="rgba(255,226,166,0.9)" />
                  <stop offset="55%" stopColor="rgba(200,160,78,0.42)" />
                  <stop offset="100%" stopColor="rgba(157,128,72,0.08)" />
                </radialGradient>
                <radialGradient id="rose-stone" cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor="rgba(124,155,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(124,155,255,0.02)" />
                </radialGradient>
              </defs>
              {/* construction circles — the mason's proof, scribed in sequence */}
              {bodies.map((body, i) => {
                const a = (((i * 60 - 90) * mirror * Math.PI) / 180);
                const gx = CX + Math.cos(a) * R * 0.62;
                const gy = CY + Math.sin(a) * R * 0.62;
                const active = focusId === body.system.id;
                return (
                  <circle
                    key={`c-${body.system.id}`}
                    className={`rose-construction${active ? " is-active" : ""}`}
                    cx={gx}
                    cy={gy}
                    r={R * 0.62}
                    pathLength={1}
                    style={{ animationDelay: `${0.25 + i * 0.28}s` }}
                  />
                );
              })}
              <circle className="rose-outer" cx={CX} cy={CY} r={R * 1.06} pathLength={1} />
              <circle className="rose-outer faint" cx={CX} cy={CY} r={R * 1.16} pathLength={1} />
              {/* petals */}
              {bodies.map((body, i) => (
                <path
                  key={`p-${body.system.id}`}
                  className={`rose-petal${focusId === body.system.id ? " is-active" : ""}`}
                  data-documented={body.documented}
                  d={petalPath(i)}
                  pathLength={1}
                  style={{ animationDelay: `${2.1 + i * 0.22}s` }}
                  fill={body.documented ? "url(#rose-gild)" : "url(#rose-stone)"}
                />
              ))}
              <circle className="rose-center" cx={CX} cy={CY} r={30} />
            </svg>
          </div>

          {/* the slower ring — one spoke per system, a rope of light, six chips */}
          <div className="rose-orbit">
            <svg className="rose-threads" viewBox="0 0 600 600" aria-hidden="true">
              {bodies.map((body, i) => {
                const a = chipAngle(i);
                const x1 = CX + Math.cos(a) * 46;
                const y1 = CY + Math.sin(a) * 46;
                const x2 = CX + Math.cos(a) * (orbitUnits - 6);
                const y2 = CY + Math.sin(a) * (orbitUnits - 6);
                return (
                  <line
                    key={`s-${body.system.id}`}
                    className={`rose-spoke${focusId === body.system.id ? " is-active" : ""}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                  />
                );
              })}
              <circle className="rose-rope-echo" cx={CX} cy={CY} r={orbitUnits + 18} />
              <circle className="rose-rope-body" cx={CX} cy={CY} r={orbitUnits} />
              <circle className="rose-rope-flow" cx={CX} cy={CY} r={orbitUnits} />
            </svg>
            {bodies.map((body, i) => {
              const a = chipAngle(i);
              const x = 50 + Math.cos(a) * orbitRadius;
              const y = 50 + Math.sin(a) * orbitRadius;
              return (
                <Link
                  key={body.system.id}
                  to={`/world/${body.system.id}`}
                  className="rose-chip"
                  data-system={body.system.id}
                  data-documented={body.documented}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onFocus={() => setFocusId(body.system.id)}
                  onBlur={() => setFocusId(null)}
                  onMouseEnter={() => setFocusId(body.system.id)}
                  onMouseLeave={() => setFocusId(null)}
                >
                  <span className="night-sat-num" aria-hidden="true">
                    {ledgerPad(body.ownerIndex + 1, 2, locale)}
                  </span>
                  {body.system.name[locale]}
                </Link>
              );
            })}
          </div>

          <span className="rose-sigil" aria-hidden="true">
            <img src={sacredCoreUrl} alt="" width={56} height={56} loading="eager" decoding="async" />
          </span>
        </div>

        <p className="night-card rose-card" aria-live="polite">
          {focused ? (
            <>
              <span className="night-card-num" aria-hidden="true">
                {ledgerPad(focused.ownerIndex + 1, 2, locale)}
              </span>
              <span className="night-card-main">
                <strong>{focused.system.name[locale]}</strong>
                <small>{focused.system.industry[locale]}</small>
              </span>
              <span className={`night-card-status ${focused.documented ? "is-lit" : "is-dim"}`}>
                {focused.documented
                  ? RECORD_STATUS_LABEL.documented[locale]
                  : RECORD_STATUS_LABEL.pending[locale]}
              </span>
            </>
          ) : (
            <span className="night-card-idle">
              {locale === "ar" ? "مرّر على شريحة لتقرأ نظامها" : "Hover a chip to read its system"}
            </span>
          )}
        </p>
      </div>
      <p className="night-key">
        <span className="night-key-item">
          <i className="night-swatch is-lit" aria-hidden="true" />
          {locale === "ar" ? "موثّق بواجهات حقيقية" : "Documented with real captures"}
        </span>
        <span className="night-key-item">
          <i className="night-swatch is-dim" aria-hidden="true" />
          {locale === "ar" ? "لم يُوثَّق بعد" : "Not yet documented"}
        </span>
      </p>
    </div>
  );
}
