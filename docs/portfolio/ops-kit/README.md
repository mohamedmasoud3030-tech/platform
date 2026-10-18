# ops-kit — عدّة التشغيل للمحفظة

**الهدف:** أن يعمل أي وكيل (أو أي إنسان) في أي مستودع من مستودعاتك
بنفس الانضباط، **بأقل جهد منك**.

وُضع بعد حادث 2026-10-18: وكيل بصلاحية كاملة قال «لا يوجد محرك دفع»،
وكانت هناك ستة. ثم أعاد بناء دالتَين موجودتَين في المستودع نفسه.
السبب لم يكن ضعفًا — كان **غياب فهرس، وغياب قاعدة تمنع البناء قبل البحث**.

---

## المحتويات — 4 ملفات، لا أكثر

| الملف | ماذا يفعل |
|---|---|
| `AGENTS.md` | **بوابة الدخول.** يُنسخ إلى جذر كل مستودع. 5 أقسام: ما تقرأه أولًا · القواعد الصلبة · تقرير نهاية الجلسة · حدود الصلاحية · ترتيب المصادر عند التعارض |
| `PORTFOLIO.md` | **الفهرس.** 13 مستودعًا · جدول «ممنوع البناء من جديد» · القرارات المعلّقة · الشغل المنسيّ على فروع |
| `skills/before-you-build/SKILL.md` | **المهارة التي كانت ستمنع الحادث.** 5 خطوات إلزامية قبل أي مكوّن جديد |
| `tools/portfolio-check.mjs` | **يمنع الفهرس من التعفّن.** يقيس المحفظة من GitHub ويقارنها بما هو مكتوب |

---

## التركيب — 60 ثانية

```bash
# 1) الفهرس والأداة إلى مكان واحد ثابت (platform هو بيت المحفظة)
cp PORTFOLIO.md            <platform>/docs/portfolio/PORTFOLIO.md
cp tools/portfolio-check.mjs <platform>/tools/portfolio-check.mjs

# 2) بوابة الدخول إلى كل مستودع
for R in malek larabeauty- carmen-gallery- Terranex starting nilesys \
         bug-free-garbanzo platform Lenastore mosaid; do
  cp AGENTS.md <path>/$R/AGENTS.md      # لا تستبدل ملفًا موجودًا — ادمجه
done

# 3) المهارة
cp -r skills/before-you-build <nilesys>/.agents/skills/
```

⚠️ **لا تستبدل `AGENTS.md` موجودًا.** في `nilesys` و`platform` ملفات `AGENTS.md` قائمة — ادمج، لا تمسح.

---

## الاستعمال

```bash
node tools/portfolio-check.mjs      # قياس + مقارنة
node tools/portfolio-check.mjs --json
```

**exit 0** = لا انحراف · **exit 2** = الفهرس يكذب، صحّحه.

---

## ما تحقّقت منه فعلًا (2026-10-18)

```
المصادقة: ✅ gh كـ mohamedmasoud3030-tech — عامة + خاصة
عدد المستودعات: 13
مقارنة بـ PORTFOLIO.md: موثّق 13 · موجود 13 → ✅ لا انحراف
إجمالي الفروع: 118 · إجمالي PRs المفتوحة: 11
exit code = 0
```

**وفي أول تشغيل له وقع في الفخ نفسه الذي كُتب لمنعه** — استخدم
`GET /users/{owner}/repos` الذي يرجّع العامة فقط حتى مع توكن صالح (5 من 13).
أُصلح إلى `GET /user/repos?type=owner` + تحقّق من هوية المصادَق.
**هذا هو سبب وجود الأمر: الأداة التي لم تُشغَّل لم تُختبَر.**

---

## ما ليس هنا بعد

- قوالب `docs/STATUS.md` · `DECISIONS.md` · `EVIDENCE.md` · `HANDOVER.md`
- ترحيل ترقيم ADRs إلى بادئات (`KAY-`, `MAL-`, …) — القرار **D4**
- حسم **D1** (`postPendingCash` مقابل append-only)
- دمج `PR #1835` في `malek` (جرد 1755 ملفًا) — جاهز و`mergeable=true` من 9 أيام
