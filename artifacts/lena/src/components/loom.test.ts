import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { publicSystems } from "@/content/systems";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";
import { roseBodies } from "@/features/home/rose-system-bodies";
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
    expect(bodies.some((b) => b.documented)).toBe(true);
    expect(
      bodies
        .filter((b) => b.ownerReady)
        .map((b) => b.system.id)
        .sort(),
    ).toEqual(["hospitality", "investment", "recycling", "rental"]);
    expect(bodies.every((b) => b.lit)).toBe(true);
  });

  it("lights knots from the start of the thread by completion, last knot blinking when unfinished", () => {
    const malek = publicSystems().find((s) => s.id === "property")!;
    expect(knotKindsFor("property", malek.operatingPrimitives.length).every((k) => k === "solid")).toBe(
      true,
    );
    const terranex = publicSystems().find((s) => s.id === "investment")!;
    const terranexKnots = knotKindsFor("investment", terranex.operatingPrimitives.length);
    expect(terranexKnots.at(-1)).toBe("dim");
    expect(terranexKnots.filter((k) => k === "blink")).toHaveLength(1);
    expect(terranexKnots[0]).toBe("solid");
    const kayyal = publicSystems().find((s) => s.id === "recycling")!;
    const kayyalKnots = knotKindsFor("recycling", kayyal.operatingPrimitives.length);
    expect(kayyalKnots.at(-1)).toBe("dim");
    expect(kayyalKnots.filter((k) => k === "blink")).toHaveLength(1);
    expect(kayyalKnots[0]).toBe("solid");
  });

  it("pins the loom selectors, the three chip states and the light theme", () => {
    for (const selector of [
      ".loom",
      ".loom-canvas",
      ".loom-roots",
      ".loom-thread-chip",
      ".loom-thread-chip[data-lit=\"true\"]",
      ".loom-thread-chip[data-documented=\"false\"][data-lit=\"true\"]",
      "p.night-card.loom-card",
      ".light .loom-thread-chip",
      "@media (max-width: 720px)",
    ]) {
      expect(css, `missing ${selector}`).toContain(selector);
    }
  });
});
