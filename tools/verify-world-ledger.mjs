import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");

const worldPage = read("artifacts/lena/src/pages/World.tsx");
const leaf = read("artifacts/lena/src/pages/WorldSystem.tsx");
const index = read("artifacts/lena/src/features/world/ledger/LedgerIndex.tsx");
const card = read("artifacts/lena/src/features/world/ledger/LedgerEntryCard.tsx");
const seal = read("artifacts/lena/src/features/world/ledger/LedgerSeal.tsx");
const format = read("artifacts/lena/src/features/world/ledger/format.ts");
const css = read("artifacts/lena/src/styles/ledger.css");
const lenaCss = read("artifacts/lena/src/lena.css");

let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`  PASS  ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${name}\n        ${error.message}`);
  }
};

console.log("\n== LENA World ledger (دفتر البيت) contract ==\n");

check("World is the register index: six entries in owner order, one house", () => {
  assert.match(worldPage, /six real operating systems in one house|ستة أنظمة تشغيل حقيقية في بيت واحد/);
  assert.match(index, /entities\.map/);
  assert.match(index, /registerTotalsLabel\(locale\)/);
});

check("every entry derives its number from the canonical owner order", () => {
  assert.match(format, /entryNumberFor/);
  assert.match(format, /ledgerPad\(order, 2, locale\)/);
  // The canonical order field flows into the number at the call site.
  assert.match(leaf, /entryNumberFor\(system\.order, locale\)/);
  assert.doesNotMatch(format, /Math\.random|Date\(/);
});

check("the seal states documentation, never lifecycle", () => {
  assert.match(format, /LedgerRecordStatus = "documented" \| "pending"/);
  assert.doesNotMatch(format, /"(?:live|beta|forming)"|'(?:live|beta|forming)'/);
  assert.match(seal, /role="status"/);
  assert.match(seal, /ledger-seal is-\$\{status\}/);
  assert.match(seal, /documented = solid brass square dot \+ solid frame/);
  assert.match(seal, /pending = hollow dot \+ dashed frame/);
});

check("figure counts are evidence-derived and never hardcoded", () => {
  assert.match(format, /figureCountFor/);
  assert.match(format, /evidenceFor\(systemId\)\?\.length \?\? 0/);
  assert.match(card, /figureCountLabel\(count, locale\)/);
  assert.match(css, /ledger-figcount/);
});

check("figure numbering is deterministic and localised (الشكل ٠١)", () => {
  assert.match(format, /figureLabel/);
  assert.match(format, /ar[\s\S]{0,600}?[٠-٩]/);
  assert.match(format, /ARABIC_INDIC/);
  assert.match(css, /ledger-plate-num/);
});

check("the register is honest about systems without evidence", () => {
  assert.match(card, /ledger-nofigure/);
  assert.match(format, /RECORD PENDING|قيد التوثيق/);
  assert.match(css, /ledger-nofigure/);
  // Only the evidence-bearing branch of the card renders an image preview.
  assert.match(card, /\{first \? \(/);
  assert.match(card, /<figure className="ledger-preview"/);
});

check("remembered entries are quietly marked, never announced as state", () => {
  assert.match(card, /is-remembered/);
  assert.match(index, /rememberedSystemId/);
});

check("record surfaces carry no sacred-core or scene artifacts", () => {
  assert.doesNotMatch(worldPage, /\.lena-world-core|\.lena-inner-|\.lena-house|lena-sacred-core/);
  assert.doesNotMatch(leaf, /\.lena-inner-|\.lena-world-core|lena-sacred-core/);
});

check("the ledger stylesheet is scoped, honest, and motion-restrained", () => {
  assert.match(css, /\.ledger-scope/);
  assert.match(css, /\.ledger-entry/);
  assert.match(css, /\.ledger-leaf/);
  assert.match(css, /\.ledger-plates/);
  // Two surfaces only: ink sheet + paper. One brass seal accent.
  assert.doesNotMatch(css, /linear-gradient|radial-gradient|backdrop-filter|box-shadow:\s*0 0 \d+px \d+px/);
  assert.doesNotMatch(css, /\binfinite\b/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /url\(|data:image|background-image/);
});

check("Arabic-Indic digits and RTL binding margins are structural", () => {
  assert.match(format, /toLedgerDigits/);
  assert.match(css, /inset-inline/);
  assert.match(css, /\[dir="rtl"\]/);
});

check("the ledger sheet loads after every sheet it must beat", () => {
  const ledger = lenaCss.indexOf('@import "./styles/ledger.css"');
  assert.ok(ledger >= 0, "ledger.css import missing");
  for (const name of ["responsive.css", "spatial-continuity.css", "world.css", "sacred-core.css"]) {
    const at = lenaCss.indexOf(`@import "./styles/${name}"`);
    assert.ok(at >= 0 && at < ledger, `ledger.css must load after ${name}`);
  }
});

console.log(failures === 0 ? "\nALL CHECKS PASSED\n" : `\n${failures} FAILED\n`);
process.exit(failures ? 1 : 0);
