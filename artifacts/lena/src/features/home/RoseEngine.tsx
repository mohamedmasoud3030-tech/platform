import { useEffect, useState } from "react";
import { Link } from "react-router";
import sacredCoreUrl from "@/assets/lena-sacred-core.webp?url";
import { ledgerPad, RECORD_STATUS_LABEL } from "@/features/world/ledger/format";
import { usePreferences } from "@/providers/preferences";
import {
  bridgeAngles,
  bridgePath,
  chipAngleDeg,
  petalCenterDeg,
  petalPath,
  petalTip,
  ROSE_CX,
  ROSE_CY,
  ROSE_R,
  towEndpoints,
  type RoseMirror,
} from "./rose-geometry";
import { ROSE_READY_LABEL, roseBodies } from "./rose-system-bodies";

/**
 * R5 — THE ROSE ENGINE (وردة الباني).
 *
 * Sacred geometry as a builder's rite: a six-fold rose window draws itself
 * the way master masons did — first the construction circles (compass arcs,
 * scribing in sequence), then the thin petals resolve from their
 * intersections, then gilding settles into the work that earned it.
 *
 * Six petals = the six systems in owner order. Lit systems gild in brass;
 * the two pending ones breathe with a quiet charging pulse while their
 * stonework stays honest. THE CHIPS LEAD: every chip rides ahead of its
 * petal in the rotation — the chip is the leader, the system follows —
 * tethered by a visible rope of light with energy flowing chip → system and
 * a glowing tow-node riding the petal's tip. The chips are also wired to
 * each other: six light-bridges join every chip to its two neighbours in one
 * continuous circuit, and three comets circle the ring.
 *
 * Hovering a chip lights its whole neighbourhood — its petal, its proof
 * circle, its tow-rope and tow-node, and the two bridges that tie it to its
 * neighbours — and the reading card names the two linked systems. Rotation
 * pauses while the visitor reads (hover / keyboard focus) and under
 * `prefers-reduced-motion` the window appears complete and still. Chips are
 * real links to chambers.
 */
/** Chip ring radius, as a percentage of the stage edge. */
const ORBIT_RADIUS_WIDE = 39;
const ORBIT_RADIUS_NARROW = 33;
/** Ambient sparkles — fixed dramaturgy, zero layout cost. */
const STARS = [
  { x: 8, y: 22, s: 2, d: 0 },
  { x: 18, y: 68, s: 3, d: 0.7 },
  { x: 30, y: 12, s: 2, d: 1.4 },
  { x: 44, y: 84, s: 2, d: 0.4 },
  { x: 56, y: 8, s: 3, d: 2.1 },
  { x: 70, y: 30, s: 2, d: 1.1 },
  { x: 82, y: 58, s: 3, d: 2.6 },
  { x: 90, y: 80, s: 2, d: 1.8 },
  { x: 12, y: 87, s: 2, d: 2.9 },
  { x: 24, y: 44, s: 2, d: 0.9 },
  { x: 64, y: 68, s: 2, d: 2.3 },
  { x: 76, y: 12, s: 2, d: 0.2 },
  { x: 37, y: 57, s: 2, d: 1.6 },
  { x: 50, y: 29, s: 2, d: 3.1 },
];
/** Three comets, interleaved between the chip stations. */
const COMET_ANGLES = [10, 130, 250];

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
  const mirror: RoseMirror = direction === "rtl" ? -1 : 1;
  const orbitRadius = useOrbitRadius();
  const [focusId, setFocusId] = useState<string | null>(null);

  const orbitUnits = (orbitRadius / 100) * 600;
  const focusedIndex = focusId ? bodies.findIndex((b) => b.system.id === focusId) : -1;
  const focused = focusedIndex >= 0 ? bodies[focusedIndex] : null;
  const linkedPrev = focused ? bodies[(focusedIndex + bodies.length - 1) % bodies.length] : null;
  const linkedNext = focused ? bodies[(focusedIndex + 1) % bodies.length] : null;
  const focusedStatus = !focused
    ? null
    : focused.documented
      ? RECORD_STATUS_LABEL.documented[locale]
      : focused.ownerReady
        ? ROSE_READY_LABEL[locale]
        : RECORD_STATUS_LABEL.pending[locale];

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
          {/* ambient sparkles */}
          <div className="rose-stars" aria-hidden="true">
            {STARS.map((star, i) => (
              <i
                key={i}
                className="rose-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.s,
                  height: star.s,
                  animationDelay: `${star.d}s`,
                }}
              />
            ))}
          </div>

          {/* the counter-rotating core — construction proof + rings */}
          <div className="rose-geometry">
            <svg className="rose-svg" viewBox="0 0 600 600" aria-hidden="true">
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
                <radialGradient id="rose-halo-gold">
                  <stop offset="0%" stopColor="rgba(232,200,118,0.55)" />
                  <stop offset="55%" stopColor="rgba(232,200,118,0.22)" />
                  <stop offset="100%" stopColor="rgba(232,200,118,0)" />
                </radialGradient>
                <radialGradient id="rose-halo-slate">
                  <stop offset="0%" stopColor="rgba(143,163,217,0.5)" />
                  <stop offset="55%" stopColor="rgba(143,163,217,0.2)" />
                  <stop offset="100%" stopColor="rgba(143,163,217,0)" />
                </radialGradient>
              </defs>
              {/* construction circles — the mason's proof, scribed in sequence */}
              {bodies.map((body, i) => {
                const a = (((i * 60 - 90) * mirror * Math.PI) / 180);
                const gx = ROSE_CX + Math.cos(a) * ROSE_R * 0.62;
                const gy = ROSE_CY + Math.sin(a) * ROSE_R * 0.62;
                const active = focusId === body.system.id;
                return (
                  <circle
                    key={`c-${body.system.id}`}
                    className={`rose-construction${active ? " is-active" : ""}`}
                    cx={gx}
                    cy={gy}
                    r={ROSE_R * 0.62}
                    pathLength={1}
                    style={{ animationDelay: `${0.25 + i * 0.28}s` }}
                  />
                );
              })}
              <circle className="rose-outer" cx={ROSE_CX} cy={ROSE_CY} r={ROSE_R * 1.06} pathLength={1} />
              <circle className="rose-outer faint" cx={ROSE_CX} cy={ROSE_CY} r={ROSE_R * 1.16} pathLength={1} />
              <circle className="rose-center" cx={ROSE_CX} cy={ROSE_CY} r={30} />
            </svg>
          </div>

          {/* comets circling the ring */}
          <div className="rose-comets" aria-hidden="true">
            {COMET_ANGLES.map((deg) => {
              const a = ((deg * mirror * Math.PI) / 180);
              return (
                <i
                  key={deg}
                  className="rose-comet"
                  style={{
                    left: `${50 + Math.cos(a) * orbitRadius}%`,
                    top: `${50 + Math.sin(a) * orbitRadius}%`,
                  }}
                />
              );
            })}
          </div>

          {/* halo rings breathing around the hub */}
          <span className="rose-halo one" aria-hidden="true" />
          <span className="rose-halo two" aria-hidden="true" />

          {/* the wheel — every chip leading its petal on a rope of light */}
          <div className="rose-orbit">
            <svg className="rose-threads" viewBox="0 0 600 600" aria-hidden="true">
              {/* petals — the systems, trailing their chips */}
              {bodies.map((body, i) => (
                <path
                  key={`p-${body.system.id}`}
                  className={`rose-petal${focusId === body.system.id ? " is-active" : ""}`}
                  data-documented={body.documented}
                  data-lit={body.lit}
                  d={petalPath(petalCenterDeg(i, mirror), mirror)}
                  pathLength={1}
                  style={{ animationDelay: `${2.1 + i * 0.22}s` }}
                  fill={body.lit ? "url(#rose-gild)" : "url(#rose-stone)"}
                />
              ))}
              {/* tow-rope auras — soft static light under each rope */}
              {bodies.map((body, i) => {
                const ends = towEndpoints(i, mirror, orbitUnits);
                return (
                  <line
                    key={`a-${body.system.id}`}
                    className="rose-tow-aura"
                    x1={ends.x1}
                    y1={ends.y1}
                    x2={ends.x2}
                    y2={ends.y2}
                  />
                );
              })}
              {/* tow-ropes — chip to petal tip, energy flowing with the pull */}
              {bodies.map((body, i) => {
                const ends = towEndpoints(i, mirror, orbitUnits);
                return (
                  <line
                    key={`t-${body.system.id}`}
                    className={`rose-tow${focusId === body.system.id ? " is-active" : ""}`}
                    x1={ends.x1}
                    y1={ends.y1}
                    x2={ends.x2}
                    y2={ends.y2}
                  />
                );
              })}
              {/* tow-node halos — static gradient glow, zero per-frame cost */}
              {bodies.map((body, i) => {
                const tip = petalTip(i, mirror);
                return (
                  <circle
                    key={`h-${body.system.id}`}
                    className="rose-tow-halo"
                    cx={tip.x}
                    cy={tip.y}
                    r={13}
                    fill={body.lit ? "url(#rose-halo-gold)" : "url(#rose-halo-slate)"}
                  />
                );
              })}
              {/* tow-nodes — glowing orbs riding the petal tips */}
              {bodies.map((body, i) => {
                const tip = petalTip(i, mirror);
                const active = focusId === body.system.id;
                return (
                  <circle
                    key={`n-${body.system.id}`}
                    className={`rose-tow-node${active ? " is-active" : ""}`}
                    data-lit={body.lit}
                    cx={tip.x}
                    cy={tip.y}
                    r={active ? 5.5 : 4}
                  />
                );
              })}
              <circle className="rose-rope-echo" cx={ROSE_CX} cy={ROSE_CY} r={orbitUnits + 18} />
              <circle className="rose-rope-body" cx={ROSE_CX} cy={ROSE_CY} r={orbitUnits} />
              <circle className="rose-rope-flow" cx={ROSE_CX} cy={ROSE_CY} r={orbitUnits} />
              {bodies.map((body, j) => {
                const next = bodies[(j + 1) % bodies.length];
                const active = focusId === body.system.id || focusId === next.system.id;
                const { from, to } = bridgeAngles(j, mirror, bodies.length);
                return (
                  <path
                    key={`b-${body.system.id}`}
                    className={`rose-bridge${active ? " is-active" : ""}`}
                    d={bridgePath(from, to, orbitUnits, mirror)}
                    style={{ animationDelay: `${3.4 + j * 0.12}s` }}
                  />
                );
              })}
            </svg>
            {bodies.map((body, i) => {
              const a = (chipAngleDeg(i, mirror) * Math.PI) / 180;
              const x = 50 + Math.cos(a) * orbitRadius;
              const y = 50 + Math.sin(a) * orbitRadius;
              const active = focusId === body.system.id;
              return (
                <Link
                  key={body.system.id}
                  to={`/world/${body.system.id}`}
                  className={`rose-chip${active ? " is-active" : ""}`}
                  data-system={body.system.id}
                  data-documented={body.documented}
                  data-lit={body.lit}
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
          {focused && linkedPrev && linkedNext ? (
            <>
              <span className="night-card-num" aria-hidden="true">
                {ledgerPad(focused.ownerIndex + 1, 2, locale)}
              </span>
              <span className="night-card-main">
                <strong>{focused.system.name[locale]}</strong>
                <small>{focused.system.industry[locale]}</small>
                <small className="night-card-links">
                  {locale === "ar"
                    ? `متصل: ${linkedPrev.system.name[locale]} · ${linkedNext.system.name[locale]}`
                    : `Linked: ${linkedPrev.system.name[locale]} · ${linkedNext.system.name[locale]}`}
                </small>
              </span>
              <span className={`night-card-status ${focused.lit ? "is-lit" : "is-dim"}`}>
                {focusedStatus}
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
          {ROSE_READY_LABEL[locale]}
        </span>
        <span className="night-key-item">
          <i className="night-swatch is-dim" aria-hidden="true" />
          {RECORD_STATUS_LABEL.pending[locale]}
        </span>
      </p>
    </div>
  );
}
