# Goal and north star

## What the owner said, on 2026-10-19

> "عاوز كلممه ديمو تجبربي بالكامل باسرع وقت مثل الي اتختطله في اول مراجع للمنصه المشابهه و الوثائق الي
> اتكتيت بمحتويات البرامج وصفحاتهم"

In plain terms: **a complete, clickable demo, as fast as possible** — the thing the first platform reviews
and the product documents described: the catalogue of programs and their pages, browsable and working.

Not "Phase 1 in production". Not "all six products tidy". A demo a stranger can click through and
understand what the business sells.

## What "complete demo" means concretely (as understood 2026-10-19)

The catalogue already exists as content in the prototype and in the offerings registry. On 2026-10-19 the
counts were:

- **7 systems** — `pos`, `inventory`, `restaurant`, `clinic`, `hr`, `courts`, `admin`
- **7 sites** — `courts`, `restaurant`, `clinic`, `realestate`, `gym`, `mobile`, `fashion`
- **5 Windows programs** — `pos`, `inventory`, `restaurant`, `clinic`, `hr`, shown as "coming soon"

Source: `nilesys@364b51f`, `docs/PRODUCT_PLAN.md` §2, which takes the catalogue from
`prototypes/nilesys/public/assets/js/home.js` at `nilesys@e74167b`.

So the demo is **19 tiles**, of which the 5 Windows ones are honestly marked "not yet".

## The tension this creates, recorded so it is not rediscovered

The owner's other recorded decision (2026-10-18, `platform` session handoff) was *"one product, not six"* —
because a solo owner spread across six products finishes none of them. **A 19-tile demo is the opposite
shape**: breadth, not depth.

Both can be true at once, and this is the reconciliation written down on 2026-10-19:

- The demo is **breadth done honestly** — it shows what exists and labels what does not. It is a sales
  instrument, not a product.
- The product is **depth in one vertical** — Kayyal/POS, which is the only one with engine work behind it.

The demo must therefore never claim a tile works when it does not. That is the same rule as
`AGENTS.md` invariant 5 in `nilesys` (never invent product evidence), applied to a marketing surface.

## What is not yet known

- Whether the demo lives inside the LENA site (`platform`) or is served by `nilesys` over API. On
  2026-10-19 the recorded owner decision D-F was: **the marketing site is part of the LENA site in
  `platform`** (`nilesys@364b51f`, ADR-0013), with `nilesys` serving readiness, leads and demo links over
  HTTP. **Where the seven system sites live is still OPEN.**
- Whether the demo needs real per-tile databases. The current demo accounts are seeded
  (`engines/platform/src/demo-seed.ts` at `nilesys@364b51f`); a clickable demo may not need more.
