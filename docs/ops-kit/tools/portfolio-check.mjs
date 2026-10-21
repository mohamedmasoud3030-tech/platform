#!/usr/bin/env node
/**
 * portfolio-check.mjs — يقيس محفظة mohamedmasoud3030-tech من GitHub مباشرة
 * ويقارنها بما هو مكتوب في PORTFOLIO.md، فيُظهر الانحراف بدل أن يصدّقه.
 *
 *   node tools/portfolio-check.mjs            # قياس + مقارنة
 *   node tools/portfolio-check.mjs --json     # ناتج آلي
 *
 * لا يعدّل شيئًا. قراءة فقط.
 *
 * لماذا موجود: في 2026-10-18 قُرئ `public_repos = 5` على أنه عدد المستودعات،
 * فكان 5 من 13. هذا السكربت يمنع تكرار ذلك.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWNER = 'mohamedmasoud3030-tech';
const here = dirname(fileURLToPath(import.meta.url));
const PORTFOLIO = join(here, '..', 'PORTFOLIO.md');

/* ---------- ١) اجلب من GitHub: بمصادقة إن وُجدت، وإلا علني فقط ---------- */

function hasGh() {
  try { execFileSync('gh', ['--version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

function gh(path) {
  return JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8', maxBuffer: 1 << 26 }));
}

function curl(path) {
  const out = execFileSync('curl', ['-sSL', '--max-time', '30', `https://api.github.com${path}`],
    { encoding: 'utf8', maxBuffer: 1 << 26 });
  return JSON.parse(out);
}

const ghPresent = hasGh();

/*
 * ⚠️ الفخ الذي وقع فيه هذا السكربت في أول تشغيل له (2026-10-18):
 * `GET /users/{owner}/repos` يرجّع العامة فقط — حتى مع توكن صالح.
 * الخاصة لا تظهر إلا عبر `GET /user/repos` (المستخدم المصادَق نفسه).
 * لذلك نتحقق من هوية المصادَق أولًا، ولا نصدّق وجود `gh` وحده.
 */
let authed = false;
let login = null;
if (ghPresent) {
  try {
    const me = gh('/user');
    login = me.login ?? null;
    authed = login === OWNER;
  } catch { authed = false; }
}
const fetchApi = ghPresent ? gh : curl;

let repos;
if (authed) {
  repos = await fetchApi('/user/repos?per_page=100&type=owner&sort=updated');
  if (Array.isArray(repos)) repos = repos.filter((r) => r.owner?.login === OWNER);
} else {
  repos = await fetchApi(`/users/${OWNER}/repos?per_page=100&sort=updated`);
}
if (!Array.isArray(repos)) {
  console.error(`فشل الجلب: ${repos?.message ?? 'استجابة غير متوقعة'}`);
  process.exit(1);
}

let publicOnly = 0;
try {
  const pub = fetchApi(`/users/${OWNER}/repos?per_page=100`);
  publicOnly = Array.isArray(pub) ? pub.length : 0;
} catch { publicOnly = 0; }
if (!authed || repos.length <= publicOnly) {
  console.error(`\n⚠️  تحذير: ترى ${repos.length} مستودعًا والعامة وحدها ${publicOnly}.`);
  console.error(`   أي استنتاج عن «كل المحفظة» من هذا الناتج خاطئ. صادِق بـ gh أولًا.\n`);
}

/* ---------- ٢) قِس كل مستودع ---------- */

const measured = [];
for (const r of repos) {
  let branches = null, openPrs = null;
  try { branches = (await fetchApi(`/repos/${OWNER}/${r.name}/branches?per_page=100`)).length; } catch {}
  try { openPrs = (await fetchApi(`/repos/${OWNER}/${r.name}/pulls?state=open&per_page=100`)).length; } catch {}
  measured.push({
    name: r.name,
    visibility: r.private ? 'private' : 'public',
    language: r.language ?? '-',
    kb: r.size,
    pushed: r.pushed_at.slice(0, 10),
    branches,
    openPrs,
  });
}
measured.sort((a, b) => b.kb - a.kb);

/* ---------- ٣) قارن بما هو مكتوب في PORTFOLIO.md ---------- */

const documented = new Set();
if (existsSync(PORTFOLIO)) {
  const md = readFileSync(PORTFOLIO, 'utf8');
  // صفوف الجدول ١ تبدأ بـ | `name` |
  for (const m of md.matchAll(/^\|\s*`([^`]+)`\s*\|/gm)) documented.add(m[1]);
}

const names = new Set(measured.map((r) => r.name));
const missingFromDoc = [...names].filter((n) => !documented.has(n));
const staleInDoc = [...documented].filter((n) => !names.has(n));

/* ---------- ٤) اطبع ---------- */

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ authed, measured, missingFromDoc, staleInDoc }, null, 2));
} else {
  console.log(`\nمحفظة ${OWNER} — قِيست من GitHub مباشرة`);
  console.log(`المصادقة: ${authed ? `✅ gh كـ ${login} — عامة + خاصة` : `⚠️  عامة فقط (${repos.length}) — الخاصة غير مرئية`}`);
  console.log(`عدد المستودعات: ${measured.length}\n`);

  const w = (s, n) => String(s).padEnd(n);
  console.log(`  ${w('المستودع', 22)}${w('الرؤية', 9)}${w('اللغة', 13)}${w('KB', 9)}${w('فروع', 6)}${w('PRs', 5)}آخر نشاط`);
  console.log('  ' + '─'.repeat(84));
  for (const r of measured) {
    console.log(`  ${w(r.name, 22)}${w(r.visibility, 9)}${w(r.language, 13)}${w(r.kb, 9)}${w(r.branches ?? '?', 6)}${w(r.openPrs ?? '?', 5)}${r.pushed}`);
  }

  console.log(`\nمقارنة بـ PORTFOLIO.md:`);
  console.log(`  موثّق فيه: ${documented.size} · موجود فعلًا: ${names.size}`);
  if (missingFromDoc.length) console.log(`  ❌ موجود ولم يُوثّق: ${missingFromDoc.join(', ')}`);
  if (staleInDoc.length) console.log(`  ❌ موثّق وغير موجود (اتشال أو اتغيّر اسمه): ${staleInDoc.join(', ')}`);
  if (!missingFromDoc.length && !staleInDoc.length) console.log(`  ✅ لا انحراف`);

  const totalBranches = measured.reduce((s, r) => s + (r.branches ?? 0), 0);
  const totalPrs = measured.reduce((s, r) => s + (r.openPrs ?? 0), 0);
  console.log(`\nإجمالي الفروع: ${totalBranches} · إجمالي PRs المفتوحة: ${totalPrs}`);
  console.log(`\n⚠️  لا تعدّل PORTFOLIO.md يدويًا لإصلاح هذا — صحّح الجدول من هذا الناتج.\n`);
}

process.exit(missingFromDoc.length || staleInDoc.length ? 2 : 0);
