# PORTFOLIO.md — فهرس محفظة `mohamedmasoud3030-tech`

> **هذا هو الملف الذي كان غيابه سبب أكبر خطأ في 2026-10-18.**
> أي وكيل يدخل أي مستودع يبدأ من هنا.
>
> **آخر تحقق:** 2026-10-18 · **طريقة التحقق:** `node tools/portfolio-check.mjs`
> **الأساس:** جرد المالك 2026-10-13 (v2، 12 مستودعًا) + إعادة تحقق 2026-10-18.

---

## ١) المستودعات — 13 (لا 12)

| المستودع | المنتج | الرؤية | الحالة |
|---|---|---|---|
| `malek` | MALEK · أملاك وإيجارات (RTL/OMR) | private | الأنشط — 4151 commit، 14 CI |
| `larabeauty-` | LenaBeauty · صالونات/مراكز صحية | private | فروع production |
| `carmen-gallery-` | LENA Dressroom · معرض وتأجير فساتين | private | 73 وسم إصدار |
| `Terranex` | Terranex · عمليات استثمارية/مقاولات | private | PLpgSQL، 106 migration |
| `starting` | تطبيق ضيافة — **عميل، الاسم محجوب** | private | أفضل حقيبة أدوات |
| **`nilesys`** | **كيّال (Kayyal) · مخزن خردة، مصر** | **public** | كان اسمه `Mohamed-App-Factory` |
| `bug-free-garbanzo` | `kayyal` · **النواة المحاسبية** | private | 6 ملفات domain = أصل المحركات |
| `platform` | LENA Digital House · monorepo | private | `.git` = 250 MB ⚠️ |
| `mosaid` | Mosaid · Go agent runtime | public | 23 حزمة Go |
| `Lenastore` | إدارة مواد إنشائية | private | أصغر بذرة نظيفة |
| `Test` | تجربة استضافة وكيل | public | 457 سطر + ZIPs متتبَّعة ⚠️ |
| `teste` | ⚠️ **قالب خارجي** (JCodesMore، MIT) | public | **ليس أصلًا من أصولك** |
| `sasa` | صور شخصية | public | 9 ملفات، لا كود — **جديد 2026-10-17** |

**تصحيح عن جرد 2026-10-13:** `Mohamed-App-Factory` → **`nilesys`** (إعادة تسمية) · **`sasa` جديد** · العدد 13 لا 12.

---

## ٢) 🚫 ممنوع البناء من جديد — موجود أصلًا

> **هذه أهم قائمة في الملف.** قبل أي مكوّن جديد، ابحث هنا أولًا.

| لو محتاج… | خُذ من | المسار |
|---|---|---|
| **نواة مالية** (decimal/cash/costing/units/line/regrade) | `bug-free-garbanzo` | `src/domain/` (6 ملفات) |
| ↑ **وهي مستخرَجة فعلًا في `nilesys`** | `nilesys` | `engines/transactions/src/` — **verbatim + ترويسة نسب 2026-10-13** |
| **حساب الدرج + إقفال الوردية** | `nilesys` | `engines/transactions/src/cash.ts` → `computeDrawer()`، `closeDifference()` |
| RLS + ثبات السجل + posting guard | `bug-free-garbanzo` | `db/migrations/0002-0005` |
| اختبارات على PostgreSQL حقيقي بلا Docker | `bfg` / `starting` | `tests/db/pg-harness.ts` · `scripts/native-db/` |
| **إثبات تزامن بجلسَتين حقيقيتَين** | `starting` | `scripts/native-db/payments_concurrency.mjs` |
| idempotency للمدفوعات | `Lenastore` | `supabase/migrations/202608060005_add_payment_idempotency.sql` |
| عقود Zod مشتركة API↔واجهة | `platform` | `lib/api-zod/` |
| CI محلي بنفس خطوات GitHub | `platform` | `tools/ci-local.sh` + `verify-all.mjs` |
| أطقم تحقق مما لا يمسكه `tsc` | `platform` | `tools/verify-*.mjs` (24) |
| توريد آمن (catalog + overrides) | `platform` | `pnpm-workspace.yaml` — **انسخه كما هو** |
| مهارات وكيل + AGENTS.md + ADRs | `nilesys` | `.agents/skills/` (8) |
| محرك مستندات/فواتير PDF | `malek` | `services/documents/` (47 ملفًا) |
| مكتبة UI | `malek` (76) · `Lenastore` (17) | `components/ui/` · `components/common/` |
| Offline / IndexedDB / Desktop | `carmen-gallery-` | `src/platform/` (28) |
| Clean Architecture + `Result<T,E>` | `larabeauty-` | `src/domain/` (27) |
| i18n عربي+إنجليزي | `larabeauty-` | `src/i18n/` (44) |
| runtime وكيل (Telegram/MCP/scheduler) | `mosaid` | `internal/` (23 حزمة Go) |
| **قواعد النقدية المعلّقة** | `bug-free-garbanzo` | `docs/FINANCIAL_RULES.md` + `docs/adr/0009-cash-reconciliation.md` |

---

## ٣) ⚠️ قرارات معمارية معلّقة — لا تحسمها لوحدك

| # | التعارض | الطرفان |
|---|---|---|
| **D1** | **`pending → posted`** | `cash.ts:57 postPendingCash()` يفترض `UPDATE` · و`nilesys` PR #4 **سحب `UPDATE`** من الدور التشغيلي. **كلاهما في `nilesys` الآن.** |
| **D2** | **4 نسخ `money`** | `Terranex/shared/money` (minor units) · `starting/lib/money.ts` (milli-OMR) · `malek/lib/money.ts` (OMR 3dp) · `bfg/domain/decimal.ts` (decimal.js) |
| **D3** | **المنصّة** | Supabase (5 مشاريع) · Drizzle+tRPC (`platform`) · Drizzle+pg (`Test`, `bfg`) |
| **D4** | **ترقيم ADRs يتصادم** | `0009` = «التسوية النقدية» في `bfg` و«العربية/RTL» في `nilesys`. كذلك 0004/0006/0007/0008. **الحل: بادئة لكل منتج** (`KAY-`, `MAL-`, `LEN-`, `TER-`, `CAR-`, `HOS-`) |

---

## ٤) 🚨 شغل منسيّ على فروع

| المستودع | الفرع / PR | المحتوى | منذ |
|---|---|---|---|
| `malek` | **PR #1835** · `arena/35340dd0-malek` | **جرد 1755 ملفًا بالعربي + PDF 113 صفحة** · `mergeable=true` | 2026-10-09 |
| `nilesys` | **PR #4** | append-only + قفل الحسابات المشتركة — **مدموج محليًا فقط، غير مدفوع** | 2026-10-14 |
| `nilesys` | فرع محلي `feat/nile-payments-engine` | محرك دفع · 115/115 اختبار · **غير مدفوع** | 2026-10-18 |
| `bug-free-garbanzo` | `arena/01a087cd` | **+154 ملفًا** — تطبيق Next.js كامل | 2026-09-15 |
| `Terranex` | 13 فرعًا غير مدموج | | |
| `larabeauty-` | 9 فروع غير مدموجة | | |

**٤٣ فرعًا من ١٠٥ فيها commits غير موجودة في `main`.** القاعدة: **العمل لا يُترك على فرع.**

---

## ٥) كيّال (`nilesys`) — المنتج الذي تُقاد به المحفظة

**نطاق النسخة الأولى كما حدده المالك:**
أصناف بالنوع والدرجة · شراء · بيع · أطراف بأرصدة · **صندوق نقدية بإقفال عدّ فعلي يومي** ·
مخزون مشتق · **إيصالات مرقّمة تُرسل WhatsApp وتُطبع** · ملخص يومي · **دوران فقط: مالك وعامل** ·
عربية RTL لمن يقف على الميزان · PWA offline · **التصحيحات بالعكس، never by deletion** · تصدير.

**وعد قابل للقياس:** كل عملية تُسجَّل في **أقل من 30 ثانية**، وفي آخر اليوم يعرف المالك:
ما دخل، ما خرج، ما تبقّى في الصندوق، وما رُبح فعلًا.

> ⚠️ «التصحيحات بالعكس» = **نفس** قرار append-only. المالك وصله من التشغيل، والوكيل وصله من الأمان. **متفقان.**

---

## ٦) كيف يُحدَّث هذا الملف

```bash
node tools/portfolio-check.mjs          # يعيد قياس الجدول ١ من GitHub مباشرة
```

**لا يُعدَّل رقم فيه يدويًا.** أي رقم بلا أمر يُعيد إنتاجه = رقم ميت.
