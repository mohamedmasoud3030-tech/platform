# Evidence Capture Guide — bringing the four undocumented products to parity

**Purpose:** make a founder capture session turnkey. When access to LENA Dress, Terranex, Hospitality or
Kayyal is available, this guide produces registry-grade evidence in one pass — the exact same rigor as the
MALEK (7 surfaces) and Lara Beauty (10 surfaces) entries already in `evidence.ts`.

Authority: `PLATFORM_PRD.md` EVID-R1/PROD-R1 (P0); registry contract: `verify-world-chambers.mjs` + the
co-located `evidence.test.ts` suites.

---

## 1. The integrity contract (read first — this is the whole point)

- Every image must be a **real capture of the running system** — the actual deployed product, signed into a
  real workspace (a QA/demo workspace is fine and preferred).
- **Nothing is invented, mocked, composited or repurposed.** A mockup or a design-file export presented as a
  real surface is the one unforgivable error in this repository. When in doubt: don't register it.
- Captures may show the owner's real operational data (it is his own business data); avoid publishing third
  parties' personal data (customer names/phones in list rows are acceptable only in the owner's own records —
  prefer blur-free QA data where possible, per `PRIVACY_DATA_GOVERNANCE.md`).
- The registry entry describes **what the surface proves** (a capability), never a lifecycle claim
  (`in-use`/`trial` are internal-only vocabulary and must not appear in alt/capability copy).

## 2. Access checklist per product

| Product | system id | Evidence folder slug | Real system to capture |
|---|---|---|---|
| MALEK (done — reference) | `property` | `malek/` | malek-plus app |
| Lara Beauty (done — reference) | `wellness` | `wellness/` | spa/wellness system |
| LENA Dress | `rental` | `rental/` | showroom/rental system |
| Hospitality | `hospitality` | `hospitality/` | events/hospitality system |
| Terranex | `investment` | `investment/` | investment ops (livestock/agriculture/real estate) |
| Kayyal | `recycling` | `recycling/` | weighbridge app (Arabic, mobile-first) |

*Folder slug is free-form kebab-case; the two existing examples use different conventions (`malek` vs
`wellness`), so any stable slug is fine — it only has to match the `src` path exactly and live under
`artifacts/lena/public/world/evidence/`.*

## 3. Suggested surface set (5–10 per product)

Mirror the depth MALEK/Lara Beauty already have — one entry/sign-in surface + one capture per major
operating capability. Suggested per product (adjust to what actually exists):

- **Common:** sign-in/entry surface.
- **LENA Dress (`rental`):** showroom/stock overview; rental agreement/contract screen; calendar of
  rentals/due returns; customer ledger; payments/pos; reports.
- **Hospitality (`hospitality`):** facility/venue setup; occasions/events board; staffing/shifts if present;
  service orders; invoicing/payments; day summary.
- **Terranex (`investment`):** livestock operation screen; agricultural tracking; real-estate portfolio;
  cash/ledger; reports. Capture what the divisions actually do.
- **Kayyal (`recycling`):** weighbridge purchase entry; sale entry; item/price list; cash box with daily
  close; counterparty balances; numbered receipt (as sent on WhatsApp/printable); daily summary; any
  offline/reversal affordance visible in the UI.

## 4. Capture rules (files)

- PNG preferred (existing entries are `.png`); sharp, readable at plate size; no browser chrome around the
  window unless it is the product's own UI; desktop and (for Kayyal) mobile captures both welcome.
- Aim ≤ ~1.5 MB each. No aspect-ratio requirement — plates letterbox/contain (`object-fit: contain`).
- Filename: kebab-case, semantic, lowercase — e.g. `rentals-calendar.png`, `cashbox-close.png`. No spaces,
  no date stamps, no screen-recorder suffixes.
- Keep RTL surfaces as they naturally render (the app is RTL-native; do not mirror or "fix" them).

## 5. Registry edit (one entry per capture)

File: `artifacts/lena/src/features/world/content/evidence.ts` → add a block under
`SYSTEM_EVIDENCE` for the system id. Exact schema (do not add fields):

```ts
rental: [
  {
    id: "entry",                                    // stable anchor; unique per system
    src: "/world/evidence/rental/entry.png",        // must exist on disk under public/
    alt: {
      ar: "شاشة تسجيل الدخول إلى LENA Dress",
      en: "The LENA Dress sign-in screen",
    },
    capability: {
      ar: "نقطة دخول المعرض: جلسة واحدة تدير المخزون والحجوزات والعملاء.",
      en: "The showroom's entry point: one session runs stock, bookings and customers.",
    },
    // primitive?: "money" — optional cross-reference to an operating root
    // (ids: relationships, time, money, assets, workflow, documents, people,
    // insight, integrity) when the surface demonstrates one root clearly.
  },
  // … one object per capture, ids unique across the file
],
```

Notes: `id` is used for deep links (`/world/<system>#<id>`); `alt` is the accessible description of what the
image actually shows; `capability` says what the surface proves — a fact visible in the capture. Arabic copy
is written first and is the primary language, English mirrors it.

## 6. Verification (run before opening a PR)

```bash
pnpm test                                            # vitest incl. evidence/product-contract suites
node tools/verify-world-chambers.mjs                 # asserts every src exists on disk, ids unique,
                                                     # alt+capability present, assets under canonical folder
```

Then push a branch and let CI run (typecheck/tests/build/verify + the guardian suite incl. the new axe WCAG
layer). The Home evidence window (`windowFor`) and the chamber's Operating Surfaces pick the new evidence up
automatically — **no component code change is expected**; if one is needed, something is wrong. PR boundary
per `PLATFORM_PRD.md` §20: **one product's evidence per tranche**, nothing else bundled. Baseline churn: only
if a guardian-captured surface changes (Home card windows for a new product would change the home baselines →
regenerate from CI Chromium actuals per the Visual Baseline Policy, recording the run id in the commit).

## 7. What NOT to do

- Do not register a product with fewer than its real first capture while calling the chamber "documented" —
  status is derived (`recordStatusFor`), never hand-set.
- Do not remove or reorder MALEK/Lara Beauty entries.
- Do not add `materials` evidence or a public window for it while F1 (visibility decision) is open.
- Do not fabricate a "live" claim from a screenshot: a capture proves the interface exists and runs in a real
  session, nothing more — that is already the strongest claim the site makes.
