import { describe, expect, it } from "vitest";
import { SYSTEM_EVIDENCE } from "./evidence";
import { OPERATOR_ASPECT_LABELS, OPERATOR_RECORDS, operatorRecordFor } from "./operator";

describe("OperatorRecords (B-10 / D6 scaffold)", () => {
  it("never claims an operator record without registered evidence", () => {
    const evidenceKeys = Object.keys(SYSTEM_EVIDENCE).sort();
    const recordKeys = Object.keys(OPERATOR_RECORDS).sort();
    expect(recordKeys.length).toBeGreaterThan(0);
    for (const key of recordKeys) {
      expect(evidenceKeys, `operator record for ${key} requires evidence`).toContain(key);
    }
  });

  it("covers both evidence-bearing reference products (MALEK, Lara Beauty)", () => {
    for (const id of ["property", "wellness"]) {
      const record = operatorRecordFor(id);
      expect(record, `${id} has an operator record`).toBeDefined();
      expect(record?.systemId).toBe(id);
    }
  });

  it("keeps every EN summary within the R7 under-80-word answer", () => {
    for (const [id, record] of Object.entries(OPERATOR_RECORDS)) {
      const words = record.summary.en.trim().split(/\s+/);
      expect(words.length, `${id} EN summary word count`).toBeLessThanOrEqual(80);
      expect(words.length).toBeGreaterThanOrEqual(20);
    }
  });

  it("provides both locales and a substantive Arabic answer", () => {
    for (const [id, record] of Object.entries(OPERATOR_RECORDS)) {
      expect(record.summary.ar.trim().length, `${id} AR summary`).toBeGreaterThan(40);
      expect(record.summary.en.trim().length).toBeGreaterThan(80);
    }
  });

  it("declares the still-undocumented D6 aspects explicitly rather than hiding them", () => {
    for (const [id, record] of Object.entries(OPERATOR_RECORDS)) {
      expect(record.open.length, `${id} declares its open aspects`).toBeGreaterThan(0);
      for (const aspect of record.open) {
        expect(OPERATOR_ASPECT_LABELS[aspect], `${aspect} has labels in both locales`).toBeDefined();
        expect(OPERATOR_ASPECT_LABELS[aspect].en.length).toBeGreaterThan(0);
        expect(OPERATOR_ASPECT_LABELS[aspect].ar.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps summaries register-derived: verbatim fragments from systems.ts stay intact", () => {
    // MALEK: the daily-work clause is property.usage verbatim.
    expect(OPERATOR_RECORDS.property?.summary.en).toContain("rather than from memory");
    expect(OPERATOR_RECORDS.property?.summary.ar).toContain("مدير المكتب الذي يشغّل الأصول للغير");
    // Lara Beauty: "not a customer booking site" is wellness.usage verbatim.
    expect(OPERATOR_RECORDS.wellness?.summary.en).toContain("not a customer booking site");
    expect(OPERATOR_RECORDS.wellness?.summary.ar).toContain("مخصص لفريق المركز");
  });
});
