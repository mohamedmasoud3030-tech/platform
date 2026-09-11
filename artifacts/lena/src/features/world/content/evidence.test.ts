import { describe, expect, it } from "vitest";
import { dashboardEvidenceFor, evidenceFor, SYSTEM_EVIDENCE } from "./evidence";

describe("product evidence authority", () => {
  it("uses the evidence registry itself as the publication truth", () => {
    expect(evidenceFor("property")).toBe(SYSTEM_EVIDENCE.property);
    expect(evidenceFor("wellness")).toBe(SYSTEM_EVIDENCE.wellness);
    expect(evidenceFor("rental")).toBe(SYSTEM_EVIDENCE.rental);
  });

  it("has substantive real MALEK operating evidence", () => {
    const malek = evidenceFor("property") ?? [];
    expect(malek.length).toBeGreaterThanOrEqual(7);
    expect(malek.map((surface) => surface.id)).toEqual(
      expect.arrayContaining([
        "entry",
        "dashboard",
        "properties",
        "contracts",
        "financials",
        "maintenance",
        "mobile",
      ]),
    );
  });

  it("has substantive real Wellness operating evidence", () => {
    const wellness = evidenceFor("wellness") ?? [];
    expect(wellness.length).toBeGreaterThanOrEqual(10);
    expect(wellness.map((surface) => surface.id)).toEqual(
      expect.arrayContaining([
        "wellness-entry",
        "wellness-dashboard",
        "wellness-appointments",
        "wellness-pos",
        "wellness-records",
        "wellness-services",
        "wellness-reports",
        "wellness-mobile-dashboard",
        "wellness-mobile-appointments",
        "wellness-mobile-pos",
      ]),
    );
  });

  it("has substantive real Carmen Gallery operating evidence", () => {
    const carmen = evidenceFor("rental") ?? [];
    expect(carmen.length).toBeGreaterThanOrEqual(11);
    expect(carmen.map((surface) => surface.id)).toEqual(
      expect.arrayContaining([
        "carmen-entry",
        "carmen-dashboard",
        "carmen-inventory",
        "carmen-availability",
        "carmen-reservations",
        "carmen-delivery",
        "carmen-payments",
        "carmen-customers",
        "carmen-appointments",
        "carmen-sales",
        "carmen-reports",
        "carmen-mobile-dashboard",
        "carmen-mobile-reservations",
        "carmen-mobile-delivery",
      ]),
    );
    expect(dashboardEvidenceFor("rental")?.src).toBe("/world/evidence/carmen/dashboard.png");
  });

  it("keeps evidence ids and asset paths unique", () => {
    for (const surfaces of Object.values(SYSTEM_EVIDENCE)) {
      if (!surfaces) continue;
      const ids = surfaces.map((surface) => surface.id);
      const paths = surfaces.map((surface) => surface.src);
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(paths).size).toBe(paths.length);
    }
  });
});
