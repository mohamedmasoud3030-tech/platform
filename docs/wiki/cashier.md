# The cashier — what it does, and what each rule is worth

State as of **2026-10-21**, `nilesys@34d970c`, verified against a live server and against
**https://nilesys-demo.vercel.app**.

The scope is not invented here. It comes from `docs/plan/001-pos-implementation-ready.md` (Phases 2–4) and
`docs/architecture/proposals/0007-payment-engine.md`. Every rule below has a test behind it in
`prototypes/nilesys/tests/pos-upgrade.test.js` — ten tests, ten rules.

## The six rules, and the failure each one removes

| Rule | Test | What it stops |
| --- | --- | --- |
| `TENDER-1` — four payment methods; change only from cash; everything else exact | 2 tests | A wallet or bank sale being recorded as a lie called "card" |
| `IDEM-1` — an idempotency key on `POST /api/sales` | 2 tests | A double-tapped confirm button producing two invoices and two stock decrements |
| `PERM-4` — cashier capped at 10% discount, manager uncapped | 1 test | A cashier giving a 100% discount |
| `HELD-1` — carts parked, recalled, and consumed by the sale that finishes them | 2 tests | Losing a customer's basket because they went back for one more item |
| `MONEY-1` — reports: `gross`, `refunds` as its own line, `net` as the headline | 1 test | "Net sales" that quietly hides refunds, or a profit number built on an untrusted cost |
| `AUDIT-1` — append-only activity log, manager-readable | 1 test | "Who discounted this?" being unanswerable |

## The money decision, in one paragraph

`MONEY-1` is decision **D-E** (ADR-0014) reaching the demo. Total sales means **money that left the shop**.
A refund is its own line, never a subtraction from the gross. The headline is `net = gross − refunds`.
The **profit KPI was removed from the screen**: plan 001 §2 says profit stays hidden until cost per unit is
trusted, and a demo that shows a green profit number teaches the owner to trust a number nobody can defend.

## A test that was rewritten on purpose

`tests/review.test.js` → `RET-4` used to assert the *old* contract: a fully returned sale disappears from
`salesTotal`. Under D-E that contract is gone. It now asserts that `grossTotal` grows by the sale,
`refundsTotal` grows by the refund, and `net` returns to where it started. The reasoning is written inside
the test, not only in the commit — a test whose contract changed must say so where someone will read it.

## What is still not there, stated plainly

- **No VAT / tax line.** The engine has no tax concept yet; the demo must not pretend otherwise.
- **No customers or loyalty.** Sales carry a cashier, not a buyer.
- **No offline mode.** Pull the network and the cashier stops.
- **`review.test.js` flakes** with `Unable to deserialize cloned data` — a Node test-runner crash, not an
  application failure. It reproduces on commits that predate this work. Not fixed; recorded.
- **The demo's storage is one JSON document.** It is now shared (Supabase) rather than per-instance, but it
  is still one row with one writer at a time. Fine for a demo; not a transaction log.

## Evidence

```
BASE=http://localhost:3210 node --test tests/regression.test.js    → 16/16
BASE=http://localhost:3210 node --test tests/review.test.js        → 31/31 (3 consecutive runs)
BASE=http://localhost:3210 node --test tests/pos-upgrade.test.js   → 10/10
```
Live, on the deployed site: a `wallet` sale was created (invoice 1047), replayed with the same key and
returned the same invoice, a cashier's 999 discount returned 403, and a cart was held successfully.
