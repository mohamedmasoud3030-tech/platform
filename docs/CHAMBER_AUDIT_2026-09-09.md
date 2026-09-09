# Chamber Audit — 2026-09-09

**Scope:** CHAMBER-R1 of the Authoritative Platform PRD (audit of `main` @ `158e8c3`): a dedicated,
per-chamber audit of LENA Dress / Hospitality / Terranex / Kayyal (plus the hidden `materials`) against the
MALEK chamber as the reference implementation.

**Method:** source inspection of the chamber surface `pages/WorldSystem.tsx`, its data authorities
(`content/systems.ts`, `features/world/content/world.ts`, `product-contract.ts`, `product-connections.ts`,
`evidence.ts`), the evidence renderer `OperatingSurfaces.tsx`, the ledger grammar `ledger/format.ts`, the
contract scripts in `tools/`, and the guardian visual spec. No claim below was assumed; every row was checked
against actual repository content at `chore/chamber-audit` head.

**Headline result:** the four undocumented chambers are structurally complete and honest — the leaf is one
generic component fed by canonical records, so every public chamber renders the same full bilingual record
(problem · daily usage · what it runs · who it is for · guarantees · workflow · roots · evidence layer · close
line). The audit found **two real copy defects on shared surfaces**, fixed in this pass, and confirmed the
zero-evidence honesty layer works exactly as designed.

---

## 1. Per-chamber status

| Chamber | Entry | Evidence plates | Ledger seal | Handoff | Sections vs MALEK | Lifecycle vocab in rendered copy | Verdict |
|---|---|---|---|---|---|---|---|
| MALEK (`property`) | 01 | 7 (registry) | موثّق / DOCUMENTED | real (`malek-plus.vercel.app`) | full set | none | reference; note defect fixed (see §2) |
| Lara Beauty (`wellness`) | 02 | 10 (registry) | موثّق / DOCUMENTED | none → "Request this system" | full set | none | reference; shared-note defect was false here — fixed (§2) |
| LENA Dress (`rental`) | 03 | 0 | قيد التوثيق / RECORD PENDING | none | full set | none | **pass** — honest pending record |
| Terranex (`investment`) | 04 | 0 | قيد التوثيق / RECORD PENDING | none | full set | none | **pass** |
| Hospitality (`hospitality`) | 05 | 0 | قيد التوثيق / RECORD PENDING | none | full set | none | **pass** |
| Kayyal (`recycling`) | 06 | 0 | قيد التوثيق / RECORD PENDING | none | full set | none | **pass** |
| `materials` (hidden) | — | 0 | — | — | no public chamber (registry cannot resolve it; unknown ids redirect to `/world`) | — | correct; F1 decision open |

Entry numbers derive from the canonical owner `order` (`entryNumberFor`); seals and figure counts derive from the
evidence registry only (`recordStatusFor`, `figureCountFor`) — the internal `stage` (`in-use`/`trial`) never
reaches public copy, confirmed by source and by the `verify-world-chambers.mjs` lifecycle sweep.

## 2. Defects found and fixed

1. **MALEK-specific evidence note on every documented chamber.** The documented-evidence paragraph in
   `OperatingSurfaces.tsx` enumerated one product's capability nouns — "operations, assets, contracts, money,
   maintenance, automation" / «التشغيل، الأصول، العقود، المال، الصيانة، الأتمتة» — and rendered it on **any**
   chamber with evidence, which today means MALEK **and Lara Beauty**. On the wellness chamber the sentence was
   false (no assets/contracts/maintenance plates there). **Fix:** the note is now system-agnostic and true for
   every documented system. New contract assertion keeps it that way.
2. **Hardcoded brand in the product-boundary section.** The "connection boundary" block (rendered only under a
   real `handoff`) said "The real MALEK product opens…" in fixed text. It renders from whichever system owns a
   connection, so a second connected system would silently be called MALEK. **Fix:** the copy interpolates
   `system.name[locale]` — byte-identical on the MALEK chamber today, correct by construction tomorrow. New
   contract assertion guards against reintroduction.

## 3. Confirmed sound (no change needed)

- Zero-evidence chambers render the pending block («لا لوحات في هذا السجل بعد … لا نعرض صورًا مفترضة») instead
  of a fabricated gallery; the leaf still closes its record honestly.
- `product-contract.test.ts` already asserts, for every non-property public system: evidence equals the
  registry, `connection: null`, `handoff: null`, observation `unavailable`. `format.test.ts` pins
  `recordStatusFor` documented/pending per system against the registry.
- `verify-world-chambers.mjs` already sweeps the chamber page, systems content and world metadata for lifecycle
  vocabulary (EN + AR), forbids stage-label tables, requires real evidence assets on disk, and requires reduced
  motion and one-shot (never `infinite`) arrival motion.
- Guardian visual coverage: chamber captured at `/world/property` (desktop + mobile, dark, EN) — baselines
  regenerated for the note change per the standing Visual Baseline Policy (source diff intentional; capture from
  CI Chromium; commit records the CI run id).

## 4. Adjacent resolutions recorded (PRD inventory)

- **WORLD-R1 (ConstellationGraph):** resolved **active** — rendered by `pages/WorldAtlas.tsx` as the atlas
  connectivity scene with `systems` + `locale` props; `verify-constellation-graph.mjs` is its live contract.
  Kept as-is; a rename is optional internal churn with no visitor-visible value (noted, not done).
- **HOME-R3 (cosmic CSS):** removal remains **premature**, confirmed live usages of the old register tokens:
  `.lena-card-glow` on Home's `SystemGrid` cards and Services/related-service cards; `.lena-visual-orb` in the
  projects visual scene; the cosmic glass/gradient sheets still style Services and projects surfaces. Recorded —
  these are the remaining old-register surfaces beyond the Chamber scope, a candidate visual-register tranche of
  its own (owner-visible change, not bundled here).

## 5. Content-parity observations (no fabrication)

The four undocumented chambers carry the full bilingual record structure. Remaining differences from MALEK are
**substance, not structure**, and all of it is founder-authored content awaiting founder action: real evidence
plates (P0 evidence capture, owner-access-blocked) and optional copy depth (e.g. `tagline` exists on property
only). None of these gaps can be closed by engineering without violating the evidence/authenticity contract, so
they are recorded here rather than "fixed".
