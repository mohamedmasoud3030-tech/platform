import type { AppLocale } from "@/providers/preferences";
import type { BusinessSystem, OperatingPrimitiveId } from "@/content/systems";

/**
 * أنظمة نيل سيستمز — منتجات مبنية ومُختبَرة، تُعرض على منصة LENA.
 *
 * المصدر الوحيد لهذا الملف هو ريبو `nilesys` كما هو **شغّال فعلاً**:
 *   • الأنظمة السبعة (ويب): /systems/{pos,inventory,restaurant,clinic,courts,hr}.html + /sites/
 *   • برامج ويندوز الخمسة: /windows/{cashier,stock,kitchen,attendance,reports}/
 *   • مواصفة كل نظام: docs/product/systems/<slug>.md بمعايير قبول معلَّمة ✓
 *   • لقطات الأدلة: public/nile-evidence/<system>/<screen>.png — كلها من التشغيل الحقيقي
 *
 * قاعدة صارمة اتبعتها بعد مراجعة المالك (2026-10-21):
 *   كل وصف هنا مشتق من شاشة رأيتها بعيني في النظام، لا من وصف في مستند.
 *   ولا صورة من برنامج ويندوز تُنسب إلى نظام ويب، والعكس.
 *
 * وتظل قواعد الحُرّاس قائمة:
 *   • لا كلمة Demo/Trial/Beta/Prototype/نسخة تجريبية/قريبًا في أي نص عام
 *     (`tools/verify-world-chambers.mjs`).
 *   • لا ادّعاء حجم أو عملاء أو إيراد (`tools/verify-world-evidence.mjs`).
 *   • الجولة الحيّة تُسمّى **«غرفة الحساب التجريبي»** وتُوضع خارج سجل الإثبات.
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
  /** الشاشات الفعلية كما تظهر في الشريط الجانبي للنظام. */
  screens: Record<AppLocale, string[]>;
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
      ar: "نقطة بيع كاملة: سلة، تحصيل بالمستلم والباقي، فواتير، تقارير ودرج.",
      en: "A complete point of sale: cart, payment against cash received, invoices, reports and the drawer.",
    },
    industry: { ar: "التجزئة ونقاط البيع", en: "Retail and point of sale" },
    problem: {
      ar: "فاتورة تُكتب باليد، ودرج لا يُطابق آخر اليوم، وخصم يُحسب في الرأس فلا يُعرف من أذن به.",
      en: "Hand-written invoices, a drawer that does not reconcile at day end, and a discount worked out in someone's head with no record of who allowed it.",
    },
    usage: {
      ar: "البيع يبدأ من شبكة الأصناف: كل صنف يُضغط فيدخل السلة، والإجمالي يُحسب لحظياً. عند التحصيل تُفتح شاشة تعرض الإجمالي والمبلغ المستلم والباقي، وفيها خانة كود خصم قبل التأكيد — فلا يُغلق البيع بأقل من المبلغ. وبعد التحصيل تبقى الفاتورة في سجل الفواتير، والوردية تُقرأ من شاشة الورديات، والأرقام تُجمع في التقارير.",
      en: "Selling starts from the item grid: tapping an item puts it in the cart and the total computes live. On checkout a payment sheet shows the total, the amount received and the change, with a discount-code field before confirmation, so a sale cannot close short. After confirmation the invoice stays in the invoice record, the shift is read from the shift screen, and the figures are gathered in reports.",
    },
    beneficiaries: {
      ar: ["صاحب المحل أو السوبر ماركت", "الكاشير على الجهاز", "المحاسب الذي يراجع الدرج آخر اليوم"],
      en: ["The shop or supermarket owner", "The cashier at the till", "The accountant reconciling the drawer at day end"],
    },
    does: {
      ar: ["نقطة بيع بسلة وتحصيل", "كود خصم على الفاتورة", "سجل الفواتير والمرتجعات", "الورديات وحركة الدرج", "التقارير اليومية", "الأصناف والمخزون والعملاء والآجل", "الموردون وأكواد الخصم والمستخدمون", "سجل العمليات والنسخ الاحتياطي"],
      en: ["Point of sale with cart and checkout", "Discount code on the invoice", "Invoice and returns record", "Shifts and drawer movement", "Daily reports", "Items, stock, customers and credit", "Suppliers, discount codes, users", "Activity log and backup"],
    },
    entities: {
      ar: ["الأصناف", "الفواتير", "المرتجعات", "الورديات", "حركات الدرج", "العملاء", "المستخدمون"],
      en: ["Items", "Invoices", "Returns", "Shifts", "Drawer movements", "Customers", "Users"],
    },
    trustHighlights: {
      ar: ["التحصيل يعرض المستلم والباقي قبل التأكيد", "الخصم بكود مسجّل لا برقم في الرأس", "المجموع لا يُغلق قبل اختيار طريقة الدفع", "كل فاتورة تبقى في السجل ويمكن مراجعتها"],
      en: ["Checkout shows received and change before confirming", "A discount comes from a code, not a figure in someone's head", "A sale does not close before a payment method is chosen", "Every invoice stays in the record and can be reviewed"],
    },
    operatingPrimitives: ["money", "workflow", "insight", "documents"],
    screens: { ar: ["نقطة البيع", "الفواتير", "المرتجعات", "الورديات", "التقارير", "الأصناف", "المخزون", "العملاء والآجل", "الموردون", "أكواد الخصم", "حركة الدرج", "المستخدمون", "الإعدادات", "النسخ الاحتياطي", "هوية المحل", "سجل العمليات"], en: ["Selling", "Invoices", "Returns", "Shifts", "Reports", "Items", "Stock", "Customers and credit", "Suppliers", "Discount codes", "Drawer movement", "Users", "Settings", "Backup", "Shop identity", "Activity log"] },
    trialRoom: `${DEMO}/systems/pos.html`,
    criteria: `${DEMO}/docs/pos.html`,
    surfaces: [
      {
        id: "nile-pos-sell",
        src: "/nile-evidence/nile-pos/sell.png",
        alt: { ar: "شاشة البيع: سلة فيها ثلاثة أصناف وشبكة أصناف بالأسعار والرصيد", en: "Selling screen: a three-item cart beside the priced item grid" },
        capability: {
          ar: "البيع من شبكة الأصناف: كل صنف يُضغط فيدخل السلة، والإجمالي يُحسب لحظياً، والوردية مفتوحة.",
          en: "Selling happens from the item grid: tapping an item fills the cart, the total computes live, and the shift is open.",
        },
        primitive: "money",
      },
      {
        id: "nile-pos-payment",
        src: "/nile-evidence/nile-pos/payment.png",
        alt: { ar: "شاشة إتمام البيع: الإجمالي والمبلغ المستلم والباقي وخانة كود خصم", en: "Checkout sheet: total, amount received, change and a discount-code field" },
        capability: {
          ar: "التحصيل يعرض الإجمالي ٥٧ ج.م والمستلم والباقي، ويقبل كود خصم قبل التأكيد — فلا يُغلق البيع ناقصاً.",
          en: "Checkout shows the total, the amount received and the change, and accepts a discount code before confirming — so a sale cannot close short.",
        },
        primitive: "money",
      },
      {
        id: "nile-pos-invoices",
        src: "/nile-evidence/nile-pos/invoices.png",
        alt: { ar: "سجل الفواتير مع الإجمالي وطريقة الدفع وحالة الفاتورة", en: "Invoice record with totals, payment method and invoice state" },
        capability: {
          ar: "كل فاتورة تبقى في السجل بإجماليها وطريقتها ووقتها، ومنه تُراجع أو تُعاد.",
          en: "Every invoice stays in the record with its total, method and time, and can be reviewed or reprinted from there.",
        },
        primitive: "documents",
      },
      {
        id: "nile-pos-shifts",
        src: "/nile-evidence/nile-pos/shifts.png",
        alt: { ar: "شاشة الورديات: درج البداية والحركة والمجموع", en: "Shift screen: opening float, drawer movement and total" },
        capability: {
          ar: "الوردية تُقرأ من هذه الشاشة: درج البداية، وما دخل الدرج، والمجموع — بدل تخمينه آخر اليوم.",
          en: "The shift is read here: the opening float, what entered the drawer and the total — instead of being guessed at day end.",
        },
        primitive: "money",
      },
      {
        id: "nile-pos-reports",
        src: "/nile-evidence/nile-pos/reports.png",
        alt: { ar: "شاشة التقارير: مبيعات اليوم وعدد الفواتير والأصناف الأكثر بيعاً", en: "Reports screen: today's sales, invoice count and best-selling items" },
        capability: {
          ar: "التقارير تجمع المبيعات وعدد الفواتير والأصناف الأكثر حركة في شاشة واحدة.",
          en: "Reports gather sales, invoice count and the fastest-moving items in one screen.",
        },
        primitive: "insight",
      },
    ],
  },

  {
    id: "nile-inventory",
    name: { ar: "نيل مخازن", en: "Nile Inventory" },
    tagline: {
      ar: "الرصيد الصح في اللحظة الصح: لوحة، أصناف، تحت الحد، وحركات.",
      en: "The right balance at the right moment: a board, items, under-threshold and movements.",
    },
    industry: { ar: "المخازن والمشتريات", en: "Inventory and purchasing" },
    problem: {
      ar: "رصيد لا يُعرف إلا بالعدّ اليدوي، وصنف ينفد قبل أن ينتبه أحد، وحركة تُنسى فلا يُعرف من أين جاء الرقم.",
      en: "A balance only a manual recount can produce, an item that runs out before anyone notices, and a movement nobody records so the figure has no origin.",
    },
    usage: {
      ar: "لوحة المخزن تجمع قيمة المخزون وعدد الأصناف وما تحت حد الطلب. شاشة الأصناف تُظهر كل صنف بكوده ورصيده وحد التنبيه وسعره، وشاشة «تحت حد الطلب» تفصل ما يحتاج شراءً قبل أن ينفد، وشاشة الحركات تسجّل كل دخول وخروج على الصنف نفسه.",
      en: "The warehouse board gathers stock value, item count and what sits under its threshold. The items screen shows each item with its code, balance, alert threshold and price; the under-threshold screen isolates what needs buying before it runs out; and the movements screen records every entry and exit against the item itself.",
    },
    beneficiaries: {
      ar: ["أمين المخزن", "مدير المشتريات", "صاحب النشاط الذي يريد معرفة قيمة مخزونه"],
      en: ["The storekeeper", "The purchasing manager", "The owner who wants his stock value"],
    },
    does: {
      ar: ["لوحة مخزن بقيمة المخزون", "أصناف وأكواد وأرصدة وحدود", "شاشة تحت حد الطلب", "حركات مخزون مسجّلة", "الموردون والتوريد"],
      en: ["A stock board with stock value", "Items, codes, balances and thresholds", "An under-threshold screen", "Recorded stock movements", "Suppliers and receiving"],
    },
    entities: {
      ar: ["الأصناف", "الحركات", "حدود الطلب", "الموردون"],
      en: ["Items", "Movements", "Order thresholds", "Suppliers"],
    },
    trustHighlights: {
      ar: ["الرصيد يُقرأ لا يُخمَّن", "ما تحت الحد مفصول في شاشته", "كل حركة مسجّلة على الصنف", "قيمة المخزون ظاهرة لصاحبه"],
      en: ["The balance is read, not guessed", "Under-threshold items sit on their own screen", "Every movement is recorded against the item", "Stock value is visible to its owner"],
    },
    operatingPrimitives: ["assets", "workflow", "insight"],
    screens: { ar: ["لوحة المخزن", "الأصناف", "تحت حد الطلب", "حركات المخزون", "الموردون والتوريد"], en: ["Warehouse board", "Items", "Under threshold", "Stock movements", "Suppliers and receiving"] },
    trialRoom: `${DEMO}/systems/inventory.html`,
    criteria: `${DEMO}/docs/inventory.html`,
    surfaces: [
      {
        id: "nile-inventory-board",
        src: "/nile-evidence/nile-inventory/board.png",
        alt: { ar: "لوحة المخزن: قيمة المخزون وعدد الأصناف وما تحت الحد", en: "Warehouse board: stock value, item count and under-threshold" },
        capability: {
          ar: "لوحة واحدة تعطي قيمة المخزون وعدد الأصناف وما يحتاج شراءً قبل أن ينفد.",
          en: "One board gives the stock value, the item count and what needs buying before it runs out.",
        },
        primitive: "insight",
      },
      {
        id: "nile-inventory-items",
        src: "/nile-evidence/nile-inventory/items.png",
        alt: { ar: "جدول الأصناف: الكود والصنف والرصيد وحد التنبيه والتكلفة والسعر", en: "Items table: code, item, balance, threshold, cost and price" },
        capability: {
          ar: "كل صنف بكوده ورصيده وحد تنبيهه وتكلفته وسعره، والرصيد المنخفض يظهر بلون مختلف.",
          en: "Every item with its code, balance, alert threshold, cost and price, with low balances marked in a different colour.",
        },
        primitive: "assets",
      },
      {
        id: "nile-inventory-lowstock",
        src: "/nile-evidence/nile-inventory/lowstock.png",
        alt: { ar: "شاشة تحت حد الطلب: الأصناف التي تحتاج شراءً وأرصدتها", en: "Under-threshold screen: items that need buying with their balances" },
        capability: {
          ar: "شاشة مستقلة لِما تحت حد الطلب، فلا يُكتشف النفاد بعد حدوثه.",
          en: "A dedicated screen for what sits under its threshold, so a stock-out is not discovered after it happens.",
        },
        primitive: "workflow",
      },
      {
        id: "nile-inventory-moves",
        src: "/nile-evidence/nile-inventory/moves.png",
        alt: { ar: "سجل حركات المخزون: النوع والصنف والكمية والوقت", en: "Stock movement record: type, item, quantity and time" },
        capability: {
          ar: "كل حركة مخزون في سجل: نوعها وصنفها وكميتها ووقتها، فيُعرف من أين جاء الرصيد.",
          en: "Every stock movement in one record — type, item, quantity and time — so the balance has a visible origin.",
        },
        primitive: "documents",
      },
    ],
  },

  {
    id: "nile-restaurant",
    name: { ar: "نيل مطعم", en: "Nile Restaurant" },
    tagline: {
      ar: "من الترابيزة للمطبخ للحساب: صالة، تذاكر، حجوزات وملخص يوم.",
      en: "From table to kitchen to bill: floor, tickets, bookings and a day summary.",
    },
    industry: { ar: "المطاعم والكافيهات", en: "Restaurants and cafés" },
    problem: {
      ar: "طلب يُنسى بين الصالة والمطبخ، وترابيزة تُفتح بلا حساب معروف، ومطبخ لا يعرف ماذا يُحضّر أولاً.",
      en: "An order lost between floor and kitchen, a table opened with no known bill, and a kitchen that does not know what to cook first.",
    },
    usage: {
      ar: "الصالة تعرض الترابيزات بحالتها: فاضية أو مشغولة وبإجمالي طلبها. الضغط على ترابيزة يفتح طلباً من قائمة الأصناف، والإرسال ينقل الطلب إلى شاشة المطبخ كتذكرة مرقّمة. المطبخ يرى التذاكر مرتّبة بالأقدم أولاً، وكل صنف بحالته («جديد») وزر بدء، وشاشة ملخص اليوم تجمع ما جرى، والوردية والدرج تحفظ النقدية.",
      en: "The floor shows tables by state — free or busy, with each order's total. Tapping a table opens an order from the menu; sending it moves the order to the kitchen as a numbered ticket. The kitchen sees tickets oldest-first, each line with its state and a start control; the day summary gathers what happened, and the shift and drawer keep the cash.",
    },
    beneficiaries: {
      ar: ["صاحب المطعم", "الويتر", "المطبخ", "الكاشير الذي يقفل الترابيزة"],
      en: ["The restaurant owner", "The waiter", "The kitchen", "The cashier closing the table"],
    },
    does: {
      ar: ["صالة بترابيزات وإجمالي كل طلب", "طلب من قائمة الأصناف", "إرسال للمطبخ بتذكرة مرقّمة", "شاشة مطبخ بالأقدم أولاً", "ملخص اليوم", "الوردية والدرج"],
      en: ["A floor with tables and each order's total", "An order built from the menu", "Sending to the kitchen as a numbered ticket", "A kitchen screen, oldest first", "Day summary", "Shift and drawer"],
    },
    entities: {
      ar: ["الترابيزات", "الطلبات", "بنود الطلب", "التذاكر", "الحجوزات"],
      en: ["Tables", "Orders", "Order lines", "Tickets", "Bookings"],
    },
    trustHighlights: {
      ar: ["الترابيزة لا تُفتح بلا طلب مسجّل", "التذكرة تصل المطبخ بترقيمها", "المطبخ مرتّب بالأقدم أولاً", "إجمالي كل ترابيزة ظاهر من الصالة"],
      en: ["A table is never opened without a recorded order", "The ticket reaches the kitchen with its number", "The kitchen runs oldest-first", "Every table's total is visible from the floor"],
    },
    operatingPrimitives: ["workflow", "money", "time"],
    screens: { ar: ["الصالة", "المطبخ", "الحجوزات", "ملخص اليوم", "الوردية والدرج"], en: ["Floor", "Kitchen", "Bookings", "Day summary", "Shift and drawer"] },
    trialRoom: `${DEMO}/systems/restaurant.html`,
    criteria: `${DEMO}/docs/restaurant.html`,
    surfaces: [
      {
        id: "nile-restaurant-floor",
        src: "/nile-evidence/nile-restaurant/floor.png",
        alt: { ar: "شاشة الصالة: ترابيزات بحالتها وعدد أفرادها وإجمالي كل طلب", en: "Floor screen: tables by state with seats and each order's total" },
        capability: {
          ar: "الصالة تعرض كل ترابيزة بحالتها وإجمالي طلبها، فتظهر المشغولة بقيمتها لا بعلامة فقط.",
          en: "The floor shows every table with its state and order total, so a busy table shows its value, not just a mark.",
        },
        primitive: "workflow",
      },
      {
        id: "nile-restaurant-order",
        src: "/nile-evidence/nile-restaurant/order.png",
        alt: { ar: "لوحة الطلب: ترابيزة مفتوحة وقائمة أصناف وبنود الطلب", en: "Order panel: an open table with the menu and the order lines" },
        capability: {
          ar: "الطلب يُبنى على الترابيزة نفسها: صنف من القائمة، وكمية، وبنود واضحة قبل الإرسال.",
          en: "The order is built against the table itself: an item from the menu, a quantity, and clear lines before sending.",
        },
        primitive: "money",
      },
      {
        id: "nile-restaurant-kitchen",
        src: "/nile-evidence/nile-restaurant/kitchen.png",
        alt: { ar: "شاشة المطبخ: تذكرة مرقّمة ببنودها وحالتها وزر بدء التحضير", en: "Kitchen screen: a numbered ticket with its lines, state and a start control" },
        capability: {
          ar: "المطبخ يستلم التذكرة بترقيمها ووقتها، وكل صنف بحالته، والتذاكر مرتّبة بالأقدم أولاً.",
          en: "The kitchen receives the ticket with its number and time, each line with its state, and tickets ordered oldest first.",
        },
        primitive: "time",
      },
    ],
  },

  {
    id: "nile-clinic",
    name: { ar: "نيل عيادة", en: "Nile Clinic" },
    tagline: {
      ar: "يوم العيادة والمرضى والأطباء والأسعار ـ بأدوار واضحة للاستقبال والطبيب.",
      en: "The clinic day, patients, doctors and prices — with clear roles for reception and doctor.",
    },
    industry: { ar: "العيادات والمراكز الطبية", en: "Clinics and medical centres" },
    problem: {
      ar: "ملفات ورقية، ومواعيد على واتساب، وسعر كشف يختلف من موظف لآخر.",
      en: "Paper files, appointments over WhatsApp, and a consultation price that changes depending on who is at the desk.",
    },
    usage: {
      ar: "شاشة يوم العيادة تعرض مواعيد اليوم بحالتها، والمرضى في سجل واحد بملفاتهم، والأطباء والأسعار تحدّد سعر كل طبيب وإجراء، فيُحصَّل بالسعر المسجّل لا بالسعر المتذكّر. الاستقبال يحجز ويحصّل، والطبيب يرى يومه، والمدير يرى التقارير.",
      en: "The clinic-day screen lists today's appointments by state, patients sit in one register with their files, and the doctors screen fixes each doctor's and procedure's price, so payment follows the recorded price instead of a remembered one. Reception books and collects, the doctor reads his day, the manager reads the reports.",
    },
    beneficiaries: {
      ar: ["طبيب العيادة", "موظف الاستقبال", "مدير العيادة"],
      en: ["The doctor", "The receptionist", "The clinic manager"],
    },
    does: {
      ar: ["يوم العيادة بحالات المواعيد", "سجل المرضى وملفاتهم", "حجز موعد", "الأطباء والأسعار", "التقارير", "الوردية والدرج"],
      en: ["The clinic day with appointment states", "A patient register and files", "Appointment booking", "Doctors and prices", "Reports", "Shift and drawer"],
    },
    entities: {
      ar: ["المرضى", "المواعيد", "الزيارات", "الأطباء", "الأسعار", "المستخدمون وأدوارهم"],
      en: ["Patients", "Appointments", "Visits", "Doctors", "Prices", "Users and roles"],
    },
    trustHighlights: {
      ar: ["السعر من جدول الأسعار لا من الذاكرة", "دور لكل مستخدم", "المواعيد بحالاتها في شاشة واحدة", "كل يوم له تقريره"],
      en: ["The price comes from the price table, not memory", "A role per user", "Appointments with their states on one screen", "Every day has its report"],
    },
    operatingPrimitives: ["people", "time", "money", "documents"],
    screens: { ar: ["يوم العيادة", "المرضى", "حجز موعد", "الأطباء والأسعار", "التقارير", "الوردية والدرج"], en: ["Clinic day", "Patients", "Book appointment", "Doctors and prices", "Reports", "Shift and drawer"] },
    trialRoom: `${DEMO}/systems/clinic.html`,
    criteria: `${DEMO}/docs/clinic.html`,
    surfaces: [
      {
        id: "nile-clinic-day",
        src: "/nile-evidence/nile-clinic/day.png",
        alt: { ar: "شاشة يوم العيادة: مواعيد اليوم وحالة كل موعد", en: "Clinic-day screen: today's appointments and each state" },
        capability: {
          ar: "يوم العيادة في شاشة واحدة: من في الانتظار، ومن في الغرفة، وما انتهى — بحالات لا بأوراق.",
          en: "The clinic day on one screen: who waits, who is in the room, what is finished — by state, not by paper.",
        },
        primitive: "time",
      },
      {
        id: "nile-clinic-patients",
        src: "/nile-evidence/nile-clinic/patients.png",
        alt: { ar: "سجل المرضى: الاسم والهاتف وعدد الزيارات", en: "Patient register: name, phone and visit count" },
        capability: {
          ar: "المرضى في سجل واحد، ولكل مريض ملفه وزياراته بدل ملف ورقي لكل زيارة.",
          en: "Patients sit in one register, each with a file and visit history instead of a paper folder per visit.",
        },
        primitive: "people",
      },
      {
        id: "nile-clinic-doctors",
        src: "/nile-evidence/nile-clinic/doctors.png",
        alt: { ar: "شاشة الأطباء والأسعار: كل طبيب وسعر كشفه وإجراءاته", en: "Doctors and prices screen: each doctor's fee and procedures" },
        capability: {
          ar: "سعر الكشف والإجراء مسجّل لكل طبيب، فيُحصَّل بالسعر المعتمد لا بالسعر المتذكّر.",
          en: "Each doctor's consultation and procedure price is recorded, so payment follows the approved price rather than a remembered one.",
        },
        primitive: "money",
      },
    ],
  },

  {
    id: "nile-courts",
    name: { ar: "نيل ملاعب", en: "Nile Courts" },
    tagline: {
      ar: "جدول اليوم بالفترات: الملعب فاضي ولا محجوز، في ثانية.",
      en: "The day as a slot grid: is the court free or booked, in a second.",
    },
    industry: { ar: "الملاعب والمراكز الرياضية", en: "Courts and sports centres" },
    problem: {
      ar: "حجز مزدوج على نفس الساعة، ودفتر مواعيد يُقرأ خطأً، وسعر ملعب يختلف من موظف لآخر.",
      en: "Double-booked hours, a paper diary misread, and a court price that varies by whoever answers the phone.",
    },
    usage: {
      ar: "جدول اليوم يعرض ساعات اليوم لكل ملعب، والخانة الفارغة تُحجز بضغطة. الحجوزات في سجل واحد بحالتها ومبلغها، والملاعب والأسعار تحدّد سعر الساعة لكل ملعب، والتقارير تجمع ما حُجز وحُصِّل.",
      en: "The day grid shows each court's hours, and a free slot is booked with one tap. Bookings sit in one record with their state and amount, the courts screen fixes each court's hourly price, and reports gather what was booked and collected.",
    },
    beneficiaries: {
      ar: ["صاحب مركز الملاعب", "موظف الحجز", "اللاعب الذي يحجز"],
      en: ["The courts owner", "The booking clerk", "The player booking a slot"],
    },
    does: {
      ar: ["جدول يوم بالفترات", "حجز من الخانة الفارغة", "سجل الحجوزات وحالتها", "الملاعب وأسعار الساعة", "التقارير", "الوردية والدرج"],
      en: ["A day grid by slot", "Booking from the free slot", "A booking record with states", "Courts and hourly prices", "Reports", "Shift and drawer"],
    },
    entities: {
      ar: ["الملاعب", "الفترات", "الحجوزات", "الأسعار"],
      en: ["Courts", "Slots", "Bookings", "Prices"],
    },
    trustHighlights: {
      ar: ["الخانة المحجوزة تظهر محجوزة", "السعر من جدول الملاعب", "كل حجز بمبلغه وحالته", "التقارير من الحجوزات نفسها"],
      en: ["A booked slot shows as booked", "The price comes from the courts table", "Every booking with its amount and state", "Reports built from the bookings themselves"],
    },
    operatingPrimitives: ["time", "money", "workflow"],
    screens: { ar: ["جدول اليوم", "الحجوزات", "الملاعب والأسعار", "التقارير", "الوردية والدرج"], en: ["Day schedule", "Bookings", "Courts and prices", "Reports", "Shift and drawer"] },
    trialRoom: `${DEMO}/systems/courts.html`,
    criteria: `${DEMO}/docs/courts.html`,
    surfaces: [
      {
        id: "nile-courts-schedule",
        src: "/nile-evidence/nile-courts/schedule.png",
        alt: { ar: "جدول اليوم: ساعات لكل ملعب مع الخانات الفارغة والمحجوزة", en: "Day schedule: hours per court with free and booked slots" },
        capability: {
          ar: "جدول اليوم يُظهر لكل ملعب ساعاته، والخانة التي تقول «فاضي» هي التي تُحجز.",
          en: "The day schedule shows each court's hours, and the slot that reads free is the one that gets booked.",
        },
        primitive: "time",
      },
      {
        id: "nile-courts-bookings",
        src: "/nile-evidence/nile-courts/bookings.png",
        alt: { ar: "سجل الحجوزات: التاريخ والملعب والعميل والمبلغ والحالة", en: "Booking record: date, court, customer, amount and state" },
        capability: {
          ar: "كل حجز في سجل بمبلغه وحالته، فيُعرف ما بيع وما حُصِّل بلا مراجعة دفتر.",
          en: "Every booking sits in a record with its amount and state, so what sold and what was collected is known without a paper diary.",
        },
        primitive: "money",
      },
      {
        id: "nile-courts-prices",
        src: "/nile-evidence/nile-courts/courts.png",
        alt: { ar: "شاشة الملاعب والأسعار: كل ملعب وسعر ساعته", en: "Courts and prices: each court and its hourly price" },
        capability: {
          ar: "سعر الساعة مسجّل لكل ملعب، فلا يختلف السعر بحسب من يردّ على الهاتف.",
          en: "Each court's hourly price is recorded, so the price does not change with whoever answers the phone.",
        },
        primitive: "money",
      },
    ],
  },

  {
    id: "nile-hr",
    name: { ar: "نيل موارد بشرية", en: "Nile HR" },
    tagline: {
      ar: "حضور وإجازات ومرتبات من سجل واحد، قبل يوم الصرف.",
      en: "Attendance, leave and payroll from one record, before pay day.",
    },
    industry: { ar: "الموارد البشرية والمرتبات", en: "HR and payroll" },
    problem: {
      ar: "حضور يُكتب في دفتر، وإجازة تُنسى، ومرتب يُجمع يدوياً كل شهر فيتأخر أو يُخطئ.",
      en: "Attendance kept in a notebook, leave nobody remembers, and payroll assembled by hand every month — late or wrong.",
    },
    usage: {
      ar: "لوحة اليوم تجمع من حضر ومن تأخر ومن في إجازة. شاشة الحضور تسجّل الدخول والخروج بالموظف نفسه، والموظفون في سجل واحد، والإجازات تُطلب وتُعتمد، والمرتبات تُبنى من الحضور والإجازات بدل التجميع اليدوي.",
      en: "The day board gathers who came, who was late and who is on leave. The attendance screen records in and out against the employee, staff sit in one register, leave is requested and approved, and payroll is built from attendance and leave instead of being assembled by hand.",
    },
    beneficiaries: {
      ar: ["مدير الموارد البشرية", "الموظف", "المحاسب الذي يصرف المرتب"],
      en: ["The HR manager", "The employee", "The accountant running payroll"],
    },
    does: {
      ar: ["لوحة يوم", "تسجيل حضور وانصراف", "سجل الموظفين", "الإجازات واعتمادها", "المرتبات", "سجلي ومسيّري"],
      en: ["A day board", "In/out attendance", "An employee register", "Leave and approval", "Payroll", "My record and approvals"],
    },
    entities: {
      ar: ["الموظفون", "البصمات", "الإجازات", "المرتبات", "المستخدمون وأدوارهم"],
      en: ["Employees", "Punches", "Leave", "Payroll", "Users and roles"],
    },
    trustHighlights: {
      ar: ["الحضور على الموظف نفسه", "الإجازة تُعتمد لا تُحكى", "المرتب يُبنى من السجل", "لكل موظف شاشة سجله"],
      en: ["Attendance is recorded against the employee", "Leave is approved, not narrated", "Payroll is built from the record", "Every employee has a record screen"],
    },
    operatingPrimitives: ["people", "time", "money"],
    screens: { ar: ["لوحة اليوم", "الحضور", "الموظفون", "الإجازات", "المرتبات", "سجلي ومسيّري"], en: ["Day board", "Attendance", "Employees", "Leave", "Payroll", "My record"] },
    trialRoom: `${DEMO}/systems/hr.html`,
    criteria: `${DEMO}/docs/hr.html`,
    surfaces: [
      {
        id: "nile-hr-today",
        src: "/nile-evidence/nile-hr/today.png",
        alt: { ar: "لوحة اليوم: الحاضرون والمتأخرون وفي إجازة", en: "Day board: present, late and on leave" },
        capability: {
          ar: "لوحة واحدة تجيب سؤال الصباح: من حضر، من تأخر، ومن في إجازة — قبل أن يسأل أحد.",
          en: "One board answers the morning question — who came, who was late, who is on leave — before anyone has to ask.",
        },
        primitive: "people",
      },
      {
        id: "nile-hr-attendance",
        src: "/nile-evidence/nile-hr/attendance.png",
        alt: { ar: "شاشة الحضور: الدخول والخروج لكل موظف مع التأخير", en: "Attendance screen: in and out per employee with lateness" },
        capability: {
          ar: "الحضور يُسجَّل على الموظف نفسه دخولاً وخروجاً، والتأخير يُحتسب من الوقت لا من الرواية.",
          en: "Attendance is recorded in and out against the employee, and lateness is computed from the clock rather than from a story.",
        },
        primitive: "time",
      },
      {
        id: "nile-hr-payroll",
        src: "/nile-evidence/nile-hr/payroll.png",
        alt: { ar: "شاشة المرتبات: الأساسي والخصومات والصافي لكل موظف", en: "Payroll screen: base, deductions and net per employee" },
        capability: {
          ar: "المرتب يُبنى من حضور الشهر وإجازاته، فلا يُجمَّع في ورقة قبل يوم الصرف.",
          en: "Payroll is built from the month's attendance and leave, so it is not assembled on a sheet just before pay day.",
        },
        primitive: "money",
      },
      {
        id: "nile-hr-staff",
        src: "/nile-evidence/nile-hr/staff.png",
        alt: { ar: "سجل الموظفين: الوظيفة والقسم وحالة كل موظف", en: "Employee register: job, department and each employee's state" },
        capability: {
          ar: "الموظفون في سجل واحد بالوظيفة والقسم، ومنه تُبنى الإجازات والمرتبات.",
          en: "Employees sit in one register by job and department, and leave and payroll are built from it.",
        },
        primitive: "people",
      },
    ],
  },

  {
    id: "nile-sites",
    name: { ar: "نيل مواقع", en: "Nile Sites" },
    tagline: {
      ar: "سبعة مواقع أنشطة، كل واحد بشكل يناسب زبونه ويعلن حالته بصدق.",
      en: "Seven trade sites, each shaped for its own customer and stating its state honestly.",
    },
    industry: { ar: "الأنشطة المتعددة والتسويق", en: "Multi-trade operations and marketing" },
    problem: {
      ar: "موقع واحد لكل الأنشطة فيبدو غريباً على كل زبون، أو مواقع متعددة بلا فهرس يجمعها.",
      en: "One site stretched over every trade and looking foreign to each customer, or several sites with no index that gathers them.",
    },
    usage: {
      ar: "فهرس واحد يعرض المواقع السبعة وحالة كل واحد، وكل موقع مبني لجمهوره: موبايل، أزياء، مطعم، عيادة، جيم، ملاعب، عقارات. الزائر يختار نشاطه فيدخل موقعاً يشبه ما يتوقعه منه، بدل صفحة عامة تُرضي الجميع ولا تُقنع أحداً.",
      en: "One index shows the seven sites and each one's state, and every site is built for its own audience: mobile, fashion, restaurant, clinic, gym, courts, real estate. A visitor picks their trade and lands on a site shaped like what they expect, instead of a generic page that suits everyone and convinces nobody.",
    },
    beneficiaries: {
      ar: ["مالك عدة أنشطة", "مدير التسويق", "من يدير المحتوى"],
      en: ["An owner running several trades", "The marketing manager", "Whoever edits the content"],
    },
    does: {
      ar: ["فهرس المواقع السبعة", "موقع لكل نشاط بجمهوره", "حالة كل موقع معلنة", "أقسام وأسعار وطلب لكل نشاط"],
      en: ["An index of the seven sites", "A site per trade for its own audience", "Each site's state stated plainly", "Sections, prices and an enquiry path per trade"],
    },
    entities: {
      ar: ["المواقع", "حالة كل موقع", "أقسام كل نشاط", "الطلبات"],
      en: ["Sites", "Each site's state", "Each trade's sections", "Enquiries"],
    },
    trustHighlights: {
      ar: ["كل موقع بشكل نشاطه لا بقالب واحد", "الحالة معلنة لا مُبالغ فيها", "فهرس يجمع السبعة", "نفس اللغة البصرية في السبعة"],
      en: ["Each site is shaped by its trade, not a single template", "State stated, not inflated", "One index gathers all seven", "The same visual language across the seven"],
    },
    operatingPrimitives: ["relationships", "insight", "workflow"],
    screens: { ar: ["فهرس المواقع", "الموبايل", "الأزياء", "المطعم", "العيادة", "الجيم", "الملاعب", "العقارات"], en: ["Sites index", "Mobile", "Fashion", "Restaurant", "Clinic", "Gym", "Courts", "Real estate"] },
    trialRoom: `${DEMO}/sites/`,
    criteria: `${DEMO}/docs/sites.html`,
    surfaces: [
      {
        id: "nile-sites-index",
        src: "/nile-evidence/nile-sites/index.png",
        alt: { ar: "فهرس المواقع السبعة مع حالة كل موقع", en: "The seven-sites index with each site's state" },
        capability: {
          ar: "فهرس واحد للسبعة، وكل موقع يعلن حالته بصدق بدل شارة تسويقية.",
          en: "One index for all seven, each stating its state honestly rather than carrying a marketing badge.",
        },
        primitive: "insight",
      },
      {
        id: "nile-sites-fashion",
        src: "/nile-evidence/nile-sites/fashion.png",
        alt: { ar: "موقع الأزياء: صفحة أولى بشكل دار أزياء", en: "The fashion site: a first page shaped like a fashion house" },
        capability: {
          ar: "موقع الأزياء بلغة دار أزياء: صورة، تشكيلة، وأسلوب يخاطب زبوناً مختلفاً عن زبون المطعم.",
          en: "The fashion site speaks as a fashion house — image, collection and a tone aimed at a different customer than the restaurant's.",
        },
        primitive: "relationships",
      },
      {
        id: "nile-sites-realestate",
        src: "/nile-evidence/nile-sites/realestate.png",
        alt: { ar: "موقع العقارات: وحدات ومساحات وطلب معاينة", en: "The real-estate site: units, areas and a viewing request" },
        capability: {
          ar: "موقع العقارات يعرض وحدات بمساحاتها ويطلب معاينة، لأن قرار العقار يُبنى على المساحة والسعر.",
          en: "The real-estate site lists units with their areas and asks for a viewing, because a property decision rests on area and price.",
        },
        primitive: "workflow",
      },
      {
        id: "nile-sites-gym",
        src: "/nile-evidence/nile-sites/gym.png",
        alt: { ar: "موقع الجيم: اشتراكات ومدربون وحجز تجربة", en: "The gym site: memberships, trainers and a trial booking" },
        capability: {
          ar: "موقع الجيم يبيع اشتراكاً لا صفحة تعريف، ويعرض المدربين وحجز الحصة الأولى.",
          en: "The gym site sells a membership rather than introducing itself, showing trainers and a first-session booking.",
        },
        primitive: "relationships",
      },
    ],
  },
];

/**
 * برامج ويندوز الخمسة — عملٌ آخر مستقل عن الأنظمة السبعة.
 *
 * لم تُخلط بأسطح الأنظمة: هذا برنامج مثبَّت على جهاز يعمل بلا إنترنت، وذاك نظام
 * ويب متعدد الأدوار. الخلط بينهما هو الخطأ الذي نبّه إليه المالك، فلا يُعاد.
 */
export type NileWindowsProgram = {
  id: string;
  name: Record<AppLocale, string>;
  line: Record<AppLocale, string>;
  runUrl: string;
  src: string;
  alt: Record<AppLocale, string>;
  capability: Record<AppLocale, string>;
};

export const NILE_WINDOWS_PROGRAMS: NileWindowsProgram[] = [
  {
    id: "cashier",
    name: { ar: "كاشير ويندوز", en: "Windows cashier" },
    line: { ar: "بيع وإيصال 80mm على الجهاز نفسه، بلا إنترنت.", en: "Selling and an 80mm receipt on the device itself, without a connection." },
    runUrl: `${DEMO}/windows/cashier/`,
    src: "/nile-evidence/nile-windows/cashier.png",
    alt: { ar: "برنامج الكاشير على ويندوز: أصناف وسلة وفاتورة", en: "The Windows cashier: items, cart and invoice" },
    capability: {
      ar: "نفس منطق البيع لكن على جهاز المكتب، مع طابور مزامنة يظهر على الشريط.",
      en: "The same selling logic on a desk machine, with a sync queue visible in the bar.",
    },
  },
  {
    id: "stock",
    name: { ar: "مخازن ويندوز", en: "Windows stock" },
    line: { ar: "أصناف وأرصدة على الجهاز، تعمل بلا شبكة.", en: "Items and balances on the device, working without a network." },
    runUrl: `${DEMO}/windows/stock/`,
    src: "/nile-evidence/nile-windows/stock.png",
    alt: { ar: "برنامج المخازن على ويندوز: جدول أصناف وأرصدة", en: "The Windows stock program: an items and balances table" },
    capability: {
      ar: "جدول أصناف وأرصدة كامل على الجهاز، ومناسب لمخزن بلا شبكة داخلية.",
      en: "A full items-and-balances table on the device, suited to a store with no internal network.",
    },
  },
  {
    id: "kitchen",
    name: { ar: "مطبخ ويندوز", en: "Windows kitchen" },
    line: { ar: "شاشة مطبخ على جهاز مستقل عن الصالة.", en: "A kitchen screen on a machine separate from the floor." },
    runUrl: `${DEMO}/windows/kitchen/`,
    src: "/nile-evidence/nile-windows/kitchen.png",
    alt: { ar: "برنامج المطبخ على ويندوز: تذاكر مفتوحة", en: "The Windows kitchen program: open tickets" },
    capability: {
      ar: "شاشة مطبخ مستقلة تشتغل على جهاز في المطبخ بعيداً عن كاشير الصالة.",
      en: "A separate kitchen screen running on a machine in the kitchen, away from the floor till.",
    },
  },
  {
    id: "attendance",
    name: { ar: "حضور ويندوز", en: "Windows attendance" },
    line: { ar: "بصمة دخول وخروج على جهاز عند البوابة.", en: "In and out punching on a machine at the gate." },
    runUrl: `${DEMO}/windows/attendance/`,
    src: "/nile-evidence/nile-windows/attendance.png",
    alt: { ar: "برنامج الحضور على ويندوز: إدخال كود الموظف", en: "The Windows attendance program: entering an employee code" },
    capability: {
      ar: "تسجيل الحضور بكود الموظف على جهاز واحد عند البوابة، بلا متصفح ولا حساب لكل موظف.",
      en: "Attendance by employee code on one machine at the gate, with no browser and no account per employee.",
    },
  },
  {
    id: "reports",
    name: { ar: "تقارير ويندوز", en: "Windows reports" },
    line: { ar: "تقارير البيع والدرج على المكتب.", en: "Sales and drawer reports on the desk." },
    runUrl: `${DEMO}/windows/reports/`,
    src: "/nile-evidence/nile-windows/reports.png",
    alt: { ar: "برنامج التقارير على ويندوز: مبيعات ودرج", en: "The Windows reports program: sales and drawer" },
    capability: {
      ar: "تقارير محلية تُقرأ من قاعدة الجهاز نفسها بلا انتظار مزامنة.",
      en: "Local reports read from the device's own store with no waiting for a sync.",
    },
  },
];

/** أسماء الأصول التشغيلية لعرض شرائح الجذور. */
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
