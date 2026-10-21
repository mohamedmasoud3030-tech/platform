# LENA Digital House — Authoritative Platform PRD

> **LIVE STATUS — 2026-09-09.** Committed to the repository as the working mandate, per the founder's instruction:
> the PRD is the authorization; tranches execute continuously and are merged when green, without per-task approval
> stops. The snapshot below is the 2026-09-08 independent audit of `main` @ `158e8c3`. Supersessions are tracked in
> **§0 Execution log** (updated as work lands) and the **§24 checklist**; any numbered requirement (FR-*/EVID-* /
> PROD-* / CHAMBER-* / WORLD-* / HOME-* / C* items) resolves with a dated §0 entry. `main` HEAD at commit time:
> `de962ab`.

---

*Compiled from a fresh, independently-verified audit of* `main` *@* `158e8c3` *(2026-09-08). Every factual claim
below was checked against actual repository content in this session — source files, evidence registry, commit
history, and live CI/PR state — not copied from prior status reports. Where I could not fully verify something
(e.g., full per-Chamber completeness beyond MALEK/Lara Beauty, or exhaustive guardian test enumeration), it's
marked explicitly rather than assumed.*

---

## 0. Execution log (live — appended as work lands)

| Date | Item | Resolution |
|---|---|---|
| 2026-09-09 | Merges | PR #74 (frontage hero) → `3911139`; PR #75 (direction record + stale-claim fixes + F1) → `a3e57e4`; PR #76 (Part B completion) → `320ea5d`; PR #77 (Chamber audit CHAMBER-R1) → `de962ab`. All squash-merged, CI green at head. |
| 2026-09-09 | HOME-R1 (P0) | **DONE** — House Ledger frontage hero (`DigitalHouseFrontage.tsx` + rooms data/tests) replaces the orbit; six windows, lit iff evidence-registry-documented (property + wellness lit), doc-status signs only; sacred-core WebP is the porch-lamp centerpiece; guardian migrated with equal-or-stronger assertions + per-entry `home-desktop-dark` tolerance 0.008/0.12; four home baselines regenerated from CI Chromium actuals (run `34292887137`). |
| 2026-09-09 | WORLD-R2 / direction-doc parity (P1) | **DONE** — `lena-direction-refined.md` committed at root (decisions D1–D7, owner-gated table). |
| 2026-09-09 | FR-16 / `materials` (P1) | **LOGGED, NOT DECIDED** — open row F1 in `OPEN_DECISIONS.md` §F with recommendation (keep hidden until real evidence exists). Owner decision pending. |
| 2026-09-09 | PRD §22 obsolete docs (FR-1 bio note; B1 "screenshots later") | **DONE** — corrected in `PRODUCT_DEFINITION.md` (FR-1 status) and `OPEN_DECISIONS.md` (B1 register: 2 of 6 documented). |
| 2026-09-09 | Part B remediation (OPEN_DECISIONS B-1…B-9; REMEDIATION M4–M6) | **DONE** — advisory bumps (vite 7.3.6, react-router 7.18.3, nodemailer 9.1.1), node 24 alignment, minimal PWA offline shell (B-7), dashboard status filter (B-8), done-verification of B-1/2/4/5/9; docs marked with evidence. |
| 2026-09-09 | CHAMBER-R1 (P1) | **DONE** — audit record `docs/CHAMBER_AUDIT_2026-09-09.md`; four undocumented chambers pass (honest pending records); two shared-surface defects fixed (evidence note made system-agnostic — was MALEK-only vocabulary shown on the wellness chamber; product-boundary copy now derives `system.name[locale]`); contracts hardened in `verify-world-chambers.mjs`; `chamber-mobile-dark` baseline regenerated from CI run `34297684208` actuals (final CI run `34298015128` green). |
| 2026-09-09 | WORLD-R1 (P2) | **RESOLVED — active** — `ConstellationGraph` is rendered by `WorldAtlas.tsx`; kept; recorded in the chamber audit doc. |
| 2026-09-09 | HOME-R3 cosmic CSS | **STILL PREMATURE** — `.lena-card-glow` / `.lena-visual-orb` / glass sheets remain live on Home SystemGrid cards, Services and projects surfaces; recorded as the remaining old-register visual surfaces. |
| 2026-09-09 | PROD-R1 / EVID-R1 (P0) evidence capture (LENA Dress, Terranex, Hospitality, Kayyal) | **BLOCKED — founder access required.** No fabrication. Capture tooling guidance committed so founder sessions are turnkey. |
| 2026-09-09 | FR-4 "Five application case studies" staleness | **DONE** — corrected to the canonical six public systems with hospitality permission caveat (this PRD commit). |
| 2026-09-09 | WCAG AA (P2 / B-11) | **DONE (automated layer)** — axe-core WCAG 2.x A/AA suite in the guardian smoke project (PR #78 → `0835808`; CI run `34300315321`): 16 route/locale/theme combos, zero violations of any impact after ledger contrast fixes (`--led-brass-dim` dark 4.12→4.96:1, light 2.58→4.99:1; light CTA bg 3.67→5.38:1). No visual baseline change needed. Assistive-technology (screen-reader) pass remains human-side. |
| 2026-09-09 | V-R1 ledger remnant sweep (§17 follow-up) | **DONE** — PR #80 → `a697b6e` (main CI run `34308483403`; PR guardian run `34308022877`, both green incl. guardian-browser visual): flattened the remaining cosmos accents on ledger surfaces — `.lena-cta` gradient → ledger sheet; nav/mobile-link hover-active blue → brass wash in both themes (axe re-verified, guardian smoke 45/45); service-icon and tags blue tints → transparent + `--lena-line`; form fields → ink/paper tints; `.light` AA overrides added for `.lena-success`/`.lena-error`; footer cold tints → warm ink/paper; logo/header-scrolled shadows neutralized; admin-header blur removed; `responsive.css` cosmos fragments (≤720 glass blur, `.lena-smoke-b`) and mobile-menu `blur(20px)` removed; onboarding portrait/chip neutralized. **Explicitly-scoped surfaces retained** (never ledger debt): studio/project concept presentation art (`ProjectVisual`, case pages, `art-float`), World graph/atlas/command visualization, LENA Assistant widget, admin console, WhatsApp brand FAB. No visual baseline change (CI visual green). |
| 2026-09-09 | V-R2 documentation parity | **DONE** — PR #81 → `1288f23`: six-application count fixed in `PRODUCT_DEFINITION.md` (×3); §Could identifier-note added (C1–C5 there ≠ `OPEN_DECISIONS.md` Part C); A5 answer carries a code-truth supersession note (hospitality stays `trial` until real evidence); owner-needed rows narrowed to C1/B4/F1 (C2/C3/C4 answered); scoped-surface list mirrored in §17. |
| 2026-09-09 | Ambient no-op removal | **DONE** — PR #82 → `f4640f1`: retired `AmbientBackdrop`/`ambient.css` stub deleted (component, file, `lena.css` import, shell/Login usages, dead responsive guards). Verified: typecheck, build, smoke 45/45, no visual change. |
| 2026-09-09 | Batch execution log (#81–#85) | **DONE** — merged: #81 `1288f23`, #82 `f4640f1`, #83 `ae9645a`, #84 `9c5e8ec`, #85 `6a67f78`; main validate runs `34309826466` + `34310112023` green. Full stack at head: typecheck OK, units 286+23, verify-all 328 assertions 0 failing (1 env skip: admin authorization needs live API), guardian static PASSED, smoke 63/63, guardian-browser (incl. visual) green on each PR. |
| 2026-09-09 | Guardian chamber coverage (P2) | **DONE** — PR #83 → `ae9645a` and PR #84 → `9c5e8ec`: every public chamber (property, wellness, rental, investment, hospitality, recycling) is now in `routes.config.json` and the axe matrix in **both locales** (25 combos); wellness AR audited — no translation gap. Smoke suite 45 → 63, static integrity PASSED. |
| 2026-09-09 | HOME-R3 / §17 old-register visual surfaces (P2) | **DONE** — House Ledger register applied to every remaining public surface (PR #79 → `0a71eea`; final CI run `34302369502` green): tokens rewritten to the ledger palette both themes (`--lena-gradient-*` deleted, referenced nowhere); page/glass/primary/secondary flat ledger paper/brass; ambient orb/smoke/grid animation system retired (`ambient.css` = `display:none` guard; component stays mounted); orb/glow nodes removed from SystemGrid, Services, RelatedServices, ProjectVisual, CmsProjectDetails — grep clean across `src/**/*.tsx`. Axe regression fixes during the pass (no disable rules, contrast-only): footer channel `<small>` opacity `.65` removed, `.lena-memory-reset` dimming removed (dark `.62` / light alpha → full-strength muted), light accent small-text `#a37924` → `#845f13` (4.9–5.5:1 on paper), `.lena-front-num` opacity `.75` removed (light 3.43:1 → full-strength). Guardian suite 72/72 at PR head; `home-desktop-dark` baseline regenerated from CI Chromium actuals (run `34302010568`, artifact `10085325719`). Supersedes the HOME-R3 premature row above. |
| 2026-09-09 | V-R1 follow-up (audit ground truth @ d93660d) | **DONE** — PR #87 → `64e75bc` (main validate run `34311694330` green, incl. guardian-browser visual in CI Chromium — no baseline change): the last cosmos fills on public ledger surfaces neutralized in `onboarding.css` (`.lena-form-context`, `.lena-form-draft`, `.lena-help-search input` navy field → register ink/paper form family incl. `.light`, `.lena-support-reference`, `.lena-provenance`, `.lena-provenance-banner`, `.lena-stage-trial` → transparent/neutral, borders carry the chips; consumers Help/Contact/ErrorBoundary/ProjectCard/ProjectDetails) and the duplicate `responsive.css` `max-width:720px` blocks consolidated into one cascade-identical block (provably-dead `backdrop-filter` kills — none remains in any stylesheet — and base-rule bg re-asserts dropped; live rules preserved: mobile-menu solid fill, mobile art-float stop, `prefers-reduced-motion` untouched). Every audit-listed public.css item (CTA/nav/service-icon/tags/form/logo/footer) was verified already-flat from #80. **Selector-level scoped-surface register now recorded in §17.** Gate: typecheck OK; lena 286 + api 23 units OK; build OK; verify-all 24 suites/328 assertions 0 failing (1 env skip: admin authorization); guardian static PASSED; local smoke/axe 90 passed (8 visual diffs are the known local-env deviation — CI Chromium authoritative per §16). |
| 2026-09-09 | B-10/D6/R7 operator-record scaffold (checklist T2-1) | **DONE** — PR #88 → `0135c0c` (main validate run `34318985015` green): evidence-gated `features/world/content/operator.ts` (record only for systems with real registered evidence) + `LedgerOperatorNote` chamber section after the daily workflow cycle for MALEK + Lara Beauty; summaries verbatim from the B2 register fields, D6 aspects without founder documentation (offline/corrections/training) declared and rendered as an explicit honest gap; 6 content-truth tests; both locales, RTL-safe, axe-clean. Chamber baselines `chamber-desktop-dark`/`chamber-mobile-dark` regenerated from CI Chromium actuals (run `34318280863`, artifact `10090952343`, page-height deltas 3483→3690 / 4602→4922 consistent with one added section) — PRD §16 flow, no local renders. Remaining four systems gain records in the same tranche their evidence registers. Fixed reference committed: `docs/EXECUTION_CHECKLIST.md`. |
| 2026-09-09 | Re-audit follow-up (post-#88) | **DONE** — PR #89 → `324ca92` (main validate run `34320236671` green): guardian smoke gained the B-10 operator-record contract (`tests/b10-operator.spec.ts`, 12 tests — section visible with answer + open-aspects line on the two evidence-bearing chambers in both locales, absent on all four pending chambers; evidence gate can never leak) and PRODUCT_DEFINITION.md's remaining active five-product rows (A3, R1, R4, R6) reconciled to the canonical six. |
| 2026-09-09 | Advisory remediation (re-audit) | **DONE** — PR #90 → `d74858a` (main validate run `34327246072` green): `pnpm audit --prod` was 1 low + 3 moderate (qs DoS/array-limit ×3, body-parser invalid-limit), all transitive through express 5.2.1; workspace overrides force the patched floors (qs ^6.16.0, body-parser ^2.3.0 — admitted by express's own ranges); audit now **0 known vulnerabilities**. Within-range lockfile fallout only; no code/content/visual change. |
| 2026-09-09 | Re-audit follow-up (post-#88) | **DONE** — PR #89 → `324ca92` (main validate run `34320236671` green): guardian smoke gained the B-10 operator-record contract (`tests/b10-operator.spec.ts`, 12 tests — visible with answer + open-aspects line on the two evidence-bearing chambers in both locales, absent on all four pending chambers; evidence gate can never leak) and PRODUCT_DEFINITION.md's remaining active five-product rows (A3, R1, R4, R6) reconciled to the canonical six. |
| 2026-10-01 | World Command authorized source (world signals) | **DONE (implemented, not connected)** — `/world/command` can now read a real product endpoint through one contract (`lena.world-signals/1`): server adapter `artifacts/api-server/src/lib/world-signals/` (configuration-only host, 4 s timeout, 60 s TTL + single-flight, coarse failure reasons), public read-only `worldSignals.snapshot` + admin `worldSignals.probe`, client re-validation + coverage-aware presence (an unobserved world is `unavailable`, never `quiet`), reason-specific closed-room copy, and `tools/verify-world-signal-source.mjs` (10 checks) in `pnpm run verify`. Read-only: no write path into any product, `writable` always false, nothing persisted. Production default is unchanged (`no-authorized-product-source`) until `LENA_WORLD_SIGNAL_SOURCE_URL` is configured; `docs/WORLD_SIGNAL_SOURCE.md` is the contract + ops guide, `tools/world-signal-fixture.mjs` the local harness. Unit tests: api 41 (14 new), lena 366 (14 new); verify-all 25 suites / 338 assertions, 0 failing (1 env skip: admin authorization). |
| — | Owner-needed now: C1 (second admin identity value), B4 (written permission to name the hospitality client), F1 (`materials` visibility decision) | **OWNER-REQUIRED** — rows stand in `OPEN_DECISIONS.md`. A5 was answered 2026-08-20 (property + hospitality in real use) with a 2026-09-09 code-truth supersession note (canonical stage stays evidence-driven: hospitality `trial` until real evidence registers). B1 evidence capture ×4 is founder-dependent. C2 answered (defer), C3 answered (defer — reopening is the owner's call), C4 answered (no). |

---

## 1. Executive Summary

LENA Digital House is a bilingual (Arabic-first/English) marketing and lead-generation platform for a single founder, Mohamed Masoud, whose product is six (really seven — see §2) real small-business operating systems: MALEK (property), Lara Beauty (wellness/spa), LENA Dress (rental), Terranex (investment/agriculture), a hospitality system, and Kayyal (recycling/scrap weighbridge), plus a hidden seventh ("materials"). The site's job is to convert skeptical business owners into inquiries by showing — not claiming — that these systems run real daily work.

The project has been through two visual eras, confirmed directly from source: an early **cosmic/orbital "World"** register (orbiting planets, "chambers," glass cards) and an emerging **"House Ledger"** direction (architectural/ledger register, real evidence plates, restrained typography). At the time of the snapshot audit it was **partially applied** — fully on the World/Chamber surfaces, partially on Home — with the hero visual still rendering the orbital animation. **HOME-R1 resolved the hero in PR #74** (flat editorial house frontage; see §0).

The single highest-leverage gap at snapshot time, confirmed by direct inspection of the evidence registry: **real product evidence exists for exactly 2 of 6 public systems** — MALEK (7 real captured surfaces) and Lara Beauty (10 real captured surfaces). LENA Dress, Hospitality, Terranex, and Kayyal have **zero** evidence entries. That remains the largest open gap; it is founder-access-blocked, not engineering-blocked.

## 2. Current Verified State

**Snapshot facts, directly verified at audit time (2026-09-08):**

| Fact | Evidence |
|---|---|
| Main HEAD (at audit) | `158e8c3a2d9947a17356fc9c9b25b8d9dc56c0da` — since advanced: see §0 |
| PR #71 (mobile `content-visibility` fix) | Merged; content on `main` matched PR head exactly |
| PR #72 (House Ledger completion) | API `closed, merged: false`, but content byte-identical on `main` via a directly-authored commit — functionally merged, procedurally irregular |
| PR #73 (Home house-direction) | Merged; replay-style commit SHAs, content identical |
| Seven canonical systems, not six | `content/systems.ts`: `property, wellness, rental, investment, hospitality, recycling, materials`. Six (materials excluded) are `visibility: "public"`; `materials` exists, fully specified, `order: 7`, `visibility: "hidden"` — owner-controlled reveal decision logged as open row F1 (`OPEN_DECISIONS.md` §F) |
| Evidence coverage | `evidence.ts`: `property` = 7 surfaces, `wellness` = 10 surfaces; no other `SYSTEM_EVIDENCE` keys. "4 remaining captures" = **4 entire undocumented products** (LENA Dress, Hospitality, Terranex, Kayyal) |
| Founder bio | Filled, both languages, `content/founder.ts` — rendered via `FounderCard` under `hasFounderBio`; PRD FR-1 note corrected 2026-09-09 |
| Hero visual (at audit) | `DigitalHouseOrbit.tsx` — 4 orbital rings, satellites, glow-breath, continuous loop — **replaced 2026-09-09 by the frontage hero (PR #74)**; orbit files deleted |
| `lena-direction-refined.md` (at audit) | Did not exist — **committed 2026-09-09 at root (PR #75)** |
| `verify-constellation-graph.mjs` / `ConstellationGraph.tsx` | Still present; **resolved active** (rendered by `WorldAtlas.tsx`) — see WORLD-R1 |

**Not independently re-verified in full at audit** (time-bounded): exhaustive Chamber-by-chamber content beyond MALEK/Lara Beauty — **since closed by CHAMBER-R1 (PR #77)**; full guardian enumeration — since re-run across four merged tranches, all green.

## 3. Product Vision

A single founder who ran real small-business operations before automating them, offering vertical operating software, proven by systems he already built and runs. The brand device (Digital House → World → Chambers, now in the House Ledger register) exists to make six-to-seven unrelated small businesses read as one coherent body of work rather than a scattered portfolio — without ever claiming more than the underlying products can prove.

## 4. Product Principles (established across `PRODUCT_DEFINITION.md`, `PRODUCT_DECISIONS.md`, `lena-direction-refined.md`, and the House Ledger commits — confirmed consistent)

1. Evidence over hype — no claim without a verifiable underlying fact.
2. Honest provenance — every product states what it is (owned/built, client work) and its real documentation state, never a fabricated metric; lifecycle stage (`in-use`/`trial`) is internal-only and never public.
3. Geography as fact, not boundary; Arabic and English as equal, not primary/secondary, markets.
4. Cost discipline — no new recurring spend, no rewrites without measured justification.
5. One primary action per page.
6. Nothing is deleted — features are hidden, not destroyed, until a real decision is made.

## 5. Current Architecture (verified directly)

React + Vite frontend (`artifacts/lena`), Express + tRPC API (`artifacts/api-server`), Drizzle/Postgres, Vercel deployment (`api/[...path].ts` entry), Supabase storage for uploads. World feature is substantial and modular: `atlas/` (spatial index), `command/` (World Command surface), `signals/` (derived runtime signals), `ledger/` (House Ledger register — entry cards, seals, formatting), `content/` (canonical `evidence.ts`, `world.ts`, `product-contract.ts`, `operating-primitives.ts`, `product-connections.ts`, each with a co-located `.test.ts`). Genuinely well-factored for its size — the architecture is not the problem anywhere; content and visual coherence are.

## 6. Home Requirements

**Current state (verified):** frontage hero in the ledger register (PR #74); house-register copy; evidence windows for MALEK + Lara Beauty only (code-enforced via `windowFor`); founder strip live; process/CTA/footer functioning.

- **HOME-R1 (P0):** hero/copy register reconciliation — **DONE (PR #74)**.
- **HOME-R2:** extend evidence windows to the remaining 4 products as their evidence is captured (§10) — do not add windows before real evidence exists. **Open; automatic once evidence lands** (`windowFor` is generic).
- **HOME-R3:** audit and retire unused cosmic CSS (`--lena-gradient-hero`, `.lena-card-glow`, `.lena-visual-orb`) once nothing references them — **still premature** (live on SystemGrid cards, Services, projects visuals); revisit in a dedicated visual-register tranche.

## 7. World Requirements

**Verified as real, tested code:** Ledger index/cards/seals, Atlas (jump/layout/presence), World Command, Signals, `registry.ts`; `verify-world-*.mjs` contract scripts active.

- **WORLD-R1 (P2):** `ConstellationGraph` / `verify-constellation-graph.mjs` status — **RESOLVED: active** (rendered by `pages/WorldAtlas.tsx`); kept. Recorded in `docs/CHAMBER_AUDIT_2026-09-09.md`.
- **WORLD-R2 (P1):** commit a real `lena-direction-refined.md` — **DONE (PR #75)**.

## 8. Six (Seven) Product Requirements

Per-product state, from `systems.ts` + `evidence.ts` directly (stage is internal-only by rule; the public bar is documentation state):

| System | ID | Stage (internal) | Evidence surfaces | Visibility |
|---|---|---|---|---|
| MALEK | `property` | in-use | **7** | public |
| Lara Beauty | `wellness` | trial | **10** | public |
| LENA Dress | `rental` | trial | **0** | public |
| Terranex | `investment` | trial | **0** | public |
| Hospitality | `hospitality` | trial | **0** | public |
| Kayyal | `recycling` | trial | **0** | public |
| (7th) | `materials` | trial | **0** | **hidden** (F1 open) |

- **PROD-R1 (P0):** capture and register real evidence for LENA Dress, Terranex, Hospitality, Kayyal — blocked on founder access, not engineering.
- **PROD-R2 (P1):** owner decision on `materials` — logged as **F1** (`OPEN_DECISIONS.md`), recommendation recorded (keep hidden until real evidence exists), awaiting the owner's word.

## 9. Chamber Requirements

MALEK's chamber carries seven real evidence plates (registry-consistent). **CHAMBER-R1 closed the per-chamber
verification gap: DONE (PR #77)** — full per-chamber audit committed in `docs/CHAMBER_AUDIT_2026-09-09.md`;
LENA Dress / Hospitality / Terranex / Kayyal chambers verified structurally complete and honest (pending seal,
no fabricated gallery); two shared-surface copy defects fixed; `materials` has no chamber and correctly cannot
resolve one.

## 10. Evidence Requirements

- **EVID-R1 (P0):** real capture sessions for the four undocumented public systems, entries in `evidence.ts`
  per the existing schema (id, src, bilingual alt, bilingual capability, optional primitive link) — same rigor
  as MALEK/Lara Beauty. **Founder-access-blocked.** A capture guide is committed (see docs) so a founder session
  is turnkey.
- **EVID-R2 (P0, standing rule, in force):** never add an entry to `evidence.ts` without a real underlying
  asset; never show a card-level evidence window for a system with no registry entry (`windowFor` returns `null`
  on empty — code-enforced, keep it that way).
- **EVID-R3 (P1):** if `materials` is ever revealed, its evidence must clear the same bar first.

## 11. Visual System Requirements

Single visual register going forward: **House Ledger** — restrained, editorial, evidence-plate-based,
RTL-native, bilingual-by-construction. Explicitly not: cosmic gradients, glassmorphism glow, orbiting
decoration, gratuitous 3D. Applied: World/Chamber, Home copy + cards, Home frontage hero. **Remaining
old-register surfaces:** Services/related-services glass cards, project visuals, SystemGrid card glow — the
candidate scope of a future visual-register tranche (HOME-R3 note; owner-visible, therefore a tranche of its
own, not bundled with functional work).

## 12. Functional Requirements

`PRODUCT_DEFINITION.md` FR-1…FR-14 remain authoritative for the base product (per-language routing, provenance
labels, inquiry attribution, etc. — implemented and guarded). New requirements from the audit:

| ID | Description | Rationale | Surface | Acceptance | Verification |
|---|---|---|---|---|---|
| FR-15 | Evidence windows appear on a card iff `evidenceFor(systemId)` returns ≥1 surface | Enforce principle in code | Home, World grid | No card shows a window without a registry entry (already true) | Unit test on `windowFor` + visual regression |
| FR-16 | `materials` has an explicit, documented visibility decision | Was silent/undecided | `systems.ts`, `OPEN_DECISIONS.md` | Owner's choice recorded | **Logged as F1 (open)** |
| FR-17 | Hero visual register matches hero copy register | Resolve HOME-R1 | Home | Visitor cannot describe hero as "in tension" | **DONE (PR #74)** |

## 13. Technical Requirements

No rewrite is justified anywhere — the codebase is modular, tested, CI-disciplined. Preserve: existing routing,
canonical data ownership (`content/`, `features/world/content/`), CSS custom-property theming, the Playwright
guardian infrastructure. Do not introduce a new state layer, CSS methodology, or framework change.

## 14. Accessibility / RTL / Responsive Requirements

RTL correctness, mobile non-voiding (post-#71), light/dark coherence — confirmed via guardian baselines and
fixed continuously. WCAG 2.2 AA remains the stated working bar (`PRODUCT_DEFINITION.md` NFR). A dedicated pass
with assistive technology was blocked (`OPEN_DECISIONS.md` B-11: no installable browser/AT in the sandbox) —
**automated axe-based layer now runs in the guardian (CI Chromium)**, closing the programmatic part; the
assistive-technology (screen-reader) pass remains the human/owner-side remainder. See §0.

## 15. Verification Requirements

Active in CI: typecheck, vitest, `verify-all` (24 suites), guardian browser+visual (desktop/mobile/light/dark/
AR-RTL), smoke, safety. **Blocking failure** = any guardian visual mismatch not traceable to an intentional,
documented change (§16), any verify-*.mjs failure, any typecheck/build failure. All green on `main` at
`de962ab`.

## 16. Visual Baseline Policy

Standing rule (followed since PR #73 and re-confirmed): a baseline may only change when (a) the source diff
shows an intentional visual change, (b) the new baseline is a real CI Chromium capture, never a sandbox
capture, (c) the commit message records the source CI run (and artifact), and (d) someone opens the actual new
images and confirms no voids/clipping/missing content before accepting. Recent regens: home ×4 (run
`34292887137`), chamber-mobile-dark (run `34297684208`).

## 17. Cleanup Requirements

- `ConstellationGraph` / `verify-constellation-graph.mjs` — **RESOLVED active** (WORLD-R1).
- Cosmic CSS audit — **RESOLVED (PR #79 + #80)** — `.lena-card-glow`, `.lena-visual-orb`, the ambient
  orb/smoke/grid system and the gradient/glass tokens are gone (#79); remaining cosmos accents on ledger
  surfaces (CTA gradient, nav-active/mobile-link blue, icon/chip blue tints, cosmos-tinted form fields,
  cold footer/logo shadows, light-theme status contrast, responsive.css cosmos fragments) flattened or
  tokenized (#80). **Intentionally-scoped non-ledger surfaces (kept and recorded, with code truth as of `64e75bc`):**
  studio/project concept presentation art — `ProjectVisual`/`CmsProjectDetails`/`ProjectCard`/`ProjectGallery`/
  `ProjectDetails`, case pages, `.lena-project-visual` + `.lena-visual-window`/`.lena-visual-stack`/
  `.lena-visual-nodes` + case variants (`.visual-brand`/`.visual-campaign`/`.visual-dashboard`) and
  `@keyframes lena-art-float` (live markup in `features/projects/*`, `pages/ProjectDetails.tsx`); World
  graph/atlas/command visualization identity incl. `.lena-roots-chip` and per-scope `--dna-accent` tokens
  in `ledger.css`; LENA Assistant widget identity (`assistant.css`); admin console platform styling
  (`.dashboard-support-*`, `.inquiry-ops-*`, `.audit-*`, `--platform-accent #5b7cff` fallback); WhatsApp
  brand FAB. These are the ONLY remaining blue/blue-family fills in the stylesheets.
- Follow-up completion (**PR #87**): `public.css`/`onboarding.css` ledger chrome is fully flat at `64e75bc`
  (last neutralization: public onboarding/help/provenance/stage fills); `responsive.css` has a single
  `max-width:720px` block; no `.lena-orb`/`.lena-smoke`/ambient/backdrop-filter rules exist anywhere.
- No other dead code surfaced; sweep out of scope until the register tranche.

## 18. Remaining Work Inventory (as of 2026-09-09)

| Item | Classification |
|---|---|
| Evidence capture: LENA Dress, Hospitality, Terranex, Kayyal | **P0 — founder-access-blocked** |
| `materials` visibility decision (F1) | **P1 — owner** |
| Second admin identity (C1), CI `workflows` permission (C3), AI translation approval (C4), B4 permission, A5 answers | **owner-gated** |
| Remaining old-register visual surfaces (Services/projects/SystemGrid glow) | **COMPLETE (#79)** |
| Full WCAG AA — assistive-technology pass | **P2 — AT pass remains owner/human-side**; automated layer DONE |
| Hero visual/copy reconciliation (HOME-R1) | **COMPLETE (#74)** |
| Direction doc parity (WORLD-R2) | **COMPLETE (#75)** |
| Stale-doc corrections (FR-1, B1) | **COMPLETE (#75)** |
| Part B remediation (B-1…B-9, M4–M6) | **COMPLETE (#76)** |
| Chamber audit (CHAMBER-R1) | **COMPLETE (#77)** |
| FR-4 five→six | **COMPLETE (this commit)** |
| Evidence windows for MALEK/Lara Beauty | **COMPLETE** |
| Founder strip / bio / frontage | **COMPLETE** |

## 19. Current Execution Scope

Active continuously, without per-task approval stops (founder directive 2026-09-09):
1. Evidence capture sessions for the four undocumented products — **when the founder grants access**, starting
   with whichever is soonest; tranche = one product's evidence + any baseline updates, nothing else bundled.
2. Everything engineering-side that remains sequenceable: automated accessibility layer (§14) — **DONE (#78)**;
   old-register visual surfaces (§17) — **DONE (#79)**, remnant sweep (#80); remaining: re-verify the full
   checklist as items resolve.
3. Keep §0 and §24 of this document current as each item resolves.

## 20. Next Tranche (as of 2026-09-09, superseded 2026-09-09)

**"Automated accessibility layer"** — **DONE (PR #78).** **"Visual-register completion"** (§17) — **DONE
(PR #79 + #80 remnant sweep).** Open sequence now: founder evidence sessions for the four undocumented
products as access arrives; WCAG assistive-technology (screen-reader) pass (owner/human-side); final
full-checklist re-verification.

## 21. Later / Deferred Work

Remaining products' evidence (founder access); WCAG assistive-technology pass (human/AT-side); `materials`
reveal (owner decision F1); hero-art second-pass polish beyond the register fix.

## 22. Obsolete Work to Remove

`PRODUCT_DEFINITION.md` B1 "screenshots later" framing and FR-1 "biography remains empty" — **corrected
(#75)**. FR-4 "Five application case studies" count — **corrected to the canonical six (this commit)**. Any
remaining doc/code contradiction is fixed in the tranche that discovers it (DoD line below).

## 23. Definition of Done

The platform is complete when: all six public systems (plus a resolved decision on `materials`) have real
evidence at MALEK/Lara Beauty parity; the hero visual and copy share one register; every guardian/verify
contract is green on `main`; no committed documentation contradicts the current codebase; all Chambers audited
to MALEK's standard; and the accessibility layer guards the WCAG working bar.

## 24. Final Completion Checklist (live)

- [x] Hero visual and hero copy share one register — PR #74 (2026-09-09)
- [x] `lena-direction-refined.md` committed as real documentation — PR #75 (2026-09-09)
- [x] `PRODUCT_DEFINITION.md` / `OPEN_DECISIONS.md` staleness corrected — PR #75 (2026-09-09)
- [x] All Chambers audited to MALEK's standard — PR #77 (2026-09-09); record in `docs/CHAMBER_AUDIT_2026-09-09.md`
- [x] `ConstellationGraph` status resolved (active) — recorded 2026-09-09
- [x] All guardian/verify contracts green on `main` — verified at `0a71eea` (main validate run `34302631539`; PR-head guardian run `34302369502`)
- [ ] 6/6 public systems have real evidence registered — **BLOCKED: founder access** (2/6 today)
- [ ] `materials` has an explicit, documented visibility decision — **F1 open, owner**
- [x] Automated WCAG 2.2 audit layer green in CI — PR #78 (2026-09-09), run `34300315321`; zero violations across the audited matrix
- [x] Remaining old-register visual surfaces moved to the ledger register — PR #79 (2026-09-09), run `34302369502`; `home-desktop-dark` regenerated from CI actuals (run `34302010568`, artifact `10085325719`)
- [x] Ledger remnant sweep — remaining cosmos accents on ledger surfaces flattened; scoped non-ledger surfaces recorded — PR #80 (2026-09-09), run `34308483403`
- [x] Ledger remnant sweep follow-up — last public fills neutralized (`onboarding.css` help/form/provenance/stage chips), duplicate `≤720px` responsive block consolidated, selector-level §17 register recorded — PR #87 (2026-09-09), run `34311694330`
- [ ] Assistive-technology (screen reader) pass — **owner/human-side, AT required**

---

## AUTHORITATIVE STATUS (updated 2026-09-09)

- **Working document:** this file — `PLATFORM_PRD.md` (root), maintained live per §0.
- **Current main commit:** `d74858a` (PRs #80–#90 merged 2026-09-09; main validate runs green — `34309826466`, `34310112023`, `34310491528`, `34311694330`, `34318985015`, `34320236671`, `34327246072`).
- **Milestone:** House Ledger register applied end-to-end — World/Chamber, Home copy + frontage hero, all
  old-register public surfaces (#79); cosmos accents on ledger surfaces flattened (#80) and fully
  completed (#87 — every public fill neutral, single responsive ≤720 block, selector-level §17 register);
  Chamber audit done; Part B done; automated a11y layer done.
- **Remaining REQUIRED work:** P0 evidence capture ×4 (founder-access-blocked); WCAG assistive-technology
  pass (owner/human-side); owner answers C1/B4/F1; final full-checklist re-verification.
- **Open owner items:** F1 `materials`; C1/C3/C4; B4 permission; A5 answers; evidence access sessions.
- **Definition of done:** §23 — tracked live in §24.

---

*End of PRD. Changelog: committed 2026-09-09 per founder directive — "commit the PRD and continue executing it
without per-task approval stops." Section 0 is the authoritative running log; sections 1–18 preserve the
2026-09-08 audit snapshot (normalized paste artifacts) with supersession notes where work has landed.*

---

<!-- دُمج من docs/PRODUCT_DEFINITION.md في توحيد 2026-10-21 -->

# LENA — Product Definition & PRD

**Version:** 1.0 · **Date:** 2026-08-20 · **Baseline:** `0ad0e63` on `arena/01a01ef6-platform`
**Status:** Approved direction, ready to implement. No technology choices are made here — the existing
stack is retained because the founder's binding constraint is minimum cost.

Founder decisions on record (2026-08-20):

| Decision | Answer |
|---|---|
| Brand identity | **Hybrid** — LENA is the brand, the founder is the visible face behind it |
| Market | **Arabic and English as two equal, real markets** (not Gulf-only) |
| Default language | **Detected from the visitor's device**, always switchable |
| 6-month goal | **New paying project clients** |
| Proof | **Six web applications across different industries** (five self-built, one for a named client), plus the existing industry/service pages retained |
| Binding constraint | **Cost** — no new paid services, no new recurring spend |

---

## 1. Value proposition

**One sentence:**
> LENA is where a business owner sees working applications that already solve real problems in their
> industry — built by someone who ran those operations before he automated them — and then talks to
> him directly, in Arabic or English.

Why this wording holds: it names the proof (working applications, not mockups), the relevance
(their industry), the differentiator (direct access to the builder, not an account manager), and the
market (two languages as equals). It promises nothing the product cannot deliver today.

**Rejected alternatives and why:** "creative digital house" (says nothing a buyer can verify);
"we turn ideas into experiences" (current copy — unfalsifiable); "Oman's leading studio" (contradicts
the new market and cannot be substantiated).

---

## 2. Target users and jobs-to-be-done

### Primary — the decision-maker (owner / founder / marketing lead of a small or mid-size business)

| Job | Trigger | Success for them |
|---|---|---|
| "Find someone who has already built something like what I need" | An operational pain: manual bookings, no online presence, scattered orders | Sees a working application in a familiar industry within 60 seconds |
| "Judge whether this person is competent before I expose my business" | Burned before by a vendor who over-promised | Can inspect depth — screens, flow, decisions — not just a logo |
| "Understand what this will involve before I ask" | Fear of a sales trap | Knows the process and can start a conversation with no form-filling ceremony |
| "Talk to a real person in my language" | Non-English speaker, or English speaker abroad | Gets a reply in the language they wrote in, within one business day |

### Secondary — the technical evaluator (CTO, IT lead, or a trusted friend asked to "check this guy out")

| Job | Success |
|---|---|
| "Check if this is real work or a template" | Can open a specific application page by direct link and see actual depth |
| "Send it to my boss with a comment" | Link preview shows the right title and description in the right language |

### Operator — the founder (single admin)

| Job | Success |
|---|---|
| "Publish a new application without touching code" | Existing dashboard editor, draft → publish |
| "Know which application brings clients" | Entry-context attribution already recorded per inquiry |
| "Reply fast enough to win the work" | New inquiries visible with a count badge on arrival |

### Explicitly **not** users

Clients tracking delivery (no portal), job recruiters (goal is clients, not employment),
other developers, students seeking tutorials, and anyone requiring a signed enterprise procurement
process.

---

## 3. Pain points and expected outcomes

| # | Pain (evidenced in the current product) | Expected outcome |
|---|---|---|
| P1 | The site says "we" everywhere while the work is one person's. A visitor cannot tell who they are hiring. | The visitor knows the founder's name, face and background before they contact. |
| P2 | Region is hard-coded: "سلطنة عمان" in config, a `+968` number as the primary and only channel, `ar-OM` date formatting. A visitor from Cairo, Amman or Berlin reads it as "not for me". | Location becomes a fact about the founder, never a limit on who is served. |
| P3 | English exists but has **no URL of its own** — locale lives in `localStorage`. The English site cannot be indexed by Google, cannot be shared as a link, and cannot be bookmarked. Half the declared market is invisible. | Each language is a real, shareable, indexable address. |
| P4 | Portfolio is 8 conceptual entries with no client name, no result, no measurable claim; testimonials and statistics arrays are literally empty in code. | 5 applications, each stating the industry, the problem, what it does, and what changed. |
| P5 | Nothing distinguishes "work done for a client" from "product I built myself". Left ambiguous, it becomes a credibility bomb if a prospect asks. | Every item is honestly labelled; ambiguity is designed out. |
| P6 | Services are described as abstract "tracks" (identity, content, automation) rather than outcomes a business owner recognises. | Industry pages connect a familiar problem to a demonstrated solution. |

---

## 4. Assumptions requiring validation

| # | Assumption | Confidence | Cheapest validation |
|---|---|---|---|
| A1 | Business owners find self-built applications persuasive enough to make contact, without client references | **Reduced from Low to Medium** — one of the six was built for a named client, and the founder's operator background is verifiable domain proof rather than a capability claim | Ship 5 app pages; measure app-page → inquiry rate over 30 days. Under 1%, the proof model is wrong, not the design |
| A2 | The English market responds at a rate worth the cost of maintaining two languages | Medium | Compare inquiries by locale after 60 days; if English is under 15% of the total, stop investing in English content |
| A3 | Six applications is enough breadth; a visitor finds one relevant to them | Medium | Track which app pages get opened; if one industry takes over 60% of the traffic, specialise instead of broadening |
| A4 | Visitors will contact a stranger through a form/WhatsApp with no pricing shown | Medium-high (normal for the category) | Already measurable via the existing entry-context attribution |
| A5 | The founder can answer within one business day in both languages, sustainably | Medium | The promise is already published; measure median time to first status change |
| A6 | Screens and a short recording persuade as well as a live demo | Medium | A/B is too expensive at this volume — instead, add a "request a live walkthrough" action and count requests |

---

## 5. MVP scope

**Guiding rule:** the smallest change set that makes a non-Gulf, non-Arabic-speaking business owner
believe this person can solve *their* problem — and nothing else.

### In scope

1. **Identity correction (hybrid).** Founder named, pictured and described; brand retained; copy voice corrected so it never claims a team that does not exist.
2. **De-regionalisation.** Remove Oman as a market boundary; keep it as the founder's location. All contact details, phone formats and date formats become configuration, not literals.
3. **Language as an address.** Every public page reachable at a per-language URL, both indexable, cross-linked, with device-based detection on first visit and a persistent manual switch.
4. **Six application case studies.** Each with: industry, the business problem, who it is for, what the application does, key screens, an honest provenance label, and one primary action. Inventory and status: `docs/PROJECT_INVENTORY.md`.
5. **Retained industry/service pages** (founder's explicit requirement), rewritten to lead with the business problem and to link to the relevant application.
6. **Trust layer.** Founder bio, an honest "how I work" sequence, and the already-published one-business-day reply commitment.
7. **Conversion path.** Existing inquiry form and WhatsApp, with entry-context attribution extended so the founder knows which application produced each inquiry.

### Out of scope (and the reason, so nobody re-proposes it)

| Excluded | Reason |
|---|---|
| Client portal / project tracking | No delivery workflow exists; invents an operations product for one person |
| Pricing pages, quotes, payments, invoicing | Founder has set no pricing policy; adds PCI scope and recurring cost against the binding constraint |
| Blog / content hub | Requires an editorial cadence nobody has committed to; three posts then silence is worse than none |
| Newsletter, drip campaigns | Needs consent management that does not exist |
| AI chatbot | High maintenance, hallucination risk against a trust-selling brand; WhatsApp already gives an instant human |
| Live chat widget / paid support desk | Recurring cost, third-party data transfer, for one inbox |
| Push notifications, install prompts, background sync | Nobody installs a portfolio site; these are the definition of fashionable-but-unnecessary |
| Third language | Not before A2 is validated for the second |
| Testimonial carousel | Empty in code today; a carousel of nothing is worse than no carousel |
| Recruiter/CV features | Founder chose clients, not employment |
| Separate deployments for the 5 applications | Each live app is a hosting cost and a maintenance surface — see §14 owner decision |

---

## 6. Roles and permissions

| Capability | Visitor (anonymous) | Founder (admin) |
|---|---|---|
| View published pages, applications, industry pages, help | ✅ | ✅ |
| Switch language and theme | ✅ | ✅ |
| Submit an inquiry / open WhatsApp | ✅ | ✅ |
| View inquiries and their entry context | ❌ | ✅ |
| Change inquiry status | ❌ | ✅ |
| Create, edit, publish, unpublish an application | ❌ | ✅ |
| Upload media | ❌ | ✅ |
| See draft (unpublished) content | ❌ | ✅ |

**No third role is introduced.** An authenticated non-admin account remains possible (the provider may
authenticate anyone) and must see exactly what a visitor sees, plus a clear "you do not have access"
message. Draft content must never be reachable by URL guessing.

---

## 7. Core user journeys

**J1 — English-speaking business owner, mobile, first visit (the journey the current product fails).**
Arrives from search → the site opens in English at an English URL, LTR → sees a headline naming what
the founder builds → opens the application closest to their industry → reads problem, solution,
screens → sends an inquiry in English, or messages WhatsApp → receives an on-screen confirmation with
a reference and the one-business-day promise.

**J2 — Arabic-speaking business owner, mobile.** Same path, opens in Arabic RTL, WhatsApp is the
prominent channel (it is the dominant business channel in the region).

**J3 — Evaluator receives a shared link.** Opens a direct application URL → the link preview and the
page are in the language of the link → can judge depth without navigating → shares onward.

**J4 — Founder publishes a sixth application.** Signs in → opens the editor → fills industry, problem,
solution, screens → saves as draft → previews → publishes → the application appears publicly and in
the sitemap.

**J5 — Founder triages inquiries.** Signs in → sees the new-inquiry count → opens an inquiry → sees
which application produced it → replies on the visitor's channel → sets the status.

---

## 8. Functional requirements

Each requirement is independently testable. "Verified" means a person or a check can confirm it
without reading code.

### FR-1 — Founder identity is present and consistent
> **Status (2026-09-09): complete — name, photograph and bilingual biography all live.** Mohamed Masoud /
> محمد مسعود appears on the About page, in `SITE_CONFIG.ownerName`, and as `founder` (with image) in
> the Organization structured data. The photograph was processed by
> `tools/prepare-founder-photo.sh` — metadata stripped, 1473KB reduced to 22KB. **FR-12 / M7 is also
> resolved:** the same run produced a 1200×630 raster social card, replacing the SVG that WhatsApp and
> LinkedIn could not render. **The biography is no longer pending:** the founder's own bilingual bio
> lives in `content/founder.ts` and renders on the About page through `FounderCard`. The original
> honesty rule is unchanged and still enforced in code — the bio block renders only because real text
> exists (`hasFounderBio` gate) — nothing about him is invented.
The About page presents the founder by name, photo, background and the reason the work is credible.
Copy elsewhere never implies a team that does not exist.
**Acceptance:** (a) About shows name, photo, and a bio of 60–150 words in both languages. (b) No public
page uses a plural-team claim that cannot be substantiated. (c) The founder's name appears in the
Organization structured data as `founder`.

### FR-2 — Geography is a fact, not a boundary
**Acceptance:** (a) No public page states or implies that service is limited to Oman or the Gulf.
(b) The founder's location appears only in the About page and structured data. (c) Contact details are
read from configuration with no hard-coded fallback number in shipped code. (d) Dates render in a
locale-appropriate, region-neutral format.

### FR-3 — Language has its own address
**Acceptance:** (a) Every public page is reachable at a distinct per-language URL. (b) Each page
declares the alternate language version and a canonical for itself. (c) First-time visitors are routed
by device language; a returning visitor's explicit choice always wins. (d) Switching language keeps the
visitor on the same page, never sends them home. (e) `html lang` and `dir` match the URL's language.
(f) Both language versions appear in the sitemap.

### FR-4 — Application case studies for the six products
**Acceptance:** For each of the six public products (five founder-initiated plus the client-built
hospitality system, whose naming stays permission-gated per B4): (a) industry label; (b) the business
problem in one paragraph; (c) who it is for; (d) what the application does, as 3–6 capabilities;
(e) real evidence surfaces in the canonical registry — the original "at least three screens" ask is
superseded by the registry standard (OPEN_DECISIONS B1: 2 of 6 documented today); (f) an honest provenance
label; (g) exactly one primary action; (h) complete in both languages; (i) a stable, shareable URL.

### FR-5 — Honest provenance labelling
Every portfolio item declares what it is: an application built and owned by the founder, work delivered
for a client, or a concept.
**Acceptance:** (a) The label is visible without expanding anything. (b) No item is unlabelled.
(c) No client name or logo appears without recorded permission. (d) No fabricated metric appears
anywhere.

### FR-6 — Industry pages lead with the problem
The retained industry/service pages open with a recognisable business problem and link to the
application that demonstrates the solution.
**Acceptance:** (a) The first paragraph describes a problem, not a service category. (b) Each page links
to at least one application, or explicitly states that a demonstration is in progress. (c) Each page
ends with the same single primary action.

### FR-7 — One primary action everywhere
**Acceptance:** (a) Exactly one primary action is visible on every public page at both mobile and
desktop widths. (b) It is reachable on mobile without scrolling. (c) WhatsApp remains available on
every page as a zero-field alternative.

### FR-8 — Inquiry carries its origin
**Acceptance:** (a) An inquiry started from an application records that application. (b) An inquiry
started from an industry page records that page. (c) The founder sees this in readable form.
(d) Origin values are validated against a fixed pattern and contain no personal data.

### FR-9 — Language-correct reply expectation
**Acceptance:** (a) The confirmation states the one-business-day commitment in the visitor's language.
(b) The identical promise appears on the contact and help pages in both languages. (c) The reference
number is shown and is quotable.

### FR-10 — Founder can publish without help
**Acceptance:** (a) All fields required by FR-4 are editable in the dashboard in both languages.
(b) Draft content is never publicly reachable, including by direct URL. (c) Publishing makes the item
public without a deployment. (d) A validation error names the field and the fix in plain language.

### FR-11 — Media has stated limits
**Acceptance:** (a) Accepted types and the size limit are stated before upload. (b) A rejected upload
explains which rule it broke. (c) When storage is unconfigured, the editor says so and offers the
external-URL alternative.

### FR-12 — Shareable link previews
**Acceptance:** (a) Each application and industry page produces a title and description specific to it
and to the language of the link. (b) A raster preview image of at least 1200×630 is used.

### FR-13 — Search engines see both markets
**Acceptance:** (a) Both language versions of every public page are indexable. (b) The sitemap lists
both. (c) No two indexable URLs share the same canonical unless intended. (d) Structured data declares
the correct language per page.

### FR-14 — Nothing regresses
**Acceptance:** The already-shipped behaviours remain true: per-page metadata, branded 404,
draft recovery on the inquiry form, differentiated error states, expired-session return path, guided
dashboard empty states, help page and safe support report, and the global crash boundary.

---

## 9. Non-functional requirements

**Security.** Admin-only data is refused server-side, never merely hidden. Draft content is
unreachable without an admin session. Sign-in redirect targets stay same-origin and admin-scoped. No
secret reaches the browser bundle. Session expiry returns the user to their destination. Uploads are
authorised server-side with type and size enforced there. Rate limiting on public writes remains.

**Performance.** Largest Contentful Paint under 2.5s on a mid-range Android over 4G for the home page
and any application page; interaction latency under 200ms; total JavaScript for a first visit under
250KB compressed. Images lazy-loaded below the fold with explicit dimensions. Screen recordings never
autoplay with sound and never block first paint. Budget rationale: the target visitor is on a phone,
possibly on a slow network, and will not wait.

**Accessibility (WCAG 2.2 AA as the working bar).** Full keyboard operation with a visible focus
indicator. Text contrast at least 4.5:1 in both themes. Touch targets at least 44×44px. Every image
has appropriate alternative text; decorative images are marked as such. Form errors are announced and
tied to their field. Language and direction are declared correctly. Motion respects the
reduced-motion preference. Screen recordings have a text description — a visitor who cannot watch the
video must still learn what the application does.

**Privacy.** No advertising or analytics trackers. No third-party script that receives visitor data.
Collect only what is typed plus the page of origin. The form draft stays on the visitor's device. Rate
limiting keeps a salted hash, never a raw address, expiring within 30 days. A privacy statement is
published before any additional collection. Deletion on request is honoured manually.

**PWA — deliberately minimal.** A web app manifest (name, icons, theme, start URL) and an offline
fallback page so a lost connection produces an explanation and the WhatsApp escape rather than the
browser's error screen. **Explicitly excluded:** install prompts, push notifications, background sync,
full offline caching of case studies, app-store packaging. Rationale: nobody installs a portfolio
site; these add maintenance and permission prompts with no benefit to the goal.

**Localisation.** Arabic and English are peers: same information, same depth, same actions — a
translation gap is a defect, not a nice-to-have. Direction, alignment, icon mirroring and number
formatting follow the active language. Latin product names inside Arabic text are isolated so they do
not corrupt the reading order. Nothing is hard-coded to one country's phone shape, currency or date
convention. Untranslated content is hidden rather than shown in the wrong language.

---

## 10. Edge cases and failure states

| Situation | Required behaviour |
|---|---|
| Device language is neither Arabic nor English | Default to English; the switch remains available |
| Visitor previously chose a language, then arrives from a link in the other | The link's language wins for that page; the preference is not silently overwritten |
| Application published in one language only | Not shown as published until both languages exist, or clearly marked as available in one language |
| Screen recording fails to load or the visitor cannot play video | Static screens and the text description carry the full meaning |
| Slow network | Text and screens render before media; nothing blocks on video |
| Media storage unconfigured | Editor explains it and offers the external-URL path; publishing still works |
| Inquiry submitted while offline | Text preserved on the device, explicit offline message, retry, WhatsApp alternative |
| Rate limit reached | Explains the limit and offers WhatsApp, which is unaffected |
| Application URL changed after sharing | Old link must not silently 404 into nothing — the branded 404 offers the portfolio and contact |
| Draft URL guessed by a stranger | Treated as not found; no title, no content, no existence signal |
| Sign-in provider unavailable | Human sentence with the cause and a path back to the site |
| Session expired mid-edit | Returns to the same page after signing in |
| A render error occurs | Crash boundary with a reference and a recovery path; no blank screen |
| JavaScript disabled or fails | At minimum the contact channels must be discoverable; treated as a known limitation of the current architecture and stated, not pretended away |
| Two applications claim the same industry | Allowed; ordering is explicit, not accidental |

---

## 11. Success metrics

**North star:** qualified inquiries per month, where "qualified" means the founder marks it as such.

| Metric | Why | 90-day target |
|---|---|---|
| Inquiries per 100 contact-page visitors | Primary conversion | ≥ 3 |
| Share of inquiries originating from an application page | Whether the proof model works (validates A1) | ≥ 40% |
| Share of inquiries from the English site | Whether the second market is real (validates A2) | ≥ 15% |
| Indexed pages per language | Whether both markets are reachable at all | ≥ 20 each |
| Median hours to first reply | The single largest conversion lever | < 8 working hours |
| Inquiries with a usable reply channel | Whether the funnel produces contactable leads | ≥ 90% |
| Form error-state rate | Whether guardrails block real people | < 3% |

**Counter-metric (guards against vanity):** if traffic rises while inquiries per 100 visitors falls,
the site is attracting the wrong audience — fix targeting, not volume.

---

## 12. Prioritised backlog

### Must — without these the stated goal cannot be reached

| # | Item | Serves |
|---|---|---|
| M1 | Per-language URLs with alternates, detection and a page-preserving switch | P3, FR-3 |
| M2 | Application case studies for all six products, complete in both languages | P4, FR-4 |
| M3 | Remove Oman as a market boundary; contact details fully configuration-driven | P2, FR-2 |
| M4 | Founder identity: About page, photo, bio, corrected voice site-wide | P1, FR-1 |
| M5 | Honest provenance labels on every portfolio item | P5, FR-5 |
| M6 | Application-level inquiry attribution surfaced to the founder | FR-8 |
| M7 | Raster social preview image per language | FR-12 |

### Should — materially improves conversion, not survival

| # | Item |
|---|---|
| S1 | Industry pages rewritten problem-first, each linking to a demonstrating application |
| S2 | "How I work" sequence with realistic durations |
| S3 | Minimal PWA: manifest plus offline fallback page |
| S4 | Screen recordings with text descriptions for each application |
| S5 | Privacy statement published |
| S6 | Archive-instead-of-delete for inquiries |

### Could — only after Must and Should are live and measured

> **Identifier note:** the C1–C5 rows below are product-idea rows specific to this document.
> `OPEN_DECISIONS.md` Part C (C1–C4) reuses the same labels for owner access/credentials items
> (second admin identity value, CI `workflows` permission, AI draft translation) — two separate
> registers with different meanings; never treat the identifiers as interchangeable.

| # | Item |
|---|---|
| C1 | Industry filter on the portfolio (justified only once there are more than ~8 items) |
| C2 | "Request a live walkthrough" action, to validate A6 cheaply |
| C3 | First real client testimonial, published with written permission |
| C4 | Second admin identity for lockout recovery |
| C5 | Structured data for individual services |

### Later — revisit only with evidence

Blog; third language; live demo deployments of all six applications; client portal; pricing page;
analytics platform; CRM; newsletter.

---

## 13. Risks and cheapest validation

| # | Risk | Impact | Cheapest way to test it |
|---|---|---|---|
| R1 | Self-built applications do not convince buyers without client references (A1) | Fatal to the goal | Publish the six, measure application → inquiry rate for 30 days. Below 1% means the *proof model* failed, not the design — pivot to acquiring one real client reference at cost price |
| R2 | Two languages double the content burden and both end up shallow | Both markets underperform | Complete English for the two strongest applications first; if the founder cannot sustain it, ship English for those two only and mark the rest clearly |
| R3 | Founder cannot sustain one-business-day replies in two languages | Published promise broken — worse than never promising | Track median reply time for 30 days; if it slips, change the published promise before a client discovers it |
| R4 | Six applications across six industries reads as unfocused | Weak positioning | Ask five people in the target segment which one they would open first; if answers scatter, lead with one industry and keep the rest as secondary |
| R5 | Demonstrations become stale or break | Credibility damage | Quarterly review; a broken or outdated application is unpublished, not left rotting |
| R6 | Hosting six live applications introduces recurring cost against the binding constraint | Budget violation | Start with screens and recordings inside the existing site — zero new cost. See §14 |
| R7 | Global positioning attracts unqualified enquiries from everywhere | Founder's time drains | Watch the qualified share; if it drops, add a light qualifying question rather than a barrier |
| R8 | Language detection sends a bilingual Gulf visitor to the wrong version | Bounce | The switch is always visible and one tap; measure switch usage — high usage means detection is wrong |

---

## 14. Compact PRD for an implementing agent

> Implement in this order. Do not add features not listed. Do not introduce a paid service. The
> existing stack is retained: the founder's binding constraint is cost.

**Context.** A bilingual portfolio and lead-generation site for one founder operating under the LENA
brand. Goal: paying project clients from Arabic and English markets. Proof: six self-built
applications across different industries (the original plan assumed five; the recycling system is the
sixth public product — PROJECT_INVENTORY). Existing surface: home, services (8 tracks), service detail,
portfolio, work detail, about, ai-solutions, contact, help, login, dashboard, project editor. Existing
data model already supports rich case studies (localised content blocks, gallery, related services,
status, sort order) — **no schema change is required for the six applications.**

**Deliver, in order:**

1. **Per-language routing.** Every public page gets a distinct per-language URL. Root detects device
   language on first visit and routes accordingly; an explicit user choice persists and wins on later
   visits. The switcher keeps the visitor on the current page. `lang`/`dir` derive from the URL.
   Emit alternate-language links and a self-canonical per page. Include every language variant in the
   sitemap. Do not break existing shared links — old paths must resolve, not 404.
2. **De-regionalisation.** Remove Oman-as-market from all copy and metadata; keep it only as the
   founder's location in About and structured data. Move every contact literal into configuration.
   Make date formatting language-based, not country-based.
3. **Six application case studies** (one per public system). Use the existing project entity. Each
   requires: industry label, business problem, intended user, 3–6 capabilities, real evidence surfaces in
   the canonical registry (the ≥3-screens wording is superseded by the evidence standard), provenance
   label, one primary action, both languages complete. Publishing gates on both languages being present.
4. **Founder identity.** Rewrite About around the named founder with photo and bio in both languages.
   Audit all public copy for unsupported team claims. Add the founder to Organization structured data.
5. **Attribution surfacing.** Inquiries already record entry context; ensure an application-originated
   inquiry displays the application's readable name to the founder.
6. **Social preview.** One raster image per language, at least 1200×630, referenced per page.
7. **Then Should-tier items** in backlog order.

**Definition of done for every item:** works at 375px and 1440px; keyboard-operable with a visible
focus ring; correct in both languages and both directions; no new runtime dependency; no new recurring
cost; existing verified behaviours (§FR-14) still pass.

**Never do without explicit founder approval:** publish a client name, logo or testimonial; publish a
metric that cannot be substantiated; add a paid service or recurring cost; collect personal data
beyond the inquiry form; change the published reply commitment; add push notifications or install
prompts.

**Resolved owner decision (2026-08-20):** the six applications are presented as **screens plus
short recordings inside this site**, with a "request a live walkthrough" action for anyone who wants
to see one running. Separate hosting for the six applications is **rejected** — zero additional
recurring cost, less maintenance, and the walkthrough requests measure real interest instead of
assuming it. Any single application may still be published live later without rebuilding anything.

---

<!-- دُمج من docs/lena-direction-refined.md في توحيد 2026-10-21 -->

# LENA Direction — Refined (settled record)

This document is the permanent, committed form of the refined creative direction for LENA
Digital House. It supersedes the informal working memo of the same name that PR #72, PR #73 and
PR #74 cited as their source; before this commit, the direction existed only in commit messages,
PR bodies and an uncommitted file, while the product strategy itself lived in `PRODUCT_DECISIONS.md`
and `OPEN_DECISIONS.md`. This record closes that documentation gap.

It is written in the same form as `PRODUCT_DECISIONS.md`: each entry states the choice, the
decisive reason, and how to reverse it. Statuses are dated so a later reader can tell what was
decided when and what still awaits the owner. Claims about the product (evidence counts, stages,
visibility) are canonical-repo facts, checked against `content/systems.ts`,
`features/world/content/evidence.ts` and the register in `OPEN_DECISIONS.md`, not recollections.

---

## D1 — The governing image is "a house you can see from the street at night, with lights on in the rooms where systems actually run"

**Status: ADOPTED 2026-09-08 — supersedes the earlier two-track framing.**

**Decision.** LENA's public expression is governed by one image: a house whose lit rooms are the
systems that are actually running and documented. **Evidence is the light.** The earlier split
framing (architectural expression on one track, evidence surfacing on another) is retired; in a
house metaphor they are the same design move. The cosmos/orbit register is retired from public
surfaces. The architectural register is not a new skin either — each room's surface is derived from
the product's real recorded entities, never from a universal gradient.

**Decisive reason.** The public surface previously mixed four registers (cosmic, architectural,
control-room, cartographic). A cosmos has no lights to turn on; a house does. This is the only
framing in LENA's market where evidence is not an add-on feature but the literal physics of the
visual system — and it makes the honesty contract (no fabricated metric, nothing claimed that is
not documented) a visual law: a lit room cannot be faked without breaking the metaphor.

**Reversible:** expression and copy only. IA, routes, product names and the World/Chamber proper
nouns are protected and did not change (see D6).

---

## D2 — Record surfaces (World index and chambers) render as a House Ledger

**Status: APPROVED AND IMPLEMENTED ON MAIN 2026-09-08 (PR #72).**

**Decision.** The World register and system chambers are ledger records: ink/paper surfaces,
hairlines, restrained editorial typography, one restrained brass seal, real evidence plates with
deterministic numbering (الشكل ٠١), tabular numerals, and RTL-native bilingual layout. No
gradients, glassmorphism, glow, orbiting decoration, decorative 3D or generic AI/SaaS aesthetics on
these surfaces. Motion is restricted; `prefers-reduced-motion` renders everything placed and
static.

**Decisive reason.** The register replaced the constellation "scene" presentation because the
product's claim is *proof of real daily work*, and a record sheet is the visual register of proof:
calm, legible, printable, honest about what is and is not in the file. It also differentiated LENA
from the genre defaults (dark glass + blue→violet→pink gradient + orbiting nodes) that the site
previously reproduced.

**Reversible:** visual/CSS layer; the ledger keeps the same underlying routes, data and card
grammar, so reverting is a stylesheet-and-component swap, not a data change.

---

## D3 — Evidence is the light, and `stage` is internal-only — the two standing rules

**Status: IN FORCE (standing rules since the evidence era; no owner action pending on the rules themselves).**

**Decision (rule 1 — evidence ladder).** A surface may show a system as *documented* only when the
canonical evidence registry (`features/world/content/evidence.ts`) holds at least one real surface
for it. Public evidence then climbs a ladder, each rung requiring more owner authority:

1. **Artifact proof** — a real interface capture from inside the system ("واجهة فعلية من داخل
   النظام"). Safe today for MALEK (7 surfaces) and Lara Beauty (10 surfaces, incl. mobile).
2. **Owner-verified status** — "runs today in real work" wording. Needs the hospitality
   reconciliation first (OPEN_DECISIONS A5 vs code: register says real use, code says `trial`).
3. **Measurable promises** — requires owner sign-off per product; current promises stay
   capability-framed, never telemetry.
4. **Named third-party references** — only with written permission (OPEN_DECISIONS B4).

**Decision (rule 2 — lifecycle words are internal).** `stage` (`in-use` / `trial`) in
`content/systems.ts` is internal canonical truth about verified evidence and **must never be
rendered publicly or used to write public copy**. Public surfaces may state documentation status
("documented", "not yet documented") but never lifecycle status. The one-line reconciliation that
would make "in real use" public-claimable for a second product is hospitality, and it is the
owner's to give (recorded in OPEN_DECISIONS).

**Decisive reason.** `evidence.ts` documents 2 of 6 public systems; the remaining four (LENA Dress,
Hospitality, Terranex, Kayyal) have zero surfaces. Any public word that outruns the registry is the
exact claim the site exists to avoid. The code/register drift on hospitality proves lifecycle
claims are unsafe until the owner reconciles them.

**Reversible:** the rules are policy; reversing them is a documented owner decision in
`OPEN_DECISIONS.md`, not an edit to a stylesheet.

---

## D4 — Home copy speaks the house register (Arabic-first)

**Status: APPROVED AND IMPLEMENTED ON MAIN 2026-09-08 (PR #73).**

**Decision.** Home hero and section copy drop the astronomical register at exactly the moments where
the product is described:

- h1: «أنظمة تشغيل حقيقية لأعمال حقيقية — في بيت رقمي واحد» / "Real operating systems for real
  businesses — inside one digital house" (mirrors the thesis line in `content/site-copy.ts`).
- Returning line: «مرحبًا بعودتك إلى البيت» / "Welcome back to the house."
- Lead and scroll hint use room language: «اختر غرفة… ثم ادخل» / "Pick a room… then step in."
- The grid kicker «عوالم التشغيل / Operating worlds» is **kept** — it is the protected
  product-line noun, not decoration.
- "Operating roots" is anchored at its first public occurrence with its proof condition: a root is
  only called shared once two real systems prove it.

**Decisive reason.** Arabic copy had consistently picked the astronomical register at the exact
moments the product was being described, while card CTAs already said "open the system chamber" —
the user's own vocabulary (غرفة / room, بيت / house) was already winning inside the components;
only the hero and hub copy still fought it. Arabic is primary; English is a parity translation.

**Reversible:** copy strings in `pages/Home.tsx`; the supporting verifier
(`tools/verify-malek-association.mjs`) pins the honest-register hero claim and asserts the cosmic
tokens stay absent — a same-strength sentinel refresh, not a weakening.

---

## D5 — Home hero scene: the Frontage (six windows = six public systems; lit iff documented)

**Status: DECIDED BY OWNER 2026-09-09 (concept, mapping and contract migration all owner-approved). Implementation in review — PR #74, not yet on main.**

**Decision.** The Home hero scene is a flat, editorial house frontage at dusk: parapet; four
first-floor windows; a round porch lamp in the frieze (the canonical Sacred Core sigil — its
artwork, lamp pulse, blink and gateway-awakening choreography are untouched); ground floor with two
windows flanking the entrance door.

- **Six windows = six public systems in owner order** (Lara Beauty leads, Kayyal last) via
  `publicSystems()` (`order` field).
- **A window is lit iff the evidence registry documents that system** — the identical rule the
  card windows use (`evidenceFor`), applied to six window slots instead of six cards. Today exactly
  two windows are lit: MALEK and Lara Beauty. LENA Dress, Hospitality, Terranex and Kayyal stay dim.
- **A dim window carries a documentation-status sign only** («لم يُوثَّق بعد» / "Not yet
  documented") — never a lifecycle word, never a fabricated state, no placeholder pretending to be
  a capture.
- The scene is decorative, non-interactive (`aria-hidden`) and JS-free: one restrained entrance
  animation, fully static under `prefers-reduced-motion`. Layout is RTL-native (grid auto-flow
  mirrors owner order right-to-left in Arabic).
- No gradients, glass or glow are added to the architecture; the approved sigil keeps its own warm
  lamp treatment.

**Decisive reason.** The frontage retires the last public surface still in the old register — the
copy said "inside one digital house" above an animation of things orbiting a glowing core, the most
visible inconsistency on the platform. Mapping windows to the registry makes the light semantics
provable: the guardian suite asserts exactly six windows, exactly two `data-documented="true"`
(property + wellness), per-window state classes equal to the evidence flags, lit and unlit panes
rendering distinct non-transparent surfaces, and the documentation-status sign visible.

**Reversible:** swap the Home scene component and its styles; the frontage uses the same canonical
data as the cards, so removing it loses no content source.

---

## D6 — Protected assets (no-touch list)

**Status: SETTLED.**

**Decision.** The following are owned decisions and are not collateral for visual work:

1. IA and routes: Home → Digital House → World → six products → Chambers.
2. Product names and the six-product grid order (Lara Beauty first, Kayyal last).
3. The card grammar: number → logo → name → industry → problem → trust chips → CTA. Evidence is
   fed into it; it is not rebuilt.
4. The proper nouns "World" and "Chamber".
5. The Sacred Core sigil (`lena-sacred-core.webp`) — the single canonical artwork/identity mark.
6. Internal code vocabulary (class names and comments). It is not public and is not churned;
   cleanup that only renames internal tokens is explicitly disallowed.
7. Canonical content is never deleted; `visibility` hides, owner decisions delete.

**Decisive reason.** These are the founder's own naming and ordering decisions (OPEN_DECISIONS
answers A5/E1/E2) plus the honesty contract. Churning them for aesthetics costs review risk and
erodes the one thing the site sells: that what you see is what runs.

---

## D7 — Visual baselines change only by the CI-Chromium rule

**Status: STANDING VERIFICATION RULE (exercised by PR #73 and PR #74).**

**Decision.** A visual baseline may change only when (a) the source diff shows an intentional
visual change, (b) the new baseline is a real CI Chromium capture — never a sandbox capture (Arabic
rendering in particular drifts outside CI), (c) the commit message records the source CI run, and
(d) the actual images are checked for voids, clipping or missing content before acceptance. When a
surface changes so subtly that a stale baseline still passes (dark-on-dark deltas under the global
2% tolerance — the `home-desktop-dark` case in PR #74), the surface's per-entry tolerance is
tightened so the change registers and the baseline is regenerated, rather than leaving a stale
picture that masks future drift.

**Decisive reason.** Guardian visual regression is the backstop against "disappearance" regressions
(content-visibility voids, missing artwork). A baseline that no longer depicts the surface turns
the backstop into a formality.

---

## Owner-gated items (recorded, not decided — cross-referenced in OPEN_DECISIONS.md)

| # | Item | What unblocks it | Recorded as |
|---|---|---|---|
| 1 | Hospitality stage reconciliation (register A5: real use; code: `trial`) | A truthful second "in real use" public signal, or the decision to stay silent | OPEN_DECISIONS A5 |
| 2 | Capture access for LENA Dress, Hospitality, Terranex, Kayyal | Evidence parity for 4 of 6 public systems (the P0 content gap) | OPEN_DECISIONS B1 |
| 3 | Hospitality client naming | Any client-visible phrasing beyond «جهة ضيافة» | OPEN_DECISIONS B4 |
| 4 | `materials` visibility (`order 7`, `visibility: "hidden"`, fully specified) | An explicit public/private decision for the seventh system | OPEN_DECISIONS F1 |
| 5 | Measurable-promise wording upgrades | Owner sign-off per product | — |

## Still-experimental (not adopted as direction)

Literalness of the house beyond the Frontage (e.g., full built-structure reinterpretation of every
surface), a per-material finish system across all six rooms, and lit/dim read tests at card size.
These are deliberately not part of the settled direction until the Frontage merges and the
measurement plan (PRODUCT_MEASUREMENT_PLAN.md) has data.

---

*Companion documents: `PRODUCT_DEFINITION.md` (product contract), `PRODUCT_DECISIONS.md`
(decision register), `OPEN_DECISIONS.md` (owner register), `docs/PROJECT_INVENTORY.md`
(per-product inventory).*

---

<!-- دُمج من docs/FEATURE_GAP_STRATEGY.md في توحيد 2026-10-21 -->

# LENA Digital House — Feature Gap & Product Strategy

> **Historical baseline — not current product/runtime authority.** This document records the
> 2026-08-20 audit and the product assumptions that existed at that time. Since then LENA moved to
> the operating-systems / World architecture and several findings below were completed, removed, or
> superseded. Current truth is owned by `artifacts/lena/src/content/systems.ts`,
> `artifacts/lena/src/features/world/content/evidence.ts`,
> `artifacts/lena/src/features/world/content/product-contract.ts`, and the canonical World Graph.
> If this document conflicts with those contracts or with later merged architecture, treat the
> conflicting statement below as historical only.

**Owner:** non-technical product owner
**Author:** Arena orchestration agent (single-agent mode with separated plan / build / adversarial-review phases)
**Date:** 2026-08-20
**Baseline commit:** `b78f19a` (branch `arena/01a01ef6-platform`)

---

## 1. Product read (historical 2026-08-20 baseline)

| Dimension | Finding | Evidence |
|---|---|---|
| **Category** | Bilingual (AR/EN, RTL-first) creative-studio / digital-agency marketing website with a lead capture form and a lightweight admin back office. Not a SaaS, not a marketplace. | `artifacts/lena` routes, `src/content/services.ts` (8 service tracks), `src/content/caseStudies.ts` |
| **Target users** | (a) Prospective clients in Oman / Gulf — SMEs, founders, F&B and retail brands looking for identity, web, content, automation. (b) The studio owner (single admin). | `SITE_CONFIG.locationLabel = "سلطنة عمان"`, `+968` phone, Arabic-first `index.html` (`lang="ar" dir="rtl"`) |
| **Primary outcome** | A qualified stranger discovers LENA, trusts it via case studies, and starts a conversation (WhatsApp, email, or the inquiry form). Everything else is supporting. | Every page ends in `LenaCta`; `WhatsAppFAB` is global; `inquiries.create` is the only public write endpoint |
| **Roles** | `user` and `admin` only. Admin = owner, granted through `OWNER_UNION_ID`. No team/multi-seat concept. | `lib/db/src/schema/enums.ts`, `artifacts/api-server/src/auth/oauth.ts` |
| **Lifecycle** | Visit → browse services/work → submit inquiry → inquiry row (`status: new`) → owner reviews in `/dashboard` → status moves `new → in_progress → qualified → closed/archived`. Delivery happens off-platform. | `inquiries` table, `Dashboard.tsx` inquiries tab |
| **Business model** | Project-based services sold off-platform. The product is a **top-of-funnel + inbox**, not a transactional system. No pricing, cart, invoicing, or contracts anywhere. | No payment/billing code; `uploads/invoice_export.pdf` is a 0-byte placeholder |
| **Maturity** | Solid engineering skeleton, thin product surface. Typecheck and build pass; security hardening (rate limiting, honeypot, RLS, signed uploads) is above average for this stage; but discovery, trust-recovery, and measurement layers are absent. | `pnpm run typecheck` ✅, `pnpm run build` ✅ (verified 2026-08-20) |

### Domain grounding (external, current)

- Median B2B website visitor→lead conversion is ~2.9%; the single biggest lever on lead-to-opportunity conversion is **speed-to-lead under 5 minutes** [SalesHive 2026](https://saleshive.com/blog/b2b-lead-benchmarks-digital-marketing-gen).
- 78% of B2B buyers are more likely to consider a vendor that publishes case studies — the portfolio is the sales asset, not decoration [Lead Scrape 2026](https://www.leadscrape.com/lead-generation-for-agencies.html).
- Content/SEO is the compounding inbound channel for agencies and produces ~3x more leads than outbound at ~62% lower cost [Lead Scrape 2026](https://www.leadscrape.com/lead-generation-for-agencies.html).
- Confirmation/welcome emails average ~82% open rate — the highest-attention message in the whole funnel [Marketing LTB 2026](https://marketingltb.com/blog/statistics/lead-generation-statistics/).

**Strategic consequence:** this product's value is *discoverability + credibility + fast, reliable response*. Any feature that does not serve one of those three should be deferred or rejected.

---

## 2. Findings by category

Each item: evidence → affected users → domain rationale → value → dependencies → risk → ongoing cost → smallest viable version (SVV) → acceptance criteria → success measure.

### A. Missing capability that blocks the core outcome

---

#### A1. The site is invisible and unshareable — no per-page SEO metadata, no `robots.txt`, no `sitemap.xml`, no structured data, soft-404s

- **Evidence:** `artifacts/lena/index.html` contains one hard-coded `<title>LENA Digital House</title>` and one description for **all 11 routes**. No component anywhere sets `document.title`, canonical, or per-route Open Graph tags (`grep` over `artifacts/lena/src` returns zero hits for `title`, `canonical`, `og:` outside `index.html`). `artifacts/lena/public/` contains only `favicon.svg` and `lena-og.svg` — no `robots.txt`, no `sitemap.xml`. `App.tsx` routes `*` to `<Navigate to="/" replace />`, so every wrong URL becomes a **soft 404** (HTTP 200 + home page), which search engines treat as a quality defect and users experience as silent teleportation.
- **Affected users:** every prospective client who searches for a studio, and anyone who pastes a LENA link into WhatsApp/LinkedIn (all previews show the same generic card).
- **Domain rationale:** for an agency with no paid-media budget in the repo and no outbound tooling, organic search + link sharing *is* the acquisition channel. Eight service pages and eight case studies are eight+eight indexable assets currently collapsed into one.
- **Expected value:** unlocks the compounding inbound channel; makes every case study a shareable sales asset (the 78% case-study effect only works if the link renders a real title and summary).
- **Dependencies:** none technical. Production domain should be set as `SITE_URL` for absolute canonical/sitemap URLs (Vercel supplies `VERCEL_PROJECT_PRODUCTION_URL` as an automatic fallback).
- **Risk:** Low. Additive, no schema change, no data touched, fully reversible.
- **Ongoing cost:** ~near zero. One metadata entry per new page.
- **SVV:** route-aware `<SeoHead>` (title, description, canonical, robots, OG, Twitter) on every public route; `Organization` + `WebSite` JSON-LD on home; generated `robots.txt` + `sitemap.xml` at build time; a real 404 page marked `noindex` instead of the redirect.
- **Acceptance criteria:** see `docs/specs/SEO_DISCOVERABILITY_SPEC.md`.
- **Success measure:** Google Search Console — indexed pages goes from ~1 to ≥ 18; organic impressions and clicks trend, tracked monthly.

**→ This is the selected Now #1 and its first vertical slice is implemented in this change.**

---

#### A2. No proof that an inquiry ever reached a human

- **Evidence:** `inquiries.create` calls `sendNewInquiryNotification(...).catch(console.error)` — fire and forget. `mailer.ts` returns silently when `SMTP_USER`/`SMTP_PASS` are unset (`console.warn` only). There is no delivery record, no retry, no `notified_at` column, and no in-app "new inquiries" alert outside opening the dashboard. The visitor receives only an in-page success sentence and **no confirmation email**, even when they supplied one.
- **Affected users:** every lead (uncertainty → they message a competitor); the owner (a mis-typed SMTP password silently destroys the pipeline while the UI says "sent successfully").
- **Domain rationale:** speed-to-lead under 5 minutes is the top conversion lever; you cannot be fast about something you were never told about. Confirmation emails are the highest-open-rate message in the funnel (~82%).
- **Expected value:** protects 100% of captured demand; converts "did they get it?" anxiety into a branded touchpoint with a reference number.
- **Dependencies:** working SMTP credentials (owner-controlled); a small `inquiries.notified_at` / `notification_status` column (additive, nullable — non-destructive).
- **Risk:** Medium-low. Sending mail to real third parties requires correct sender identity and an unsubscribe-free transactional framing; a misconfigured sender can damage domain reputation.
- **Ongoing cost:** SMTP mailbox already assumed; ~0 additional if Gmail/Workspace is used.
- **SVV:** (1) auto-reply to the visitor in their submitted locale with inquiry reference `#id`, only when an email was supplied; (2) persist notification outcome; (3) surface an unmissable red banner in `/dashboard` when the last notification attempt failed.
- **Acceptance criteria:** submitting with an email yields exactly one visitor email and one owner email; forced SMTP failure still stores the inquiry, marks it `notification_failed`, and shows the dashboard banner; no duplicate sends on retry.
- **Success measure:** notification failure rate < 1%; median time from inquiry creation to first `status` change (proxy for speed-to-lead) below 4 hours.

---

### B. Missing trust / safety / recovery capability

#### B1. Single-point-of-failure authentication with no recovery path
- **Evidence:** `/login` offers exactly one button → `/api/oauth/login` (Kimi OAuth). Admin identity is pinned to `OWNER_UNION_ID`. If that provider is unreachable, the account changes, or the env var is wrong, **the owner is permanently locked out of the only management surface** — with no fallback, no second admin, and no break-glass path.
- **Affected users:** the owner exclusively; blast radius = total loss of lead access.
- **Domain rationale:** industry standard for single-admin back offices is at minimum a documented, credential-verified recovery route.
- **Value:** eliminates a catastrophic, non-recoverable failure mode.
- **Dependencies:** owner decision on the second factor (magic-link email vs. a second `OWNER_UNION_ID`). **Second-owner or email-based login touches account/credential policy → owner approval required.**
- **Risk:** Medium — any additional auth path is an additional attack surface; must be rate-limited and single-purpose.
- **Ongoing cost:** negligible.
- **SVV:** support a comma-separated `OWNER_UNION_IDS` allowlist (2 identities) — no new auth mechanism, no new attack surface, purely a config widening.
- **Acceptance:** both listed identities receive `role=admin`; unlisted identities still get `role=user`; empty/blank entries are ignored.
- **Success measure:** documented, tested recovery drill completed once.

#### B2. Admin destructive actions have no undo and no audit trail
- **Evidence:** `inquiries.delete` and `projects.delete` are hard `DELETE`s guarded only by a browser `confirm()` (`Dashboard.tsx`, `text.confirmDelete`). A mis-click permanently destroys a sales lead. `archived` already exists in `INQUIRY_STATUS_VALUES` but hard delete still bypasses it.
- **Affected users:** owner; and indirectly the lead whose request vanishes.
- **Rationale:** for low-volume, high-value records (a lead is worth thousands of OMR), soft delete is the standard.
- **Value:** removes an irreversible data-loss path at almost no cost.
- **Dependencies:** none — `archived` status already exists.
- **Risk:** Very low.
- **SVV:** dashboard "delete" becomes "archive" (sets `status='archived'`, hidden by default behind an "Archived" filter); the hard-delete procedure stays server-side but is no longer reachable from one click.
- **Acceptance:** archiving hides the row from the default list and is reversible from the archived view; no rows are removed from the database.
- **Success measure:** zero unintended permanent deletions; measured as `count(inquiries)` never decreasing month-over-month.

#### B3. The public form's success state is not resilient
- **Evidence:** `Contact.tsx` clears the whole form (`setForm(createEmptyInquiry())`) only on success — correct — but on failure it shows one generic sentence and the message text is retained *without any offline/retry affordance*; a rate-limited visitor (`TOO_MANY_REQUESTS`) sees the same message as a server outage, and the honeypot's 1.5s minimum-completion rule silently rejects fast legitimate pasters as "Invalid inquiry."
- **Affected users:** genuine leads who hit the guardrails.
- **Value:** recovers demand that the anti-spam layer currently discards silently.
- **Risk:** Very low.
- **SVV:** distinguish three error states (rate limited / rejected as automated / server error) with distinct copy, and always show the WhatsApp fallback CTA inside the error block.
- **Acceptance:** each of the three tRPC error codes renders its own message + a working WhatsApp link.
- **Success measure:** form submission error rate visible and < 3%.

#### B4. No cookie / privacy statement while setting a 1-year session cookie and storing personal data
- **Evidence:** `SESSION_MAX_AGE_SECONDS = 365 * 24 * 60 * 60`; `inquiries` stores name, email, phone, free-text message; `inquiry_rate_limits` stores an HMAC of the visitor IP. There is no privacy page, no retention statement, and no consent copy anywhere in `src/pages`.
- **Rationale:** collecting personal data through a public form without a published privacy notice is below baseline expectation for a professional studio and is a commercial/legal exposure for Gulf and EU-facing clients.
- **Dependencies:** **owner-authored legal content — requires owner decision, cannot be invented by an agent.**
- **SVV:** a `/privacy` page whose text the owner supplies, linked from the footer and referenced by one line under the contact form.
- **Success measure:** page exists, is linked, and is the target of the form's consent line.

---

### C. Expected usability support

#### C1. No search-engine-visible language variants despite a full AR/EN system
- **Evidence:** `PreferencesProvider` stores locale in `localStorage` and mutates `document.documentElement.lang/dir`. **The URL never changes.** `/services` in Arabic and `/services` in English are the same URL, so only one language can ever be indexed or shared.
- **Value:** doubles the addressable indexable surface and makes "send the English version to my investor" possible.
- **Risk:** Medium — introducing `/en/*` routing touches every internal link and all canonical logic. Should follow, not precede, A1.
- **SVV:** `/en/...` path prefix with `hreflang` alternates; Arabic stays at the root.
- **Acceptance:** every public route resolves under both prefixes; locale is derived from the URL first and `localStorage` second; `hreflang` pairs are emitted.
- **Success measure:** English pages indexed and receiving impressions in Search Console.

#### C2. Dashboard is a raw table, not a follow-up workspace
- **Evidence:** `Dashboard.tsx` renders the inquiry list with a status `<select>` and a delete button. No search, no filter by status, no sort, no notes field, no "new since last visit" indicator (`inquiries.countNew` exists on the server but **is never called by the frontend**).
- **Value:** at 5–10 leads/month the table is fine; at 50 it fails. Wire up the *existing* `countNew` first — that is a 3-line change with real value.
- **SVV:** status filter chips + a "new" count badge using the existing endpoint.
- **Success measure:** median time-to-first-status-change decreases.

#### C3. Local development cannot reach the API
- **Evidence:** `vite.config.ts` defines **no `server.proxy`**, while `providers/trpc.tsx` calls the relative URL `/api/trpc`. Running the frontend dev server alone means every data-driven screen fails.
- **Affected users:** every future maintainer (a real, recurring cost).
- **SVV:** add a `/api` dev proxy to `http://localhost:8080`.
- **Risk:** none (dev-only config).
- **Success measure:** `pnpm --filter @workspace/lena dev` renders dashboard data without extra steps.

#### C4. The Open Graph image is an SVG
- **Evidence:** `index.html` → `og:image = /lena-og.svg`; `public/` has no raster image. WhatsApp, LinkedIn, X and Facebook do not render SVG previews — shared links currently show **no image at all**.
- **SVV:** one 1200×630 PNG brand card. **Requires a real brand asset from the owner — an agent-generated image would misrepresent the brand.**
- **Success measure:** link preview renders an image on WhatsApp and LinkedIn.

---

### D. Competitive / growth opportunity

#### D1. Case studies carry no outcome evidence
- **Evidence:** `caseStudies.ts` supplies `overview / challenge / direction / solution / features / journey` — all process narrative. There is **no result, metric, timeline, client name, or testimonial field** anywhere in the schema or the content.
- **Rationale:** the case-study effect on buyer consideration comes from *proof*, not process description. Competing studios lead with numbers.
- **SVV:** add an optional `results` block (2–4 label/value pairs, bilingual) to the existing `ProjectContentBlocks` JSON type — additive, no migration needed since `content_blocks` is already `jsonb`.
- **Risk:** Low technically; **the owner must supply truthful numbers — fabricated results are a commercial and reputational risk and will not be invented.**
- **Success measure:** contact-page visits originating from case-study pages.

#### D2. No measurement of the primary outcome
- **Evidence:** zero analytics of any kind (`grep` for `gtag|analytics|plausible|posthog|umami` over the frontend returns nothing). Nobody can currently answer "how many people saw the contact page and did not submit?"
- **Rationale:** every recommendation in this document, including this one, is unfalsifiable without a conversion baseline.
- **SVV:** privacy-friendly, cookieless page + `inquiry_submitted` event counting. **Any hosted analytics vendor is a recurring cost and a data-processing decision → owner approval.** A zero-cost alternative is a self-owned `page_views` counter, but that adds maintenance; recommendation is to defer until A1 produces traffic worth measuring.
- **Success measure:** contact-page → submission conversion rate is reportable.

#### D3. Structured data for local discovery
- **Evidence:** no JSON-LD at all today. LENA has a physical market (Oman), a phone number, and a service catalogue — all first-class structured-data entities.
- **SVV:** `Organization` + `WebSite` now (**included in the Now #1 slice**), `Service` and `BreadcrumbList` later.
- **Success measure:** rich-result eligibility in Search Console.

---

### E. Optional features that should wait

| Feature | Why it waits |
|---|---|
| **Client portal / project status tracking** | Zero demand evidence. There is no `clients` table, no delivery workflow, no multi-user model. Building it means inventing an operations product for one owner. |
| **Quotes, pricing pages, payments, invoicing** | `uploads/invoice_export.pdf` is a 0-byte placeholder — a ghost of an abandoned idea. Pricing is a commercial policy the owner has not set. Payments add PCI scope, refunds policy, and recurring cost for a service business that closes deals in WhatsApp. |
| **Blog / content hub** | Correct long-term SEO play, but it needs an editorial commitment (≥2 posts/month). Publishing three posts and stopping is worse than not starting. Revisit only after A1 shows organic traffic and the owner commits to a cadence. |
| **CRM integration (HubSpot/Pipedrive)** | Premature at current volume; the dashboard plus a reliable email is sufficient until inquiries exceed ~30/month. |
| **AI chatbot / lead qualification bot** | Trendy, high maintenance, high hallucination risk against a brand promise. WhatsApp already provides an instant human channel with better conversion. |
| **Newsletter / drip sequences** | Requires consent management, unsubscribe handling, and content supply. Not before D2 and B4. |

### F. Existing features to simplify, merge, hide, or remove

| # | Item | Evidence | Recommendation |
|---|---|---|---|
| F1 | **Two competing project editors** | `/dashboard` (projects tab, `Dashboard.tsx`) and `/dashboard/projects-editor` (`ProjectsCms.tsx`) both create/update/delete the *same* `projects` rows through the *same* endpoints, with different field coverage. The dashboard version cannot edit `contentBlocks` or `gallery`; the CMS version can. | **Merge.** Keep `ProjectsCms` (superset) as the single editor; the dashboard projects tab becomes a read-only list that links to it. Removes a whole class of "I edited it in the other screen and lost my gallery" bugs. |
| F2 | **The `content_entries` CMS is a ghost feature** | Full stack exists: table, four tRPC procedures, `listPublished` + `getPublishedByKey`, and a dashboard tab. **Nothing in the public site ever reads it** — all copy comes from the static `src/content/site-copy.ts` via `useSiteCopy`. `grep` for `trpc.content` outside `Dashboard.tsx` returns nothing. | **Hide, don't delete.** Remove the dashboard tab (an admin publishing content that never appears is an active trust bug), keep the server code and table. Re-expose only when a real editable surface is defined. |
| F3 | **Dead 404 components** | `pages/NotFound.tsx` **and** `pages/not-found.tsx` both exist; `grep` proves neither is imported anywhere. Meanwhile the app has no 404 route at all. | **Consolidate into one branded 404** and actually route to it (part of the Now #1 slice); delete the duplicate. |
| F4 | **Duplicated `use-mobile` hook** | `hooks/use-mobile.ts` and `hooks/use-mobile.tsx` are both present; two different consumers import `@/hooks/use-mobile`, resolution depends on extension order. | Delete the `.ts` duplicate, keep one. Low risk, removes ambiguity. |
| F5 | **`lib/api-spec` (orval) is scaffolding for an API style this project does not use** | The project is tRPC end-to-end; `orval.config.ts` generates a REST client into `lib/api-client-react`, which the frontend declares as a dependency but never imports. | Keep the packages (they are inert and cheap) but **do not extend them**. Reject any future work that maintains two API paradigms. |
| F6 | **`artifacts/mockup-sandbox`** | A full second Vite app with a duplicated `components/ui` tree, built on every `pnpm run build`. | Keep as a dev tool but **exclude from the production build** to cut build time; it ships nothing to users. |
| F7 | **`replit.md` describes a different product** | It documents the former hospitality application, tables `leads`/`portfolio`/`instagram_posts` that do not exist, and endpoints that were removed. | **Rewrite or delete.** A stale handoff document is how the next agent breaks production. |
| F8 | **Hard-coded owner contact details as code fallbacks** | `src/config/site.ts` falls back to a literal personal phone number and Outlook address when env vars are missing; `mailer.ts` hard-codes the same address as `NOTIFY_EMAIL` default. | Keep the fallbacks (they prevent a blank site) but **fail loudly in production logs** when the env vars are absent, so a misconfigured deploy is visible. |

---

## 3. Recommended sequence

### NOW — ship in this order, nothing else in parallel

1. **Discoverability & shareability foundation (A1 + D3 + F3).** Per-route metadata, canonical, Open Graph/Twitter, `Organization`+`WebSite` JSON-LD, `robots.txt`, generated `sitemap.xml`, real `noindex` 404 replacing the soft-404 redirect. *Zero dependencies, zero cost, fully reversible, unblocks every other growth item.* **← implemented in this change (first vertical slice).**
2. **Inquiry delivery reliability + visitor auto-reply (A2).** Needs owner SMTP credentials.
3. **Archive-instead-of-delete + login allowlist widening (B2 + B1 SVV).**
4. **Hygiene: merge the two project editors, hide the ghost content CMS, delete dead duplicates, fix the dev API proxy, rewrite `replit.md` (F1, F2, F3, F4, C3, F7).**

### NEXT — after Now is live and stable

5. Static prerendering of route HTML so social crawlers (WhatsApp/LinkedIn) read real per-page Open Graph tags — phase 2 of A1, requires verification against real Vercel routing.
6. Contact-form error differentiation with a WhatsApp fallback (B3).
7. Dashboard follow-up workspace: status filters + the already-built `countNew` badge (C2).
8. Case-study `results` block, populated with owner-supplied truthful numbers (D1).
9. `/privacy` page from owner-supplied text (B4).
10. Real 1200×630 raster OG image from an owner-supplied brand asset (C4).

### LATER — only if the earlier stages produce evidence

11. `/en` URL-based localisation with `hreflang` (C1) — do this only once Arabic pages are actually indexed.
12. Conversion analytics (D2) — once there is traffic worth measuring; approval needed if a paid vendor is chosen.
13. `Service` + `BreadcrumbList` structured data (D3 phase 2).
14. Editorial blog — only with a written publishing commitment.

### DO NOT BUILD

- Client portal / project status tracking for clients.
- Pricing pages, quotes, payments, invoicing.
- CRM integration below ~30 inquiries/month.
- AI chatbot lead qualification.
- Newsletter / drip campaigns before consent management exists.
- Any second API paradigm (REST/orval) alongside tRPC.
- Any feature whose success cannot be stated as a measurable sentence before it is built.

---

## 4. Open decisions that genuinely require the owner

| # | Decision | Why an agent must not decide it |
|---|---|---|
| 1 | Production domain value for `SITE_URL` | Owned asset / DNS |
| 2 | SMTP sender identity for visitor auto-replies | Credential + sender reputation |
| 3 | Second admin identity for lockout recovery | Account access policy |
| 4 | Privacy-notice text and data-retention period | Legal |
| 5 | Real, truthful case-study result numbers | Commercial truth claims |
| 6 | Whether to pay for hosted analytics | Recurring cost |

---

<!-- دُمج من docs/PRODUCT_UX_ROADMAP.md في توحيد 2026-10-21 -->

# Product UX Roadmap

Ordered by user value, domain correctness, risk, effort and reversibility. Each item has testable
acceptance criteria. Status labels: **DONE**, **READY** (specified, safe, not yet built), **BLOCKED**.

---

## Now — done in this pass (record)

### R1. Provenance on every portfolio item — **DONE**
*Defect · critical · all visitors*

**Was:** eight published case studies, none corresponding to real work, none labelled.
**Now:** every card shows a badge; every case study opens with a banner naming what it is and what it
is not.

**Acceptance criteria**
1. Every portfolio card renders a provenance badge. ✅
2. Every case study renders the banner above the title. ✅
3. Labels exist in Arabic and English. ✅ (verified in the shipped bundle)
4. No item can be added without a provenance value. ✅ (required by the type)

**Evidence:** `عمل مفاهيمي`, `Concept work` and the explanatory note all present in
`ProjectVisual-DmNgAcrN.js`; `/ar/portfolio`, `/en/portfolio`, `/ar/work/riwaq` all return 200.

### R2. Remove the tab that publishes nothing — **DONE**
*Defect · high · founder*

**Acceptance criteria:** the content tab is absent from the dashboard ✅; the server procedures and
table are untouched ✅; typecheck and build pass ✅.

---

## Then — the D1-approved sequence

> D1 was approved (the 2026-08-20 owner correction + subsequent direction decisions, formalised in
> `lena-direction-refined.md`). This section records where each sequenced item landed; current work
> executes from `PLATFORM_PRD.md`. Statuses as of 2026-09-09.

### R3. Reposition the homepage and services around operations software — **DONE**
**Acceptance criteria**
1. The H1 names the outcome for an operating business, not "digital presence".
2. Every service track maps to a capability used in a real system.
3. The homepage states who it is for within the first screen, on mobile.
4. No claim appears that the founder cannot substantiate.
5. Arabic and English carry identical meaning.

### R4. Industry entry points — **DONE**
Home and the services page are organised by industry: property, wellness, rental showrooms,
investment, hospitality, recycling. Each links straight to the form carrying its own context.

**Verified:** `/ar/services` and `/en/services` return 200; the new promise and all six industries are
present in the shipped bundle; the sitemap dropped from 48 to 16 URLs because hidden pages are no
longer advertised.

### R4b. Hidden-not-deleted mechanism — **DONE**
Owner constraint honoured: a `visibility` field on services and projects. Eight creative tracks and
eight concept projects remain in the repository and are excluded from every listing, the contact
picker, related-service lookups, and the sitemap. Restoring any one of them is a single word.
**Acceptance criteria:** a visitor can reach the relevant system in one click from the homepage; each
industry page opens with a recognisable operational problem; each links to at least one application or
states plainly that a demonstration is in progress.

### R5. Publish the six real applications — **BLOCKED on owner access (2026-09-09)**
Needs, per application: the owner's access to capture real evidence (the "≥3 screens" wording is
superseded by the canonical evidence-registry standard — `docs/EVIDENCE_CAPTURE_GUIDE.md`).
**Acceptance criteria:** each has industry, problem, user, 3–6 capabilities, real evidence surfaces in
the registry (2 of 6 documented today), provenance, one primary action, both languages, a stable URL,
and appears in the sitemap.

### R6. Stage badge: live / pilot / available — **SUPERSEDED (never built, by decision)**
Lifecycle stage vocabulary (`in-use`/`trial`, live/pilot/available) is **internal-only** and must never
surface publicly (`lena-direction-refined.md` D3, 2026-09-09). Public surfaces carry documentation
seals derived from the evidence registry instead («موثّق»/DOCUMENTED vs «قيد التوثيق»/RECORD PENDING),
visible on the card/chamber without a click. R6's original acceptance is therefore obsolete; the
honest-state goal it served is met by the seals.

### R7. Operator section on each application — **SCAFFOLD DONE 2026-09-09 (PR #88 → `0135c0c`)**
Evidence-gated operator record + ledger-grammar chamber section live on the two evidence-bearing
chambers (MALEK, Lara Beauty); remaining applications gain their record in the same tranche their
evidence registers (checklist T1-x; content module ready in `features/world/content/operator.ts`).
**Acceptance criteria:** each application answers what changes for daily staff, offline behaviour, and
how mistakes are corrected, in under 80 words — the delivered records answer from the B2 register;
offline/corrections/training aspects stay declared-open until founder documentation exists.

---

## Later — real but not urgent

### R8. Accessibility verification — **PARTIAL 2026-09-09**
Automated layer DONE: an axe-core WCAG 2.x A/AA suite runs in the guardian on every push (now 25
route/locale/theme combos — every public chamber in both locales after PRs #83/#84; zero violations
after AA contrast fixes on the ledger surfaces — PR #78 onward).
Register completion (PR #79, run `34302369502`) kept the automated matrix green: axe surfaced four
opacity/alpha dimming spots on the old-register surfaces (footer `<small>`, `.lena-memory-reset`,
`.lena-front-num`) and a pale light-theme brass — all fixed at the token level, no contrast disable rules;
guardian suite 72/72 at PR head. Ledger remnant sweep (PR #80, main run `34308483403`) then
flattened the remaining cosmos accents on ledger surfaces (CTA, nav-active, icon/chip tints, form
fields, statuses, footer, mobile-menu blur) while keeping the axe matrix clean; follow-up (PR #87,
run `34311694330`) neutralized the last public fills (help-search field, help/form-context/draft,
support-reference, provenance, stage-trial chips) and consolidated the duplicate ≤720px responsive
block — axe matrix stayed clean throughout. Intentionally-scoped non-ledger surfaces (studio/project
concept art, World visualization incl. `.lena-roots-chip` and `--dna-accent` scope tokens, assistant
widget, admin console, WhatsApp brand FAB) are recorded with selectors in `PLATFORM_PRD.md` §17. Guardian chamber guard extended to
all six public chambers (`#83`) and to both locales/RTL (`#84`); smoke suite grew 45 → 63 while staying
green, static integrity PASSED.
Screen-reader (assistive-technology) verification remains open — no AT available in any environment
(OPEN_DECISIONS B-11).
**Acceptance criteria:** every interactive element reachable and announced (open — AT pass); contrast
≥ 4.5:1 in both themes (DONE — enforced in CI); the contact form completable by keyboard alone in both
directions (covered by the guardian keyboard checks on the a11y spec).

### R9. Delivery lifecycle vocabulary
Inquiry statuses suit lead capture, not software delivery. Add discovery → scoping → pilot → rollout
only when a second project runs in parallel.

### R10. State the engagement model
One short section: how a project starts, what the founder delivers, what happens after handover.
Requires owner input on support policy — commercial, not inferable.

---

## Explicitly not doing

Pricing pages · client portal · blog · chatbot · CRM · testimonial carousel with no testimonials ·
framework, database or design-system replacement · any third-party script.

---

## The single next action (2026-09-09)

D1 and the full House Ledger direction are approved and shipped. **Current work executes from
`PLATFORM_PRD.md`** (the committed authoritative PRD with its live execution log); remaining P0/P1 work
is evidence capture for the four undocumented products (founder access) and the owner-gated rows in
`OPEN_DECISIONS.md`.
