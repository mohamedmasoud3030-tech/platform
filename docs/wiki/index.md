# Wiki — LENA / Nile

Memory that outlives a session. The sandbox is wiped between sessions; this folder is not, because it
travels with the repository.

**Rules for every page here:**

- Every claim carries a date. `2026-10-19` means the claim was true when it was written down.
- Every claim about code carries a commit and a repo: `nilesys@7959fb9`.
- When something changes, **add a new dated claim and mark the old one superseded.** Never rewrite the old
  one. A wiki that silently corrects itself cannot be trusted about anything else.
- Sources (PRs, issues, commits, reports) are **cited, never copied.** This folder must not become a
  second source of truth for things that live in the repo.
- This is a private repository. It may hold business context that the public `nilesys` repo must never
  contain.

---

## Direction

| Page | What it answers |
| --- | --- |
| [goal-north-star.md](goal-north-star.md) | What "done" means, and how the demo is scoped |

## How we work

| Page | What it answers |
| --- | --- |
| [agent-operating-rules.md](agent-operating-rules.md) | Standing rules from the owner, and why they exist |
| [capabilities-and-limits.md](capabilities-and-limits.md) | What an agent can actually do here, and what it cannot |

## Environment

| Page | What it answers |
| --- | --- |
| [environment-gaps.md](environment-gaps.md) | The five places agents fall short, with evidence |

## State

| Page | What it answers |
| --- | --- |
| [payment-engine.md](payment-engine.md) | What the payment engine does and does not do, pinned to commits |
| [cashier.md](cashier.md) | The demo cashier: six rules, the failure each removes, and what is still missing |
| [repos-and-branches.md](repos-and-branches.md) | Which repository holds what, and which branches matter |
| [demo-and-vercel.md](demo-and-vercel.md) | The demo's real state, why Vercel blocks, and where it can ship |

## Decisions

| Page | What it answers |
| --- | --- |
| [owner-decisions.md](owner-decisions.md) | Every decision the owner has made, dated, and what is still open |

---

*Created 2026-10-19. Location agreed with the owner the same day: this repository, because `nilesys` is
public and the wiki holds commercial context.*
