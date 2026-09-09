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
- **Current main commit:** `0135c0c` (PRs #80–#88 merged 2026-09-09; main validate runs green — `34309826466`, `34310112023`, `34310491528`, `34311694330`, `34318985015`).
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
