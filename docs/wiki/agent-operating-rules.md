# Agent operating rules

Standing rules, in the owner's words where possible. Each rule exists because something went wrong once.

## R1 — Push early, push often (2026-10-19)

> "ضروري ترفع الشغل اول باول للريبو عشان الساندبوكس عندك بتمسح تتلقائي"

**The sandbox is wiped automatically.** Anything not pushed is lost, including reports and notes.

Consequence, adopted 2026-10-19: **no work product survives only on disk.** Every meaningful step ends with
a commit and a push to a branch. Local-only reports are a liability, not a safety net.

This supersedes the earlier default of "prepare locally, push when the owner approves". The owner approved
pushing work-in-progress to **branches** on 2026-10-19. It does **not** authorise merging to `main`.

## R2 — The owner merges (standing, reaffirmed 2026-10-19)

No merge to `main`. No force-push. No branch deletion. No tag deletion. All of those wait for an explicit
instruction. Branch pushes and pull requests are allowed.

## R3 — No invented numbers (2026-10-18)

> "مفيش رقم من غير أمر طلّعه"

Every number reported must come from a command whose output can be shown. This rule exists because an
agent once reported "108 files in `malek`" when the true figure at the root was 5 — the 108 was a total
across the repository.

## R4 — No "done" without evidence (2026-10-18)

> "مفيش «خلصت» من غير دليل"

A task closes with a command and its output, not a description of the output. Corollary: a skipped test is
reported as skipped, never folded into a pass count. On 2026-10-19 that meant writing "274 passed, 22
skipped — the 22 need a real PostgreSQL" rather than "296 tests green".

## R5 — Nothing is deleted without permission (2026-10-18)

And before any deletion, the file's contents must be read. Verdicts based on filenames were wrong four
times out of four in the 2026-10-18 session.

## R6 — No jargon with the owner (2026-10-18)

> "المالك مش تقني"

Products, money, customers, risk. A technical term the owner has to look up is the agent's mistake, not the
owner's gap.

## R7 — Every reply covers the whole portfolio (2026-10-18)

Not one repository. The owner was explicit that answering per-repo hides the cross-repo problem that is
actually hurting him.

## R8 — No new repositories (technical decision, 2026-10-19)

Recorded in `nilesys@364b51f`, `docs/STATUS.md` §3: archives stay as tags in the existing repository. A
proposed `nilesys-archive` repo was dropped.

**This ruled out one option for this wiki.** A separate private wiki repository was considered on
2026-10-19 and rejected because R8 already forbids it. `platform/docs/wiki/` was chosen instead.

## R9 — Fix the environment, not just the task

Adopted 2026-10-19 with the chief-of-staff role. Every piece of work is an excuse to ask: is there a rule,
a type, or a gate that would have made the *next* version of this mistake impossible?

Worked example from 2026-10-19: two bugs were found by tests, not by review — a nested transaction that
deadlocked, and a function passing raw numbers into decimal arithmetic. Neither is catchable by a linter.
But the class of money errors that *is* catchable is `bigint(mode: 'number')`: every amount is a plain
`number`, so nothing stops adding piastres to pounds at compile time. Filed in
[environment-gaps.md](environment-gaps.md) as gap 3.
