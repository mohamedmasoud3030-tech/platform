import type { AppLocale } from "@/providers/preferences";
import type { BusinessSystem, OperatingPrimitiveId } from "@/content/systems";

/**
 * أنظمة نيل سيستمز — منتجات مبنية ومُختبَرة، تُعرض على منصة LENA.
 *
 * المصدر الوحيد لهذا الملف هو ريبو `nilesys`:
 *   • مواصفة كل نظام: `docs/product/systems/<slug>.md` بمعايير قبول معلَّمة ✓
 *   • الديمو الشغّال: https://nilesys-demo-git-feat-demo-on-vercel-lenabeauty.vercel.app
 *   • لقطات الأدلة: `public/nile-evidence/<system>/…` مأخوذة من التشغيل الفعلي
 *
 * قواعد صارمة متوافقة مع حُرّاس هذا الريبو:
 *   • لا كلمة Demo/Trial/Beta/Prototype/نسخة تجريبية/قريبًا في أي نص عام
 *     (`tools/verify-world-chambers.mjs`).
 *   • لا ادّعاء حجم أو عملاء أو إيراد (`tools/verify-world-evidence.mjs`).
 *   • الجولة التجريبية الحيّة تُسمّى **«غرفة الحساب التجريبي»** وتُوضع خارج سجل الإثبات،
 *     لأنها ليست دليل استخدام تجاري — والتسمية صريحة لا مخفية.
 */

/** سطح دليل واحد: صورة حقيقية من التشغيل + ما تُثبته. */
export type NileSurface = {
  id: string;
  /** مسار نسبي لجذر الموقع. */
  src: string;
  alt: Record<AppLocale, string>;
  capability: Record<AppLocale, string>;
  primitive?: OperatingPrimitiveId;
};

/**
 * بيانات العرض لأنظمة النيل: تكمل `BusinessSystem` بحقول لا يعرفها الكتالوج
 * الأصلي (الردف، الصناعة بالإنجليزية، صور الأدلة، رابط الغرفة الحيّة).
 */
export type NileSystemMeta = {
  /** معرّف النظام في كتالوج LENA. */
  id: string;
  name: Record<AppLocale, string>;
  tagline: Record<AppLocale, string>;
  industry: Record<AppLocale, string>;
  problem: Record<AppLocale, string>;
  usage: Record<AppLocale, string>;
  beneficiaries: Record<AppLocale, string[]>;
  does: Record<AppLocale, string[]>;
  entities: Record<AppLocale, string[]>;
  trustHighlights: Record<AppLocale, string[]>;
  operatingPrimitives: OperatingPrimitiveId[];
  /** غرفة الحساب التجريبي على الديمو المنشور — ليست دليل استخدام تجاري. */
  trialRoom: string;
  /** معايير القبول التي يُقاس عليها البناء. */
  criteria: string;
  surfaces: NileSurface[];
};

const DEMO = "https://nilesys-demo-git-feat-demo-on-vercel-lenabeauty.vercel.app";

export const NILE_SYSTEMS_META: NileSystemMeta[] = [
  {
    id: "nile-pos",
    name: { ar: "نيل كاشير", en: "Nile POS" },
    tagline: {
      ar: "بيع وتحصيل ووردية ودرج — يعمل والشبكة مقطوعة.",
      en: "Selling, checkout, shift and drawer — it keeps working offline.",
    },
    industry: { ar: "التجزئة ونقاط البيع", en: "Retail and point of sale" },
    problem: {
      ar: "فاتورة تُكتب باليد، ودرج لا يُطابق آخر اليوم، وبيع يتوقف لأن الإنترنت فصل.",
      en: "Hand-written invoices, a drawer that does not reconcile at day end, and selling that stops when the internet drops.",
    },
    usage: {
      ar: "البيع يبدأ من الأصناف، والتحصيل يرفض مبلغاً ناقصاً، والإيصال يُطبع 80mm فور البيع. الوردية تُفتح بدرج البداية وتُغلق بمبلغ معدود، فيُحسب الفرق بين المتوقع والموجود بدل تخمينه. وكل فاتورة تُحفظ على الجهاز أولاً بمفتاح فريد، فانقطاع الشبكة لا يُفقد فاتورة ولا يُكرّرها عند رجوعها.",
      en: "Selling starts from the item grid; checkout refuses a short payment; the 80mm receipt prints immediately. A shift opens with a starting float and closes against a physical count, so the difference between expected and counted is computed rather than guessed. Every invoice is written to the device first with a unique key, so a dropped connection loses nothing and a reconnection duplicates nothing.",
    },
    beneficiaries: {
      ar: ["صاحب المحل أو السوبر ماركت", "الكاشير على الجهاز", "المحاسب الذي يراجع الدرج آخر اليوم"],
      en: ["The shop or supermarket owner", "The cashier at the till", "The accountant reconciling the drawer at day end"],
    },
    does: {
      ar: ["بيع وتحصيل نقدي وكارت", "إيصال 80mm", "وردية وفرق الدرج", "أصناف وأرصدة محلية", "مزامنة لا تُكرّر حركة"],
      en: ["Selling, cash and card checkout", "80mm receipt", "Shift and drawer difference", "Local items and balances", "Sync that never double-counts"],
    },
    entities: {
      ar: ["الأصناف", "الفواتير", "بنود الفاتورة", "الورديات", "طابور المزامنة"],
      en: ["Items", "Invoices", "Invoice lines", "Shifts", "Sync outbox"],
    },
    trustHighlights: {
      ar: ["البيع يعمل بلا إنترنت", "إيصال 80mm من الطباعة نفسها", "فرق الدرج محسوب لا مُخمَّن", "إعادة الإرسال لا تُكرّر فاتورة"],
      en: ["Selling works offline", "An 80mm receipt from the same print path", "Drawer difference computed, not guessed", "A resend never duplicates an invoice"],
    },
    operatingPrimitives: ["money", "workflow", "insight"],
    trialRoom: `${DEMO}/windows/cashier/`,
    criteria: `${DEMO}/docs/windows/cashier.html`,
    surfaces: [
      {
        id: "nile-pos-sell",
        src: "/nile-evidence/nile-pos/sell.png",
        alt: { ar: "شاشة البيع في نيل كاشير: أصناف وسلة وإجمالي", en: "Nile POS selling screen: items, cart and total" },
        capability: {
          ar: "نقطة البيع: صنف يُضاف للسلة، والإجمالي يُحسب فوراً، والوردية مفتوحة بدرج بداية.",
          en: "The point of sale: an item joins the cart, the total computes immediately, and a shift is open with a starting float.",
        },
        primitive: "money",
      },
      {
        id: "nile-pos-invoices",
        src: "/nile-evidence/nile-pos/invoices.png",
        alt: { ar: "قائمة الفواتير مع الإجمالي وطريقة الدفع", en: "Invoice list with totals and payment method" },
        capability: {
          ar: "كل فاتورة محفوظة على الجهاز برقمها وطريقتها، ومنها يُعاد طبع الإيصال.",
          en: "Every invoice is held on the device with its number and method, and its receipt can be reprinted from here.",
        },
        primitive: "documents",
      },
      {
        id: "nile-pos-shift",
        src: "/nile-evidence/nile-pos/shift.png",
        alt: { ar: "شاشة الوردية والدرج مع المتوقع والمعدود والفرق", en: "Shift and drawer screen with expected, counted and difference" },
        capability: {
          ar: "الوردية تُغلق بمبلغ معدود فيظهر الفرق بين المتوقع والموجود، والورديات المقفولة تبقى في سجل.",
          en: "A shift closes against a physical count so the difference shows, and closed shifts remain in the record.",
        },
        primitive: "money",
      },
    ],
  },

  {
    id: "nile-inventory",
    name: { ar: "نيل مخازن", en: "Nile Inventory" },
    tagline: {
      ar: "جرد يطلب سبباً، واستلام، وملصقات باركود حقيقية.",
      en: "Counts that demand a reason, receiving, and real barcode labels.",
    },
    industry: { ar: "المخازن والمشتريات", en: "Inventory and purchasing" },
    problem: {
      ar: "جرد ينتهي بفرق بلا تفسير، وملصقات لا تُقرأ بالماسح، ورصيد لا يُعرف إلا بالعدّ اليدوي.",
      en: "Counts ending in unexplained gaps, labels the scanner cannot read, and a stock figure that only a manual recount can produce.",
    },
    usage: {
      ar: "الجرد يُدخَل بالكمية المعدودة فعلاً، وأي فرق عن الرصيد الدفتري لا يُحفظ بلا سبب مكتوب — فلا يختفي نقص بضاعة بلا تفسير. الاستلام يزيد الرصيد بحركة مسجّلة، والملصق يُطبع بعرض 50mm بباركود Code39 محسوب من جدول الترميز نفسه.",
      en: "A count is entered as the physically counted quantity, and any difference against the book balance cannot be saved without a written reason — so shrinkage cannot disappear unexplained. Receiving raises stock through a recorded movement, and labels print at 50mm with a Code39 barcode computed from the real encoding table.",
    },
    beneficiaries: {
      ar: ["أمين المخزن", "مدير المشتريات", "صاحب النشاط الذي يريد معرفة قيمة مخزونه"],
      en: ["The storekeeper", "The purchasing manager", "The owner who wants his stock value"],
    },
    does: {
      ar: ["أصناف ووحدات وأرصدة", "جرد بسبب إلزامي", "استلام بضاعة", "حركات مخزون مسجّلة", "ملصقات Code39"],
      en: ["Items, units and balances", "Counts with a mandatory reason", "Goods receiving", "Recorded stock movements", "Code39 labels"],
    },
    entities: {
      ar: ["الأصناف", "الحركات", "عمليات الجرد", "الملصقات"],
      en: ["Items", "Movements", "Count sessions", "Labels"],
    },
    trustHighlights: {
      ar: ["لا جرد بفرق بلا سبب", "الرصيد لا يصير سالباً", "ملصق Code39 من جدول الترميز", "كل حركة بمفتاح فريد"],
      en: ["No count difference without a reason", "Stock never goes negative", "Code39 labels from the encoding table", "Every movement carries a unique key"],
    },
    operatingPrimitives: ["assets", "workflow", "documents", "insight"],
    trialRoom: `${DEMO}/windows/stock/`,
    criteria: `${DEMO}/docs/windows/stock.html`,
    surfaces: [
      {
        id: "nile-inventory-items",
        src: "/nile-evidence/nile-inventory/items.png",
        alt: { ar: "جدول الأصناف: الكود والرصيد والحد والتكلفة وسعر البيع", en: "Items table: code, balance, threshold, cost and price" },
        capability: {
          ar: "كل صنف بكوده ورصيده وحد التنبيه، وما تحت الحد يظهر بلون مختلف.",
          en: "Every item with its code, balance and alert threshold, with items under threshold marked.",
        },
        primitive: "assets",
      },
      {
        id: "nile-inventory-count",
        src: "/nile-evidence/nile-inventory/count.png",
        alt: { ar: "شاشة الجرد: الرصيد الدفتري والمعدود والفرق والسبب", en: "Count screen: book balance, counted, difference and reason" },
        capability: {
          ar: "الفرق يُحسب لحظياً، وخانة السبب لا تُفتح إلا عند وجود فرق — ولا يُحفظ بلا سبب.",
          en: "The difference computes live and the reason field opens only when a difference exists — and nothing saves without it.",
        },
        primitive: "workflow",
      },
    ],
  },

  {
    id: "nile-restaurant",
    name: { ar: "نيل مطعم", en: "Nile Restaurant" },
    tagline: {
      ar: "ترابيزات وتذكرة مطبخ، ولا تحصيل قبل تقديم كل صنف.",
      en: "Tables and kitchen tickets — and no payment before every item is served.",
    },
    industry: { ar: "المطاعم والكافيهات", en: "Restaurants and cafés" },
    problem: {
      ar: "طلبات تُنسى بين الصالة والمطبخ، وتذاكر تُطبع مرتين، وترابيزة تُحصَّل قبل أن يخرج الطلب.",
      en: "Orders lost between floor and kitchen, tickets printed twice, and a table paid for before the food left the pass.",
    },
    usage: {
      ar: "الترابيزة تُفتح بطلب، والطلب يُرسل للمطبخ فيُطبع تذكرة 80mm، وتُسجَّل كل إعادة طباعة على التذكرة نفسها. التحصيل يبقى مقفولاً حتى تُقدَّم كل الأصناف، فلا تُغلق ترابيزة على طلب لم يخرج من المطبخ.",
      en: "A table opens with an order; the order goes to the kitchen and prints an 80mm ticket; every reprint is recorded against that same ticket. Payment stays locked until every item is served, so a table cannot be closed on food that never left the kitchen.",
    },
    beneficiaries: {
      ar: ["صاحب المطعم", "الويتر", "المطبخ", "الكاشير الذي يقفل الترابيزة"],
      en: ["The restaurant owner", "The waiter", "The kitchen", "The cashier closing the table"],
    },
    does: {
      ar: ["ترابيزات وطلبات", "تذكرة مطبخ 80mm", "تسجيل إعادة الطباعة", "منع التحصيل قبل التقديم", "حالة الصنف: جديد ← طبخ ← جاهز ← قُدِّم"],
      en: ["Tables and orders", "80mm kitchen ticket", "Reprint logging", "Payment blocked until served", "Item states: new → cooking → ready → served"],
    },
    entities: {
      ar: ["الترابيزات", "الطلبات", "بنود الطلب", "التذاكر المطبوعة"],
      en: ["Tables", "Orders", "Order lines", "Printed tickets"],
    },
    trustHighlights: {
      ar: ["لا تحصيل قبل التقديم", "إعادة الطبع مسجّلة", "تذكرة 80mm للمطبخ", "الطلب لا يضيع بين الصالة والمطبخ"],
      en: ["No payment before serving", "Reprints are recorded", "80mm kitchen ticket", "No order lost between floor and kitchen"],
    },
    operatingPrimitives: ["workflow", "money", "time"],
    trialRoom: `${DEMO}/windows/kitchen/`,
    criteria: `${DEMO}/docs/windows/kitchen.html`,
    surfaces: [
      {
        id: "nile-restaurant-floor",
        src: "/nile-evidence/nile-restaurant/floor.png",
        alt: { ar: "شاشة الترابيزات بحالة كل ترابيزة وعدد الأفراد", en: "Floor screen with each table's state and seats" },
        capability: {
          ar: "كل ترابيزة بحالتها: فاضية أو طلب مفتوح أو نشطة، وبإجمالي طلبها.",
          en: "Every table with its state — free, open order or active — and its order total.",
        },
        primitive: "workflow",
      },
      {
        id: "nile-restaurant-order",
        src: "/nile-evidence/nile-restaurant/order.png",
        alt: { ar: "بناء الطلب: قائمة أصناف وسلة وإجمالي", en: "Building an order: menu, cart and total" },
        capability: {
          ar: "الطلب يُبنى من قائمة الأصناف، والتحصيل مقفول حتى يُرسل الطلب للمطبخ.",
          en: "The order is built from the menu, and checkout stays locked until the order reaches the kitchen.",
        },
        primitive: "money",
      },
      {
        id: "nile-restaurant-kitchen",
        src: "/nile-evidence/nile-restaurant/kitchen.png",
        alt: { ar: "شاشة المطبخ: تذاكر مفتوحة مع زمن الانتظار", en: "Kitchen screen: open tickets with wait time" },
        capability: {
          ar: "المطبخ يرى كل تذكرة بزمنها، وينقل الصنف: جديد ← طبخ ← جاهز ← قُدِّم.",
          en: "The kitchen sees every ticket with its elapsed time and moves each item new → cooking → ready → served.",
        },
        primitive: "time",
      },
    ],
  },

  {
    id: "nile-clinic",
    name: { ar: "نيل عيادة", en: "Nile Clinic" },
    tagline: {
      ar: "ملف مريض ومواعيد وتحصيل، بأدوار واضحة للاستقبال والطبيب.",
      en: "Patient file, appointments and checkout, with clear roles for reception and doctor.",
    },
    industry: { ar: "العيادات والمراكز الطبية", en: "Clinics and medical centres" },
    problem: {
      ar: "ملفات ورقية، ومواعيد على واتساب، وتحصيل لا يُطابق الزيارات آخر اليوم.",
      en: "Paper files, appointments over WhatsApp, and collections that do not match visits at day end.",
    },
    usage: {
      ar: "الاستقبال يسجّل المريض ويحجز الموعد ويحصّل، والطبيب يرى ملفه ومواعيده ويكتب الزيارة. كل دور يرى ما يخصه، وسجل التدقيق يحفظ من فعل ماذا ومتى.",
      en: "Reception registers the patient, books the appointment and takes payment; the doctor reads the file and appointments and records the visit. Each role sees only what it needs, and the audit trail keeps who did what and when.",
    },
    beneficiaries: {
      ar: ["طبيب العيادة", "موظف الاستقبال", "مدير العيادة"],
      en: ["The doctor", "The receptionist", "The clinic manager"],
    },
    does: {
      ar: ["ملف المريض", "حجز المواعيد", "الزيارة والتشخيص", "التحصيل", "صلاحيات لكل دور"],
      en: ["Patient file", "Appointment booking", "Visit and diagnosis", "Checkout", "Per-role permissions"],
    },
    entities: {
      ar: ["المرضى", "المواعيد", "الزيارات", "المدفوعات", "المستخدمون وأدوارهم"],
      en: ["Patients", "Appointments", "Visits", "Payments", "Users and roles"],
    },
    trustHighlights: {
      ar: ["دور لكل مستخدم", "سجل تدقيق لكل إجراء", "موعد ← زيارة ← تحصيل في مسار واحد"],
      en: ["A role per user", "An audit trail per action", "Appointment → visit → payment in one path"],
    },
    operatingPrimitives: ["people", "time", "money", "documents"],
    trialRoom: `${DEMO}/systems/clinic.html`,
    criteria: `${DEMO}/docs/clinic.html`,
    surfaces: [
      {
        id: "nile-clinic-entry",
        src: "/nile-evidence/nile-clinic/entry.png",
        alt: { ar: "شاشة دخول نظام العيادة مع حسابات الأدوار", en: "Clinic sign-in screen with role accounts" },
        capability: {
          ar: "نقطة الدخول تعرض الحسابات بأدوارها — استقبال وطبيب ومدير — لا حساباً واحداً يعمل كل شيء.",
          en: "The entry point lists accounts by role — reception, doctor, manager — rather than one account that does everything.",
        },
        primitive: "people",
      },
      {
        id: "nile-clinic-flow",
        src: "/nile-evidence/nile-clinic/app.png",
        alt: { ar: "لوحة العيادة: في الانتظار وفي الغرفة وأنهى ومحصّل النهارده", en: "Clinic board: waiting, in room, completed and collected today" },
        capability: {
          ar: "لوحة واحدة تجمع حالات التردد: من في الانتظار، ومن في الغرفة، وما حُصِّل اليوم، مع إجراءات لكل موعد.",
          en: "One board gathers attendance states: who waits, who is in the room, what was collected today, with actions per appointment.",
        },
        primitive: "time",
      },
    ],
  },

  {
    id: "nile-courts",
    name: { ar: "نيل ملاعب", en: "Nile Courts" },
    tagline: { ar: "حجز بالساعة يرفض تعارض المواعيد.", en: "Hourly booking that refuses overlapping slots." },
    industry: { ar: "الملاعب والمراكز الرياضية", en: "Courts and sports centres" },
    problem: {
      ar: "حجز مزدوج على نفس الساعة، ودفتر مواعيد يُقرأ خطأً، وإيراد يوم لا يُعرف بدقة.",
      en: "Double-booked hours, a paper diary misread, and a day's takings nobody can state precisely.",
    },
    usage: {
      ar: "الملعب يُحجز بفترة زمنية محددة، والنظام يرفض أي تداخل بدل أن يُكتشف في الملعب. التحصيل يُسجَّل على الحجز نفسه، فيُعرف كم حجزاً بيع وكم حُصِّل.",
      en: "A court is booked for a defined slot and the system refuses any overlap instead of it being discovered on the pitch. Payment is recorded against the booking, so how many slots sold and how much was collected is known.",
    },
    beneficiaries: {
      ar: ["صاحب مركز الملاعب", "موظف الحجز", "اللاعب الذي يحجز"],
      en: ["The courts owner", "The booking clerk", "The player booking a slot"],
    },
    does: {
      ar: ["ملاعب وفترات", "حجز ومنع التعارض", "تحصيل على الحجز", "تقارير الحجز والإيراد"],
      en: ["Courts and slots", "Booking with overlap refusal", "Payment against the booking", "Booking and takings reports"],
    },
    entities: {
      ar: ["الملاعب", "الفترات", "الحجوزات", "المدفوعات"],
      en: ["Courts", "Slots", "Bookings", "Payments"],
    },
    trustHighlights: {
      ar: ["لا حجز مزدوج", "الدفع مربوط بالحجز", "حالة كل ملعب ظاهرة"],
      en: ["No double booking", "Payment tied to the booking", "Every court's state visible"],
    },
    operatingPrimitives: ["time", "money", "workflow"],
    trialRoom: `${DEMO}/systems/courts.html`,
    criteria: `${DEMO}/docs/courts.html`,
    surfaces: [
      {
        id: "nile-courts-entry",
        src: "/nile-evidence/nile-courts/entry.png",
        alt: { ar: "شاشة دخول نظام الملاعب", en: "Courts sign-in screen" },
        capability: {
          ar: "الدخول بحساب الحجز، ومنه تُدار الفترات والحجوزات.",
          en: "Sign in with the booking account, from which slots and bookings are managed.",
        },
        primitive: "workflow",
      },
      {
        id: "nile-courts-app",
        src: "/nile-evidence/nile-courts/app.png",
        alt: { ar: "لوحة الملاعب: شبكة الفترات وحالة كل حجز", en: "Courts board: slot grid and each booking's state" },
        capability: {
          ar: "شبكة الفترات تُظهر المحجوز والمتاح، والتداخل يُرفض قبل أن يصبح حجزاً.",
          en: "The slot grid shows what is booked and what is free, and an overlap is refused before it becomes a booking.",
        },
        primitive: "time",
      },
    ],
  },

  {
    id: "nile-hr",
    name: { ar: "نيل موارد بشرية", en: "Nile HR" },
    tagline: { ar: "حضور ومرتبات من رقم واحد لا يُخمَّن.", en: "Attendance and payroll from one figure that is not guessed." },
    industry: { ar: "الموارد البشرية والمرتبات", en: "HR and payroll" },
    problem: {
      ar: "حضور يُكتب في دفتر، وتأخير لا يُحتسب، ومرتب يُجمع يدوياً كل شهر.",
      en: "Attendance kept in a notebook, lateness never counted, and payroll assembled by hand every month.",
    },
    usage: {
      ar: "الموظف يسجّل حضوره بكوده: أول تسجيل دخول والثاني خروج، والتسجيل المزدوج مرفوض، والتأخير بعد 09:15 يُحتسب. المحاسب يسحب ملخص الشهر للصرف بدل تجميعه من دفاتر.",
      en: "An employee punches with a code: the first punch is in, the second is out, a duplicate is refused, and lateness after 09:15 is counted. The accountant pulls the month summary instead of assembling it from notebooks.",
    },
    beneficiaries: {
      ar: ["مدير الموارد البشرية", "الموظف", "المحاسب الذي يصرف المرتب"],
      en: ["The HR manager", "The employee", "The accountant running payroll"],
    },
    does: {
      ar: ["بصمة دخول وخروج", "احتساب التأخير", "ملخص شهري", "تصدير CSV للمرتبات", "إدارة الموظفين"],
      en: ["In/out punching", "Lateness calculation", "Monthly summary", "Payroll CSV export", "Employee records"],
    },
    entities: {
      ar: ["الموظفون", "البصمات", "ملخصات الشهر", "المستخدمون وأدوارهم"],
      en: ["Employees", "Punches", "Monthly summaries", "Users and roles"],
    },
    trustHighlights: {
      ar: ["بصمة مزدوجة مرفوضة", "التأخير بعد 09:15 محتسب", "ملخص الشهر هو أساس الصرف", "CSV يفتح في إكسل العربي"],
      en: ["A duplicate punch is refused", "Lateness after 09:15 counted", "The month summary is the payroll basis", "CSV opens in Arabic Excel"],
    },
    operatingPrimitives: ["people", "time", "money"],
    trialRoom: `${DEMO}/windows/attendance/`,
    criteria: `${DEMO}/docs/windows/attendance.html`,
    surfaces: [
      {
        id: "nile-hr-punch",
        src: "/nile-evidence/nile-hr/punch.png",
        alt: { ar: "شاشة البصمة بكود الموظف وقائمة الموظفين", en: "Punch screen with employee code and employee list" },
        capability: {
          ar: "البصمة بكود الموظف أو بالضغط على اسمه، والدخول والخروج تلقائيان بالتناوب.",
          en: "Punch by employee code or by tapping the name, with in/out alternating automatically.",
        },
        primitive: "people",
      },
      {
        id: "nile-hr-month",
        src: "/nile-evidence/nile-hr/month.png",
        alt: { ar: "الملخص الشهري: أيام الحضور والتأخير وبلا انصراف والساعات", en: "Monthly summary: present days, late days, missing checkout and hours" },
        capability: {
          ar: "ملخص الشهر لكل موظف — أيام الحضور والتأخير وما بلا انصراف والساعات — وهو أساس الصرف.",
          en: "A month summary per employee — present days, late days, missing checkout and hours — which is the payroll basis.",
        },
        primitive: "insight",
      },
    ],
  },

  {
    id: "nile-sites",
    name: { ar: "نيل مواقع", en: "Nile Sites" },
    tagline: {
      ar: "لوحة واحدة تدير مواقع الأنشطة وتعلن حالة كل واحد بصدق.",
      en: "One dashboard runs the trade sites and states each one's state honestly.",
    },
    industry: { ar: "الأنشطة المتعددة والتسويق", en: "Multi-trade operations and marketing" },
    problem: {
      ar: "مواقع متعددة بلا لوحة واحدة، وحالة كل موقع تُسأل عنها بالهاتف، وعميل محتمل يضيع بينها.",
      en: "Several sites with no single dashboard, each one's state asked about by phone, and enquiries lost between them.",
    },
    usage: {
      ar: "كل موقع نشاط يظهر بحالته الحقيقية بلا شارة تكذب، واللوحة تجمع العملاء المحتملين لكل موقع ومن يحوّل منهم، فيعرف المالك أي نشاط يجلب طلباً فعلاً.",
      en: "Each trade site appears with its real state and no badge that lies, and the dashboard gathers leads per site and which ones convert, so the owner sees which trade actually brings enquiries.",
    },
    beneficiaries: {
      ar: ["مالك عدة أنشطة", "مدير التسويق", "من يدير المحتوى"],
      en: ["An owner running several trades", "The marketing manager", "Whoever edits the content"],
    },
    does: {
      ar: ["مواقع أنشطة", "حالة صادقة لكل موقع", "تجميع العملاء المحتملين", "متابعة التحويل"],
      en: ["Trade sites", "An honest state per site", "Lead aggregation", "Conversion tracking"],
    },
    entities: {
      ar: ["المواقع", "العملاء المحتملون", "حالة كل موقع", "المستخدمون وأدوارهم"],
      en: ["Sites", "Leads", "Site state", "Users and roles"],
    },
    trustHighlights: {
      ar: ["لا شارة تكذب", "كل عميل محتمل في مكان واحد", "صلاحيات لكل دور"],
      en: ["No badge that lies", "Every lead in one place", "Per-role permissions"],
    },
    operatingPrimitives: ["relationships", "insight", "workflow"],
    trialRoom: `${DEMO}/sites/`,
    criteria: `${DEMO}/docs/sites.html`,
    surfaces: [
      {
        id: "nile-sites-index",
        src: "/nile-evidence/nile-sites/landing.png",
        alt: { ar: "فهرس مواقع الأنشطة مع حالة كل موقع", en: "Trade sites index with each site's state" },
        capability: {
          ar: "فهرس واحد لكل مواقع الأنشطة، وكل موقع يعلن حالته بصدق بدل شارة تسويقية.",
          en: "One index for every trade site, each stating its state honestly rather than carrying a marketing badge.",
        },
        primitive: "insight",
      },
    ],
  },
];

/** أسماء الأصول التشغيلية بالإنجليزية لعرض شرائح الجذور. */
export const PRIMITIVE_LABEL: Record<OperatingPrimitiveId, Record<AppLocale, string>> = {
  relationships: { ar: "العلاقات", en: "Relationships" },
  time: { ar: "الوقت", en: "Time" },
  money: { ar: "المال", en: "Money" },
  assets: { ar: "الأصول", en: "Assets" },
  workflow: { ar: "سير العمل", en: "Workflow" },
  documents: { ar: "المستندات", en: "Documents" },
  people: { ar: "الأشخاص", en: "People" },
  insight: { ar: "الرؤية", en: "Insight" },
  integrity: { ar: "الاتساق", en: "Integrity" },
};

/**
 * تحويل بيانات النيل إلى كتالوج LENA القياسي.
 *
 * `stage: "trial"` هو التصنيف الداخلي الصادق: مشروع مبني ومُختبَر، والاستخدام
 * التجاري الحقيقي غير مُثبت — والتصنيف لا يُعرض على أي واجهة عامة.
 */
export function nileBusinessSystems(): BusinessSystem[] {
  return NILE_SYSTEMS_META.map((meta, index) => ({
    id: meta.id as BusinessSystem["id"],
    visibility: "public",
    order: 101 + index,
    name: meta.name,
    tagline: meta.tagline,
    stage: "trial",
    beneficiaries: meta.beneficiaries,
    usage: meta.usage,
    industry: meta.industry,
    problem: meta.problem,
    does: meta.does,
    entities: meta.entities,
    operatingPrimitives: meta.operatingPrimitives,
    trustHighlights: meta.trustHighlights,
  }));
}

export function nileMetaFor(id: string): NileSystemMeta | undefined {
  return NILE_SYSTEMS_META.find((meta) => meta.id === id);
}

export function nileSurfaceCount(id: string): number {
  return nileMetaFor(id)?.surfaces.length ?? 0;
}

export function isNileSystem(id: string): boolean {
  return NILE_SYSTEMS_META.some((meta) => meta.id === id);
}

/** الديمو المنشور — يُستخدم للتحقق ولروابط الغرفة. */
export const NILE_TRIAL_DEMO = DEMO;
