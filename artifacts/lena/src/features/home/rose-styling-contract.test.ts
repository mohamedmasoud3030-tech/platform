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
      '.rose-chip[data-lit="true"]',
      '.rose-chip[data-lit="false"]',
      '.rose-tow-node[data-lit="true"]',
      '.light .rose-petal[data-lit="true"]',
      '.light .rose-petal[data-lit="false"]',
      '.light .rose-chip[data-lit="true"]',
      '.light .rose-chip[data-lit="false"]',
    ]) {
      expect(css, `missing selector ${selector}`).toContain(selector);
    }
  });

  it("never keys hero visuals to data-documented", () => {
    expect(css).not.toContain("data-documented");
  });

  it("defines the key pulse the night card invokes", () => {
    expect(css, "missing @keyframes rose-key-pulse").toContain("@keyframes rose-key-pulse");
  });
});
