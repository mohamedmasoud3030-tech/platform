# Environment gaps

Audited 2026-10-19 against `nilesys@7959fb9`. Gap 2 was closed the same day; the rest stand. Each entry: what is missing, the evidence, and what it costs
an agent. Ordered by leverage, not by difficulty.

## Gap 1 — No CI at all (highest leverage)

**Evidence:** `.github/workflows` does not exist in `nilesys` at `7959fb9`. `STATUS.md` §1 records CI as
"None on GitHub". A reviewed draft exists at `deliverables/ci/nilesys-ci.yml` on branch
`rescue/2026-10-19-workspace-archive` (`nilesys@27bf9b3`).

**Cost:** every pull request is "trust me". A reviewer cannot see a test result; they see a paragraph
claiming one. This is the single largest difference between this repository and one where agents are safe.

**Fix shape:** four jobs — typecheck, tests against PostgreSQL 17, API smoke, `gitleaks`. The draft already
exists; it needs reviewing and pushing. Scope `workflow` exists on the token since 2026-10-19.

## Gap 2 — No PostgreSQL, so the race tests never run — **CLOSED 2026-10-19**

> **Closed the same day it was written.** `nilesys@7959fb9` now ships `tools/local-pg.sh`. Running
> `./tools/local-pg.sh test` on PostgreSQL 17.11 gave **29 files, 296/296, 0 skipped** — the first time the
> concurrency files ran in a sandbox (9 assertions: refund races A–G, double shift open), with 0 leftover
> test databases. The historical description below is kept, because the reasoning is why the script exists.

**Evidence:** `engines/transactions/test/refund-concurrency.pg.test.ts:70` is
`describe.skipIf(!ADMIN_URL)`. With `ADMIN_URL` unset — which it was on 2026-10-19 — both `.pg.test.ts`
files skip. That was **22 skipped assertions** in the 274-pass run.

**Cost:** no agent in this sandbox can honestly claim concurrency is correct. Two rows of the invariant
table in proposal 0007 §3 (I5 refund races, I12 double shift open) rest on tests that have not run here.

**Fix shape (built):** `tools/local-pg.sh` — install if missing, start the cluster, set the superuser
password so the default scram policy accepts TCP, wait for readiness, print the URL. Subcommands
`start | url | stop | test`. The durable lesson is in the script's header: **a missing environment is a bug
in the environment, not in the agent.**

## Gap 3 — Money is a bare `number`

**Evidence:** `engines/transactions/src/db/schema.ts` uses `bigint(name, { mode: 'number' })` for every
amount, at `7959fb9`. There is no branded type on money crossing the engine boundary — unlike
`engines/transactions/src/decimal.ts`, which already brands `EGP`, `Kg`, `EGPPerKg` for the *pure logic*
layer. The persistence layer drops that protection.

**Cost:** nothing at compile time prevents adding piastres to pounds, or a minor unit to a major one. Two of
the four money tables in the four repos of the portfolio use different `money` conventions
(`nilesys@364b51f`, `docs/STATUS.md`; the portfolio decision D2 in `platform/docs` records four variants).

**Fix shape:** a branded `Minor` type at the DB boundary, plus a lint rule forbidding arithmetic on raw
amounts. This is the "constrained API" idea: make the mistake unrepresentable rather than tested-for.

## Gap 4 — No linter of any kind

**Evidence:** no `lint` script in `package.json`, no `.eslintrc*`, `eslint.config.*`, `biome.json` or
`.prettierrc*` at `7959fb9`. TypeScript runs `strict` with `noUncheckedIndexedAccess`, which is genuinely
good, and nothing else.

**Cost:** unused imports, floating promises and accidental `any` accumulate. The repo has many explicit
`any` in the DB-typing seams; without a rule they will spread from the seams into logic.

**Honest note:** the two bugs found on 2026-10-19 (a nested transaction deadlocking on a single-connection
engine; a function passing numbers into `Decimal` arithmetic) were **not** linter-shaped. They were caught
by tests. A linter is not a substitute for the tests in gap 2.

## Gap 5 — No CODEOWNERS, and one stale PR

**Evidence:** no `CODEOWNERS` file at `7959fb9`. PR #5 is open since 2026-10-15 with a recorded decision of
"do not merge" (`STATUS.md` §2).

**Cost:** no mechanism forces owner review on money, auth or migration paths. And an open PR that everyone
has agreed to abandon is a trap for the next agent, who will assume it is live.

**Fix shape:** `CODEOWNERS` over `engines/transactions/`, `engines/db/migrations/`, `engines/platform/src/auth/`.
For PR #5, the recorded plan is: tag `archive/…`, then close — both need the owner.

---

## What is already good, so it is not "fixed" by mistake

- `tsc --strict` with `noUncheckedIndexedAccess` at `7959fb9`.
- 274 assertions running on an in-process PostgreSQL engine (`PGlite`) through the same migration path
  production uses (`engines/db/open.ts`).
- Migrations are generated from the schema, never hand-written, and a guard test refuses a forked snapshot
  chain (`engines/db/test/migration-chain.test.ts`).
- Append-only is enforced by the database, not by convention: `REVOKE UPDATE, DELETE` from the runtime role
  in `0002` and `0004`, and `nile_app` cannot bypass RLS.
