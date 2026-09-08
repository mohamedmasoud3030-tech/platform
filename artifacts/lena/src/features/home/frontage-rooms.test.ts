import { describe, expect, it } from "vitest";
import { frontageRooms, isFrontageWindowLit } from "./frontage-rooms";

describe("home frontage rooms (House Ledger hero mapping)", () => {
  it("maps exactly the six public systems in owner order", () => {
    const rooms = frontageRooms();
    expect(rooms.map((room) => room.system.id)).toEqual([
      "wellness", // Lara Beauty — leads the row
      "rental", // LENA Dress
      "property", // MALEK
      "hospitality",
      "investment", // Terranex
      "recycling", // Kayyal — last
    ]);
    expect(rooms).toHaveLength(6);
  });

  it("lights exactly the two systems the evidence registry documents", () => {
    const lit = frontageRooms()
      .filter((room) => room.documented)
      .map((room) => room.system.id)
      .sort();
    expect(lit, "documented = lit, by the registry, in any visual era").toEqual([
      "property", // MALEK — 7 real surfaces
      "wellness", // Lara Beauty — 10 real surfaces
    ]);
  });

  it("never lights a system whose registry is empty", () => {
    for (const room of frontageRooms()) {
      const expected = isFrontageWindowLit(room.system.id);
      expect(room.documented, `${room.system.id} flag matches the shared rule`).toBe(expected);
      if (!expected) {
        expect(room.system.id, "undocumented systems stay dim").toMatch(
          /^(rental|hospitality|investment|recycling)$/,
        );
      }
    }
  });

  it("holds bilingual names for every lit window label", () => {
    for (const room of frontageRooms()) {
      expect(room.system.name.ar.trim().length, `${room.system.id} AR name`).toBeGreaterThan(0);
      expect(room.system.name.en.trim().length, `${room.system.id} EN name`).toBeGreaterThan(0);
    }
  });
});
