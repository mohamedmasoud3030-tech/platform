import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");

/**
 * House Ledger tranche — the World constellation scene is retired, so the
 * "portal choreography" surfaces (.lena-world scene, is-portal CSS) are gone.
 * What survives and must be guarded:
 *   1. WorldPortalTransition stays the single owner of every chamber exit,
 *      including its scene-less fallback (plain descend navigation);
 *   2. the shared spatial runtime keeps single-flight + reduced-motion
 *      behaviour for arrival intent;
 *   3. the ledger stylesheet loads last, so record surfaces win cleanly.
 */
const transition = read("artifacts/lena/src/features/world/WorldPortalTransition.tsx");
const worldPage = read("artifacts/lena/src/pages/World.tsx");
const index = read("artifacts/lena/src/features/world/ledger/LedgerIndex.tsx");
const card = read("artifacts/lena/src/features/world/ledger/LedgerEntryCard.tsx");
const runtime = read("artifacts/lena/src/lib/spatial/runtime.ts");
const tokens = read("artifacts/lena/src/lib/spatial/tokens.ts");
const lenaCss = read("artifacts/lena/src/lena.css");
const analytics = read("artifacts/lena/src/lib/analytics/events.ts");

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

console.log("\n== LENA World arrival / spatial-continuity contract ==\n");

check("the World index is a register, not a constellation scene", () => {
  assert.match(worldPage, /import LedgerIndex from/);
  assert.match(worldPage, /<LedgerIndex/);
  assert.doesNotMatch(worldPage, /WorldScene|\.lena-world-entity|\.lena-world-core|\.lena-world-list-link/);
});

check("every chamber exit belongs to one owner: the portal transition", () => {
  // The page binds the transition once and hands it to every entry card.
  assert.match(worldPage, /const enterPortal = useWorldPortalTransition\(\)/);
  assert.match(
    worldPage,
    /onEnter=\{\(destination, systemId, event\) => enterPortal\(destination, systemId, event\)\}/,
  );
  assert.match(index, /onEnter: LedgerEnterHandler/);
  // Cards never navigate themselves.
  assert.doesNotMatch(card, /useNavigate|useWorldPortalTransition/);
  assert.match(card, /onEnter\(/);
});

check("scene-less arrival falls back to plain descend navigation", () => {
  assert.match(transition, /if \(!world\)/);
  assert.match(transition, /fallback\(\)/);
  assert.match(transition, /buildSpatialState\(\{ origin: "\/world", intent: "descend", systemId \}\)/);
  assert.match(transition, /navigate\(destination, \{\s*state: buildSpatialState/s);
  assert.doesNotMatch(transition, /fromWorldPortal:\s*true/);
});

check("native navigation is prevented so arrival has one owner", () => {
  assert.match(transition, /if \(event\) event\.preventDefault\(\)/);
  assert.match(transition, /spatialRuntime\.run/);
  assert.doesNotMatch(transition, /inFlight\.current/);
  // Single-flight lives in the shared spatial runtime, not a local ref.
  assert.match(runtime, /if \(active\) return null/);
});

check("reduced motion navigates without cinematic delay", () => {
  assert.match(transition, /reducedMotion: reduced/);
  assert.match(runtime, /prefers-reduced-motion:\s*reduce/);
  assert.match(runtime, /if \(reduced && options\.action\)/);
  assert.match(tokens, /export const reducedBeat = 90/);
  // Reduced path must return before movement classes are applied.
  const reducedBlock = runtime.slice(runtime.indexOf("if (reduced && options.action)"));
  assert.match(reducedBlock, /return handle/);
  assert.doesNotMatch(
    reducedBlock.slice(0, reducedBlock.indexOf("return handle")),
    /enterPhase\("preparing"\)/,
  );
});

check("View Transitions enhance the final handoff with a CSS fallback", () => {
  assert.match(runtime, /doc\.startViewTransition/);
  assert.match(runtime, /if \(vt\.supported\)/);
  assert.match(runtime, /promise\.finished/);
});

check("the ledger stylesheet loads last, after every sheet it must beat", () => {
  const order = lenaCss;
  const after = ['"./styles/spatial-continuity.css"', '"./styles/responsive.css"'];
  const ledger = order.indexOf('"./styles/ledger.css"');
  assert.ok(ledger >= 0, "ledger.css import missing");
  for (const name of after) {
    const at = order.indexOf(`@import ${name}`);
    assert.ok(at >= 0 && at < ledger, `ledger.css must load after ${name}`);
  }
  // Retired scene sheets are gone.
  for (const name of ["world-v2.css", "world-portal.css", "world-chamber.css", "world-evidence.css", "world-inner.css"]) {
    assert.doesNotMatch(order, new RegExp(name), `${name} must be retired`);
  }
});

check("chamber arrival is a record act, defined only in the ledger sheet", () => {
  const ledger = read("artifacts/lena/src/styles/ledger.css");
  assert.match(ledger, /\.ledger-leaf\.is-opening/);
  assert.match(ledger, /@keyframes ledger-leaf-open/);
  assert.match(ledger, /prefers-reduced-motion:\s*reduce/);
  assert.match(ledger, /animation:\s*none\s*!important/);
  assert.doesNotMatch(ledger, /\burl\(/);
});

check("analytics recognises World as a first-class route family", () => {
  assert.match(analytics, /case "world":/);
});

console.log(failures === 0 ? "\nALL CHECKS PASSED\n" : `\n${failures} FAILED\n`);
process.exit(failures ? 1 : 0);
