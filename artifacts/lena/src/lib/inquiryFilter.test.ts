import { describe, expect, it } from "vitest";
import { ALL_INQUIRY_STATUSES, matchesInquiryStatusFilter } from "./inquiryFilter";

const rows = [
  { status: "new" },
  { status: "new" },
  { status: "contacted" },
  { status: "archived" },
  { status: "qualified" }, // legacy, never offered in the picker
];

describe("matchesInquiryStatusFilter", () => {
  it("passes every row when the filter is \"all\"", () => {
    expect(rows.filter((row) => matchesInquiryStatusFilter(row, ALL_INQUIRY_STATUSES))).toHaveLength(5);
  });

  it("keeps only rows of the chosen status", () => {
    expect(rows.filter((row) => matchesInquiryStatusFilter(row, "new"))).toHaveLength(2);
    expect(rows.filter((row) => matchesInquiryStatusFilter(row, "archived"))).toHaveLength(1);
  });

  it("never hides legacy rows behind \"all\"", () => {
    expect(rows.some((row) => row.status === "qualified" && matchesInquiryStatusFilter(row, ALL_INQUIRY_STATUSES))).toBe(true);
  });
});
