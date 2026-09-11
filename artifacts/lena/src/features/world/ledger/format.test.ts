import { describe, expect, it } from "vitest";
import { publicSystems } from "@/content/systems";
import { evidenceFor } from "@/features/world/content/evidence";
import {
  entryNumberFor,
  figureCountFor,
  figureLabel,
  figureCountLabel,
  ledgerPad,
  RECORD_STATUS_LABEL,
  recordStatusFor,
  registerTotals,
  registerTotalsLabel,
  toLedgerDigits,
} from "./format";

describe("ledger formatting", () => {
  it("keeps Latin digits in English and converts to Arabic-Indic in Arabic", () => {
    expect(toLedgerDigits(7, "en")).toBe("7");
    expect(toLedgerDigits(7, "ar")).toBe("٧");
    expect(toLedgerDigits("10", "ar")).toBe("١٠");
  });

  it("zero-pads tabular numerals in both digit sets", () => {
    expect(ledgerPad(3, 2, "en")).toBe("03");
    expect(ledgerPad(3, 2, "ar")).toBe("٠٣");
  });

  it("numbers plates deterministically from their registry index", () => {
    expect(figureLabel(0, 7, "en")).toEqual({ number: "01", of: "07" });
    expect(figureLabel(6, 7, "en")).toEqual({ number: "07", of: "07" });
    expect(figureLabel(0, 7, "ar")).toEqual({ number: "٠١", of: "٠٧" });
  });

  it("derives entry numbers from the canonical owner order", () => {
    const malek = publicSystems().find((system) => system.id === "property");
    expect(malek).toBeDefined();
    expect(entryNumberFor(malek!.order, "en")).toBe("01");
    expect(entryNumberFor(malek!.order, "ar")).toBe("٠١");
  });
});

describe("record status is evidence-derived, never lifecycle-derived", () => {
  it("marks documented only systems that have evidence registry entries", () => {
    for (const system of publicSystems()) {
      const expected = (evidenceFor(system.id)?.length ?? 0) > 0;
      expect(recordStatusFor(system.id) === "documented").toBe(expected);
      expect(figureCountFor(system.id)).toBe(evidenceFor(system.id)?.length ?? 0);
    }
  });

  it("the public label vocabulary stays on documentation state", () => {
    expect(Object.keys(RECORD_STATUS_LABEL).sort()).toEqual(["documented", "pending"]);
    expect(RECORD_STATUS_LABEL.pending.en).toContain("PENDING");
  });

  it("figure count labels never claim numbers the registry does not hold", () => {
    const malek = publicSystems().find((system) => system.id === "property")!;
    const count = figureCountFor(malek.id);
    expect(count).toBeGreaterThanOrEqual(7);
    expect(figureCountLabel(count, "ar")).toContain("لوحات");
    expect(figureCountLabel(0, "ar")).toBe("لا لوحات بعد");
  });
});

describe("register totals", () => {
  it("reconcile: documented + pending = total across public systems", () => {
    const totals = registerTotals();
    expect(totals.documented + totals.pending).toBe(totals.total);
    expect(totals.total).toBe(publicSystems().length);
  });

  it("renders a bilingual totals line", () => {
    const en = registerTotalsLabel("en");
    const ar = registerTotalsLabel("ar");
    expect(en).toMatch(/systems/);
    expect(ar).toContain("أنظمة");
  });
});
