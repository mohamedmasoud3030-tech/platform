# حالة LENA الحية — الوحيدة

> تُحدَّث مع أي تغيير حالة. التسليمات والتقارير القديمة في تاريخ Git فقط (توحيد 2026-10-21).

# PROJECT_HANDOFF.md — تسليم المشروع لوكيل جديد

**تاريخ الفحص:** 2026-10-15 · **نوع المهمة:** فحص وتوصيات فقط — **لم يُحذف أو يُنقل أو يُعدَّل أي ملف، ولم يُعمل أي commit أو push**

---

## 🔄 تحديث 2026-10-15 (بعد موافقة المالك على التنفيذ)

> القسم الأصلي بالأسفل يظل صحيحًا **كسجل للفحص**، لكن الوضع تغيّر. هذا هو الوضع الحالي.

### ما نُفِّذ

| الإجراء | النتيجة | الحالة |
|---|---|---|
| **دمج `docs/source-of-truth-cleanup` في `main`** | `main` انتقل من `ebcfe72` إلى **`0369716`** (merge commit)، +13 كوميت، 45 ملفًا | ✅ **منشور على GitHub** ومُتحقَّق منه عبر `git ls-remote` **و** REST API |
| **التعديلات المتبقية** | فرع `docs/skill-manifest-and-dead-refs` عند **`a8bbd9d`** — 3 ملفات | ✅ **منشور** كمرجع جديد · **بلا PR** (يُفتح بمعرفة المالك) |
| **فحص `main` الجديد** | `typecheck` exit 0 · `npm test` **91/91** · **0 رابط مكسور** في كل الوثائق الجديدة | ✅ PASS |

**تحقق ما بعد الرفع:** 13 فرعًا · **11 فرعًا بلا تغيير** · صفر حذف · التغيير الوحيد في `main` هو الـ fast-forward المقصود · `PR #4` ما زال `open`/`merged=False`/head `784e50c` · لم يُفتح أي PR جديد بواسطتي (الـ`PR #5` الموجود يخص فرع `docs/2026-10-15-autonomous-execution-protocol` وافتُتح من غيري).

### المشاكل اللي اتحلّت بالدمج

| # | المشكلة | الوضع الآن |
|---|---|---|
| **F-1** | `docs/STATUS.md` مش موجودة على `main` | ✅ **اتحلّت** — بقت موجودة |
| **F-2** | نسختان من `AGENTS.md` | ⚠️ **部分** — اتوحّدت على نسخة التنظيف، لكن لسه فيه فرع `docs/2026-10-15-autonomous-execution-protocol` بيعدّلها |
| **F-3** | ADR-0007 مش في الفهرس | ✅ **اتحلّت** — فرع التنظيف كان ضافه + معه 0008/0009/0010 |
| **F-6** | `architecture-assessment.md` مسودة قديمة معروضة كحالية | ✅ **اتحلّت** — اتنقلت `docs/archive/` |
| **F-9** | `STATUS.md` متأخرة عن N-1 | ⚠️ **لسه** — ما زالت تصف N-1 بأنها PROPOSED |
| **F-10** | وصف `docs/` في README | ✅ **اتحلّت** — README اتعاد كتابته كاملًا |

### تصحيح لكلامي السابق

⚠️ قلت إن فرع التنظيف «توثيق فقط، مافيه ولا سطر كود» — **ده كان غير دقيق**. هو فعلًا **ما بيلمس أي ملف `.ts`/`.js` في `engines/` أو `apps/`** (تحققت: صفر)، لكنه **بيعدّل** `AGENTS.md` و`README.md` و`.gitignore` و`engines/README.md` ووثائق النماذج الأولية، **وبيضيف** سكربتات فحص تحت `tools/spikes/`.

### اللي ما اتنفذش

- ❌ **`PR #4`** — لسه مفتوح، **ما اتدمجش** (مافيش مراجع مستقل). **ده مقصود.**
- ❌ **فجوة `FINANCIAL_RULES.md`** — لسه محتاجة قرار مالك (14 إشارة في 8 ملفات + 4 تصادمات في أرقام ADR).
- ⚠️ فرع `docs/index-and-reference-fixes` (`75c100f`) **محلي فقط وما ارفعش** — بقى متجاوز لأن 3 من تعديلاته الستة بقوا مكررين بعد الدمج. **ما ترفعوش ولا تفتحوه كـ PR.**
- ⚠️ **`PR #5`** مفتوح على فرع `docs/2026-10-15-autonomous-execution-protocol` — **لم أفتحه أنا**، وهو بيعدّل `AGENTS.md` اللي `main` لسه مستلمها من الدمج. محتاج مراجعة قبل الدمج.

---


**كيف تقرأ هذا الملف:** كل معلومة عليها وسم من ثلاثة:

| الوسم | المعنى |
|---|---|
| ✅ **مُتحقَّق الآن** | قرأتُه أو شغّلتُه بنفسي داخل المستودع في هذا الفحص |
| 💬 **منقول من المحادثة** | قيل في محادثة سابقة ولم أُعِد التحقق منه الآن |
| ❓ **غير محسوم** | لا توجد إجابة مؤكدة، ولا يجوز تخمينها |

---

## 1. فهم المشروع

### ما فكرة المشروع؟

✅ **مُتحقَّق الآن** (من `README.md` و `docs/architecture-assessment.md` و `engines/README.md`):

الفكرة اسمها **«مصنع تطبيقات» (App Factory)**: بدل ما تبني كل تطبيق من الصفر، تبني **قدرات أعمال مشتركة مرة واحدة** (بيع، كتالوج، حجوزات، موارد بشرية، أموال) ثم **تعيد استخدامها** في عدة تطبيقات مختلفة.

المنتج الداخلي اسمه **Nile / نيل سيستمز**.

### لمن هو موجه؟

✅ **مُتحقَّق الآن:** المستودع نفسه لا يحدد جمهورًا نهائيًا صريحًا. من طبيعة الأنظمة (كاشير، حجوزات، حضور وانصراف، رواتب، كتالوج) ومن النموذج الأولي، يتضح أنه **أنظمة إدارة لأعمال تجارية صغيرة/متوسطة**، مع دعم عربي (RTL) كامل ومنطقة زمنية `Africa/Cairo`.

❓ **غير محسوم:** هل العميل النهائي هو محمد نفسه، أم أصحاب أعمال آخرون؟ لا يوجد نص صريح يحسم هذا.

### ما الذي يريد المستخدم الوصول إليه؟

✅ **مُتحقَّق الآن** (من `docs/architecture-assessment.md` و `docs/adr/0003`):
- **المرحلة 1 (Milestone 1):** تطبيق واحد يعمل فعلًا لإثبات فكرة «المصنع»، وليس إطارًا عامًا مجردًا.
- **الهدف الاستراتيجي:** منصة مشتركة + تطبيقات رأسية (مبيعات، عقارات وإيجارات، وتطبيقات مستقبلية).

💬 **منقول من المحادثة:** المستخدم يريد في النهاية **واجهة كاشير** تعمل على هذه النواة.

### ما الذي نُفِّذ فعلًا مقابل ما يزال فكرة؟

✅ **مُتحقَّق الآن** — قرأت الكود وشغّلت الاختبارات:

| الحالة | التفاصيل |
|---|---|
| **منفَّذ ومُختبَر** | عزل المستأجرين (Tenancy + RLS) · المصادقة عبر Better Auth مع منظمات وأدوار · مسار البيع الكامل (تسجيل دخول ← صلاحية ← مستأجر ← بيع محفوظ مع الأصناف وحركة المخزون وسجل تدقيق) · الكتالوج · ملفات الهجرة (migrations) وتقوية دور قاعدة البيانات · واجهة برمجة `apps/api` مع OpenAPI |
| **كود مجال فقط — بلا خدمة ولا API** | `engines/booking` (الحجوزات) و `engines/people` (الحضور والرواتب) — الكود موجود ومُختبَر كمنطق، لكن لا يوجد API يستخدمه |
| **نموذج أولي فقط — ليس إنتاجًا** | `prototypes/nilesys/` — منصة Node.js خالصة بقاعدة بيانات ملف JSON، مبنية لاختبار الفكرة والتجربة العربية. **مكتوب عليها صراحة «ليست كود الإنتاج»** |
| **لم يُنفَّذ إطلاقًا** | المدفوعات (Finding G-3) · المرتجعات · ورديات الكاشير · إعادة تعيين بيانات الـ demo يوميًا · **أي واجهة مستخدم للمنتج** · **CI (فحص آلي)** — ✅ تأكدت: لا يوجد مجلد `.github/` |

### ما المهمة الحالية والخطوة التالية؟

💬 **منقول من المحادثة + ✅ تحققت من وجود العمل:**

المهمة الجارية هي **N-1**: إضافة «مستمع أخطاء» لاتصال قاعدة البيانات، حتى لا يتوقف البرنامج كاملًا عندما يُغلق PostgreSQL اتصالًا خاملًا.

✅ **مُتحقَّق الآن:** هذا العمل **تم فعلًا** وموجود على الفرع `fix/nile-pool-error-listener` في كوميتين (`cf3c75f` ثم `29390fa`)، **ومنشور على GitHub**.

⚠️ **ملاحظة مهمة:** وثيقة الحالة `docs/STATUS.md` ما زالت تصف N-1 بأنها **«PROPOSED» (مقترحة)** — أي أن وثيقة الحالة **متأخرة عن الواقع**. انظر الملاحظة F-1 و F-14.

❓ **غير محسوم (قرارات تنتظر المالك):**
- **الاستضافة (D5):** لم يُختر أي مزوّد استضافة. Supabase قُيِّم كـ «قابل للتنفيذ بشروط، غير مُختار».
- **نظام الدفاتر المالية (ADR-0008):** ما زال **PROPOSED** — لم يُعتمد.
- **D2 / D3 / D4:** تقييم ERPNext، وملكيات بيانات مصلحة الضرائب المصرية، وميزانية الدفاتر.

---

## 2. الحالة الحالية

### ✅ مُتحقَّق الآن في هذا الفحص

| البند | القيمة |
|---|---|
| المسار المحلي | `/home/user/repo` |
| الفرع الحالي | `fix/nile-pool-error-listener` |
| HEAD | `29390fa722588d2b471db3c9d057803875f7f5e6` |
| شجرة العمل | **نظيفة تمامًا** (`git status --porcelain` فارغ، ولا توجد ملفات غير متتبعة) |
| `main` المحلي والبعيد | `ebcfe722ebeaba1ed4eebef1c42eae9a7cb399a8` — **متطابقان** |
| الفرق عن `main` | كوميتان، 4 ملفات، 491 سطرًا مضافًا |
| عدد الفروع على GitHub | **11 فرعًا** |
| عدد الملفات المتتبعة | 108 على `main` · 111 على الفرع الحالي |
| CI | **لا يوجد** — لا مجلد `.github/` |

### ⚠️ اكتشاف مهم: تغيّر اسم المستودع

✅ **مُتحقَّق الآن:** اسم المستودع على GitHub أصبح **`mohamedmasoud3030-tech/nilesys`** بدل `Mohamed-App-Factory`.

- الرابط الصحيح: `https://github.com/mohamedmasoud3030-tech/nilesys`
- الاسم القديم **ما زال يعمل** عبر تحويل تلقائي (redirect)، ولذلك لم ينكسر شيء.
- عنوان `origin` المحلي ما زال بالاسم **القديم**.
- ملفان فقط ما زالا يذكران الاسم القديم: `README.md` و `docs/reviews/2026-10-14-n1-pool-error-listener.md`.

### التعديلات غير المحفوظة

| الموقع | الحالة |
|---|---|
| `/home/user/repo` | ✅ نظيف — لا شيء غير محفوظ |
| `/home/user/handoff` (نسخة عمل ثانية) | ✅ تحققت: ملف واحد معدَّل وهو `tools/spikes/supabase-feasibility/probes/run-version.sh` — **تغيير في صلاحية التنفيذ فقط** (`100755` → `100644`)، والمحتوى **مطابق تمامًا** (0 سطر مضاف، 0 محذوف). محفوظ كما هو، لم يُنشر |

### العمل المنشور مقابل غير المنشور

✅ **مُتحقَّق الآن** بمقارنة الفروع:

- ✅ **منشور:** `fix/nile-pool-error-listener` عند `29390fa` — موجود على GitHub.
- **PR #4 مفتوح ولم يُدمج:** `fix(security): append-only ledger for runtime role; lock shared demo logins` — القاعدة `main`، الرأس `784e50c`. الرابط: `https://github.com/mohamedmasoud3030-tech/nilesys/pull/4`
- **فروع مرشحة (candidates) غير مدموجة في `main` وليس لها PR:** `docs/source-of-truth-cleanup` · `handoff/2026-10-14-evidence` · `investigation/g7-runtime-role-boundary-incomplete`

### ⚠️ فرع جديد ظهر أثناء هذا الفحص

✅ **مُتحقَّق الآن:** أثناء الفحص ارتفع عدد الفروع من 11 إلى **12** بظهور:

- `docs/2026-10-15-autonomous-execution-protocol` عند `644f7f6` — كوميت واحد فوق `main`، يغيّر `AGENTS.md` (+10 أسطر) ويضيف `docs/agent-system/AUTONOMOUS_EXECUTION_PROTOCOL.md` (192 سطرًا).
- **لا يتعارض** مع التعديلات الستة (لا يمس أيًا من ملفاتها الخمسة) — ✅ تحققت من ذلك ملفًا بملف.
- لكنه **يغيّر `AGENTS.md`**، وهو نفس الملف الذي يختلف بين `main` وفرع التنظيف (F-2). أي أن `AGENTS.md` صار له **ثلاث نسخ متوازية**. هذا يعزّز الحاجة لقرار المالك في F-2.

### ما نُفِّذ فعلًا بعد الفحص

✅ **مُتحقَّق الآن:** طُبِّقت التعديلات الستة منخفضة المخاطر على فرع جديد:

| البند | القيمة |
|---|---|
| الفرع | `docs/index-and-reference-fixes` (من `main`) |
| الكوميت | `75c100f0de4dafe13362d1302373e8cb5250b33b` |
| الحجم | 5 ملفات، 20 سطرًا مضافًا، 6 محذوفة |
| طبيعة التغيير | توثيق وتعليقات فقط + سطر `.gitignore` — **بلا أي تغيير سلوكي** |
| الفحص | `npm run typecheck` exit 0 · `npm test` exit 0 بـ **91/91** (9 ملفات) · الحزمة الذهبية **27/27** · فحص الروابط: **0 رابط مكسور** |
| الحالة | **محفوظ محليًا؛ الرفع موقوف على موافقة الدخول** |

### ملفات عمل خارج المستودع (لا تسافر معه)

✅ **مُتحقَّق الآن** — موجودة في `/home/user/` وليست داخل المستودع (0 ملفات مطابقة في `git ls-files`):

| الملف | الحجم | ما هو |
|---|---|---|
| `nile-n1-29390fa.bundle` | 15332 بايت | نسخة احتياطية لنقل عمل N-1 |
| `publish-n1.sh` | 2123 بايت | سكربت نشر كان مُعدًّا للاستخدام من طرف المالك |
| `n1-review-cf3c75f.diff` | 54178 بايت | حزمة مراجعة N-1 |

هذه الملفات **لم تعد ضرورية** بعد نجاح النشر، لكنني لم أحذفها (ممنوع في هذه المهمة).

### بيانات المصادقة

✅ **مُتحقَّق الآن:** **لا توجد أي بيانات اعتماد داخل ملفات المستودع.** لا `~/.git-credentials` ولا `~/.netrc` داخل مساحة العمل، وإعدادات git تحتوي على **أمر مساعد** فقط وليس قيمة سرية.

توجد جلسة مصادقة GitHub داخل بيئة العمل **المؤقتة** (خارج المستودع)، وهي تختفي مع انتهاء الجلسة.

💬 **منقول من المحادثة — يحتاج إجراءً من المالك:** رُمِزَ وصول (PAT) سابقان في المحادثة ولم يُستخدما، لكن **يُستحسن إلغاؤهما** من إعدادات GitHub.

---

## 3. خريطة مبسطة للمستودع

### المجلدات الرئيسية

| المجلد | عدد الملفات | وظيفته بلغة بسيطة |
|---|---|---|
| `engines/` | 61 | **قلب المشروع.** قواعد الأعمال الصافية بلغة TypeScript بدون قاعدة بيانات ولا إنترنت ولا واجهة. مقسمة إلى 5 محركات: `platform` (المستأجرون والصلاحيات والتعريب)، `transactions` (الأموال والفواتير والتكاليف)، `booking` (الحجوزات)، `catalog` (الأصناف)، `people` (الحضور والرواتب). ويشمل `engines/db/` للاتصال بقاعدة البيانات |
| `apps/api/` | 8 | **الواجهة الخلفية.** خدمة NestJS/Fastify تربط المحركات بالعالم الخارجي، مع وثيقة OpenAPI |
| `docs/` | 13 | **الوثائق.** قرارات معمارية (ADR) وتقييمات ومراجعات |
| `prototypes/` | 12 | **نموذج أولي** لمنصة نيل سيستمز، للتجربة فقط. **ليس إنتاجًا** |
| `.agents/skills/` | 9 | **تعليمات إجرائية للوكلاء** (كيف تخطط، كيف تختبر، كيف تراجع) |

### تصنيف الملفات المهمة

**أ. أفكار ورؤية المستخدم**
- `docs/architecture-assessment.md` — أول استشارة معمارية، **مسودة بتاريخ 2026-09-04** (انظر F-6)
- `prototypes/nilesys/README.md` + `prototypes/nilesys/REVIEW.md` — **بالعربية**؛ الفكرة كما جرّبها المستخدم فعليًا + تقرير هندسي بـ 30 سيناريو

**ب. قرارات ومتطلبات معتمدة**
- `docs/DECISIONS.md` — فهرس القرارات (⚠️ ناقص، انظر F-3)
- `docs/adr/0001` … `0007` — سبعة قرارات معمارية معتمدة (التقنيات، تعدد المستأجرين، نطاق المرحلة 1، قاعدة البيانات، المصادقة والأمان، عقود API، الأدوار والصلاحيات)
- `AGENTS.md` — **نقطة الدخول الإلزامية** لأي وكيل، وتحدد ترتيب الأولويات عند التعارض

**ج. خطط ومهام**
- ❌ **لا يوجد على `main`.** خطة المهام الحقيقية (`docs/STATUS.md`) موجودة على فروع غير مدموجة فقط — **هذه أهم ملاحظة في التقرير كله** (F-1)
- `docs/REUSE.md` — يحتوي قسم «ما لم يُستخرج بعد» وهو أقرب شيء لخطة مراحل

**د. كود وتنفيذ**
- `engines/*/src/` — 43 ملف كود
- `engines/db/*.ts` — 5 ملفات (الاتصال وتجميع المخططات)
- `apps/api/src/` — 6 ملفات
- `engines/db/migrations/*.sql` — ملفا هجرة (مولَّد + تقوية أمان)

**هـ. اختبارات وإعدادات**
- 11 ملف اختبار: 10 منها يعمل عبر vitest (محركات + `apps/api`)، والحادى عشر `prototypes/nilesys/tests/review.test.js` يعمل عبر `node --test`
- `package.json` · `tsconfig.json` · `vitest.config.ts` · `drizzle.config.ts` · `.gitignore`

**و. تقارير وتسليمات سابقة**
- `docs/reviews/2026-10-14-engines-db-auth-review.md` — 8 نتائج (F1–F8) كلها مُصلحة
- `docs/reviews/2026-10-14-n1-pool-error-listener.md` — تقرير N-1
- `docs/agent-system/REFERENCES.md` — مصادر خارجية مُصنَّفة (ADOPT/ADAPT/REFERENCE/REJECT)

**ز. ملفات مولَّدة — لا تُحرَّر يدويًا**
- `engines/db/migrations/meta/0000_snapshot.json` و `0001_snapshot.json` — 2251 سطرًا **لكل واحد**
- `package-lock.json` — 4576 سطرًا

**ح. ملفات لم تتضح وظيفتها**
- لا يوجد شيء مبهم على `main`. كل ملف الـ 108 له وظيفة واضحة.

---

## 4. تقييم التنظيم والتشتيت

> **قاعدة التقييم:** لم أحكم على أي ملف من اسمه أو تاريخه. كل ملاحظة below مبنية على قراءة المحتوى وفحص المراجع. **عدم وجود مرجع لا يثبت أن الملف غير مستخدم.**

| # | المسار | المشكلة المحددة | الدليل المختصر | التوصية | الثقة |
|---|---|---|---|---|---|
| **F-1** | `docs/STATUS.md` | **وثيقة الحالة المركزية غير موجودة على `main` إطلاقًا.** أي وكيل يبدأ من `main` لن يجد خطة المهام ولا سجل النتائج ولا حالة الفروع | ✅ `git ls-tree` لكل فرع: **مفقودة** على `main` و `fix/nile-pool-error-listener`، **موجودة** على `origin/docs/source-of-truth-cleanup` و `origin/handoff/2026-10-14-evidence` (ومتطابقة فيهما) | **قرار مالك:** دمج فرع `docs/source-of-truth-cleanup`، أو نسخ `STATUS.md` وحدها إلى `main` | **عالية** |
| **F-2** | `AGENTS.md` | **نسختان مختلفتان من ملف التعليمات الإلزامي.** نسخة `main` أبسط؛ نسخة فرع التنظيف أضافت نظام «طبقات» (tiers) و120 سطرًا | ✅ `git diff --stat main origin/docs/source-of-truth-cleanup -- AGENTS.md` → 120 إضافة / 8 حذف. النسخة الجديدة تُعرِّف 4 طبقات وتُلزم باتباع `docs/STATUS.md` | **قرار مالك:** اعتماد نسخة واحدة. لا يجوز أن يعمل وكيلان بقاعدتين مختلفتين | **عالية** |
| **F-3** | `docs/DECISIONS.md` | **القرار ADR-0007 غير مُدرَج في الفهرس** رغم أنه معتمد ومستخدَم في 3 أماكن | ✅ الملف موجود وحالته `Accepted` بتاريخ 2026-10-14؛ لكن `grep -c '0007' docs/DECISIONS.md` = **0**. ويشير إليه: `engines/README.md:28`، `engines/platform/src/auth/permissions.ts:2`، `docs/REUSE.md:45` | إضافة سطر 0007 إلى جدول الفهرس | **عالية** |
| **F-4** | `engines/transactions/src/*.ts` + `test/golden.test.ts` (8 ملفات) | **⚠️ أكبر من مرجع مكسور واحد — فجوة منهجية.** عقد القواعد المالية الذي يعتمد عليه كود الأموال **غير موجود في المستودع إطلاقًا**، وأرقام ADR القادمة من المستودع المصدر **تتصادم** مع أرقام هذا المستودع | ✅ `docs/FINANCIAL_RULES.md` **غير موجود** لكنه مُشار إليه **14 مرة في 8 ملفات** (`cash`, `costing`, `decimal`, `line`, `regrade`, `sale`, `units`, `golden.test`). ✅ **4 تصادمات رقمية:** `0004-decimal-arithmetic` ↔ `0004-orm-and-database-access` · `0006-costing-model` ↔ `0006-rest-and-openapi-api-contract` · `0007-regrade-allocation` ↔ `0007-roles-and-permissions…` · و`ADR-0008` في `costing.ts:69` ↔ `0008-build-vs-adopt-ledger-substrate` (على فرع التنظيف). ✅ `0009-cash-reconciliation` غير موجود بلا تصادم | **قرار مالك، لا إصلاح آلي:** إمّا إنشاء `docs/FINANCIAL_RULES.md` يوثّق القواعد الفعلية (المصدر الوحيد الصادق حاليًا هو الحزمة الذهبية `golden.test.ts`)، أو ترقيم مراجع المستودع المصدر ببادئة تميّزها، أو اعتبارها provenance فقط. **تم تصحيح `regrade.ts` وحده** (البند 6) مع تسجيل أن الحالة عامة | **عالية** |
| **F-5** | `.agents/skills/README.md` | **مهارتان موجودتان على القرص لكنهما غير مُدرَجتين في الفهرس**، و`AGENTS.md` يوجّه الوكيل للاعتماد على الفهرس — فلن يكتشفهما أحد | ✅ 8 مهارات على القرص مقابل 6 في الفهرس. الناقص: **`security-review`** و **`source-driven-development`** | إضافة المهارتين إلى جدول الفهرس (ملاحظة: `security-review` مهمة تحديدًا في مشروع فيه RLS) | **عالية** |
| **F-6** | `docs/architecture-assessment.md` | **تقرير قديم يمكن فهمه خطأً باعتباره الحالة الحالية.** يقول إن المستودع «يحتوي README.md واحدًا فقط، ولا يوجد كود ولا توثيق» | ✅ السطر 4: `Status: Draft` بتاريخ 2026-09-04؛ السطر 22: «يحتوي README.md واحدًا فقط… لا يوجد كود». والواقع الآن 108 ملفات متتبعة و61 ملف كود. و`README.md` يربطه كوثيقة معمارية حالية | **أرشفة** — وفرع التنظيف فعل ذلك بالفعل: نقله إلى `docs/archive/2026-09-04-architecture-assessment.md` | **عالية** |
| **F-7** | `prototypes/nilesys/REVIEW.md` | **يشير إلى مسارات جهاز لم تعد موجودة**، فيصعب على وكيل جديد تتبع دليله | ✅ يذكر `/home/user/nilesys/` و`/home/user/nilesys-backup-phase1.tar.gz` — كلاهما **خارج المستودع** وغير موجود | إبقاء الملف كمرجع تاريخي مع إضافة ملاحظة أن المسارات خارجية وماتت | **عالية** |
| **F-8** | `prototypes/README.md`<br>`prototypes/nilesys/README.md`<br>`prototypes/nilesys/REVIEW.md` | **لغة غير متسقة:** 3 وثائق بالعربية وكل المستودع بالإنجليزية | ✅ عدّ الأسطر العربية: REVIEW.md ‏152/242 · README.md ‏59/91 · prototypes/README.md ‏26/46. و`docs/STATUS.md` نفسها تسجّل هذا كمهمة رقم 7 | **أولوية منخفضة** — قرار مالك. المحتوى العربي هنا **قيمة** (قاموس مصطلحات وتجربة RTL) وليس عيبًا | **عالية** |
| **F-9** | `docs/STATUS.md` §5 | **وثيقة الحالة متأخرة عن الواقع** بخصوص N-1 | ✅ تصف N-1 بأنها «PROPOSED» بينما هي منفَّذة ومنشورة عند `29390fa` | تحديث `STATUS.md` عند دمج فرعها | **عالية** |
| **F-10** | `README.md` | **وصف غير دقيق لمحتوى `docs/`** — يقول إنها تحوي «مهارات الوكلاء» وهي في `.agents/skills/` | ✅ نص `README.md`: «`docs/` — architecture decisions (ADRs), assessments, and agent skills» · ولا توجد مهارات داخل `docs/` | تصحيح السطر | **عالية** |
| **F-11** | `README.md` | يذكر مجلدات `modules/` و `platform/` كجزء من الهيكل، ولا وجود لها | ✅ النص يقول «Created in Milestone 1» فهو **تطلع للمستقبل لا خطأ**، لكنه قد يُربك قارئًا جديدًا | إضافة كلمة «مخططة» بوضوح | **متوسطة** |
| **F-12** | `/home/user/handoff` | نسخة عمل ثانية معلّقة بحالة «detached» وفيها تعديل صلاحية غير محفوظ | ✅ `git worktree list` يُظهر نسختين · `git diff --numstat` = 0/0 (تغيير mode فقط) | تركها كما هي الآن، وتنظيفها لاحقًا بقرار مالك | **عالية** |
| **F-13** | `.gitignore` | سطر `node_modules/` مكرر مرتين | ✅ يظهر في السطر 12 والسطر 20 | تكرار بلا ضرر — يُصلح عند أول تعديل للملف | **عالية** |
| **F-14** | `README.md` (و`docs/reviews/2026-10-14-n1-pool-error-listener.md` على فرعه فقط) | يذكران اسم المستودع القديم | ✅ **تصحيح:** على `main` كان `README.md` هو الملف **الوحيد** (العدد الآن 0 بعد الإصلاح). أما تقرير N-1 فموجود فقط على فرع `fix/nile-pool-error-listener` وليس على `main` — لأنني فحصت أولًا من ذلك الفرع | `README.md` مُصلَّح · تقرير N-1 يُصلَّح على فرعه عند دمجه | **عالية** |

### ما بحثتُ عنه ولم أجد له مشكلة

✅ **مُتحقَّق الآن:**
- **لا توجد روابط Markdown مكسورة** داخل `main` — فحصت كل الروابط النسبية في كل ملفات `.md` برمجيًا: **صفر رابط معطوب**.
- **لا توجد ملفات غامضة** أو بلا وظيفة على `main`.
- **لا توجد نسخ متعددة من نفس الكود** بلا تحديد أيها المعتمد — التكرار الوحيد هو ملفات `meta/*_snapshot.json` وهي **مولَّدة آليًا** ومقصودة.
- **لا توجد أسرار أو بيانات اعتماد** داخل ملفات المستودع.

> **ملاحظة أمانة:** `prototypes/nilesys/README.md` يحتوي بيانات دخول **تجريبية معلنة** لنموذج أولي يعمل بملف JSON. لم أكررها هنا. هي مقصودة للتجربة وليست سرًا إنتاجيًا، لكن يُستحسن التنويه عنها في أي نشر عام.

---

## 5. مصدر الحقيقة

### هل توجد وثيقة معتمدة تمثل الوضع الحالي؟

**الإجابة تعتمد على الفرع — وهذا هو جوهر المشكلة:**

| على `main` (ما يراه أي وكيل جديد) | على فرع `docs/source-of-truth-cleanup` |
|---|---|
| ❌ **لا توجد وثيقة حالة.** `AGENTS.md` نقطة دخول جيدة لكنها **لا تحوي الحالة ولا المهام** | ✅ **`docs/STATUS.md`** — وتُعلن عن نفسها صراحة: «canonical… الوثيقة الوحيدة الحيّة للحالة والتسليم» |
| ⚠️ `docs/DECISIONS.md` فهرس **ناقص** (بلا 0007) | ✅ `docs/ARCHITECTURE.md` + `docs/README.md` + ADR-0008/0009/0010 |
| ✅ ADRs نفسها سليمة وموثوقة | ✅ + مجلد `docs/archive/` للأرشيف |

✅ **الخلاصة المُتحقَّق منها:** **يوجد مصدر حقيقة ممتاز… لكنه غير مدموج في `main`.** فرع `docs/source-of-truth-cleanup` أضاف **34 ملف توثيق** (منها `STATUS.md` و `ARCHITECTURE.md` و3 قرارات جديدة و7 مقترحات ومجلد أرشيف) وحذف ملفًا واحدًا (نقله للأرشيف).

### التعارضات التي تحتاج **قرار المالك** — لا يجوز للوكيل حسمها

1. **أي نسخة من `AGENTS.md` هي المعتمدة؟** (F-2) — النظام الطبقي الجديد أفضل تنظيمًا، لكن اعتماده قرار.
2. **هل يُدمج فرع `docs/source-of-truth-cleanup` في `main`؟** هذا يحل F-1 و F-2 و F-6 دفعة واحدة، لكنه تغيير توثيقي كبير.
3. **تعارض رقم ADR-0007** (F-4): القرار المعتمد هو «الأدوار والصلاحيات»، بينما كود `regrade.ts` يفترض وجود قرار بنفس الرقم عن «توزيع الخصومات». **أيهما يحتفظ بالرقم؟**
4. **هل يُنشأ ملف `docs/FINANCIAL_RULES.md`؟** الكود يعتمد عليه كعقد رسمي للقواعد المالية وهو غير موجود.
5. **الاستضافة (D5) ونظام الدفاتر (ADR-0008):** ❓ غير محسومين وينتظران المالك.

---

## 6. خطة تنظيف مقترحة — **لا تُنفَّذ قبل الموافقة**

### أ. تنظيم منخفض المخاطر (تعديلات نصية صغيرة، بلا نقل ملفات)

| الإجراء | يعالج | الخطر |
|---|---|---|
| إضافة سطر ADR-0007 إلى جدول `docs/DECISIONS.md` | F-3 | شبه معدوم |
| إضافة `security-review` و `source-driven-development` إلى فهرس المهارات | F-5 | شبه معدوم |
| تصحيح وصف `docs/` في `README.md` | F-10 | شبه معدوم |
| إزالة تكرار `node_modules/` في `.gitignore` | F-13 | معدوم |
| تحديث اسم المستودع في ملفين | F-14 | منخفض — الاسم القديم ما زال يعمل |
| تصحيح تعليق `regrade.ts:8` ليشير لمصدر حقيقي | F-4 (جزئيًا) | منخفض — تعليق فقط، بلا تغيير سلوك |

### ب. دمج وثائق بعد مراجعة المحتوى

| الإجراء | يعالج | شرط التنفيذ |
|---|---|---|
| **دمج `docs/source-of-truth-cleanup` في `main`** | F-1 · F-2 · F-6 · F-9 | **قرار مالك + مراجعة محتوى.** يجلب 34 ملف توثيق ويوحّد `AGENTS.md`. يجب تحديث `STATUS.md` أولًا لأنها متأخرة بخصوص N-1 |
| دمج `handoff/2026-10-14-evidence` | يجلب أدلة الاختبارات والمراجعات | مبني فوق فرع التنظيف، فيُدمج بعده. **يحتوي 97 ملفًا إضافيًا** معظمه أدلة خام — قرار مالك إن كانت تستحق الدمج أم تبقى كأرشيف فرع |

### ج. أرشفة مواد تاريخية مع الحفاظ عليها

| الإجراء | يعالج | ملاحظة |
|---|---|---|
| نقل `docs/architecture-assessment.md` إلى `docs/archive/` | F-6 | **فرع التنظيف نفّذها بالفعل** — تُعتمد تلقائيًا عند دمجه |
| وضع لافتة «تاريخي» أعلى `prototypes/nilesys/REVIEW.md` | F-7 | يُبقي المحتوى ويمنع الفهم الخاطئ |
| إبقاء الفروع الأربعة المدموجة (`arena/*`, `feat/*`) كما هي | — | GitHub يحتفظ بمراجع الـ PR حتى بعد الحذف، لكن **لا داعي للاستعجال** |

### د. حذف محتمل — **يحتاج موافقة صريحة وفحصًا إضافيًا**

> ⚠️ **لا أوصي بحذف أي شيء الآن.** القائمة التالية للتوثيق فقط:

| العنصر | لماذا قد يُحذف | لماذا **لا** أنصح بالحذف الآن |
|---|---|---|
| الفروع الأربعة المدموجة في `main` | `STATUS.md` تقترح حذفها | حذف فروع **ممنوع** بدون موافقة صريحة، والفائدة شكلية |
| `tools/spikes/nile-review/scratch-2026-10-14/` (على فرع التسليم) | اسمها «scratch» أي مسودات | **الاسم لا يثبت أنها غير مهمة** — هي أدلة مراجعة لـ PR #4 المفتوح. **أرشيف لا حذف** |
| ملفات `/home/user/` الثلاثة (bundle, script, diff) | صارت زائدة بعد النشر | خارج المستودع أصلًا، ولا تضر. تُحذف بقرار مالك |

### ما قد يتأثر بالنقل أو إعادة التسمية

✅ **مُتحقَّق الآن:**
- نقل `docs/architecture-assessment.md` **سيكسر رابطًا في `README.md`** — يجب تحديثه في نفس التغيير.
- نقل أي ADR **سيكسر 3 مراجع** في `engines/README.md` و `permissions.ts` و `docs/REUSE.md`.
- `docs/STATUS.md` (على فرعها) تحتوي **عشرات الروابط النسبية** لمراجعات ومقترحات — نقلها وحدها بدون بقية المجلد سيُنتج روابط ميتة. **لهذا يُنصح بدمج الفرع كاملًا لا نسخ ملف واحد.**
- لا توجد أدوات بناء أو CI تعتمد على مسارات الوثائق (لا يوجد CI أصلًا).

---

## 7. تسليم للوكيل الجديد

### ما الذي يجب أن يقرأه أولًا، بالترتيب؟

1. **`AGENTS.md`** — قواعد العمل وترتيب الأولويات عند التعارض. **إلزامي.**
2. **`docs/DECISIONS.md` ثم ADR-0001 و 0002 و 0004 و 0005** — القرارات المعمارية الملزمة. (وتذكّر أن 0007 مفقود من الفهرس — اقرأه من ملفه مباشرة.)
3. **`docs/STATUS.md` — لكن من فرع `origin/docs/source-of-truth-cleanup`**، لأنه غير موجود على `main`. هذه أهم خطوة غالبًا ما تُفوّت.
4. **`engines/README.md`** — ما الذي يملكه كل محرك.
5. **`docs/REUSE.md`** — أصل كل ملف ومن أين جاء.
6. **هذا الملف (`PROJECT_HANDOFF.md`)** — للحالة الميدانية والتعارضات المفتوحة.

### قرارات يجب الحفاظ عليها وعدم المساس بها

- ✅ **قاعدة «لا واجهة منتج قبل محركها»** — مكتوبة في `README.md` و `engines/README.md`.
- ✅ **النتائج المالية الذهبية** (`engines/transactions/test/golden.test.ts`) — **ممنوع تغييرها بدون ADR** (منصوص في `docs/REUSE.md`).
- ✅ **عزل المستأجرين المغلق (fail-closed RLS)** والدور `nile_app` الذي لا يستطيع تجاوز RLS — البرنامج **يرفض الإقلاع** لو كان الدور يتجاوز RLS.
- ✅ **القرارات المعتمدة ADR-0001…0007 غير قابلة للتعديل** — التغيير يحتاج ADR جديدًا يلغي القديم.
- ✅ **`PR #4` يملك رقم الهجرة `0002`** — لا تُنشأ هجرات جديدة قبل دمجه.
- ✅ **لا دمج في `main` ولا إغلاق `PR #4` ولا حذف فروع** بدون إذن المالك.

### ما الذي يجب ألا يفترضه الوكيل؟

- ❌ **لا تفترض أن `docs/STATUS.md` موجودة على `main`** — ليست كذلك.
- ❌ **لا تفترض أن `AGENTS.md` على `main` هي النسخة النهائية** — توجد نسخة أوسع على فرع التنظيف.
- ❌ **لا تفترض أن `docs/architecture-assessment.md` تصف الوضع الحالي** — هي مسودة 2026-09-04 تصف مستودعًا فارغًا.
- ❌ **لا تفترض أن `prototypes/nilesys` كود إنتاج** — هو نموذج أولي بكلمات مرور نصية وبلا عزل مستأجرين، ومكتوب عليه ذلك صراحة.
- ❌ **لا تفترض أن وجود 91 اختبارًا ناجحًا يعني تغطية كاملة** — 5 اختبارات (`pool-resilience.pg.test.ts`) **تُتخطى تلقائيًا** ما لم تُوفَّر قاعدة PostgreSQL حقيقية.
- ❌ **لا تفترض أن مرشح G-7 (`60342be`) إصلاح أمني** — `STATUS.md` تصفه صراحة بأنه **INCOMPLETE / ليس إصلاحًا**، والمطلوب مراجعته تصميميًا.
- ❌ **لا تفترض أن الاستضافة محسومة** — ❓ غير محسومة.
- ❌ **لا تستخدم أي مشروع Supabase قائم** — ممنوع.

### أهم الأسئلة المتبقية للمستخدم (5 فقط)

1. **هل توافق على دمج فرع `docs/source-of-truth-cleanup` في `main`؟** هذا وحده يحل أكبر 4 مشاكل تنظيمية (F-1, F-2, F-6, F-9).
2. **أي نسخة من `AGENTS.md` تريد أن تكون المعتمدة؟** (البسيطة على `main` أم الموسّعة بنظام الطبقات؟)
3. **قرار ADR-0007:** «الأدوار والصلاحيات» أم «توزيع الخصومات» — أيهما يحتفظ بالرقم؟ وهل تريد إنشاء `docs/FINANCIAL_RULES.md`؟
4. **هل تريد مراجعة مستقلة لـ `PR #4` قبل دمجه؟** المراجعة الوحيدة الموجودة هي من كاتب الـ PR نفسه.
5. **متى تريد حسم الاستضافة (D5) ونظام الدفاتر (ADR-0008)؟** هما يعطلان مهام لاحقة.

### أول خطوة آمنة لاستكمال العمل

> **تنفيذ البند (أ) من خطة التنظيف فقط** — التعديلات النصية الصغيرة الستة (فهرس ADR-0007، فهرس المهارات، وصف `docs/` في `README`، تكرار `.gitignore`، اسم المستودع، تعليق `regrade.ts`) على **فرع جديد منفصل من `main`**، ثم فتح PR للمالك.
>
> **لماذا هي الآمنة؟** لا تنقل ملفًا، ولا تكسر رابطًا، ولا تغيّر سلوك أي كود، ولا تلمس `main` مباشرة، ويمكن التراجع عنها بالكامل.
>
> **ما يجب تأجيله:** دمج فروع التوثيق (يحتاج قرار مالك)، وأي عمل على المدفوعات (محجوب بـ `PR #4`)، وأي واجهة مستخدم.

---

## الحكم النهائي

> # المشروع يحتاج **تنظيفًا محدودًا ومركّزًا في التوثيق** — وليس إعادة تنظيم واسعة.

### الأسباب

**ما هو سليم بالفعل (ولا يحتاج تدخلًا):**
- ✅ **الكود منظّم بوضوح:** فصل نظيف بين `engines` (منطق صافٍ) و `apps/api` (الواجهة) و `prototypes` (تجربة) و `docs` (قرارات). هذا فصل معماري مقصود وموثق بـ ADRs.
- ✅ **صفر رابط مكسور** في وثائق `main` (فحص برمجي شامل).
- ✅ **صفر ملف غامض** على `main` — كل الـ 108 ملفات لها وظيفة مفهومة.
- ✅ **لا أسرار ولا بيانات اعتماد** داخل المستودع.
- ✅ **شجرة عمل نظيفة** ولا عمل ضائع.
- ✅ **أصل كل ملف موثّق** في `docs/REUSE.md` — وهذا نادر وثمين.

**ما يحتاج تنظيفًا (وكله توثيق، لا كود):**
- ⚠️ **المشكلة الجذرية واحدة:** التوثيق الحقيقي يعيش على **فرعين غير مدموجين**، فصار هناك **عالَمان متوازيان** — `main` بوثائقه الناقصة، وفرع التنظيف بوثائقه الكاملة. تسع من الملاحظات الأربع عشرة تعود إلى هذا السبب.
- ⚠️ **تعارض رقم ADR-0007** يحتاج قرارًا بشريًا.
- ⚠️ **مهارتان مخفيتان** عن الوكيل بسبب فهرس ناقص.
- ⚠️ **تقرير 2026-09-04** ما زال يُعرض كوثيقة حالية.

**لو نُفِّذ البند (ب) فقط** (دمج فرع التنظيف بعد مراجعة المالك) **لاختفت 4 من أهم الملاحظات دفعة واحدة**، ولصار للمستودع مصدر حقيقة واحد واضح.

### حدود هذا الفحص — ما لم أفعله

- ❌ **لم أحذف أو أنقل أو أعيد تسمية أي ملف.** لم أعدّل كودًا ولا وثيقة. لم أعمل commit أو push.
- ⚠️ **لم أتحقق من N-1 على PostgreSQL حقيقي في هذا الفحص.** الاختبارات الخمسة المعنية **تُخطِّيت** لعدم توفر قاعدة بيانات حقيقية (`NILE_TEST_PG_ADMIN_URL` غير مضبوط). ✅ ما تحققت منه: `npm run typecheck` نجح (exit 0) و `npm test` نجح (exit 0) بـ **91 ناجح + 5 متخطاة من 96** عبر 10 ملفات.
- 💬 نتائج N-1 على PostgreSQL ‏15.18/17.10/18.4 (96/96) **منقولة من محادثة سابقة** ولم أُعِد تشغيلها.
- ❌ **لم أشغّل النموذج الأولي** (`prototypes/nilesys/server.js`) ولم أختبره.
- ❌ **لم أُجرِ تدقيقًا أمنيًا.** سجل النتائج G-1…G-15 منقول من `docs/STATUS.md` على فرعها، ولم أُعِد验证ه.
- ⚠️ **قراءة كاملة:** `AGENTS.md` · `README.md` · `docs/DECISIONS.md` · `docs/REUSE.md` · `engines/README.md` · `prototypes/README.md` · `.agents/skills/README.md` · `docs/agent-system/REFERENCES.md` · و`docs/STATUS.md` كاملًا من فرعها.
- ⚠️ **قراءة جزئية (العناوين والأقسام الحاكمة فقط):** `docs/architecture-assessment.md` (40 سطرًا من 376) · `docs/reviews/2026-10-14-engines-db-auth-review.md` (22 من 50) · `prototypes/nilesys/README.md` و `REVIEW.md` (المقدمات) · و**من ملفات ADR السبعة قرأت رأس ADR-0007 فقط** (519 سطرًا إجمالًا لم تُقرأ كلها).
- ⚠️ **فحص انتقائي للكود:** فحصت المسارات والمراجع والتعليقات وروابط العقود، **ولم أقرأ كل سطر** في 43 ملف كود داخل المحركات.
- ❌ **لا أدّعي سلامة الكود أو اجتياز الاختبارات لما لم أشغّله.** ما ورد أعلاه من نتائج اختبار هو ما شغّلته فعلًا في هذا الفحص فقط.


---

# LENA Digital House — Final Roadmap & Execution Checklist

**Status date:** 2026-09-09 · **Current `main`:** `d74858a` · **Source of truth reconciled from:** `PLATFORM_PRD.md` (live), `OPEN_DECISIONS.md` (live register), `lena-direction-refined.md`, `docs/CHAMBER_AUDIT_2026-09-09.md`, and independent verification performed across this engagement (real diffs, real CI runs, real baseline images — not status reports taken on faith).

This document is the fixed reference for future tranche reports: update against this checklist's item numbers rather than restating scope from scratch. Everything below is either: (a) verified complete, (b) blocked on a named external party with a named unblock condition, or (c) sequenceable now. Nothing is included on the strength of a claim alone — see each item's evidence pointer.

---

## 0. What is actually done (do not re-litigate)

Verified — engineering complete, CI green, baseline-audited where visual:

- Mobile `content-visibility` void/layout-shift fix (#71)
- House Ledger register on World/Chamber surfaces (#72)
- Home copy → house register, evidence windows for MALEK/Lara Beauty, founder strip (#73)
- Documentation parity: `lena-direction-refined.md` committed; FR-1/B1 staleness corrected (#75)
- Frontage hero replacing the orbit — 6 windows, lit-iff-documented, guardian contracts migrated with equal-or-stronger assertions (#74)
- Part B dependency/hygiene remediation — advisory bumps, PWA offline shell, dashboard status filter (#76)
- Chamber audit (CHAMBER-R1) — two real shared-surface copy defects found and fixed, contracts hardened (#77)
- Automated WCAG 2.x A/AA layer in CI (axe-core, 16 route/theme/locale combos) + contrast token fixes (#78)
- House Ledger register extended to **every** remaining public surface; ambient orb/glow system retired site-wide (#79)
- Ledger remnant sweep — remaining cosmos accents flattened (#80); follow-up completion — last public fills neutralized, duplicate ≤720px responsive block consolidated, selector-level §17 register (#87 → `64e75bc`, run `34311694330`)
- Ambient system fully deleted, zero dangling references (#82, independently `grep`-confirmed)
- Guardian test matrix expanded to all six public chambers, bilingual/RTL, 63/63 (#83, #84); B-10 operator-record browser contract added — 12 smoke tests pinning visible-on-evidence-bearing / absent-on-pending chambers in both locales (#89 → `324ca92`)
- FR-4 "five" → six-product staleness corrected
- B-10 / D6 / R7 operator-record scaffold on the evidence-bearing chambers (MALEK + Lara Beauty) — evidence-gated content module + ledger-grammar chamber section, bilingual, tests pinned; remaining chambers gain records in the same tranche their evidence registers (**#88 → `0135c0c`, run `34318985015`; baselines `chamber-desktop-dark`/`chamber-mobile-dark` regenerated from CI Chromium actuals, run `34318280863`, artifact `10090952343`**)
- Credential hygiene (T0-1) — closed 2026-09-09: token audit clean (never in repo files or shell history; appeared only in the chat transcript), invalid token rotated by the owner; delivery resumed with the replacement
- Transitive advisory floors raised — `pnpm audit --prod` from 1 low + 3 moderate to **0 known vulnerabilities** (qs 6.16.0, body-parser 2.3.0 via workspace overrides; **#90 → `d74858a`**, run `34327246072`)

**Do not re-open, re-litigate, or re-implement any of the above.** If something here looks wrong, that's a bug report against a specific commit, not a new tranche.

---

## 1. Dependency map (why this order)

```
[Owner one-word decisions] ─── unblocks ──▶ [C1 admin failover, B4 client naming, F1 materials]
        (no other dependency)

[Credential hygiene check] ─── independent, do first, blocks nothing, blocked by nothing

[Founder evidence access] ─── unblocks ──▶ [Evidence capture ×4] ─── auto-unblocks ──▶ [Home windows,
                                                                                          Chamber plates,
                                                                                          Operator sections,
                                                                                          A5 hospitality
                                                                                          reconciliation]

[AT/screen-reader environment] ─── unblocks ──▶ [Final accessibility pass]

[All of the above] ─── unblocks ──▶ [Final full-checklist re-verification] ─── = ──▶ [DEFINITION OF DONE]
```

Three independent tracks (owner decisions, evidence access, AT environment) converge on one final verification gate. Nothing in this roadmap is sequenced arbitrarily — everything downstream of an unblocked item can start immediately; everything downstream of a blocked item waits on the named party, not on more engineering.

---

## 2. Tier 0 — Owner one-word decisions

| # | Item | Action needed | Owner | Status |
|---|---|---|---|---|
| **T0-1** | **Credential hygiene** | Confirm where the authenticated git remote URL used during the #80–#86 autonomous batch came from and whether it was ever written to shell history, logs, or a chat transcript outside a proper credential store. Rotate the PAT if there's any doubt. | You | **DONE 2026-09-09** — audit: token lived only in live-session `.git/config`; absent from repo files and shell history; present in this chat transcript. Old token invalid (401) → rotated by owner; delivery resumed |
| **T0-2** | **F1 — `materials` visibility** | One word: keep hidden (recommended — reveal is a one-line flip later, nothing lost by waiting), reveal now, or deprecate. | You | Open |
| **T0-3** | **C1 — second admin identity** | Provide the actual account id; mechanism is already built and tested. Closes the "one lost account = permanent lockout" risk. | You | Open |
| **T0-4** | **B4 — hospitality client naming** | Written permission (or continued withholding) to name the hospitality client. Currently withheld; no change needed if that stands. | You | Open |
| **T0-5** | **C3 — CI `workflows` permission** | Either grant the connector `workflows` scope, or paste the 4 documented lines yourself (`docs/CI_VERIFY_STEP.md`). Currently deferred by your own prior answer — only revisit if you want it resolved. | You (optional) | Open (optional) |

None of these require engineering time. Each is "a sentence," per the register's own framing.

---

## 3. Tier 1 — The one real P0: evidence capture

This is the actual bottleneck of the entire project. Everything else is either done or waiting on this.

**Current state (verified directly from `evidence.ts`):** MALEK = 7 surfaces, Lara Beauty = 10 surfaces. LENA Dress, Hospitality, Terranex, Kayyal = 0.

**The mechanism is fully built and turnkey** — `docs/EVIDENCE_CAPTURE_GUIDE.md` documents the process; `evidence.ts`'s schema is proven at 2-product scale; `windowFor()` (Home cards + Frontage windows) and the Chamber evidence-plate renderer are both **generic** — they light up automatically the moment an entry exists in the registry. No code changes are needed per product; only real captures.

| # | Tranche | Blocked by | What happens automatically once unblocked |
|---|---|---|---|
| **T1-1** | LENA Dress evidence capture | Founder access/time | Card window + Frontage window lit + Chamber plates rendered + operator record gained (B-10 scaffold ready) |
| **T1-2** | Hospitality evidence capture | Founder access/time | Same, **plus**: closes the A5 code/register discrepancy — hospitality can only carry a real "in real use" public signal once evidence backs it |
| **T1-3** | Terranex evidence capture | Founder access/time | Same |
| **T1-4** | Kayyal evidence capture | Founder access/time | Same |

**Sequencing note:** do these one at a time, one PR per product (established pattern), not as a batch — each is independently verifiable and independently valuable the moment it lands; there's no reason to hold all four for a single release.

**Recommended order:** Hospitality first if practical — it's the only one that also resolves an existing register/code inconsistency (A5 answered "in real use" in 2026-08-20, but `systems.ts` correctly withholds that claim publicly until evidence exists). Otherwise, whichever the founder can access soonest.

---

## 4. Tier 2 — Automatically unblocked by Tier 1 (no separate engineering tranche)

These aren't separate work items — they're consequences of evidence landing, already coded to trigger correctly:

- **HOME-R2** — Home card evidence windows for the 4 remaining products: automatic (`windowFor` is generic)
- **Frontage window lighting** for the 4 remaining products: automatic (same evidence source as the cards)
- **Chamber evidence plates** for the 4 remaining products: automatic (same registry-driven renderer used by MALEK/Lara Beauty)
- **A5 hospitality reconciliation**: automatic the moment hospitality evidence lands — no code change, the internal `stage` field already exists, only the evidence-gate decides what's public

| # | Item | Status | Trigger |
|---|---|---|---|
| **T2-1** | **B10 — Operator section per product page** ("who exactly runs this day to day") | **Scaffold DONE (#88 → `0135c0c`)** — evidence-gated content module (`features/world/content/operator.ts`) + ledger-grammar chamber section on MALEK/Lara Beauty, verbatim from the B2 register, open D6 aspects declared honestly; 6 contract tests. **Per-product operator records for the remaining four systems** depend on Tier 1 (record added in the same tranche as each product's evidence) | Scaffold delivered; per-product content completion depends on Tier 1 |

---

## 5. Tier 3 — Owner/business-triggered, not currently blocking

Not on the critical path. Act on these when their trigger condition is met, not before.

| # | Item | Trigger |
|---|---|---|
| **T3-1** | D2 — legal review of the six privacy questions | Before actively marketing to the English-speaking market — not before general launch |
| **T3-2** | B13 — pagination for `inquiries.list` | At ~500 inquiries; deliberately deferred until then |
| **T3-3** | C2 — SMTP credentials | Whenever you want the notification email to actually fire; dashboard remains the reliable source until then |
| **T3-4** | C4 — AI draft translation | Already answered **no** — re-open only if you change your mind; not a pending action |

---

## 6. Tier 4 — Genuinely tooling-blocked

| # | Item | Blocked by | Status |
|---|---|---|---|
| **T4-1** | Assistive-technology (screen reader) accessibility pass | No AT-capable environment available in any sandbox used on this project | Automated layer (axe-core, WCAG 2.x A/AA, CI-enforced) is done and is the strongest available substitute; this row is the one remaining manual/human-side check |
| **T4-2** | Low-end device performance measurement | Same — no device/tooling available | Deferred; revisit if a real performance complaint surfaces or before a push to a bandwidth-constrained market |

These aren't "blocked forever" — they're blocked on a resource nobody in this engagement has had access to. If you have a screen-reader user or a low-end test device available to you directly, T4-1 in particular is worth closing out; it's the last piece of the accessibility Definition-of-Done line.

---

## 7. Tier 5 — Final gate

**T5-1 — Final full-checklist re-verification.** Once Tier 0–1 owner items and Tier 1 evidence are resolved (T4 can remain open per below — see DoD note), run one last complete pass: typecheck, full test suite, `verify-all`, guardian static integrity, smoke, safety, guardian visual across every surface/locale/theme, and a fresh independent read of the actual diffs and baseline images for whatever landed last — same rigor as every tranche in this engagement, not a rubber stamp.

---

## 8. Definition of Done

The platform is done when:

1. **All six public systems have real evidence at MALEK/Lara Beauty parity** (Tier 1 complete)
2. **`materials` has an explicit, recorded visibility decision** (T0-2)
3. **C1 and B4 are resolved** — no standing single-point-of-failure on admin access, no ambiguity on client naming (T0-3, T0-4)
4. **Hero visual and copy share one register** — ✅ already true (PR #74)
5. **Every guardian/verify contract is green on `main`** — ✅ already true, re-confirmed at each tranche
6. **No committed documentation contradicts the current codebase** — ✅ already true (PR #75, PR #76 doc corrections; re-confirmed after #87/#88)
7. **All Chambers audited to MALEK's standard** — ✅ already true (PR #77)
8. **Automated WCAG 2.x A/AA layer green in CI** — ✅ already true (PR #78)
9. **The credential-hygiene question is closed** (T0-1) — ✅ closed 2026-09-09 (token rotated)

**Explicitly NOT required for Definition of Done, tracked separately instead:** the assistive-technology screen-reader pass (T4-1) and low-end device performance (T4-2). Both are real gaps, both are honestly recorded as tooling-blocked rather than silently dropped, and both should be revisited the moment the blocking resource becomes available — but making the whole platform's completion hostage to two items nobody in this engagement has had the tools to close would leave "done" permanently unreachable for reasons unrelated to the product's actual quality. Recommend tracking T4-1/T4-2 as a standing post-launch line item, not a completion blocker.

---

## 9. Execution checklist (flat, trackable)

**Tier 0 — owner one-word decisions:**
- [x] T0-1 — Credential hygiene closed (audited; token rotated 2026-09-09)
- [ ] T0-2 — Answer F1 (`materials` visibility)
- [ ] T0-3 — Provide C1 (second admin account id)
- [ ] T0-4 — Confirm B4 (hospitality client naming — withheld unless you say otherwise)
- [ ] T0-5 — (Optional) C3 — grant CI `workflows` permission or paste the 4 lines yourself

**The one real P0 (Tier 1 — sequence one at a time):**
- [ ] T1-1 — LENA Dress evidence capture → PR → verify
- [ ] T1-2 — Hospitality evidence capture → PR → verify (also resolves A5)
- [ ] T1-3 — Terranex evidence capture → PR → verify
- [ ] T1-4 — Kayyal evidence capture → PR → verify

**Automatic once Tier 1 lands (Tier 2 — no separate PR needed except T2-1):**
- [x] T2-1 — Operator section scaffold DONE (#88 → `0135c0c`); per-product operator records complete automatically per evidence tranche
- [ ] HOME-R2 / frontage windows / chamber plates / A5 — automatic per captured product

**When triggered (Tier 3 — not gating anything, act when the trigger condition is met):**
- [ ] T3-1 — Legal review before active English-market marketing
- [ ] T3-2 — Pagination at ~500 inquiries
- [ ] T3-3 — SMTP credentials, whenever email notification is wanted

**Tooling-blocked (Tier 4 — track, don't block on):**
- [ ] T4-1 — Assistive-technology screen-reader pass (needs AT-capable environment)
- [ ] T4-2 — Low-end device performance check (needs test device)

**Final gate:**
- [ ] T5-1 — Full-checklist re-verification pass (typecheck, tests, verify-all, guardian static + visual + smoke + safety, independent diff/baseline review) once Tier 0 + Tier 1 are closed

---

*Fixed reference document (committed 2026-09-09 after #88). Future tranche reports update against this checklist's item numbers rather than restating scope from scratch.*


---

# Project inventory — raw input from the founder

> **Evidence-path reconciliation — 2026-10-15:** at Platform commit `5ad2b66b7fc314e17bde8e7106a92a2576568a4a`, the canonical `artifacts/lena/src/features/world/content/evidence.ts` references 31 committed image paths: MALEK 7, Wellness 10, Carmen 14. All 31 paths exist in that commit's tree. This is a static path check, NOT independent validation of screenshot capture provenance, deployed UI, business results, or production readiness. Statements below about missing screens preserve historical intake and must not override current canonical product/evidence files. Cross-repository execution and its evidence gates are tracked in [the portfolio execution plan](/home/user/office/ROADMAP.md); product truth remains in each repository's existing authorities.


**Captured:** 2026-08-20 · **Status:** historical founder-input baseline, recorded verbatim in substance.

> **Current-state correction — 2026-09-04:** this document preserves the original intake history; it
> is not the current publication/evidence authority. Runtime product truth lives in
> `artifacts/lena/src/content/systems.ts`, while publishable product evidence lives in
> `artifacts/lena/src/features/world/content/evidence.ts`. MALEK now has seven real operating
> surfaces committed under `public/world/evidence/malek/` and rendered in its World chamber.
> Older statements below saying MALEK still needs interior screens are historical and superseded.

> **Correction to the product definition:** the plan assumed **five** applications. There are **six**,
> and one of them was built for a named client rather than self-initiated. `PRODUCT_DEFINITION.md`
> has been updated.

---

## 1. Malek — property management
**Industry:** real estate / asset operation.
**What it does:** operating and leasing properties, rent collection, maintenance, reporting.
**Why it is credible:** this is the founder's own former job. He ran an office operating real-estate
assets for other owners before building the tool.
**Provenance:** built and owned by the founder.
**Current evidence:** seven real operating surfaces are now committed and shown in LENA World; the original screen requirement is satisfied for MALEK.

## 2. LenaBeauty — health centres and spa management
**Industry:** wellness / personal care.
**What it does:** manages health centres and spas.
**Provenance:** built and owned by the founder.
**Still needed:** problem, user, capabilities, screens.

## 3. LENA Dressroom — evening-wear showroom and rental
**Industry:** retail / rental.
**What it does:** manages showrooms and the rental of evening and wedding dresses.
**Provenance:** built and owned by the founder.
**Still needed:** problem, user, capabilities, screens.

## 4. Terranix — investment company operations
**Industry:** investment.
**What it does:** three divisions — livestock, agricultural, real estate.
**Provenance:** built and owned by the founder.
**Still needed:** problem, user, capabilities, screens.

## 5. Hospitality app — client project (name withheld pending written permission)
**Industry:** events and hospitality services.
**What it does:** runs an office that provides hospitality services for events and occasions.
**Provenance:** **built for a named client.** The client's name, and any result, may only be published with
**written permission** (`FEATURE_GAP_STRATEGY.md` §D1, `PRIVACY_DATA_GOVERNANCE.md` §9.5).
**Note:** this explains the stale `replit.md` that described the former hospitality application — it
was a real client project, not a leftover from an unrelated product.
**Current deployment evidence:** the repository does not establish a live Hospitality production
instance. Until a current production deployment is independently evidenced, the public site must not
label this product as "in real use".
**Still needed:** permission decision, production evidence if available, then problem, user, capabilities, screens.

## 6. Kayyal (كيّال) — "the weigher" · recycling warehouse management, Egypt
**Industry:** recycling / scrap trading.
**Status:** newest project.
**The problem it solves, in the founder's own framing:** an Arabic mobile application used standing
next to the weighbridge. Every purchase, sale and cash movement is recorded in under 30 seconds, so
at the end of each day the warehouse owner knows exactly: what came in, what went out, what is left
in the cash box, and what was actually earned.

**First version scope, as specified by the founder:**
- Items by type and grade, with today's prices
- Purchase
- Sale
- Counterparties with open balances
- Cash box with a daily physical count close
- Derived stock
- Numbered receipts, sent over WhatsApp and printable
- Daily summary for the owner
- Two roles only: owner and worker
- Arabic RTL interface designed for someone standing at the weighbridge
- PWA that works offline
- Corrections by reversal, never by deletion
- Data export

**Why this one is worth leading with:** it is the only entry that already states a measurable promise
("under 30 seconds", "knows at end of day"), it names a specific operator standing in a specific
place, and its design constraints — offline, one-handed, reversal instead of deletion — are evidence
of real operational understanding rather than a feature list.

**Still needed:** intended user in one line, ≥3 screens, and confirmation of whether it is live with
a real warehouse yet (a running deployment with a real user would make it the single strongest proof
on the site).

---

## Resolved: the studio publishes no location

**Decision (2026-08-20, founder):** no country is published as the studio's location. The address was
removed from the structured data entirely.

What replaces it is stronger than a location: a **local number in each of three markets** — Oman,
Egypt and Saudi Arabia — so a client dials a familiar country code rather than an international one.
Each is published as its own `ContactPoint` with its own `areaServed`. "Location undetermined" would
read as evasive; "reachable locally in three markets" is a verifiable fact that supports the
bilingual, cross-market positioning in `PRODUCT_DEFINITION.md`.


---

## Product facts read from the products' own sign-in screens (2026-08-20)

The owner sent five screenshots. They could not be saved into the workspace, but the following was
read from them and applied to `src/content/systems.ts`:

| Product | Corrected fact |
|---|---|
| **TERRANEX** | Spelled **TERRANEX**, not "Terranix". Its own strapline is "للاستثمار الحيواني والتنمية الزراعية" — livestock investment and agricultural development |
| **LenaBeauty** | Its sign-in screen states the scope precisely: "نظام التشغيل اليومي لمركز تجميل واحد — المواعيد ونقطة البيع والعملاء والمخزون والموظفون في مكان واحد", plus three facts worth publishing: it is for the centre's team and **not a customer booking site**, accounts are created by the centre's administrator with **no self-registration**, and each centre's data stays in its own database. Point of sale and inventory were previously unknown and are now listed |
| **LENA (showroom)** | Its screen reads "تسجيل الدخول لإدارة المعرض" — showroom management, confirming the reading of the owner's note |
| **Hospitality** | Sign-up flow is "أنشئ حسابك ثم منشأتك لبدء إدارة مناسباتك" — a facility is created first, then occasions are run from it |
| **MALEK** | "سجّل الدخول إلى مساحة عملك في MALEK" — confirmed |

### Corrections resolved from repository evidence

1. **Official product name:** **LenaBeauty**. The earlier "Bio Beauty / بيو بيوتي" interpretation is
   superseded; the public site now uses the product's actual name.
2. **Hospitality stage:** a live production deployment is **not established by the repository**. The
   screenshot with the environment-configuration error is not evidence of a live production instance,
   so the public site keeps Hospitality at **trial** until current production use is evidenced.
3. **Interior screenshots (superseded 2026-09-04):** MALEK now has real runtime captures for dashboard,
   properties, contracts, financials, maintenance and mobile operation, plus the sign-in surface.
   Other products still require independently verified interior evidence before LENA presents it as real.

### Evidence publication rule — current

A sign-in screen proves identity, not operating depth. LENA therefore publishes interior product evidence
only when it has been captured from the real application and committed into the canonical evidence layer.
MALEK satisfies that rule today. Products without verified interior evidence remain evidence-free in the
World chamber; LENA does not generate substitute mockups or imply evidence that does not exist.

---

## 🛰️ مراجع الموجات الإدارية — مزامنة مركز القيادة (2026-10-23)

آخر ثلاث موجات إدارية اكتملت على هذا المستودع بدمج موثق — هذا القسم هو الصفحة الأخيرة من رحلة «خطة ← تسليم»:

| الموجة | PR | مرجع الدمج | التاريخ | الأثر |
|---|---|---|---|---|
| توحيد المستندات القانونية | #102 | `7d8590e` | 2026-10-21 | مصدر واحد قانوني للمنصة |
| ربط مركز القيادة | #103 | `5fe5739` | 2026-10-23 | AGENTS/STATUS موحدان + ربط المركز |
| مزامنة المهارات | #104 | `198a985` | 2026-10-23 | 18 مهارة مرجعية بعد المزامنة |

> **المرجع الأم للمحفظة:** مركز القيادة [`command-center-`](https://github.com/mohamedmasoud3030-tech/command-center-) — سجل الجلسات النشطة والـ PRs المفتوحة وقرارات المالك يعيش هناك. هذا القسم يحدّثه مدير المحفظة مع كل موجة ولا يُعدّل يدوياً.
