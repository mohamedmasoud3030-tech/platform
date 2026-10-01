import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());
const css = readFileSync(resolve(root, "src/styles/rose-engine.css"), "utf8");

/**
 * The Rose wires its visuals to `data-lit` (evidence + the temporary
 * owner-ready directive) — never to `data-documented`. A selector/attribute
 * mismatch renders ready systems dim with zero test failures, so the wiring
 * itself is pinned here.
 */
describe("rose styling contract (data-lit wiring)", () => {
  it("keys every hero visual state to data-lit", () => {
    for (const selector of [
      '.rose-petal[data-lit="true"]',
      '.rose-petal[data-lit="false"]',
      '.rose-petal[data-vacant="true"]',
      '.rose-chip[data-lit="true"]',
      '.rose-chip[data-lit="false"]',
      '.rose-tow-node[data-lit="true"]',
      '.light .rose-petal[data-lit="true"]',
      '.light .rose-petal[data-lit="false"]',
      '.light .rose-petal[data-vacant="true"]',
      '.light .rose-chip[data-lit="true"]',
      '.light .rose-chip[data-lit="false"]',
    ]) {
      expect(css, `missing selector ${selector}`).toContain(selector);
    }
  });

  it("never keys hero visuals to data-documented", () => {
    expect(css).not.toContain("data-documented");
  });

  it("keeps every tow-rope a visible tether (bright, thick, long dashes)", () => {
    expect(css).toContain("stroke-dasharray: 6 4;");
    expect(css).toContain("rgba(240, 212, 140, 0.9)");
  });

  it("defines the key pulse the night card invokes", () => {
    expect(css, "missing @keyframes rose-key-pulse").toContain("@keyframes rose-key-pulse");
  });
});

/**
 * Reduced motion is a promise with two halves: nothing travels through space,
 * and the window is not left dead. Both halves are pinned here, together with
 * the constraints that make the promise survive the cascade and the visual
 * baselines.
 */
describe("rose reduced-motion contract", () => {
  const block = (() => {
    const start = css.indexOf("@media (prefers-reduced-motion: reduce)");
    expect(start, "missing reduced-motion block").toBeGreaterThan(-1);
    // The block runs to the end of the file (it is the last section).
    return css.slice(start);
  })();

  it("stops every wheel that would move through space", () => {
    for (const mover of [".rose-geometry", ".rose-orbit", ".rose-comets", ".rose-tow-node", ".rose-bridge"]) {
      expect(block, `${mover} must be stopped`).toContain(mover);
    }
    expect(block).toContain("animation: none;");
  });

  it("keeps the hub alive with an opacity-only pulse, gated on the settled stage", () => {
    expect(block).toContain('.rose-stage[data-calm="true"] .rose-sigil');
    expect(block).toContain('.rose-stage[data-calm="true"] .rose-halo');
    expect(block).toContain("rose-calm-pulse");
    expect(block).toContain("rose-calm-halo");
  });

  it("pulses only when the stage is marked settled, never before", () => {
    // An ungated `.rose-sigil { animation: ... }` would give the pulse an
    // early life the guardian's captures would photograph — and would leave
    // the window moving before the page has settled. Only rules whose selector
    // is exactly the hub element may set an animation here.
    const rules = [...block.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
      selectors: selectors.split(",").map((selector) => selector.trim()),
      body,
    }));
    const ungated = rules.filter(
      (rule) =>
        rule.selectors.some((selector) => selector === ".rose-sigil" || selector === ".rose-halo") &&
        rule.body.includes("animation:"),
    );
    expect(ungated).toEqual([]);
  });

  it("never animates position, rotation or scale in the calm pulse", () => {
    const frames = css.slice(
      css.indexOf("@keyframes rose-calm-pulse"),
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
    );
    expect(frames).toContain("rose-calm-pulse");
    expect(frames).toContain("rose-calm-halo");
    for (const forbidden of ["rotate", "translate", "scale", "transform", "margin", "left", "top"]) {
      expect(frames, `calm pulse must not animate ${forbidden}`).not.toContain(`${forbidden}:`);
    }
  });

  it("outranks the global reduced-motion kill and starts at full opacity", () => {
    // `responsive.css` caps every animation on `*` with !important; without
    // !important here the pulse would be silently reduced to 0.01ms.
    expect(block).toMatch(/\.rose-stage\[data-calm="true"\] \.rose-sigil\s*\{\s*animation: rose-calm-pulse[^}]*!important/);
    expect(block).toMatch(/\.rose-stage\[data-calm="true"\] \.rose-halo\s*\{\s*animation: rose-calm-halo[^}]*!important/);
    // Every keyframe starts and ends at full opacity: no sampled frame is a
    // dimmed window.
    expect(css).toMatch(/@keyframes rose-calm-pulse\s*\{\s*0%,\s*100%\s*\{\s*opacity:\s*1/);
    expect(css).toMatch(/@keyframes rose-calm-halo\s*\{\s*0%,\s*100%\s*\{\s*opacity:\s*1/);
  });
});
