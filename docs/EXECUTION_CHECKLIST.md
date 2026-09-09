# LENA Digital House — Final Roadmap & Execution Checklist

**Status date:** 2026-09-09 · **Current `main`:** `d74858a` · **Source of truth reconciled from:** `PLATFORM_PRD.md` (live), `OPEN_DECISIONS.md` (live register), `lena-direction-refined.md`, `docs/CHAMBER_AUDIT_2026-09-09.md`, and independent verification performed across this engagement (real diffs, real CI runs, real baseline images — not status reports taken on faith).

This document is the fixed reference for future tranche reports: update against this checklist's item numbers rather than restating scope from scratch. Everything below is either: (a) verified complete, (b) blocked on a named external party with a named unblock condition, or (c) sequenceable now. Nothing is included on the strength of a claim alone — see each item's evidence pointer.

---

## 0. What is actually done (do not re-litigate)

Verified — engineering complete, CI green, baseline-audited where visual:

- Mobile `content-visibility` void/layout-shift fix (#71)
- House Ledger register on World/Chamber surfaces (#72)
- Home copy → house register, evidence windows for MALEK/Lara Beauty, founder strip (#73)
- Documentation parity: `lena-direction-refined.md` committed; FR-1/B1 staleness corrected (#75)
- Frontage hero replacing the orbit — 6 windows, lit-iff-documented, guardian contracts migrated with equal-or-stronger assertions (#74)
- Part B dependency/hygiene remediation — advisory bumps, PWA offline shell, dashboard status filter (#76)
- Chamber audit (CHAMBER-R1) — two real shared-surface copy defects found and fixed, contracts hardened (#77)
- Automated WCAG 2.x A/AA layer in CI (axe-core, 16 route/theme/locale combos) + contrast token fixes (#78)
- House Ledger register extended to **every** remaining public surface; ambient orb/glow system retired site-wide (#79)
- Ledger remnant sweep — remaining cosmos accents flattened (#80); follow-up completion — last public fills neutralized, duplicate ≤720px responsive block consolidated, selector-level §17 register (#87 → `64e75bc`, run `34311694330`)
- Ambient system fully deleted, zero dangling references (#82, independently `grep`-confirmed)
- Guardian test matrix expanded to all six public chambers, bilingual/RTL, 63/63 (#83, #84); B-10 operator-record browser contract added — 12 smoke tests pinning visible-on-evidence-bearing / absent-on-pending chambers in both locales (#89 → `324ca92`)
- FR-4 "five" → six-product staleness corrected
- B-10 / D6 / R7 operator-record scaffold on the evidence-bearing chambers (MALEK + Lara Beauty) — evidence-gated content module + ledger-grammar chamber section, bilingual, tests pinned; remaining chambers gain records in the same tranche their evidence registers (**#88 → `0135c0c`, run `34318985015`; baselines `chamber-desktop-dark`/`chamber-mobile-dark` regenerated from CI Chromium actuals, run `34318280863`, artifact `10090952343`**)
- Credential hygiene (T0-1) — closed 2026-09-09: token audit clean (never in repo files or shell history; appeared only in the chat transcript), invalid token rotated by the owner; delivery resumed with the replacement
- Transitive advisory floors raised — `pnpm audit --prod` from 1 low + 3 moderate to **0 known vulnerabilities** (qs 6.16.0, body-parser 2.3.0 via workspace overrides; **#90 → `d74858a`**, run `34327246072`)

**Do not re-open, re-litigate, or re-implement any of the above.** If something here looks wrong, that's a bug report against a specific commit, not a new tranche.

---

## 1. Dependency map (why this order)

```
[Owner one-word decisions] ─── unblocks ──▶ [C1 admin failover, B4 client naming, F1 materials]
        (no other dependency)

[Credential hygiene check] ─── independent, do first, blocks nothing, blocked by nothing

[Founder evidence access] ─── unblocks ──▶ [Evidence capture ×4] ─── auto-unblocks ──▶ [Home windows,
                                                                                          Chamber plates,
                                                                                          Operator sections,
                                                                                          A5 hospitality
                                                                                          reconciliation]

[AT/screen-reader environment] ─── unblocks ──▶ [Final accessibility pass]

[All of the above] ─── unblocks ──▶ [Final full-checklist re-verification] ─── = ──▶ [DEFINITION OF DONE]
```

Three independent tracks (owner decisions, evidence access, AT environment) converge on one final verification gate. Nothing in this roadmap is sequenced arbitrarily — everything downstream of an unblocked item can start immediately; everything downstream of a blocked item waits on the named party, not on more engineering.

---

## 2. Tier 0 — Owner one-word decisions

| # | Item | Action needed | Owner | Status |
|---|---|---|---|---|
| **T0-1** | **Credential hygiene** | Confirm where the authenticated git remote URL used during the #80–#86 autonomous batch came from and whether it was ever written to shell history, logs, or a chat transcript outside a proper credential store. Rotate the PAT if there's any doubt. | You | **DONE 2026-09-09** — audit: token lived only in live-session `.git/config`; absent from repo files and shell history; present in this chat transcript. Old token invalid (401) → rotated by owner; delivery resumed |
| **T0-2** | **F1 — `materials` visibility** | One word: keep hidden (recommended — reveal is a one-line flip later, nothing lost by waiting), reveal now, or deprecate. | You | Open |
| **T0-3** | **C1 — second admin identity** | Provide the actual account id; mechanism is already built and tested. Closes the "one lost account = permanent lockout" risk. | You | Open |
| **T0-4** | **B4 — hospitality client naming** | Written permission (or continued withholding) to name the hospitality client. Currently withheld; no change needed if that stands. | You | Open |
| **T0-5** | **C3 — CI `workflows` permission** | Either grant the connector `workflows` scope, or paste the 4 documented lines yourself (`docs/CI_VERIFY_STEP.md`). Currently deferred by your own prior answer — only revisit if you want it resolved. | You (optional) | Open (optional) |

None of these require engineering time. Each is "a sentence," per the register's own framing.

---

## 3. Tier 1 — The one real P0: evidence capture

This is the actual bottleneck of the entire project. Everything else is either done or waiting on this.

**Current state (verified directly from `evidence.ts`):** MALEK = 7 surfaces, Lara Beauty = 10 surfaces. LENA Dress, Hospitality, Terranex, Kayyal = 0.

**The mechanism is fully built and turnkey** — `docs/EVIDENCE_CAPTURE_GUIDE.md` documents the process; `evidence.ts`'s schema is proven at 2-product scale; `windowFor()` (Home cards + Frontage windows) and the Chamber evidence-plate renderer are both **generic** — they light up automatically the moment an entry exists in the registry. No code changes are needed per product; only real captures.

| # | Tranche | Blocked by | What happens automatically once unblocked |
|---|---|---|---|
| **T1-1** | LENA Dress evidence capture | Founder access/time | Card window + Frontage window lit + Chamber plates rendered + operator record gained (B-10 scaffold ready) |
| **T1-2** | Hospitality evidence capture | Founder access/time | Same, **plus**: closes the A5 code/register discrepancy — hospitality can only carry a real "in real use" public signal once evidence backs it |
| **T1-3** | Terranex evidence capture | Founder access/time | Same |
| **T1-4** | Kayyal evidence capture | Founder access/time | Same |

**Sequencing note:** do these one at a time, one PR per product (established pattern), not as a batch — each is independently verifiable and independently valuable the moment it lands; there's no reason to hold all four for a single release.

**Recommended order:** Hospitality first if practical — it's the only one that also resolves an existing register/code inconsistency (A5 answered "in real use" in 2026-08-20, but `systems.ts` correctly withholds that claim publicly until evidence exists). Otherwise, whichever the founder can access soonest.

---

## 4. Tier 2 — Automatically unblocked by Tier 1 (no separate engineering tranche)

These aren't separate work items — they're consequences of evidence landing, already coded to trigger correctly:

- **HOME-R2** — Home card evidence windows for the 4 remaining products: automatic (`windowFor` is generic)
- **Frontage window lighting** for the 4 remaining products: automatic (same evidence source as the cards)
- **Chamber evidence plates** for the 4 remaining products: automatic (same registry-driven renderer used by MALEK/Lara Beauty)
- **A5 hospitality reconciliation**: automatic the moment hospitality evidence lands — no code change, the internal `stage` field already exists, only the evidence-gate decides what's public

| # | Item | Status | Trigger |
|---|---|---|---|
| **T2-1** | **B10 — Operator section per product page** ("who exactly runs this day to day") | **Scaffold DONE (#88 → `0135c0c`)** — evidence-gated content module (`features/world/content/operator.ts`) + ledger-grammar chamber section on MALEK/Lara Beauty, verbatim from the B2 register, open D6 aspects declared honestly; 6 contract tests. **Per-product operator records for the remaining four systems** depend on Tier 1 (record added in the same tranche as each product's evidence) | Scaffold delivered; per-product content completion depends on Tier 1 |

---

## 5. Tier 3 — Owner/business-triggered, not currently blocking

Not on the critical path. Act on these when their trigger condition is met, not before.

| # | Item | Trigger |
|---|---|---|
| **T3-1** | D2 — legal review of the six privacy questions | Before actively marketing to the English-speaking market — not before general launch |
| **T3-2** | B13 — pagination for `inquiries.list` | At ~500 inquiries; deliberately deferred until then |
| **T3-3** | C2 — SMTP credentials | Whenever you want the notification email to actually fire; dashboard remains the reliable source until then |
| **T3-4** | C4 — AI draft translation | Already answered **no** — re-open only if you change your mind; not a pending action |

---

## 6. Tier 4 — Genuinely tooling-blocked

| # | Item | Blocked by | Status |
|---|---|---|---|
| **T4-1** | Assistive-technology (screen reader) accessibility pass | No AT-capable environment available in any sandbox used on this project | Automated layer (axe-core, WCAG 2.x A/AA, CI-enforced) is done and is the strongest available substitute; this row is the one remaining manual/human-side check |
| **T4-2** | Low-end device performance measurement | Same — no device/tooling available | Deferred; revisit if a real performance complaint surfaces or before a push to a bandwidth-constrained market |

These aren't "blocked forever" — they're blocked on a resource nobody in this engagement has had access to. If you have a screen-reader user or a low-end test device available to you directly, T4-1 in particular is worth closing out; it's the last piece of the accessibility Definition-of-Done line.

---

## 7. Tier 5 — Final gate

**T5-1 — Final full-checklist re-verification.** Once Tier 0–1 owner items and Tier 1 evidence are resolved (T4 can remain open per below — see DoD note), run one last complete pass: typecheck, full test suite, `verify-all`, guardian static integrity, smoke, safety, guardian visual across every surface/locale/theme, and a fresh independent read of the actual diffs and baseline images for whatever landed last — same rigor as every tranche in this engagement, not a rubber stamp.

---

## 8. Definition of Done

The platform is done when:

1. **All six public systems have real evidence at MALEK/Lara Beauty parity** (Tier 1 complete)
2. **`materials` has an explicit, recorded visibility decision** (T0-2)
3. **C1 and B4 are resolved** — no standing single-point-of-failure on admin access, no ambiguity on client naming (T0-3, T0-4)
4. **Hero visual and copy share one register** — ✅ already true (PR #74)
5. **Every guardian/verify contract is green on `main`** — ✅ already true, re-confirmed at each tranche
6. **No committed documentation contradicts the current codebase** — ✅ already true (PR #75, PR #76 doc corrections; re-confirmed after #87/#88)
7. **All Chambers audited to MALEK's standard** — ✅ already true (PR #77)
8. **Automated WCAG 2.x A/AA layer green in CI** — ✅ already true (PR #78)
9. **The credential-hygiene question is closed** (T0-1) — ✅ closed 2026-09-09 (token rotated)

**Explicitly NOT required for Definition of Done, tracked separately instead:** the assistive-technology screen-reader pass (T4-1) and low-end device performance (T4-2). Both are real gaps, both are honestly recorded as tooling-blocked rather than silently dropped, and both should be revisited the moment the blocking resource becomes available — but making the whole platform's completion hostage to two items nobody in this engagement has had the tools to close would leave "done" permanently unreachable for reasons unrelated to the product's actual quality. Recommend tracking T4-1/T4-2 as a standing post-launch line item, not a completion blocker.

---

## 9. Execution checklist (flat, trackable)

**Tier 0 — owner one-word decisions:**
- [x] T0-1 — Credential hygiene closed (audited; token rotated 2026-09-09)
- [ ] T0-2 — Answer F1 (`materials` visibility)
- [ ] T0-3 — Provide C1 (second admin account id)
- [ ] T0-4 — Confirm B4 (hospitality client naming — withheld unless you say otherwise)
- [ ] T0-5 — (Optional) C3 — grant CI `workflows` permission or paste the 4 lines yourself

**The one real P0 (Tier 1 — sequence one at a time):**
- [ ] T1-1 — LENA Dress evidence capture → PR → verify
- [ ] T1-2 — Hospitality evidence capture → PR → verify (also resolves A5)
- [ ] T1-3 — Terranex evidence capture → PR → verify
- [ ] T1-4 — Kayyal evidence capture → PR → verify

**Automatic once Tier 1 lands (Tier 2 — no separate PR needed except T2-1):**
- [x] T2-1 — Operator section scaffold DONE (#88 → `0135c0c`); per-product operator records complete automatically per evidence tranche
- [ ] HOME-R2 / frontage windows / chamber plates / A5 — automatic per captured product

**When triggered (Tier 3 — not gating anything, act when the trigger condition is met):**
- [ ] T3-1 — Legal review before active English-market marketing
- [ ] T3-2 — Pagination at ~500 inquiries
- [ ] T3-3 — SMTP credentials, whenever email notification is wanted

**Tooling-blocked (Tier 4 — track, don't block on):**
- [ ] T4-1 — Assistive-technology screen-reader pass (needs AT-capable environment)
- [ ] T4-2 — Low-end device performance check (needs test device)

**Final gate:**
- [ ] T5-1 — Full-checklist re-verification pass (typecheck, tests, verify-all, guardian static + visual + smoke + safety, independent diff/baseline review) once Tier 0 + Tier 1 are closed

---

*Fixed reference document (committed 2026-09-09 after #88). Future tranche reports update against this checklist's item numbers rather than restating scope from scratch.*
