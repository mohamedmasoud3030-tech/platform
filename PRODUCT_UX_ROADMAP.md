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
