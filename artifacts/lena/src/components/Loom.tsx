import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { SystemId } from "@/content/systems";
import { ledgerPad, RECORD_STATUS_LABEL } from "@/features/world/ledger/format";
import { ROSE_READY_LABEL, roseBodies } from "@/features/home/rose-system-bodies";
import { usePreferences } from "@/providers/preferences";
import { PRIMITIVE_LABELS, ROOT_ORDER, loomStatus, rootLoadFor } from "./loom-model";

/**
 * THE LOOM (النول) — the documentation sky, woven.
 *
 * There is no sphere and no orbit. The identity image IS the thesis:
 * «أنظمة مختلفة. جذور تشغيلية تتكرر. عالم واحد يربطها.»
 *
 *   WARP (vertical)   — the nine operating roots. A root proven by two or
 *                       more real systems draws as strong brass; a root
 *                       evidenced by one stays a faint signal. The
 *                       documented rule, rendered.
 *   WEFT (horizontal) — the six systems in owner order. Every knot is a
 *                       REAL datum: it exists only where the system's
 *                       operatingPrimitives contain that root.
 *   LIGHT             — readiness-aware: documented and owner-ready systems
 *                       weave as solid brass filaments, but only documented
 *                       systems carry the travelling shuttle of light.
 *                       Pending systems weave as faint dotted threads —
 *                       present, named, honest, not lit.
 *
 * The cloth undulates under a slow standing wave; focusing a system pulls
 * its thread taut and bright while the rest falls back. One canvas,
 * DPR ≤ 1.5, loop paused offscreen/hidden; under reduced motion the cloth
 * is drawn once at rest with every state intact.
 */

type Palette = {
  warpProven: string;
  warpSignal: string;
  threadLit: string;
  threadDim: string;
  knotHalo: string;
  knotCore: string;
  knotDim: string;
  shuttleGlow: string;
  shuttleCore: string;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    warpProven: "226, 194, 116",
    warpSignal: "157, 177, 255",
    threadLit: "226, 194, 116",
    threadDim: "157, 177, 255",
    knotHalo: "240, 209, 144",
    knotCore: "255, 240, 205",
    knotDim: "170, 188, 255",
    shuttleGlow: "226, 194, 116",
    shuttleCore: "255, 249, 232",
  },
  light: {
    warpProven: "154, 123, 61",
    warpSignal: "38, 72, 152",
    threadLit: "138, 95, 16",
    threadDim: "38, 72, 152",
    knotHalo: "154, 123, 61",
    knotCore: "138, 95, 16",
    knotDim: "38, 72, 152",
    shuttleGlow: "154, 123, 61",
    shuttleCore: "138, 95, 16",
  },
};

export default function Loom() {
  const { locale, direction, theme } = usePreferences();
  const bodies = [...roseBodies()].sort((a, b) => a.ownerIndex - b.ownerIndex);
  const systems = bodies.map((body) => body.system);
  const rtl = direction === "rtl";

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chipRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusId, setFocusId] = useState<SystemId | null>(null);
  const focusRef = useRef<SystemId | null>(null);
  focusRef.current = focusId;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const state = useRef({ w: 0, h: 0, visible: false, reduced: false, t: 0, last: 0 });

  /** Roots carrying two or more real systems — the "proven shared" set. */
  const rootLoad = rootLoadFor(systems);

  const layout = () => {
    const { w, h } = state.current;
    const edgeToEdge = w <= 720;
    // On the phone the weft must reach the screen edges. Chips sit on the
    // thread instead of outside it, so the side pad can collapse.
    const padX = edgeToEdge ? 8 : w < 560 ? 132 : Math.max(96, w * 0.13);
    const padTop = 68;
    const padBottom = 92;
    return {
      x0: padX,
      x1: w - padX,
      y0: padTop,
      y1: h - padBottom,
      rowGap: (h - padTop - padBottom) / (bodies.length - 1 || 1),
      colGap: (w - padX * 2) / (ROOT_ORDER.length - 1 || 1),
      edgeToEdge,
    };
  };

  /** The cloth's standing wave — every point of every thread rides it. */
  const wave = (x: number, row: number, t: number) => {
    const s = state.current;
    if (s.reduced) return 0;
    const k = x * 0.0075;
    return (
      Math.sin(k + t * 0.55 + row * 0.62) * 9 +
      Math.sin(k * 2.1 - t * 0.31 + row * 0.4) * 4.5
    );
  };

  const draw = (t: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = state.current;
    if (w === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const C = PALETTES[themeRef.current];
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const L = layout();
    const focused = focusRef.current;

    // ---- warp: the operating roots -------------------------------------
    ROOT_ORDER.forEach((root, col) => {
      const x = L.x0 + col * L.colGap;
      const proven = rootLoad[col] >= 2;
      const focusSys = focused ? systems.find((s) => s.id === focused) : null;
      const inFocus = focusSys ? focusSys.operatingPrimitives.includes(root) : true;
      const alpha = (proven ? 0.3 : 0.13) * (inFocus ? 1 : 0.35);
      ctx.strokeStyle = proven
        ? `rgba(${C.warpProven}, ${alpha})`
        : `rgba(${C.warpSignal}, ${alpha})`;
      ctx.lineWidth = proven ? 1.15 : 0.8;
      ctx.setLineDash(proven ? [] : [2, 6]);
      ctx.beginPath();
      for (let y = L.y0 - 26; y <= L.y1 + 26; y += 6) {
        const rowF = (y - L.y0) / (L.rowGap || 1);
        const px = x + wave(y * 1.6, rowF * 0.35, t) * 0.42;
        if (y === L.y0 - 26) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ---- weft: the six systems ------------------------------------------
    bodies.forEach((body, row) => {
      const y = L.y0 + row * L.rowGap;
      const isFocused = focused === body.system.id;
      const dim = focused !== null && !isFocused ? 0.3 : 1;
      const lit = body.lit;
      const alpha = (lit ? 0.72 : 0.34) * dim * (isFocused ? 1.25 : 1);

      ctx.strokeStyle = lit
        ? `rgba(${C.threadLit}, ${Math.min(alpha, 1)})`
        : `rgba(${C.threadDim}, ${Math.min(alpha, 1)})`;
      ctx.lineWidth = lit ? (isFocused ? 2.1 : 1.5) : isFocused ? 1.3 : 0.9;
      ctx.setLineDash(lit ? [] : [3, 7]);
      ctx.beginPath();
      const xStart = L.edgeToEdge ? 0 : L.x0 - 40;
      const xEnd = L.edgeToEdge ? w : L.x1 + 40;
      for (let x = xStart; x <= xEnd; x += 5) {
        const py = y + wave(x, row, t);
        if (x === xStart) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // knots — one per real operatingPrimitive of this system
      ROOT_ORDER.forEach((root, col) => {
        if (!body.system.operatingPrimitives.includes(root)) return;
        const x = L.x0 + col * L.colGap;
        const py = y + wave(x, row, t);
        const pulse = state.current.reduced
          ? 1
          : 1 + 0.28 * Math.sin(t * 1.5 + col * 0.7 + row);
        const r = (lit ? 2.9 : 2.1) * (isFocused ? 1.45 : 1) * pulse;
        if (lit) {
          const g = ctx.createRadialGradient(x, py, 0, x, py, r * 4.5);
          g.addColorStop(0, `rgba(${C.knotHalo}, ${0.55 * dim})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, py, r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = lit
          ? `rgba(${C.knotCore}, ${0.95 * dim})`
          : `rgba(${C.knotDim}, ${0.5 * dim})`;
        ctx.beginPath();
        ctx.arc(x, py, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // shuttle of light — only documented systems carry one
      if (body.documented && !state.current.reduced) {
        const span = L.x1 - L.x0;
        const travel = ((t * 0.13 + row * 0.5) % 1) * (span + 160) - 80;
        const sx = rtl ? L.x1 - travel : L.x0 + travel;
        const sy = y + wave(sx, row, t);
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 26);
        sg.addColorStop(0, `rgba(${C.shuttleCore}, ${0.5 * dim})`);
        sg.addColorStop(0.4, `rgba(${C.shuttleGlow}, ${0.22 * dim})`);
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${C.shuttleCore}, ${0.9 * dim})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  /** Place the DOM name chips at the start of each thread (RTL-aware). */
  const placeChips = (t: number) => {
    const L = layout();
    for (let i = 0; i < bodies.length; i += 1) {
      const el = chipRefs.current[i];
      if (!el) continue;
      const y = L.y0 + i * L.rowGap;
      const py = y + wave(rtl ? L.x1 : L.x0, i, t);
      el.style.top = `${py}px`;
      if (L.edgeToEdge) {
        el.style.insetInlineStart = "8px";
        el.style.transform = "translateY(-50%)";
      } else {
        // Anchor each chip just outside its thread's starting edge. In RTL the
        // weave starts at the right, and inset-inline-start resolves to `right`.
        const anchorX = rtl ? L.x1 : L.x0;
        el.style.insetInlineStart = `${rtl ? state.current.w - anchorX : anchorX}px`;
        el.style.transform = rtl
          ? "translate(calc(100% + 14px), -50%)"
          : "translate(calc(-100% - 14px), -50%)";
      }
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const s = state.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    s.reduced = media.matches;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      s.w = rect.width;
      s.h = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw(s.t);
      placeChips(s.t);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();

    const io = new IntersectionObserver(
      (entries) => {
        s.visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.05 },
    );
    io.observe(root);

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!s.visible || s.reduced || document.hidden) {
        s.last = now;
        return;
      }
      if (s.last === 0) s.last = now;
      s.t += Math.min((now - s.last) / 1000, 0.1);
      s.last = now;
      draw(s.t);
      placeChips(s.t);
    };
    raf = requestAnimationFrame(tick);

    const onChange = (event: MediaQueryListEvent) => {
      s.reduced = event.matches;
      draw(s.t);
      placeChips(s.t);
    };
    media.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      media.removeEventListener("change", onChange);
    };
    // draw/placeChips read live refs; re-subscribing per locale/theme/dir is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, locale, theme]);

  const focused = focusId ? (bodies.find((b) => b.system.id === focusId) ?? null) : null;
  const focusedStatus = focused ? loomStatus(focused, locale).text : null;

  return (
    <section className="lena-section loom-section" aria-labelledby="loom-title">
      <div className="lena-container">
        <p className="lena-kicker">
          {locale === "ar" ? "خريطة التوثيق" : "The documentation map"}
        </p>
        <h2 id="loom-title" className="lena-section-title">
          {locale === "ar"
            ? "النواة هادئة — والنور من حولها هو التوثيق"
            : "The core is calm — and the light around it is documentation"}
        </h2>
      </div>
        <div
          ref={rootRef}
          className={`loom${focusId ? " is-focus" : ""}`}
          role="group"
          aria-label={
            locale === "ar"
              ? "نول التوثيق: الأنظمة الستة منسوجة على الجذور التشغيلية"
              : "The documentation loom: six systems woven across the operating roots"
          }
        >
          <canvas ref={canvasRef} className="loom-canvas" aria-hidden="true" />

          <div className="loom-roots" aria-hidden="true">
            {ROOT_ORDER.map((root, col) => (
              <span
                key={root}
                className={`loom-root${rootLoad[col] >= 2 ? " is-proven" : ""}`}
                style={{ insetInlineStart: `${(col / (ROOT_ORDER.length - 1)) * 100}%` }}
              >
                {PRIMITIVE_LABELS[root][locale]}
              </span>
            ))}
          </div>

          {bodies.map((body, index) => (
            <Link
              key={body.system.id}
              to={`/world/${body.system.id}`}
              className="loom-thread-chip"
              data-system={body.system.id}
              data-documented={body.documented}
              data-lit={body.lit}
              ref={(node) => {
                chipRefs.current[index] = node;
              }}
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
          ))}

          <p className="night-card loom-card" aria-live="polite">
            {focused ? (
              <>
                <span className="night-card-num" aria-hidden="true">
                  {ledgerPad(focused.ownerIndex + 1, 2, locale)}
                </span>
                <span className="night-card-main">
                  <strong>{focused.system.name[locale]}</strong>
                  <small>
                    {focused.system.operatingPrimitives
                      .map((root) => PRIMITIVE_LABELS[root][locale])
                      .join(" · ")}
                  </small>
                </span>
                <span className={`night-card-status ${focused.lit ? "is-lit" : "is-dim"}`}>
                  {focusedStatus}
                </span>
              </>
            ) : (
              <span className="night-card-idle">
                {locale === "ar" ? "مرّر على خيط لتقرأ نظامه" : "Hover a thread to read its system"}
              </span>
            )}
          </p>
        </div>
      <div className="lena-container">
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
    </section>
  );
}
