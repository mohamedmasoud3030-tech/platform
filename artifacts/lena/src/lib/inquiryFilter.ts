/**
 * Dashboard inquiry status filter (OPEN_DECISIONS Part B-8): the working
 * list grows without bound, so the operator needs a quick way to view one
 * stage at a time. Pure and tiny on purpose — the interesting behaviour is
 * the "all" passthrough and the legacy "qualified" rows that are never
 * offered in the picker but must stay visible under "all".
 */

export const ALL_INQUIRY_STATUSES = "all";

export interface InquiryStatusRow {
  status: string;
}

export function matchesInquiryStatusFilter(row: InquiryStatusRow, filter: string): boolean {
  return filter === ALL_INQUIRY_STATUSES || row.status === filter;
}
