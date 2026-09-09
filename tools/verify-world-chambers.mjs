import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");

const app = read("artifacts/lena/src/App.tsx");
const page = read("artifacts/lena/src/pages/WorldSystem.tsx");
const world = read("artifacts/lena/src/features/world/content/world.ts");
const systems = read("artifacts/lena/src/content/systems.ts");
const leafCss = read("artifacts/lena/src/styles/ledger.css");
const lenaCss = read("artifacts/lena/src/lena.css");
const sitemap = read("artifacts/lena/scripts/generate-sitemap.mjs");
const analytics = read("artifacts/lena/src/lib/analytics/events.ts");

const FORBIDDEN_LIFECYCLE = [
  // English lifecycle vocabulary that must not appear on public surfaces.
  /\bDemo\b/i,
  /\bTrial\b/i,
  /\bPrototype\b/i,
  /\bBeta\b/i,
  /\bExperimental\b/i,
  /\bUnder development\b/i,
  /\bComing soon\b/i,
  /\bWork in progress\b/i,
  /\bIn real use\b/i,
  /Demo version/i,
  // Arabic lifecycle vocabulary.
  /نسخة تجريبية/,
  /تحت التطوير/,
  /جاري العمل/,
  /قريبًا/,
  /قيد التجربة/,
  /قيد الاستخدام الفعلي/,
];

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

console.log("\n== LENA World System Chamber (ledger leaf) contract ==\n");

check("a lazy dynamic World chamber route exists", () => {
  assert.match(app, /const WorldSystem = lazy\(\(\) => import\("\.\/pages\/WorldSystem"\)\)/);
  assert.match(app, /path="\/world\/:systemId" element=\{<WorldSystem \/>\}/);
});

check("all six World exits land in canonical chambers", () => {
  for (const id of ["wellness", "rental", "property", "hospitality", "investment", "recycling"]) {
    assert.match(world, new RegExp(`${id}: \\{ state:`));
  }
  assert.match(
    world,
    /export function worldPathFor\(systemId: SystemId\): string \{\s*return `\/world\/\$\{systemId\}`;/s,
  );
  assert.match(world, /return publicSystems\(\)\.map/);
  assert.match(world, /detailPath: worldPathFor\(system\.id\)/);
  assert.doesNotMatch(world, /detailPath:\s*"\/services#/);
  // Chamber routes are derived, never restated per world.
  assert.doesNotMatch(
    world,
    /detailPath:\s*"\/world\/(property|wellness|rental|investment|hospitality|recycling)"/,
  );
});

check("the Chamber resolves facts from the canonical system record", () => {
  assert.match(page, /findWorldEntity\(systemId\)/);
  assert.match(page, /worldSystem\(entity\)/);
  assert.match(page, /system\.problem\[locale\]/);
  assert.match(page, /system\.usage\[locale\]/);
  assert.match(page, /system\.does\[locale\]/);
  assert.match(page, /system\.beneficiaries\[locale\]/);
  assert.match(page, /system\.workflowCycle/);
});

check("invalid system ids return safely to World", () => {
  assert.match(page, /if \(!entity \|\| !system\) return <Navigate to="\/world" replace \/>/);
});

check("public Chamber copy carries no lifecycle status vocabulary", () => {
  for (const pattern of FORBIDDEN_LIFECYCLE) {
    assert.doesNotMatch(page, pattern, `forbidden lifecycle term on the chamber page`);
  }
});

check("no lifecycle label tables are exported for public rendering", () => {
  assert.doesNotMatch(systems, /STAGE_LABEL|STAGE_NOTE/);
  assert.doesNotMatch(world, /WORLD_STATE_LABEL|WORLD_STATE_NOTE|WORLD_ACTION_LABEL/);
});

check("the leaf keeps record grammar derived from canonical data, never hardcoded", () => {
  assert.match(page, /entryNumberFor\(system\.order, locale\)/);
  assert.match(page, /recordStatusFor\(system\.id\)/);
  assert.match(page, /figureCountFor\(system\.id\)/);
  assert.match(page, /ledgerPad\(index \+ 1, 2, locale\)/);
});

check("the Chamber mounts the Operating Surfaces evidence layer", () => {
  assert.match(page, /productContractFor\(system\.id\)/);
  assert.match(page, /<OperatingSurfaces/);
  assert.match(page, /systemId=\{entity\.systemId\}/);
  assert.match(page, /brand=\{system\.name\[locale\]\}/);
  assert.match(
    page,
    /import \{ OperatingSurfaces \} from "@\/features\/world\/components\/OperatingSurfaces"/,
  );
});

check("Operating Surfaces is real-evidence only — never a gallery, never fabricated", () => {
  const component = read("artifacts/lena/src/features/world/components/OperatingSurfaces.tsx");
  assert.match(component, /evidence \?\? evidenceFor\(systemId\) \?\? \[\]/);
  assert.match(component, /total === 0/);
  assert.match(component, /figureLabel/);
  assert.doesNotMatch(component, /Math\.random|Date\(|fetch\(/);
  assert.doesNotMatch(component, /publicSystems\(\)|SYSTEM_EVIDENCE\s*=|new Array/);
  // A system with no evidence yet gets an honest pending record, not a mock.
  assert.match(component, /ledger-plates is-pending/);
});

check("the documented evidence note stays system-agnostic, never one product's nouns", () => {
  const component = read("artifacts/lena/src/features/world/components/OperatingSurfaces.tsx");
  // The note is shared by every documented chamber (property and wellness
  // today). It must not enumerate capabilities that only one system's plates
  // show — e.g. MALEK's assets/contracts/maintenance vocabulary would be
  // false on the wellness chamber.
  assert.doesNotMatch(component, /assets, contracts, money, maintenance/);
  assert.doesNotMatch(component, /الأصول، العقود، المال/);
});

check("a chamber with no evidence yet still closes its record honestly", () => {
  assert.match(leafCss, /\.ledger-plates\.is-pending/);
});

check("the Chamber keeps a calm exit into operating detail and contact", () => {
  assert.match(page, /to=\{`\/services#\$\{system\.id\}`\}/);
  assert.match(page, /to=\{`\/contact\?service=\$\{system\.id\}`\}/);
  assert.match(page, /ledger-cta/);
});

check("real product handoff is a single explicit boundary, never embedded", () => {
  assert.match(page, /productContract\?\.handoff/);
  assert.match(page, /data-testid="malek-product-handoff"/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /rel="noreferrer"/);
  assert.doesNotMatch(page, /<iframe/);
});

check("the product boundary names the connected system, never a hardcoded brand", () => {
  // The boundary copy renders under handoff for whichever system owns a real
  // connection. Hardcoding "MALEK" here would silently lie the day a second
  // system gains a connection.
  assert.match(page, /يفتح \$\{system\.name\[locale\]\} الفعلي في جلسة مستقلة/);
  assert.match(page, /The real \$\{system\.name\[locale\]\} product opens/);
  assert.doesNotMatch(page, /يفتح MALEK الفعلي في جلسة مستقلة/);
  assert.doesNotMatch(page, /The real MALEK product opens/);
});

check("arrival is one-shot record motion, never continuous", () => {
  assert.match(page, /navState\?\.spatial\.intent === "descend"/);
  assert.match(page, /navState\?\.spatial\.intent === "emerge"/);
  assert.match(page, /"arrival"/);
  assert.match(page, /"return"/);
  assert.match(leafCss, /@keyframes ledger-leaf-open/);
  assert.doesNotMatch(leafCss, /\binfinite\b/);
  // Current write path is typed spatial state. The legacy flag is not produced here.
  assert.doesNotMatch(page, /fromWorldPortal/);
});

check("the leaf carries a deliberate close line: only the documented is entered", () => {
  assert.match(page, /ledger-leaf-close/);
  assert.match(page, /لا يُسجَّل في هذا الدفتر إلا ما هو حقيقي وموثّق|nothing is entered in this register unless it is real and documented/);
});

check("ledger styles load after every sheet they must beat", () => {
  const ledger = lenaCss.indexOf('@import "./styles/ledger.css"');
  assert.ok(ledger >= 0, "ledger.css import missing");
  for (const name of ["responsive.css", "spatial-continuity.css", "world.css"]) {
    const at = lenaCss.indexOf(`@import "./styles/${name}"`);
    assert.ok(at >= 0 && at < ledger, `ledger.css must load after ${name}`);
  }
});

check("reduced-motion removes arrival motion and keeps records present", () => {
  assert.match(leafCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(leafCss, /animation:\s*none\s*!important/);
});

check("public systems generate indexable Chamber sitemap entries", () => {
  assert.match(sitemap, /extractPublicIds\("content\/systems\.ts"\)/);
  assert.match(sitemap, /path: `\/world\/\$\{id\}`/);
  assert.match(sitemap, /path: "\/world\/command"/);
  assert.match(sitemap, /path: "\/world\/atlas"/);
});

check("analytics records a route shape, never the chamber system id", () => {
  assert.match(analytics, /case "world":/);
  assert.match(analytics, /if \(second === "command" \|\| second === "atlas"\) return `\/world\/\$\{second\}`/);
  assert.match(analytics, /return "\/world\/:system"/);
});

check("real evidence assets exist under the canonical system folder", () => {
  const evidence = read("artifacts/lena/src/features/world/content/evidence.ts");
  const publicDir = resolve(ROOT, "artifacts/lena/public");
  const matches = evidence.matchAll(/src:\s*"(\/world\/evidence\/([a-z0-9-]+)\/([^"]+))"/g);
  let count = 0;
  for (const match of matches) {
    const [, src, systemFolder, file] = match;
    assert.match(src, /^\/world\/evidence\/[a-z0-9-]+\/[^/]+$/);
    assert.ok(
      existsSync(resolve(publicDir, "world/evidence", systemFolder, file)),
      `missing evidence asset: ${src}`,
    );
    count += 1;
  }
  assert.ok(count >= 5, `expected at least 5 real surfaces, found ${count}`);
});

check("evidence ids are unique and every surface is alt + capability labelled", () => {
  const evidence = read("artifacts/lena/src/features/world/content/evidence.ts");
  const ids = [...evidence.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate evidence surface ids");
  assert.ok(evidence.includes("alt: {"), "surfaces need alt text");
  assert.ok(evidence.includes("capability: {"), "surfaces need capability copy");
});

check("no public render site still references stage labels", () => {
  for (const file of [
    "artifacts/lena/src/components/SystemGrid.tsx",
    "artifacts/lena/src/pages/Portfolio.tsx",
    "artifacts/lena/src/pages/Services.tsx",
    "artifacts/lena/src/features/world/ledger/LedgerEntryCard.tsx",
    "artifacts/lena/src/features/world/ledger/LedgerIndex.tsx",
    "artifacts/lena/src/pages/WorldSystem.tsx",
  ]) {
    const source = read(file);
    assert.doesNotMatch(source, /STAGE_LABEL|STAGE_NOTE|WORLD_STATE_LABEL|WORLD_STATE_NOTE|WORLD_ACTION_LABEL/);
  }
});

console.log(failures === 0 ? "\nALL CHECKS PASSED\n" : `\n${failures} FAILED\n`);
process.exit(failures ? 1 : 0);
