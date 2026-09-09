import { describe, expect, it } from "vitest";
import { isFrontageWindowLit } from "./frontage-rooms";
import { roseBodies } from "./rose-system-bodies";

describe("rose engine bodies (R5 hero mapping)", () => {
  it("maps exactly the six public systems in owner order", () => {
    const bodies = roseBodies();
    expect(bodies.map((body) => body.system.id)).toEqual([
      "wellness", // Lara Beauty — leads the row
      "rental", // LENA Dress
      "property", // MALEK
      "hospitality",
      "investment", // Terranex
      "recycling", // Kayyal — last
    ]);
    expect(bodies.map((body) => body.ownerIndex)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("gilds exactly the systems the evidence registry documents", () => {
    for (const body of roseBodies()) {
      expect(body.documented, `${body.system.id} flag matches the shared rule`).toBe(
        isFrontageWindowLit(body.system.id),
      );
    }
  });

  it("holds bilingual names for every chip label", () => {
    for (const body of roseBodies()) {
      expect(body.system.name.ar.trim().length, `${body.system.id} AR name`).toBeGreaterThan(0);
      expect(body.system.name.en.trim().length, `${body.system.id} EN name`).toBeGreaterThan(0);
    }
  });
});
