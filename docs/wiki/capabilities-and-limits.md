# Capabilities and limits

Written 2026-10-19, so that the next session does not re-discover this by failing.

## Available

| Capability | Notes |
| --- | --- |
| Shell, Node 20, npm, pnpm, git, TypeScript, Vitest | Confirmed 2026-10-19 |
| `gh` CLI (2.46.0, installed from Debian) | Confirmed authenticated as `mohamedmasoud3030-tech` on 2026-10-19 |
| GitHub token scopes | `repo`, `workflow`, `read:org`, `gist` |
| Token stored at `~/.local/gh` | Deliberately outside the persisted workspace. Wrapper scripts at `~/bin/gh` and `~/bin/gh-cred.sh` contain no secret |
| Public internet over HTTPS | Confirmed: `api.github.com` returns 200 |
| `sudo` and `apt-get` | Confirmed 2026-10-19. Used to install `gh` and `expect` |
| Background processes | `start_process` survives within a session; **not** across a sandbox wipe |
| Browser automation (Playwright + Chromium) | Preinstalled, not yet exercised on this goal |
| Publishing a live preview | A process bound to `0.0.0.0` becomes a preview URL for the owner |

## Not available — do not pretend otherwise

| Missing | What it means in practice |
| --- | --- |
| **Subagents** | There is no tool to spawn a background agent. Work is serial. "Co-ordinate subagents" is not executable here; the wiki is the substitute for shared memory |
| **Schedules / cron** | There is no scheduler. A recurring job must be a command the owner runs, or a checklist executed at the start of each session |
| **An MCP-style connector for Vercel or Supabase** | On 2026-10-19 both connectors reported `disabled` — connected but switched off for the conversation. The owner must enable them; a new connection is not needed |
| **A PostgreSQL server** | Not installed. `apt` candidate is `17+278`. Consequences in [environment-gaps.md](environment-gaps.md) gap 2 |
| **Persistence across a wipe** | Only what is inside a git repository that has been pushed. Everything else is lost |

## Corrections to earlier statements

- **On 2026-10-19 an agent claimed** that pending cash "sits in the drawer for ever and never becomes
  revenue". Reading the writers showed no production code ever inserts `status = 'pending'`: `checkout` and
  `refunds` both insert `'posted'` (`nilesys@7959fb9`, `engines/transactions/src/drawer.ts` header). The
  mechanism was dormant, not leaking. Recorded here because the wrong version was reported to the owner in
  writing and was retracted on the same day.
