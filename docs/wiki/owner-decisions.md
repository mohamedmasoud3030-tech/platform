# Owner decisions

Dated. A decision is only listed as decided if the owner said it, or if the owner explicitly delegated it.

## Decided by the owner

| Date | Decision | Where recorded |
| --- | --- | --- |
| 2026-10-18 | **Six products, one platform.** None is closed or frozen | `platform` session handoff, `HANDOFF_ar.md` |
| 2026-10-18 | **LENA is the umbrella brand; Nile is integrated into it** | `nilesys@364b51f`, `STATUS.md` §3 |
| 2026-10-18 | Cash corrections are **new rows, never edits** | Same. Also a database guarantee, not a preference |
| 2026-10-18 | Salary is never below zero | Same |
| 2026-10-18 | `UPDATE` stays allowed on leads and attendance | Same |
| 2026-10-19 | **D-F: the marketing site is part of the LENA site in `platform`** (`nilesys` serves it over HTTP) | `nilesys@364b51f`, ADR-0013 |
| 2026-10-19 | **No new repositories** | `nilesys@364b51f`, `STATUS.md` §3 |
| 2026-10-19 | **Keep npm; Nx and pnpm not adopted now** | ADR-0011 at `nilesys@364b51f` |
| 2026-10-19 | **Push work to the repository continuously** — the sandbox is wiped automatically | This wiki, [agent-operating-rules.md](agent-operating-rules.md) R1 |
| 2026-10-19 | **The goal is a complete, clickable demo as fast as possible** | [goal-north-star.md](goal-north-star.md) |

## Delegated by the owner, decided by an agent

| Date | Decision | Reasoning recorded in |
| --- | --- | --- |
| 2026-10-19 | **D-E: "total sales" means money collected**, refunds as their own line | `nilesys@7959fb9`, ADR-0014 |

Delegation wording, 2026-10-19: *"بلمنطق اتخذ الاختيار المناسب"*. The reasoning exists so the decision can
be overturned on its merits rather than on authority.

## Still open — the owner's alone

| ID | Question | Why it blocks work |
| --- | --- | --- |
| **D-A** | Which payment methods do we accept? | Decides the method list and its database constraint |
| **D-B** | What happens when a cash amount is typed wrong? | Recommendation on the table: a new correcting row |
| **D-C** | Who may close a shift? | **Decides the permission on the new shift endpoints** |
| **D-D** | Who may read the end-of-day report? | **Decides the permission on the report endpoint** |
| **D5** | Where does it run, and on what database? | Nothing can be shown to a customer without a host |
| **D-G** | Product order: Kayyal before POS, or POS first? | Two owner documents disagree (`nilesys@364b51f`, `PRODUCT_PLAN.md` §10) |
| **—** | Where do the seven system sites live? | Open in ADR-0013 §4 |

**D-C and D-D are the ones worth answering first** (noted 2026-10-19): they are the only two decisions that
gate writing an HTTP layer on top of an engine that is already finished and tested.
