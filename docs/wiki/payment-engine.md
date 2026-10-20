# Payment engine — state

Pinned to `nilesys@7959fb9` (branch `feat/plt-0005-payment-db-constraints`, PR #6) unless stated otherwise.
Design contract: `nilesys@7959fb9`, `docs/architecture/proposals/0007-payment-engine.md` §8.

## What works, and where the evidence is

| Capability | Implementation | Tested |
| --- | --- | --- |
| Sale + split tenders + change, one transaction | `engines/transactions/src/checkout.ts` | `checkout.test.ts`, `review-gates.test.ts` |
| Refunds, serialised per sale | `engines/transactions/src/refunds.ts` | `refunds.test.ts`; race tests **skipped** without a server |
| Cash shifts, locked close | `engines/transactions/src/shifts.ts` | `shifts.test.ts` |
| Drawer position, pending cash | `engines/transactions/src/drawer.ts` | `payments-drawer.test.ts` |
| Settle a sale later (deposits) | `engines/transactions/src/payments.ts` `recordPayment` | `payments-drawer.test.ts` |
| Derived payment status | `payments.ts` `derivePaymentStatus` | pure-function assertions |
| Daily report, Africa/Cairo, DST-safe | `engines/transactions/src/reports.ts` | `reports.test.ts`, `dst-cairo.test.ts` |

Migration `0005_money_constraints` moved these into the database: `amount > 0`, closed method set,
`tendered − change = amount`, `(tenant_id, shift_id)` foreign keys, closure arithmetic, closed resolution
set. Generated from the schema, never hand-written.

## What does not work yet

| Missing | Consequence |
| --- | --- |
| **No HTTP layer for the new functions** | The engine exists; nothing can call it from outside. 2026-10-19: `recordPayment`, `getDrawer`, `resolvePendingCash`, `getPaymentStatus` have no endpoint |
| **No receipt, no sales list, no product writes** | POS-04, POS-05, POS-09 in `docs/PRODUCT_PLAN.md` §5.2 at `nilesys@364b51f` |
| **No cashier UI anywhere** | Neither repository has a product UI |
| **Pending cash has no producer** | `resolvePendingCash` is ready and idle. No code inserts `status = 'pending'`. Correct for a cash business; needed the day credit sales exist |

## What is *not* proven

On 2026-10-19 the suite ran **274 passed, 22 skipped**. The 22 are the two-connection race tests. Anyone
reading this page should treat refund-concurrency and double-shift-open as **unverified in this sandbox**
until gap 2 in [environment-gaps.md](environment-gaps.md) is closed.

## Superseded claims

- **Claimed 2026-10-19 (wrong):** "a pending cash movement can be created but never resolved: money sits in
  the drawer for ever." **Superseded the same day.** No production code created pending movements at all.
  `checkout.ts` and `refunds.ts` both insert `'posted'`. See [capabilities-and-limits.md](capabilities-and-limits.md).
- **Claimed 2026-10-14 in proposal 0007 §3 I2:** "change ≤ cash tendered" is the invariant. **Superseded
  2026-10-19:** that accepts a receipt that does not add up (1000 handed over, 250 change, 1000 recorded as
  covered). The database now enforces `tendered − change = amount`.
