import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { roseBodies } from "@/features/home/rose-system-bodies";
import { skyRows } from "./sky-model";

const css = readFileSync(resolve(process.cwd(), "src/styles/sky-map.css"), "utf8");

describe("documentation sky", () => {
  it("threads all six systems in owner order with chamber links", () => {
    const bodies = roseBodies();
    const rows = skyRows();
    expect(rows).toHaveLength(6);
    for (let i = 0; i < 6; i++) {
      expect(rows[i].id).toBe(bodies[i].system.id);
      expect(rows[i].name).toEqual(bodies[i].system.name);
      expect(rows[i].href).toBe(`/world/${bodies[i].system.id}`);
    }
  });

  it("lights threads by strict evidence only — never the hero's owner-ready gilding", () => {
    const bodies = roseBodies();
    const rows = skyRows();
    for (let i = 0; i < 6; i++) {
      expect(rows[i].documented).toBe(bodies[i].documented);
    }
    // The distinction must be real today, or this test guards nothing:
    // at least one system rides the temporary owner-ready directive.
    expect(bodies.some((b) => b.ownerReady)).toBe(true);
  });

  it("pins the sky selectors, the RTL mirror and the node pulse", () => {
    for (const selector of [
      ".sky-panel",
      ".sky-threads",
      ".sky-thread.lit",
      ".sky-chip[data-documented=\"true\"]",
      ".sky-chip[data-documented=\"false\"]",
      ".sky-legend-dot.lit",
      '[dir="rtl"] .sky-threads',
      "@keyframes sky-dot-pulse",
    ]) {
      expect(css, `missing ${selector}`).toContain(selector);
    }
  });
});
