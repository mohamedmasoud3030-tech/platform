# Portfolio execution plan and evidence ledger

**Owner authorized staged execution on 2026-10-15.** This document coordinates cross-repository work; it is NOT a second product registry, accounting policy, or replacement for repository governance. Platform runtime product facts remain in `artifacts/lena/src/content/systems.ts`, and publication evidence in `artifacts/lena/src/features/world/content/evidence.ts`. Each product's own canonical pack/ADRs govern behavior.

No repository migration, production database repair, customer-data publication, new paid resources, or automatic merge is approved by this coordination document. Preserve owner restrictions on bulk cloning and unnecessary installations.

## Current execution evidence

| Phase | Status | Evidence / remaining gate |
|---|---|---|
| 1. Current truth | Baseline prepared; adoption pending review | Nine pinned source snapshots; existing authorities mapped. No governed product-stage credit changed. |
| 2. Verification | Existing MALEK CI failure diagnosed, not repaired | SQL exception reports missing expected direct-write grants; migration-ledger drift reported. Independently validate probe visibility, canonical expectations and live state before any repair. |
| 3. First product | Not runtime-proven | MALEK is diagnostic priority, not automatically the business flagship. Choose one customer journey and approved QA environment. |
| 4. Showcase | Static evidence-path check passed | 31 references exist: MALEK 7, wellness 10, Carmen 14. Capture provenance, browser journey and live deployment NOT verified. |
| 5. Shared capability | Existing extraction checked | Nile currency-rollup source equals Terranex body after documented provenance/import normalization. Dependencies, runtime behavior and two-consumer integration NOT verified. Do not create another duplicate. |
| 6. Expansion | Not started | Requires preceding acceptance evidence; no portfolio-wide completion claim. |

MALEK evidence: [read-only readiness job](https://github.com/mohamedmasoud3030-tech/malek/actions/runs/38536762880/job/115761413995). Inspected scripts: `scripts/verify-supabase-live-readiness.sh` and `scripts/verify-migration-ledger-parity.sh` at `2d20a0d356204857b4acc1e393eaea107aa8e6a7`. No job dispatched, no DB connection made, no raw logs persisted. Check reports are not an independent assertion of present database state.

Specific earlier Platform/Carmen/LenaBeauty checks did not start because GitHub annotations cited account-payment/spending-limit issues. Do not label application code broken from those results or increase spending automatically.

## Pinned review baseline — not live readiness

- [platform @ 5ad2b66b](https://github.com/mohamedmasoud3030-tech/platform/tree/5ad2b66b7fc314e17bde8e7106a92a2576568a4a): المعرض واستفسارات العملاء. المرجع الواجب مراجعته: AGENTS.md؛ systems.ts؛ evidence.ts.
- [nilesys @ ebcfe722](https://github.com/mohamedmasoud3030-tech/nilesys/tree/ebcfe722ebeaba1ed4eebef1c42eae9a7cb399a8): القدرات المشتركة وAPI. المرجع الواجب مراجعته: AGENTS.md؛ docs/DECISIONS.md؛ docs/REUSE.md.
- [malek @ 2d20a0d3](https://github.com/mohamedmasoud3030-tech/malek/tree/2d20a0d356204857b4acc1e393eaea107aa8e6a7): العقارات والإيجارات والمحاسبة. المرجع الواجب مراجعته: docs/source-of-truth/00_INDEX.md؛ الوثيقة 07؛ سجلات الحوكمة.
- [carmen-gallery- @ 7b6e1df7](https://github.com/mohamedmasoud3030-tech/carmen-gallery-/tree/7b6e1df782cf890b0114940b0ba9d04aeacdfcd3): المعرض وتأجير الفساتين. المرجع الواجب مراجعته: README.md؛ docs/BUSINESS_MODEL.md؛ docs/EXECUTION_CHECKLIST.md.
- [larabeauty- @ 0f0ce8ec](https://github.com/mohamedmasoud3030-tech/larabeauty-/tree/0f0ce8ecca5343226165a2128065604ca7f2a768): تشغيل مركز التجميل. المرجع الواجب مراجعته: README.md؛ عقود قاعدة البيانات ومصدر التقارير.
- [starting @ f5cf2f5e](https://github.com/mohamedmasoud3030-tech/starting/tree/f5cf2f5e093e9370b37c94ca0653a62972e856c2): تشغيل مناسبات الضيافة. المرجع الواجب مراجعته: README.md؛ PROJECT_STATUS.md؛ PROJECT_DEFECTS.md.
- [Terranex @ bd42745b](https://github.com/mohamedmasoud3030-tech/Terranex/tree/bd42745be218a6404ab68586fa7df7ddce6d142c): الاستثمار والمشروعات. المرجع الواجب مراجعته: README.md؛ docs/ROADMAP_R0_R17.md؛ قرارات السياسة.
- [bug-free-garbanzo @ bfaa1414](https://github.com/mohamedmasoud3030-tech/bug-free-garbanzo/tree/bfaa1414cb708ff5721b6f3dcda2e3cafa80d6ca): مجال عمليات كيّال المالية. المرجع الواجب مراجعته: docs/ARCHITECTURE.md؛ docs/adr/؛ الكود والاختبارات.
- [Lenastore @ 432d49cf](https://github.com/mohamedmasoud3030-tech/Lenastore/tree/432d49cf309a0cd982199041f997fff7ecdb7b60): مواد المشروع والمشتريات والمخزون. المرجع الواجب مراجعته: README.md؛ schema.sql؛ عقود التقارير.

## Roadmap and acceptance gates

# خارطة الطريق — من المشاريع الموجودة إلى منتجات قابلة للعرض والتشغيل

**مسودة قرار للمالك — 15 أكتوبر 2026**  
مبنية على مراجعة انتقائية لـ9 مستودعات، وليست شهادة جاهزية. هذه الخريطة خطة مقترحة، وليست تفويضًا بتنفيذ النقل أو الدمج أو النشر.

## الاتجاه المقترح

**Platform = المعرض ومدخل العملاء** ← يعرض **التطبيقات المستقلة** ← تتشارك تدريجيًا قدرات مثبتة في **Nile**.

المعرض لا يتولى تشغيل المنتجات أو مصادقتها لمجرد أنه يعرضها. هدفنا الاستفادة من الموجود، لا جعل كل المشاريع مشروعًا ضخمًا واحدًا.

## الطريق في سطر

**نحن هنا: مراجعة أولية** → **1. توحيد الحقيقة** → **2. استعادة التحقق** → **3. إثبات منتج أول** → **4. عرضه وربطه بالعملاء** → **5. استخراج المشترك** → **6. التوسع المنضبط**

### 1. توحيد الحقيقة وتنظيف التشتيت

**الهدف:** أي وكيل يعرف ما المعتمد وما التاريخي قبل أن يبدأ.

- إنشاء سجل مختصر للمنتجات: الغرض، المستودع، مصدر الحالة المعتمد، ما ثبت وما لم يثبت، والخطوة التالية.
- مراجعة تعارض الوثائق مع الكود؛ خصوصًا جرد Platform، أدلة العرض، وقوائم التنفيذ المتراكمة.
- مراجعة طلبَي بروتوكول الوكلاء قبل الدمج؛ نشرهما على فرع لا يعني اعتمادهما على main.
- تصنيف الوثائق إلى نشطة وتاريخية ومقترحة. الأرشفة أفضل من الحذف؛ لا دمج شامل لملفات التقارير.

**المخرج:** سجل حالة صغير + قائمة تنظيف محددة قابلة للمراجعة.  
**بوابة الخروج:** لكل تطبيق مصدر حالة واضح، ولا قرار مهم مقدَّم كحقيقة وهو لم يُعتمد.  
**قرار المالك:** اعتماد حدود المعرض/المنتجات/المشترك، وأي نقل أو أرشفة فعلية.

### 2. استعادة القدرة على التحقق

**الهدف:** نعرف ما يعمل بدل الاعتماد على وصف قديم أو علامة CI.

- تشخيص فشل MALEK live-readiness من أقل قدر لازم من الأدلة، دون تغيير قاعدة الإنتاج.
- فصل فشل الكود عن الوظائف التي لم تبدأ بسبب الفوترة أو إعدادات التشغيل.
- اختيار مسار تحقق مناسب للميزانية: CI متاح، أو تشغيل محدود لمستودع واحد بعد الإذن. لا رفع لحد الإنفاق أو تنزيل شامل تلقائيًا.
- تحديد اختبارات البيانات والصلاحيات والمال والتشغيل المطلوبة للمنتج المرشح.

**المخرج:** أسباب العوائق + مسار فحوص قابل للتكرار + أدلة مؤرخة.  
**بوابة الخروج:** مسار تحقق واحد يعمل للمنتج المرشح، والعوائق الحية معروفة أو مسجلة صراحة كمانع للإطلاق.  
**قرار المالك:** أي تكلفة، بيئة تشغيل جديدة، أو وصول لقاعدة بيانات حية.

> المرحلتان 1 و2 يمكن أن تتقدما بالتوازي في أعمال القراءة المستقلة، لا أن ينتظر المشروع تنظيف كل مستنداته أولًا.

### 3. إثبات منتج أول بدل إصلاح الجميع

**الهدف:** رحلة تشغيل كاملة في تطبيق واحد تعطي قيمة حقيقية.

- مقارنة MALEK وCarmen وLenaBeauty حسب: طلب عميل فعلي، قرب التشغيل، حجم العوائق، ودليل موثوق.
- MALEK مرشح مهم للمحاسبة والتقارير، لكنه ليس فائزًا تلقائيًا ولا جاهزًا مثبتًا.
- اختيار منتج واحد ورحلة واحدة. مثال لمالك إن اختير: عقد → استحقاق → تحصيل → تقرير متسق.
- إصلاح موانع هذه الرحلة فقط، واختبار الصلاحيات والتكرار والعكس المالي والعزل حيث تنطبق.

**المخرج:** رحلة مثبتة + حدود استخدام + خطة رجوع.  
**بوابة الخروج:** تحقق متكرر في بيئة مأذونة، وتسوية النتائج المالية، وعدم بقاء عائق حرج غير محسوم في النطاق المختار.  
**قرار المالك:** المنتج الأول، المستخدم/العميل المستهدف، وقبول تجربة محدودة.

### 4. تحويل Platform إلى معرض يثبت القيمة

**الهدف:** الزائر يفهم المنتج ويرى دليله ويصل لطريقة تجربة أو تواصل واضحة.

- الاستفادة من صفحات الهبوط الحالية وعدم استبدالها تلقائيًا.
- تتبع رحلة: بطاقة المنتج → شرح المشكلة → دليل مصرح بعرضه → تجربة أو طلب تواصل.
- مراجعة صور العرض والروابط والهوية والخصوصية؛ وجود صورة بالمستودع ليس إثبات جاهزية.
- منع عبارات تشغيل أو نتائج عملاء لا تدعمها أدلة. اختبار الهاتف والعربية والإنجليزية والاستفسارات.

**المخرج:** مسار عرض متكامل للمنتج الأول، ثم باقي المنتجات حسب أدلتها.  
**بوابة الخروج:** الروابط والتواصل يعملان في البيئة المستهدفة، والادعاءات مدعومة، والبيانات مصرح بنشرها.  
**قرار المالك:** المحتوى النهائي وأي نشر عام أو إتاحة تجربة.

> مراجعة المحتوى والروابط ممكن تبدأ مبكرًا؛ إعلان أن المنتج جاهز للتشغيل ينتظر أدلة المرحلة 3.

### 5. استخراج أول قدرة مشتركة مثبتة

**الهدف:** تقليل التكرار دون نقل التعقيد إلى Nile.

- اختيار جزء صغير ثبت احتياج تطبيقين له، لا نسخ مشروع كامل.
- مرشح أول: قواعد مال/عملات أو تنسيق تقرير بعقد محدد؛ نراجع الموجود في Nile قبل استخراج نسخة جديدة.
- مقارنة المصدر والنسخة المشتركة باختبارات تكافؤ، وضبط الإصدار والاعتماديات وخطة الرجوع.
- بدء الاستخدام في تطبيق واحد، ثم الثاني. لا ترحيل بيانات ضمن إجراء تنظيم ملفات.

**المخرج:** مكوّن مشترك موثق ومستخدم، مع اختبارات وحدود واضحة.  
**بوابة الخروج:** نفس النتائج المطلوبة، دون تراجع وظيفي أو تجاوز للصلاحيات، وفائدة عملية في التطبيقين.  
**قرار المالك:** نطاق الاستخراج وأي قرار معماري جديد.

**مؤجل:** اختيار دفتر محاسبة عام، ومحرك كوبونات عام، ومحرك قوالب شامل؛ لم تثبت جاهزيتها أو الحاجة الدقيقة لها بهذا الفحص. تبدأ متطلباتها قبل بنائها.

### 6. التوسع منتجًا بعد منتج

**الهدف:** تكرار ما نجح، لا فتح كل المشاريع في وقت واحد.

- اختيار التطبيق التالي بناءً على المستخدم والقيمة وقرب التشغيل.
- إعادة استخدام ما أثبت نفسه فقط، وإبقاء قواعد كل مجال مختلفة حين يلزم.
- متابعة عيوب التشغيل، اتساق المال، النسخ والاستعادة، تجربة المستخدم، وطلبات العملاء.
- توسيع Nile عند وجود طلب مثبت، لا لمجرد استكمال قائمة محركات.

**المخرج:** منتج تالٍ أو قدرة مشتركة تالية بقيمة قابلة للإثبات.  
**بوابة الخروج:** مراجعة قبول لكل إصدار، مع مسؤول واضح ودليل وخطة رجوع.

## ما لا نفعله الآن

- لا نقل كامل لـNile إلى Platform أو دمج قواعد البيانات.
- لا إعادة بناء عامة، ولا تغيير تقنيات لمجرد توحيد الأسماء.
- لا حذف للأفكار أو دمج آلي لكل فروع التوثيق.
- لا بناء محاسبة وكوبونات وقوالب وتقارير لكل القطاعات في دفعة واحدة.
- لا ادعاء أن اختبارات محلية أو صورًا أو وثائق تعني تشغيلًا حيًا ناجحًا.

## قواعد إدارة التنفيذ من الآن

1. مهمة رئيسية واحدة نشطة؛ الأعمال المتوازية تكون مستقلة ومحددة.
2. كل مهمة: هدف، نطاق، ممنوعات، دليل قبول، وخطة رجوع.
3. المنفذ يوثق اختباره؛ المراجع يفحص الأدلة باستقلال قبل اعتماد التغيير.
4. التغيير الصغير عبر فرع وطلب دمج، دون دمج تلقائي أو تعديلات خارج النطاق.
5. الحالات منفصلة: مقترح / منفذ / مختبر / منشور / مثبت حيًا.
6. لا موعد زمني موثوق قبل حسم منتج البداية ومسار التحقق؛ لا أضع مددًا شكلية.

## أول حزمة عمل مقترحة

**المرحلتان 1 و2 بنطاق قراءة فقط:** سجل حالة مختصر للتطبيقات الثلاثة المرشحة + تشخيص عائق MALEK + اقتراح مسار تحقق غير مفاجئ التكلفة. بعدها نختار المنتج الأول بالأدلة، وليس بالاسم أو حجم الكود.
