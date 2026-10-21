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

---

## الحالة بعد التنفيذ — 2026-10-21 (الجولة الثانية)

السبع عشرة ميزة التي كانت «متبقية» نُفِّذت. المستند الآن يحمل لكل بند **حالته ودليله
وما ينقصه** بدل أن يحمل وعداً:

| الحالة | العدد | البنود |
| --- | --- | --- |
| منفَّذ ومُختبَر | 15 | F-01 … F-15 |
| منفَّذ جزئياً | 2 | F-16 (نظامان من سبعة) · F-17 (المواقع جاهزة، برامج ويندوز لا) |
| بصري | 16 | V-01 … V-16 — لم يُبدأ |

### كيف تُثبت الأرقام

```sh
cd nilesys/prototypes/nilesys
npm test        # 93 اختبار API على سيرفر حقيقي وقاعدة مؤقتة
npm run test:ui # 76 فحصاً في متصفح حقيقي (شاشات · يوم كامل · أوفلاين · مخازن · مواقع)
```

`tools/run-tests.sh` يشغّل كل ملف اختبار على سيرفر وقاعدة بيانات جديدين. السبب ليس
ترفاً: تشغيل الملفات على قاعدة واحدة جعل النتائج تتقلّب، والنتيجة المتقلّبة أسوأ من
الفاشلة لأنها تعلّمك ألا تثق بأي نتيجة.

### ما بُني في هذه الجولة (ملخص للمالك)

- **ضريبة وفاتورة ضريبية** بنسبة لكل صنف وإعفاء، وسطر ضريبة منفصل في الإيصال والتقرير.
- **خصومات منظمة**: سطر بسقف 30%، أكواد خصم، وسقف 10% للكاشير قابل للرفض بـ 403.
- **طباعة 80 مم** بلا أي عنصر واجهة على الورق، و**فاتورة ضريبية** بالاسم القانوني والرقم الضريبي.
- **قراءة باركود بالكاميرا** مع إدخال يدوي دائم ومنع تكرار في نصف ثانية.
- **مخزون بحركات**: كل زيادة ونقص بسطر وسبب ورصيد بعده، وممنوع السالب.
- **موردون وتوريد** بمتوسط تكلفة مرجح.
- **عملاء**: حد آجل، رصيد، نقاط ولاء، كشف حساب، وتحصيل يدخل الدرج.
- **حركات درج يدوية** يطلبها الكاشير ويعتمدها المدير، وتُحسب مرة واحدة.
- **تصدير CSV** بأربعة ملفات وبـ BOM حتى يقرأ Excel العربي.
- **مستخدمون** بكلمات مرور مجزّأة، وقفل بعد خمس محاولات، وحماية آخر مدير.
- **بيع بلا شبكة**: ثلاث فواتير بلا اتصال تصل ثلاثاً بالضبط — لا فقد ولا تكرار.
- **نسخ واستعادة** بتأكيد نصي، و**تنبيهات** بعدّاد.
- **نظام مخازن مستقل** له مستخدموه وشاشته واختباراته، على نفس المخزون.
- **سبعة مواقع نشاط** بشارات حالة صادقة: ما يعمل مكتوب أنه يعمل، وما لم يُبنَ مكتوب أنه قيد التنفيذ.

### ما لم يُنفَّذ — مكتوب صريحاً

1. الفاتورة الإلكترونية بصيغة ETA (المطبوع 80 مم وPDF فقط).
2. خمسة أنظمة: المطعم · العيادة · الموارد البشرية · حجز الملاعب · لوحة المواقع.
3. خمسة برامج ويندوز (صفحتها تقول «قيد التخطيط»).
4. تعدد الفروع.
5. الترقية البصرية V-01…V-16.
6. **قيد معماري:** التخزين صف JSON واحد بلا معاملات. كل نسخة على Vercel تقرأ الحالة
   قبل الطلب وتكتب فوراً قبل الرد، لكن كتابتين متزامنتين قد تفقد واحدة. العلامة في
   `environment-gaps.md` باقية مفتوحة، ولا تُغلق بكلام.
