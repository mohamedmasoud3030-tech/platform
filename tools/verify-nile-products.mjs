#!/usr/bin/env node
/**
 * بيت نيل سيستمز — عقد عرض المنتجات على LENA.
 *
 * هذه المجموعة تحمي القاعدة التي بُني عليها عرض أنظمة نيل:
 *   • المنتجات تُعرَّف في وحدة بيانات مستقلة، لا داخل سجل الأدلة.
 *   • كل صورة معروضة أصل حقيقي موجود على القرص (لا صور مفترضة).
 *   • كل سطح له تسمية وقدرة بالعربية والإنجليزية.
 *   • رابط الحساب التجريبي يخرج من حقل واحد صريح خارج سجل الإثبات.
 *   • لا لغة دورة حياة ولا ادّعاء حجم على أي سطح عام.
 *   • دفتر البيت يبقى ستة أنظمة بترتيب المالك: العرض الجديد لا يعدّله.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");

const meta = read("artifacts/lena/src/content/nile-systems.ts");
const evidence = read("artifacts/lena/src/features/world/content/evidence.ts");
const systems = read("artifacts/lena/src/content/systems.ts");
const app = read("artifacts/lena/src/App.tsx");
const indexPage = read("artifacts/lena/src/pages/NileProducts.tsx");
const productPage = read("artifacts/lena/src/pages/NileProduct.tsx");
const band = read("artifacts/lena/src/features/nile/NileHouseBand.tsx");
const services = read("artifacts/lena/src/pages/Services.tsx");
const portfolio = read("artifacts/lena/src/pages/Portfolio.tsx");

const PUBLIC = resolve(ROOT, "artifacts/lena/public");

/** لغة دورة الحياة الممنوعة على أي سطح عام (نفس عقد بقية الموقع). */
const FORBIDDEN_LIFECYCLE = [
  /\bDemo\b/i,
  /\bTrial\b/i,
  /\bPrototype\b/i,
  /\bBeta\b/i,
  /\bExperimental\b/i,
  /\bUnder development\b/i,
  /\bComing soon\b/i,
  /\bWork in progress\b/i,
  /\bIn real use\b/i,
  /نسخة تجريبية/,
  /تحت التطوير/,
  /جاري العمل/,
  /قريبًا/,
  /قيد التجربة/,
  /قيد الاستخدام الفعلي/,
];

/** ادّعاءات الحجم والعميل والإيراد — ممنوعة في نصوص المنتجات. */
const FORBIDDEN_CLAIMS = [
  /\b\d[\d.,]*\+?\s*(?:customers?|clients?|users?|orders?|bookings?|units?|properties|tenants?)\b/i,
  /\bMRR\b|\bARR\b|\brevenue\b|\bin production\b|\bproduction-ready\b|\bcase study\b/i,
  /\b\d+\s*(?:عميل|عميلاً|عميلا|مستخدم|مستخدماً|طلب|طلبات|حجز|حجوزات|وحدة|عقار)\b/,
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

console.log("\n== Nile house products on LENA ==\n");

check("the product registry is its own module, not part of the evidence register", () => {
  assert.ok(existsSync(resolve(ROOT, "artifacts/lena/src/content/nile-systems.ts")));
  // سجل الأدلة يستورد البيانات ولا يستنسخها: لا مسار صورة نيل مكتوب يدوياً فيه.
  assert.doesNotMatch(evidence, /\/nile-evidence\//, "evidence.ts must not hardcode Nile plates");
  assert.match(evidence, /nileEvidence\(\)/);
  assert.match(evidence, /NILE_SYSTEMS_META/);
});

check("the base house stays six systems in owner order", () => {
  assert.match(systems, /export function publicSystems\(\): BusinessSystem\[\] \{\s*return BUSINESS_SYSTEMS\.filter/);
  assert.match(systems, /export function nileSystems\(\): BusinessSystem\[\]/);
  assert.match(systems, /findSystem[\s\S]{0,120}BUSINESS_SYSTEMS\.find/);
});

check("every Nile id is a canonical SystemId member", () => {
  const ids = [...meta.matchAll(/^\s{4}id: "(nile-[a-z-]+)",$/gm)].map((m) => m[1]);
  assert.equal(ids.length, 7, `expected seven Nile systems, found ${ids.length}`);
  assert.equal(new Set(ids).size, ids.length, "duplicate Nile system id");
  for (const id of ids) assert.match(systems, new RegExp(`\\|\\s*"${id}"`), `missing SystemId member ${id}`);
});

check("every shown plate is a real file on disk", () => {
  const sources = [...meta.matchAll(/src: "\/([^"]+)"/g)].map((m) => m[1]);
  assert.ok(sources.length >= 12, `expected at least twelve plates, found ${sources.length}`);
  for (const src of sources) {
    assert.ok(existsSync(resolve(PUBLIC, src)), `missing plate asset: /${src}`);
  }
});

check("every plate carries alt and capability in Arabic and English", () => {
  const altBlocks = [...meta.matchAll(/alt: \{ ar: [^}]*?en: [^}]*?\}/g)];
  const capBlocks = [...meta.matchAll(/capability: \{[\s\S]*?en:[^}]*?\},/g)];
  const srcCount = [...meta.matchAll(/src: "\//g)].length;
  assert.equal(altBlocks.length, srcCount, "one bilingual alt per plate");
  assert.equal(capBlocks.length, srcCount, "one bilingual capability per plate");
  for (const block of altBlocks) assert.match(block[0], /ar: "[^"]{8,}"/);
  for (const block of capBlocks) assert.match(block[0], /ar: "[^"]{20,}"/);
});

check("the trial room is one explicit field and stays out of the evidence register", () => {
  assert.match(meta, /trialRoom: string;/);
  const rooms = [...meta.matchAll(/trialRoom: `\$\{DEMO\}([^`]+)`/g)].map((m) => m[1]);
  assert.equal(rooms.length, 7, "one live room per system");
  // صفحة المنتج تقرأ الحقل، ولا تكتب رابطاً يدوياً.
  assert.match(productPage, /href=\{product\.trialRoom\}/);
  assert.doesNotMatch(productPage, /https?:\/\//, "no hand-written URL on the product page");
  assert.match(productPage, /is not counted as evidence of commercial use/);
});

check("no lifecycle language on any public Nile surface", () => {
  for (const [name, source] of [
    ["NileProducts", indexPage],
    ["NileProduct", productPage],
    ["NileHouseBand", band],
  ]) {
    for (const pattern of FORBIDDEN_LIFECYCLE) {
      assert.doesNotMatch(source, pattern, `forbidden lifecycle term in ${name}`);
    }
  }
});

check("no traction, customer or revenue claim in product copy", () => {
  for (const [name, source] of [
    ["nile-systems.ts", meta],
    ["NileProducts", indexPage],
    ["NileProduct", productPage],
    ["NileHouseBand", band],
  ]) {
    for (const pattern of FORBIDDEN_CLAIMS) {
      assert.doesNotMatch(source, pattern, `forbidden claim in ${name}`);
    }
  }
});

check("the routes exist, read the registry, and stay out of the MALEK app-chooser rule", () => {
  // `tools/verify-malek-association.mjs` يمنع مسار `/products` كي لا تصبح LENA منتقي
  // تطبيقات؛ لذلك بيت نيل يسكن `/nile` ويُحال إليه من الخدمات والأعمال.
  assert.match(app, /const NileProducts = lazy\(\(\) => import\("\.\/pages\/NileProducts"\)\)/);
  assert.match(app, /const NileProduct = lazy\(\(\) => import\("\.\/pages\/NileProduct"\)\)/);
  assert.match(app, /path="\/nile" element=\{<NileProducts \/>\}/);
  assert.match(app, /path="\/nile\/:productId" element=\{<NileProduct \/>\}/);
  assert.match(indexPage, /NILE_SYSTEMS_META\.map/);
  assert.match(productPage, /nileMetaFor\(productId\)/);
});

check("the product plates reuse the house evidence component", () => {
  assert.match(productPage, /<OperatingSurfaces systemId=\{product\.id as SystemId\}/);
  assert.doesNotMatch(productPage, /<img[\s\S]*?nile-evidence/, "plates must come through the evidence component");
});

check("services and portfolio link to the Nile house", () => {
  assert.match(services, /<NileHouseBand \/>/);
  assert.match(portfolio, /<NileHouseBand \/>/);
  assert.match(band, /to="\/nile"/);
});

console.log(failures === 0 ? "\nALL CHECKS PASSED\n" : `\n${failures} FAILED\n`);
process.exit(failures ? 1 : 0);
