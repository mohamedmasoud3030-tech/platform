# The feature register — the one document the owner reads

Written **2026-10-21** at the owner's request: *"a dedicated file for the remaining features with their full
properties, containing the current features and their properties, and what still needs development and
visual upgrading."*

## Where it lives, and why there

| Artifact | Path | For |
| --- | --- | --- |
| Readable / printable | `nilesys/docs/product/feature-register.html` | The owner. RTL, self-contained, prints on A4 |
| Same content, plain | `nilesys/docs/product/feature-register.md` | GitHub, searching, copying |
| Generator | `nilesys/tools/build-feature-register.py` | Keeping both honest |

**It is generated, not written by hand.** Every row carries an id (`C-…`, `F-…`, `V-…`), a limit, and the
test that proves it. A hand-maintained register of this size would be wrong within a week, and a document
that is quietly wrong is worse than no document.

## What it contains, with counts as of 2026-10-21

| Section | Items | Form |
| --- | --- | --- |
| Current features | **14 working + 1 partial** (`C-01`…`C-15`) | properties, limits, and the proof for each |
| Remaining features | **17** (`F-01`…`F-17`) | why it matters · full spec · checkable acceptance criteria · dependencies · size · the decision it waits on |
| Visual upgrade | **16** (`V-01`…`V-16`) | "now" vs "target", stated as a measurable standard |
| Owner decisions | **8** | closed ones kept, because they explain why the behaviour is what it is |

## The three findings that came out of writing it

1. **The single largest gap is tax.** Not a nice-to-have: a sale without VAT is not a legal sale in Egypt.
   It touches the receipt, the drawer expectation, the report, and invoicing — which is why it is `F-01`
   and marked *large*, not *small*.
2. **Four features already wait on decisions the owner has not made** — `D-B`, `D-C`, `D-D`, `D-G`. They are
   named in the register next to the feature each one blocks, so a decision can be made against a cost.
3. **The visual work is not taste.** Sixteen items were rewritten as measurable standards (44px touch
   targets, an 8px spacing grid, six type sizes, AA contrast, 80mm print) because "make it look better" is
   un-reviewable and un-finishable.

## Skills used to build it

The owner asked for GitHub skills to be used, not improvised. The relevant public skills were read from
`anthropics/skills` (182k★) before writing a line:

- `frontend-design` — the two-pass rule (design plan, then critique it against the brief), and its list of
  tells to avoid: rounded cards with one shadow, gradient washes, all-caps eyebrows, monospace for small
  labels. The register therefore uses column rules and stamps, not cards and pills.
- `web-artifacts-builder` — the self-contained rule: inline everything, no external CDN, so the file opens
  in a sandboxed preview and on any machine with no network.
- `webapp-testing` — verify by looking: the page was screenshotted in headless Chromium at 1180px and
  390px before it was called done.

## Not done, deliberately

No PDF export yet (the browser's print-to-PDF is exact and needs no dependency). The register is not wired
to the tests — if someone deletes `pos-upgrade.test.js`, the register will still claim 10 passing tests.
That is the register's one real weakness and it is written here rather than hidden.
