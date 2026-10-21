# The demo, and where it can live

Facts as of **2026-10-21**, each one from a command or an API response, not from memory.

## What the demo is, right now

`nilesys/prototypes/nilesys` — a plain-Node server with **zero dependencies**, JSON-file storage,
`public/` static pages, and one working system (the POS). Started with `node server.js`, honours
`PORT` and `DB_FILE`, binds `0.0.0.0`.

**Verified 2026-10-21 against a live server on `:3210` with a clean database:**

```
tests/regression.js     → 16/16 pass
tests/review.test.js    → 31/31 pass (30 results: 30 sound, 0 confirmed problems)
```

A note worth keeping: an earlier run the same day showed **29 failures**. The cause was the *harness* —
the test process pointed at a different `DB_FILE` than the server was writing to — not the code. The
lesson is the same one gap 1 teaches: a red number is only meaningful with the command that produced it.

## Vercel, honestly

| Question | Verified answer (2026-10-21) |
| --- | --- |
| Is Vercel connected? | Yes. Account `m77mdms3d@gmail.com`, team `lenabeauty`, hobby plan |
| How many projects? | **One**: `jiwdah` (`prj_5MgYmjUfT1tjotTgoE2VSqThn6xo`) |
| What is it wired to? | GitHub `mohamedmasoud3030-tech/starting` @ `main` — **not** `nilesys`, **not** `platform` |
| Is there a project for `nilesys`? | **No.** `list_projects search=nilesys` → `[]` |
| State of the last deployments? | **BLOCKED** (both production and preview) |
| Supabase projects? | **Zero** |

### Why `jiwdah` is blocked — the exact words returned

1. Production, `dpl_HsfXaxvVJcLiAZYFfF4m5Foy7fmR`:
   > "The deployment was blocked because the commit author doesn't have permission to create
   > deployments for this project."
   Technical marker: `seatBlock.blockCode = TEAM_ACCESS_REQUIRED`. The commit came from GitHub login
   `mohamedmasoud3030-tech`, and Vercel does not have a **seat** for that user on the `lenabeauty` team.
2. Preview, `dpl_qjGFwvd2TAYfshCvaxhFKa5Qmhp3`:
   > "The deployment was blocked because Vercel couldn't find a Git account for the commit author."
   Cause: the commit author was a fabricated local identity, `Portfolio Ops <ops@local>`.

**Reading:** this is an identity/permission problem in the Vercel dashboard, not a code or repository
problem. It is fixed by giving the committing account a seat on the team — an owner action.

## What was prepared so a deploy is one step (not done)

`nilesys@780bf49`, branch `feat/demo-on-vercel`, **PR #7** (base `feat/plt-0005-payment-db-constraints`):

- `server.js` no longer listens on import (`require.main === module`) — the same listener serves as a
  serverless function. One copy of the logic, not two.
- Sessions are HMAC-signed and self-contained, because on Vercel each request may land on a different
  instance. `timingSafeEqual` for comparison; logout revokes the `jti` on the instance that handled it.
- `DB_FILE` → `/tmp/nilesys-db.json` when `VERCEL` is set.
- `api/[...path].js` — zero logic, re-exports `requestListener`.
- `vercel.json` — function settings only.

### The limit that must be said out loud

`/tmp` on Vercel is **per instance, not shared**. Logins, permissions and reports work on any instance;
the demo **data** lives in the warm instance and returns to seed on a new one. Vercel is therefore good
for *showing* and *reviewing*, and not evidence that "the data is saved". Proving that needs a shared
database (Postgres/Supabase) instead of a JSON file.

## The decision still open (owner)

| Option | Meaning | Cost |
| --- | --- | --- |
| A — Vercel as-is | Public link, data resets per instance | ~10 minutes |
| B — Vercel + Supabase | Data genuinely persists; needs a Supabase project to be created | ~1 hour |
| C — Wait | Review from the sandbox preview; no deploy | nothing |

**Nothing has been deployed.** No merge to `main`, no branch deletions, no force-push.
