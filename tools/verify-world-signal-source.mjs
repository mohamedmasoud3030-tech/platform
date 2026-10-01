#!/usr/bin/env node
/**
 * Authorized world-signal source contract.
 *
 * World Command may only become live through one path: a founder-authorized
 * product endpoint, read by the server adapter, validated on both sides of the
 * wire, and hydrated into a store that cannot mutate. These checks exist so a
 * later change cannot quietly reopen the three ways that promise breaks:
 *
 *   1. fabricated data (fixtures, demo signals, a seeded production store);
 *   2. fabricated calm (an unobserved world reported as `quiet`);
 *   3. fabricated authority (a write path, or a source the room cannot verify).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");

const runtime = read("artifacts/lena/src/features/world/signals/runtime.ts");
const derive = read("artifacts/lena/src/features/world/signals/derive.ts");
const transport = read("artifacts/lena/src/features/world/signals/transport.ts");
const provider = read("artifacts/lena/src/features/world/signals/SignalRuntimeProvider.tsx");
const barrel = read("artifacts/lena/src/features/world/signals/index.ts");
const bridge = read("artifacts/lena/src/features/world/signals/WorldSignalSourceBridge.tsx");
const command = read("artifacts/lena/src/features/world/command/WorldCommand.tsx");
const main = read("artifacts/lena/src/main.tsx");
const contract = read("artifacts/api-server/src/lib/world-signals/contract.ts");
const source = read("artifacts/api-server/src/lib/world-signals/source.ts");
const router = read("artifacts/api-server/src/trpc/routers/world-signals.ts");

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

function walk(dir, files = []) {
  for (const entry of readdirSync(resolve(ROOT, dir))) {
    const full = join(dir, entry);
    if (statSync(resolve(ROOT, full)).isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) files.push(full);
  }
  return files;
}

console.log("\n== LENA World signal source authority ==");

check("the production store starts seedless and unavailable", () => {
  assert.match(runtime, /export const worldSignalStore = createSignalStore\(\);/);
  assert.match(runtime, /seed: WorldSignal\[\] = \[\]/);
  assert.doesNotMatch(runtime, /DEMO_SIGNALS|fixtures/);
});

check("hydration is total, read-only, and refuses mutation authority", () => {
  assert.match(runtime, /if \(snapshot\.source\.writable\) return;/);
  assert.match(runtime, /snapshot\.source\.availability === "available"/);
  assert.match(runtime, /: \[\]/);
});

check("only the transport module may hydrate the store", () => {
  const callers = walk("artifacts/lena/src").filter(
    (file) =>
      read(file).includes("worldSignalStore.hydrate(") &&
      !file.endsWith("features/world/signals/transport.ts"),
  );
  assert.deepEqual(
    callers.map((file) => relative(ROOT, resolve(ROOT, file))),
    [],
    "hydration must stay behind the validated transport boundary",
  );
});

check("the client never invents an observation", () => {
  assert.doesNotMatch(transport, /DEMO_SIGNALS|fixtures/);
  assert.doesNotMatch(bridge, /DEMO_SIGNALS|fixtures/);
  assert.match(transport, /export function applyWorldSignalSnapshot/);
  assert.match(transport, /unavailableSignalSource\("invalid-payload"\)/);
  assert.match(transport, /export function markWorldSignalSourceUnreachable/);
});

check("the client owns the world registry and the chamber paths", () => {
  assert.match(transport, /import \{ WORLD_ENTITIES, worldPathFor \} from "\.\.\/content\/world"/);
  assert.match(transport, /WORLD_IDS\.has\(world\)/);
  assert.match(transport, /record\.targetPath === canonicalPath \? canonicalPath : undefined/);
});

check("an unobserved world can never read as calm", () => {
  assert.match(derive, /coveredWorldIds\?: readonly string\[\]/);
  assert.match(derive, /if \(covered && !covered\.has\(id\)\) \{\s*map\[id\] = "unavailable";/);
  assert.match(provider, /presenceByWorld\(observedSignals, worldIds, source\.coversWorlds\)/);
});

check("the bridge is the single production composition point", () => {
  assert.match(main, /<WorldSignalSourceBridge \/>/);
  assert.match(bridge, /trpc\.worldSignals\.snapshot\.useQuery/);
  assert.match(bridge, /return null;/);
  assert.doesNotMatch(barrel, /WorldSignalSourceBridge/, "the signals barrel must stay transport-free");
});

check("the server adapter is configuration-only — no host is compiled in", () => {
  assert.match(source, /LENA_WORLD_SIGNAL_SOURCE_URL/);
  assert.match(source, /credentials: "omit"/);
  assert.match(source, /redirect: "error"/);
  // No literal host may appear in the adapter or the contract it validates.
  for (const file of ["source.ts", "contract.ts"]) {
    assert.doesNotMatch(
      read(`artifacts/api-server/src/lib/world-signals/${file}`),
      /https?:\/\//,
      `${file} must not carry a hardcoded endpoint`,
    );
  }
});

check("the public read surface cannot mutate anything", () => {
  assert.match(router, /snapshot: publicQuery\.query/);
  assert.match(router, /probe: adminQuery\.query/);
  assert.match(router, /const WRITABLE = false as const;/);
  assert.doesNotMatch(router, /\.mutation\(/);
});

check("a closed room still says which absence it is showing", () => {
  assert.match(command, /function unavailableCopy\(/);
  assert.match(command, /reason === "uncovered-worlds"/);
  assert.match(command, /reason === "no-authorized-product-source" \|\| reason === "not-configured"/);
  assert.match(command, /Live product signals are not connected yet/);
});

console.log(failures === 0 ? "\nALL WORLD SIGNAL SOURCE CHECKS PASSED\n" : `\n${failures} WORLD SIGNAL SOURCE CHECKS FAILED\n`);
process.exit(failures ? 1 : 0);
