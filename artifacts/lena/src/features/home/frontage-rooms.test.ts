import { describe, expect, it } from "vitest";
import { frontageRooms, isFrontageWindowLit } from "./frontage-rooms";
import { SYSTEM_EVIDENCE } from "@/features/world/content/evidence";

describe("home frontage rooms (House Ledger hero mapping)", () => {
  it("maps exactly the six public systems in owner order", () => {
    const rooms = frontageRooms();
    expect(rooms.map((room) => room.system.id)).toEqual([
      "property", // MALEK — first
      "investment", // Terranex
      "wellness", // Lara Beauty
      "rental", // Carmen Gallery
      "hospitality",
      "recycling", // Kayyal — last
    ]);
    expect(rooms).toHaveLength(6);
  });

  it("lights exactly the systems the evidence registry documents", () => {
    // Derived from the registry, not remembered: whether two or three systems
    // have real captures is the registry's business, and a system that gains
    // evidence (Carmén Gallery did) must move this test with it.
    const documented = Object.entries(SYSTEM_EVIDENCE)
      .filter(([, surfaces]) => (surfaces?.length ?? 0) > 0)
      .map(([id]) => id)
      .sort();
    expect(documented.length, "the registry documents at least one system").toBeGreaterThan(0);
    const lit = frontageRooms()
      .filter((room) => room.documented)
      .map((room) => room.system.id)
      .sort();
    expect(lit, "documented = lit, by the registry, in any visual era").toEqual(documented);
  });

  it("never lights a system whose registry is empty", () => {
    for (const room of frontageRooms()) {
      const expected = isFrontageWindowLit(room.system.id);
      expect(room.documented, `${room.system.id} flag matches the shared rule`).toBe(expected);
      if (!expected) {
        expect(
          (SYSTEM_EVIDENCE[room.system.id]?.length ?? 0),
          `${room.system.id} stays dim while its registry page is empty`,
        ).toBe(0);
      }
    }
  });

  it("holds bilingual names for every lit window label", () => {
    for (const room of frontageRooms()) {
      expect(room.system.name.ar.trim().length, `${room.system.id} AR name`).toBeGreaterThan(0);
      expect(room.system.name.en.trim().length, `${room.system.id} EN name`).toBeGreaterThan(0);
      expect(room.system.name.ar, `${room.system.id} names switch with language`).not.toBe(
        room.system.name.en,
      );
    }
  });
});
