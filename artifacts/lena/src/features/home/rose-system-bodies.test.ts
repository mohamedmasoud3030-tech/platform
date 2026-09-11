import { describe, expect, it } from "vitest";
import { isFrontageWindowLit } from "./frontage-rooms";
import { completionFor, roseBodies } from "./rose-system-bodies";

describe("rose engine bodies (R5 hero mapping)", () => {
  it("maps exactly the six public systems in owner order", () => {
    const bodies = roseBodies();
    expect(bodies.map((body) => body.system.id)).toEqual([
      "property", // MALEK — first
      "investment", // Terranex
      "wellness", // Lara Beauty
      "rental", // Carmen Gallery
      "hospitality",
      "recycling", // Kayyal — last
    ]);
    expect(bodies.map((body) => body.ownerIndex)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("keeps documented purely evidence-based", () => {
    for (const body of roseBodies()) {
      expect(body.documented, `${body.system.id} flag matches the shared rule`).toBe(
        isFrontageWindowLit(body.system.id),
      );
    }
  });

  it("lights documented systems plus the temporary owner-ready directive", () => {
    const bodies = roseBodies();
    expect(
      bodies
        .filter((body) => body.lit)
        .map((body) => body.system.id)
        .sort(),
    ).toEqual(["hospitality", "investment", "property", "recycling", "rental", "wellness"]);
    expect(
      bodies
        .filter((body) => body.ownerReady)
        .map((body) => body.system.id)
        .sort(),
    ).toEqual(["hospitality", "investment", "recycling", "rental"]);
  });

  it("holds bilingual names for every chip label", () => {
    for (const body of roseBodies()) {
      expect(body.system.name.ar.trim().length, `${body.system.id} AR name`).toBeGreaterThan(0);
      expect(body.system.name.en.trim().length, `${body.system.id} EN name`).toBeGreaterThan(0);
    }
  });

  it("records completion so Terranex and Kayyal light from the start, not to the last knot", () => {
    expect(completionFor("property")).toBe(1);
    expect(completionFor("wellness")).toBe(1);
    expect(completionFor("investment")).toBe(0.7);
    expect(completionFor("recycling")).toBe(0.85);
  });
});
