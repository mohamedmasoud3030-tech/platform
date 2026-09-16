import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { publicSystems } from "@/content/systems";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";
import { ROSE_OWNER_READY, roseBodies } from "@/features/home/rose-system-bodies";
import { SYSTEM_EVIDENCE } from "@/features/world/content/evidence";
import { PRIMITIVE_LABELS, ROOT_ORDER, knotKindsFor, loomStatus, rootLoadFor } from "./loom-model";

const css = readFileSync(resolve(process.cwd(), "src/styles/loom.css"), "utf8");

describe("the loom", () => {
  it("warps the nine canonical roots in registry order", () => {
    expect(ROOT_ORDER).toEqual(OPERATING_PRIMITIVES.map((p) => p.id));
    expect(ROOT_ORDER).toHaveLength(9);
  });

  it("labels every root in both languages", () => {
    for (const root of ROOT_ORDER) {
      expect(PRIMITIVE_LABELS[root].ar.length).toBeGreaterThan(0);
      expect(PRIMITIVE_LABELS[root].en.length).toBeGreaterThan(0);
    }
  });

  it("loads every root with at least one real system (a zero root is a design bug)", () => {
    const loads = rootLoadFor(publicSystems());
    expect(loads).toHaveLength(9);
    for (const load of loads) {
      expect(load).toBeGreaterThan(0);
    }
    const total = publicSystems().reduce((n, s) => n + s.operatingPrimitives.length, 0);
    expect(loads.reduce((n, l) => n + l, 0)).toBe(total);
  });

  it("reads three honest states: documented, owner-ready, pending", () => {
    expect(loomStatus({ documented: true, ownerReady: false }, "ar")).toEqual({
      text: "موثّق",
      lit: true,
    });
    expect(loomStatus({ documented: true, ownerReady: false }, "en")).toEqual({
      text: "DOCUMENTED",
      lit: true,
    });
    expect(loomStatus({ documented: false, ownerReady: true }, "ar")).toEqual({
      text: "جاهز",
      lit: true,
    });
    expect(loomStatus({ documented: false, ownerReady: true }, "en")).toEqual({
      text: "READY",
      lit: true,
    });
    expect(loomStatus({ documented: false, ownerReady: false }, "ar")).toEqual({
      text: "قيد التوثيق",
      lit: false,
    });
    expect(loomStatus({ documented: false, ownerReady: false }, "en")).toEqual({
      text: "RECORD PENDING",
      lit: false,
    });
  });

  it("sees the temporary owner-ready middle state alive today", () => {
    const bodies = roseBodies();
    const documented = Object.entries(SYSTEM_EVIDENCE)
      .filter(([, surfaces]) => (surfaces?.length ?? 0) > 0)
      .map(([id]) => id);
    expect(bodies.some((b) => b.documented)).toBe(true);
    // The middle state is the owner's directive for the systems evidence has
    // not reached yet — read from the directive, never memorised here.
    expect(
      bodies
        .filter((b) => b.ownerReady)
        .map((b) => b.system.id)
        .sort(),
    ).toEqual((ROSE_OWNER_READY as readonly string[]).filter((id) => !documented.includes(id)).sort());
    expect(bodies.every((b) => b.lit)).toBe(true);
  });

  it("lights knots from the start of the thread by completion, last knot blinking when unfinished", () => {
    const slots = ROOT_ORDER.length;
    expect(knotKindsFor("property", slots).every((k) => k === "solid")).toBe(true);
    const terranexKnots = knotKindsFor("investment", slots);
    expect(terranexKnots[0]).toBe("solid");
    expect(terranexKnots.filter((k) => k === "blink")).toHaveLength(1);
    expect(terranexKnots.at(-1)).toBe("dim");
    const kayyalKnots = knotKindsFor("recycling", slots);
    expect(kayyalKnots[0]).toBe("solid");
    expect(kayyalKnots.filter((k) => k === "blink")).toHaveLength(1);
    expect(kayyalKnots.at(-1)).toBe("dim");
  });

  it("pins the loom selectors, the three chip states and the light theme", () => {
    for (const selector of [
      ".loom",
      ".loom-canvas",
      ".loom-roots",
      ".loom-thread-chip",
      ".loom-thread-chip[data-lit=\"true\"]",
      ".loom-thread-chip[data-documented=\"false\"][data-lit=\"true\"]",
      ".light .loom-thread-chip",
      "@media (max-width: 720px)",
    ]) {
      expect(css, `missing ${selector}`).toContain(selector);
    }
  });
});
