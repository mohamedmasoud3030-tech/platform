# LENA Digital House — Support Runbook

Operational reference for whoever maintains this system. Every entry below was verified against the
code at commit `4a1bad8` or later. **If behaviour changes, this file changes in the same pull request.**

Terminology used consistently across the product, the help page and this runbook:

| Term (AR) | Term (EN) | Means |
|---|---|---|
| استفسار | inquiry | A row in `inquiries`, created by the public form only |
| مشروع | project | A row in `projects`, shown publicly only when `status = published` |
| مسار | track / service | One of the eight entries in `content/services.ts` (static, not database-driven) |
| المصدر | source | Entry context of an inquiry: `contact`, `service:<id>`, `work:<slug>` |
| رقم المرجع | reference | `#<inquiry id>` for visitors, `LENA-YYMMDD-XXXX` for error/support reports |

---

## 1. Severity, response and escalation

| Severity | Definition | Examples | First response | Escalation |
|---|---|---|---|---|
| **S1 — Critical** | Lead capture is broken, or data/credentials may be exposed | Contact form fails for everyone; dashboard exposes data to non-admins; a secret leaked into the repository or logs | Immediately | Take the affected surface out of service, rotate the affected secret, then diagnose. Never wait for a scheduled window. |
| **S2 — High** | Owner cannot work, or inquiries are invisible | Owner locked out; dashboard cannot load inquiries; notification email silently failing | Same working day | If unresolved within one working day, disable the failing path and post a plain-language notice on the contact page. |
| **S3 — Normal** | A feature misbehaves with a workaround | Upload rejects a file; a project will not publish; wrong text | Within one business day (matches the public promise) | Batch into the next change. |
| **S4 — Low** | Cosmetic or content | Typo, spacing, outdated wording | Next scheduled change | — |

**Security, personal-data and payment issues are always S1 regardless of blast radius.** There is no
payment surface in this product today; if one is ever added, it inherits S1 by default.

Rules that never bend:
- Never ask a user for a password, token, OTP or session cookie. No support flow in this product ever needs one.
- Never paste an inquiry's contents, a visitor's email or phone number into an external tool or chat.
- Rotate `APP_SECRET` and every user is signed out — this is the intended lockout kill-switch.

---

## 2. Runbook entries

### R1 — "The contact form is broken" (S1 if reproducible for everyone)

1. Check the API is alive: `GET /api/healthz` → `{"status":"ok"}` and `GET /api/trpc/ping`.
2. Reproduce with a real submission. Read the tRPC error code, not the UI text:
   - `TOO_MANY_REQUESTS` → **not a bug.** Five inquiries per hour per network (`INQUIRY_RATE_LIMIT_MAX_ATTEMPTS`). The visitor's own network is rate limited; WhatsApp is unaffected.
   - `BAD_REQUEST` → the honeypot or the 1.5-second minimum completion time rejected it, or a field failed validation (name ≤ 255, message ≤ 5000, `source` must match `contact|service:<id>|work:<slug>`).
   - `INTERNAL_SERVER_ERROR` with "Inquiry rate limiting is not configured" → `INQUIRY_RATE_LIMIT_SECRET` is missing in production. **This blocks every inquiry.** Set it and redeploy.
   - Anything else → check the database connection.
3. While diagnosing, the visitor path is not dead: WhatsApp and email are on every page.

### R2 — "I am not receiving inquiry notification emails" (S2)

Verified behaviour: `sendNewInquiryNotification` returns silently after a `console.warn` when
`SMTP_USER` or `SMTP_PASS` is unset, and failures are caught and logged only. **The inquiry is still
saved.** The dashboard is the source of truth, not the inbox.

1. Confirm the inquiry exists in the dashboard. If yes, this is a notification problem, not data loss.
2. Check `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`, `NOTIFY_EMAIL` on the server.
3. Look for `[mailer]` lines in the server log: "SMTP credentials not configured" (unset) or "Failed to send notification" (rejected by the provider).
4. Until fixed, tell the owner plainly: check the dashboard daily; email is not currently a reliable trigger.

### R3 — "The owner cannot sign in" (S2, S1 if permanent)

1. Which message appears on `/login`? Each maps to one cause:
   `cancelled` (declined at the provider) · `provider` (provider refused) · `incomplete` (missing code/state) · `expired` (state cookie expired or mismatched — usually a slow or reopened tab) · `failed` (token exchange or profile fetch failed) · `unavailable` (`APP_ID`/`APP_SECRET`/`KIMI_AUTH_URL`/`KIMI_OPEN_URL` missing).
2. Signed in but everything says "no access"? The account authenticated but is `role = user`. Admin is granted only when the provider's `user_id` equals `OWNER_UNION_ID`. Verify that value.
3. **Known single point of failure:** one identity, one provider, no fallback. See `FEATURE_GAP_STRATEGY.md` §B1. Widening `OWNER_UNION_ID` to an allowlist is the smallest safe fix and needs owner approval.

### R4 — "A project does not appear on the site" (S3)

In order of likelihood: status is still `draft` (visitors see `published` only) · the page was cached
in the browser (hard refresh) · the slug was changed after sharing, so the old link 404s · the project
exists but has no cover image, so it renders without a visual. Nothing here requires a deployment.

### R5 — "Media upload fails" (S3)

Verified limits: JPG, PNG, WebP, GIF, AVIF, MP4, WebM, OGV — max **100MB** per file.

| Response | Meaning | Action |
|---|---|---|
| `415` | Unsupported file type | Convert the file |
| `413` | Over 100MB | Compress it |
| `400` | Empty or unreadable file | Re-export it |
| `503` | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing | Configure storage; meanwhile paste an external image URL |
| `401` / `403` | Session expired, or the account is not admin | Sign in again; see R3 |

### R6 — "The dashboard shows a load error" (S2)

The owner now sees plain language and a retry button. Behind it: the API is unreachable, or
`DATABASE_URL` is wrong, or migrations were never applied. Confirm with `/api/healthz`, then check
that `inquiries`, `projects`, `content_entries`, `users` and `inquiry_rate_limits` exist.

### R7 — "The page is blank / an error reference appeared" (S2)

The error boundary shows `LENA-YYMMDD-XXXX` and keeps the full error in the browser console only.
Ask for the reference, the route and the app version shown on screen — never a screenshot of an
inquiry's contents. Reproduce on the same route, then read the console.

### R8 — "A visitor asks to delete their inquiry" (S2 — personal data)

1. Verify the request comes from the same channel or reference as the original inquiry.
2. Delete the specific row from the dashboard. `inquiry_rate_limits` holds only a salted HMAC of the network address and expires after 30 days; it contains nothing identifying and needs no action.
3. Confirm in writing that the record is deleted.

---

## 3. Freshness tests

Run these whenever the interface, limits or messages change. If any fails, the help content is wrong:

1. Every upload limit quoted in `content/help.ts` and `AdminSupport.tsx` matches `PROJECT_MEDIA_MAX_BYTES` and `PROJECT_MEDIA_MIME_EXTENSIONS`.
2. The rate limit quoted to visitors matches `INQUIRY_RATE_LIMIT_MAX_ATTEMPTS` and its window.
3. Every status name in the dashboard help matches `INQUIRY_STATUS_VALUES`.
4. Every `link.to` in `content/help.ts` resolves to a route registered in `App.tsx`.
5. Each `?error=` value produced by `oauth.ts` has a matching sentence in `Login.tsx`.
6. The published reply-time promise appears identically on `/contact` and `/help`.
7. No help text mentions a feature that does not exist (search `content/help.ts` for anything not in the router).

---

## 4. Language addressing (added with M1)

Every public page lives under a language segment: `/ar/...` and `/en/...`.

- **Priority:** the URL wins, then the visitor's stored choice, then the device language, then English.
- **Old links keep working.** An unprefixed path such as `/services` is moved client-side to the
  visitor's language, preserving the query string and hash. Nothing 404s.
- **Never prefixed:** `/api/*`, `/assets/*`, `/robots.txt`, `/sitemap.xml`, and the icon files.
- **Switching language** rewrites only the language segment, so the visitor stays on the same page.
- **Search engines** receive a self-canonical plus `hreflang` alternates for both languages and
  `x-default` pointing at English; the sitemap lists both versions with mutual alternates.
- **Admin routes** are `noindex` and deliberately emit no alternates.

Freshness test: `sitemap.xml` must contain exactly twice the number of public routes, and every
`<loc>` must begin with a supported language segment.

---

## 5. Measurement and retention (added with the counters)

**Aggregate counters.** `analytics_daily` holds `(day, event, route shape, locale, dimension, count)`.
There is no identifier, no address and no session, so no row describes a person. Reading is admin-only
(`analytics.summary` for the three dashboards, `analytics.raw` for the underlying counters). Writing is
public because visitors are anonymous; the server validates every field against closed vocabularies and
silently ignores anything else. Counters are directional, not forensic — never use them adversarially.

**Retention.** Nothing runs on a schedule. To apply the policy:

1. `operations.retentionPreview` — reports the window, cutoff and how many records would be affected.
   It changes nothing.
2. `operations.applyRetention` — requires the exact word `ANONYMISE` and a written reason. It clears
   name, email, phone and message on records older than `INQUIRY_RETENTION_MONTHS` (default 24) and
   leaves the row, its status, its dates and its entry context intact. The run is audited.

**Audit immutability.** `admin_audit_events` rejects `UPDATE` and `DELETE` at the database level. If a
legitimate correction is ever needed, append a new corrective event — never rewrite an old one.

---

<!-- دُمج من docs/CI_VERIFY_STEP.md في توحيد 2026-10-21 -->

# CI verification contract

The `validate` job on `pull_request` and `push` to `main` runs the same
critical verification developers are expected to trust locally:

1. `pnpm run typecheck`
2. `pnpm test`
3. `pnpm run build`
4. `pnpm run verify`
5. Guardian static asset integrity

`pnpm test` runs the LENA package tests. CI uses Node 24, which is required
for the `--experimental-strip-types` suite.

`pnpm run verify` runs the architecture suites in `tools/verify-all.mjs`.
The admin-authorization suite reports SKIPPED when no API is listening on
`127.0.0.1:8080`. That skip is intentional: CI must not turn a missing
database into a false pass, and it must not fail the public contract because
a private API is absent.

Guardian browser + visual remains a `pull_request` job after `validate`.
Do not refresh visual baselines unless the rendered result is the intended
canonical UI.

---

<!-- دُمج من docs/EVIDENCE_CAPTURE_GUIDE.md في توحيد 2026-10-21 -->

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
