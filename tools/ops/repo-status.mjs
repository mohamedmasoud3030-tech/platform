#!/usr/bin/env node
/**
 * repo-status.mjs — يولّد STATUS.md من المستودع نفسه، بدل أن يكتبه أحد بيده.
 *
 *   node repo-status.mjs /path/to/repo            # يطبع على الشاشة
 *   node repo-status.mjs /path/to/repo --write    # يكتب docs/STATUS.md
 *
 * لماذا موجود: كل STATUS.md كُتب يدويًا في هذه المحفظة عَفِن.
 * ما لا يُقاس آليًا يُنسى. هذا السكربت يقيس، ولا يحكم.
 *
 * قراءة فقط — لا يعدّل إلا بـ --write.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const root = process.argv[2];
if (!root || !existsSync(root)) {
  console.error('الاستعمال: node repo-status.mjs <مسار المستودع> [--write]');
  process.exit(1);
}

const SKIP = new Set(['.git', 'node_modules', 'dist', 'build', '.next', 'coverage', '__pycache__', '.cache', '.venv']);
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.sql', '.go', '.py', '.sh', '.css', '.html']);
const DOC_EXT = new Set(['.md']);

/* ---------- اجمع الملفات ---------- */
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile()) files.push({ path: relative(root, p), size: statSync(p).size });
  }
})(root);

const byExt = {};
for (const f of files) {
  const x = extname(f.path).toLowerCase();
  byExt[x] = (byExt[x] ?? 0) + 1;
}

const codeFiles = files.filter((f) => CODE_EXT.has(extname(f.path).toLowerCase()));
const docFiles = files.filter((f) => DOC_EXT.has(extname(f.path).toLowerCase()));
const tests = files.filter((f) => /\.test\.|\.spec\.|(^|\/)tests?\//i.test(f.path));
const migrations = files.filter((f) => /migrations?\//i.test(f.path) && extname(f.path) === '.sql');

/* ---------- عدّ الأسطر ---------- */
let codeLines = 0;
for (const f of codeFiles) {
  try { codeLines += readFileSync(join(root, f.path), 'utf8').split('\n').length; } catch {}
}

/* ---------- طقم المستندات: إيه الموجود وإيه الناقص ---------- */
const KIT = [
  ['README.md', 'ما هذا ولمن وهل يعمل بمستخدم حقيقي'],
  ['docs/STATUS.md', 'ما الذي يعمل وما الذي لا يعمل — يولّده هذا السكربت'],
  ['docs/RULES.md', 'قواعد المال والبزنس في هذا المجال'],
  ['docs/DECISIONS.md', 'القرارات المرقّمة ببادئة المنتج'],
  ['AGENTS.md', 'بوابة الدخول: ما يُقرأ أولًا والقواعد الصلبة'],
  ['docs/EVIDENCE.md', 'كل ادعاء + الأمر الذي يُعيد إنتاجه'],
];
const present = KIT.filter(([p]) => existsSync(join(root, p)));
const missing = KIT.filter(([p]) => !existsSync(join(root, p)));

/* ---------- Git ---------- */
const git = (...a) => { try { return execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim(); } catch { return null; } };
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
const head = git('rev-parse', '--short', 'HEAD');
const dirty = git('status', '--porcelain');
const hasUpstream = git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}');
const unpushed = hasUpstream ? git('log', '--oneline', '@{u}..HEAD') : null;

/* ---------- CI ---------- */
const wfDir = join(root, '.github', 'workflows');
const workflows = existsSync(wfDir) ? readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f)) : [];

/* ---------- اطبع ---------- */
const now = new Date().toISOString().slice(0, 10);
const L = [];
L.push(`# STATUS.md — ${root.split('/').pop()}`);
L.push('');
L.push(`> **مُولَّد آليًا** بواسطة \`ops-kit/tools/repo-status.mjs\` في ${now}. لا تعدّله يدويًا — أعد توليده.`);
L.push('');
L.push('## الحالة');
L.push('');
L.push('| المقياس | القيمة |');
L.push('|---|---|');
L.push(`| الفرع / HEAD | \`${branch ?? '?'}\` / \`${head ?? '?'}\` |`);
L.push(`| التعديلات غير المثبّتة | ${dirty ? `**${dirty.split('\n').length} ملف**` : 'لا شيء — نظيف'} |`);
L.push(`| commits غير مدفوعة | ${
  !hasUpstream ? '**لا يوجد upstream — الفرع كله غير مدفوع**'
  : unpushed ? `**${unpushed.split('\n').length}**` : '0'
} |`);
L.push(`| CI workflows | ${workflows.length ? workflows.length : '**0 — لا حراسة**'} |`);
L.push('');
L.push('## الحجم');
L.push('');
L.push('| المقياس | العدد |');
L.push('|---|---|');
L.push(`| إجمالي الملفات | ${files.length} |`);
L.push(`| ملفات كود | ${codeFiles.length} (${codeLines.toLocaleString('en')} سطر) |`);
L.push(`| ملفات توثيق | ${docFiles.length} |`);
L.push(`| ملفات اختبار | ${tests.length} |`);
L.push(`| migrations SQL | ${migrations.length} |`);
L.push('');
L.push('## طقم المستندات');
L.push('');
if (present.length) { L.push('**موجود:**'); for (const [p] of present) L.push(`- ✅ \`${p}\``); L.push(''); }
if (missing.length) { L.push('**ناقص:**'); for (const [p, why] of missing) L.push(`- ❌ \`${p}\` — ${why}`); L.push(''); }
if (!missing.length) L.push('✅ الطقم كامل.');
L.push('');
L.push('## أكبر 12 مجلدًا');
L.push('');
L.push('| المجلد | ملفات |');
L.push('|---|---|');
const dirs = {};
for (const f of codeFiles) { const d = f.path.split('/').slice(0, 2).join('/') || '/'; dirs[d] = (dirs[d] ?? 0) + 1; }
Object.entries(dirs).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([d, n]) => L.push(`| \`${d}\` | ${n} |`));
L.push('');
L.push('## ما لا يعرفه هذا السكربت');
L.push('');
L.push('- هل الاختبارات تنجح — شغّلها وسجّل الناتج في `EVIDENCE.md`');
L.push('- هل المنتج يعمل بمستخدم حقيقي — يُكتب يدويًا في `README.md`');
L.push('- هل القرارات مُطبّقة في الكود — راجع `DECISIONS.md`');
L.push('');

const out = L.join('\n');
if (process.argv.includes('--write')) {
  const target = join(root, 'docs', 'STATUS.md');
  writeFileSync(target, out);
  console.log(`كُتب: ${target}`);
} else {
  console.log(out);
}

console.error(`\nقياس: ${files.length} ملف · ${codeFiles.length} كود · ${tests.length} اختبار · طقم المستندات ${present.length}/${KIT.length}`);
process.exit(missing.length ? 2 : 0);
