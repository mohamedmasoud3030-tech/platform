# Repositories and branches

Facts as of 2026-10-19, verified through `git ls-remote` and the GitHub API.

## The two repositories that matter this week

| Repo | Visibility | Holds | Do **not** assume |
| --- | --- | --- | --- |
| `mohamedmasoud3030-tech/nilesys` | **public** | The engines, the migrations, the payment work, the prototype, the product plan | That anything private or commercial belongs here. It does not |
| `mohamedmasoud3030-tech/platform` | **private** | The LENA Digital House site, the portfolio documents, and — from 2026-10-19 — this wiki | That it contains the payment engine. It does not. It has nine branches, none about payments |

**A mistake corrected on 2026-10-19:** the owner asked for work on "proposal 0007 in `platform`". The
proposal lives in `nilesys`, at `docs/architecture/proposals/0007-payment-engine.md`. `platform` has nine
branches and none of them touches payments. Checked by searching every branch of both repositories.

## `nilesys` branches worth knowing

| Branch | Head (2026-10-19) | State |
| --- | --- | --- |
| `main` | `52af469` | Merge of PR #4. The production branch |
| `docs/unified-plan-2026-10-19` | `364b51f` | Newest documents (product plan, status, ADR-0011…0013) plus the POS engine. **Unmerged** |
| `integration/nile-2026-10-18` | `0207c13` | Checkout, refunds, shifts, reports, lead and people services. **Unmerged** |
| `feat/plt-0005-payment-db-constraints` | `7959fb9` | Migration `0005`, proposal §8, `drawer.ts`, `payments.ts`, ADR-0014. **PR #6**, base `docs/unified-plan-2026-10-19` |
| `feat/nile-payments-engine` | `c489a23` | An *alternative* implementation of proposal 0007. Option (3) of decision D-A. Not taken |
| `fix/nile-pool-error-listener` | `29390fa` | Superseded: N-1 is fixed inside `7959fb9` instead |
| `investigation/g7-runtime-role-boundary-incomplete` | `60342be` | **Not a fix.** See finding G-7a |
| `feat/demo-on-vercel` | `780bf49` (2026-10-21) | Makes the prototype deployable as a Vercel project. **PR #7**, base `feat/plt-0005-payment-db-constraints`. Nothing deployed |

## `platform` branches

Nine branches as of 2026-10-19, all documentation or visual work. `main` is `f91989de`. Nothing on them
relates to the payment engine.

## The "where does the code go" answer, on 2026-10-19

- **Engines, migrations, APIs, the cashier** → `nilesys`.
- **The marketing site** → `platform`, per owner decision D-F and ADR-0013 (`nilesys@364b51f`).
- **Where the seven system sites live** → still OPEN on 2026-10-19.
- **This wiki** → `platform`, because it holds commercial context and `nilesys` is public.
