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
