import type { AppLocale } from "@/providers/preferences";
import type { OperatingPrimitiveId, SystemId } from "@/content/systems";
import { NILE_SYSTEMS_META } from "@/content/nile-systems";

/**
 * Canonical real-application evidence.
 *
 * One place owns every product visual surfaced in LENA World. Each entry points
 * at an actual asset from the real product repository (verified by the
 * repository guard), describes the capability the surface proves, and — where
 * it is meaningful — links the surface to the operating root it demonstrates,
 * so the Constellation Graph can point visitors at real proof.
 *
 * Systems without evidence yet simply have no entry here. Nothing is invented:
 * no fictional screens, no mockups presented as real. The chamber reveals the
 * Operating Surfaces layer only when real evidence exists.
 */
export type EvidenceSurface = {
  /** Stable anchor id, used for deep links (e.g. /world/property#money). */
  id: string;
  /** Site-root-relative asset path (public/world/evidence/<system>/…). */
  src: string;
  /** Accessible description of the actual application surface. */
  alt: Record<AppLocale, string>;
  /** What this surface proves — capability, never lifecycle status. */
  capability: Record<AppLocale, string>;
  /** Operating root this surface demonstrates, when applicable. */
  primitive?: OperatingPrimitiveId;
};

/** أسطح نيل سيستمز — تُولَّد من ملف بيانات واحد حتى لا تنفصل عن الكتالوج. */
function nileEvidence(): Partial<Record<SystemId, EvidenceSurface[]>> {
  const out: Partial<Record<SystemId, EvidenceSurface[]>> = {};
  for (const meta of NILE_SYSTEMS_META) {
    out[meta.id as SystemId] = meta.surfaces.map((surface) => ({
      id: surface.id,
      src: surface.src,
      alt: surface.alt,
      capability: surface.capability,
      primitive: surface.primitive,
    }));
  }
  return out;
}

export const SYSTEM_EVIDENCE: Partial<Record<SystemId, EvidenceSurface[]>> = {
  /**
   * MALEK — real application surfaces captured from the running application
   * (the current deployed MALEK UI, signed in as the QA workspace) plus the
   * sign-in screen. Each surface proves a different capability: entry point,
   * operating overview, assets, contracts, money, maintenance and mobile
   * operations. These are current-interface captures, not archived exports.
   */
  property: [
    {
      id: "entry",
      src: "/world/evidence/malek/entry.png",
      alt: {
        ar: "شاشة تسجيل الدخول إلى MALEK",
        en: "The MALEK sign-in screen",
      },
      capability: {
        ar: "نقطة دخول MALEK: جلسة واحدة تدخل إلى كل عمليات النظام.",
        en: "MALEK's entry point: one session into the whole system's operations.",
      },
    },
    {
      id: "dashboard",
      src: "/world/evidence/malek/dashboard-dark.png",
      alt: {
        ar: "لوحة تشغيل MALEK: العقارات والوحدات وحالة الشهر في نظرة واحدة",
        en: "MALEK operating dashboard: properties, units and the month at a glance",
      },
      capability: {
        ar: "نظرة تشغيل عامة تجمع العقارات والوحدات وحالة التحصيل.",
        en: "An operating overview that gathers properties, units and collection state.",
      },
      primitive: "insight",
    },
    {
      id: "properties",
      src: "/world/evidence/malek/properties.png",
      alt: {
        ar: "شاشة العقارات والوحدات في MALEK",
        en: "The properties and units screen in MALEK",
      },
      capability: {
        ar: "العقارات والوحدات أصول منظَّمة داخل النظام.",
        en: "Properties and units as organized assets inside the system.",
      },
      primitive: "assets",
    },
    {
      id: "contracts",
      src: "/world/evidence/malek/contracts.png",
      alt: {
        ar: "شاشة العقود والإيجارات في MALEK",
        en: "The contracts and leases screen in MALEK",
      },
      capability: {
        ar: "العقود والتجديدات بتاريخها، يتتبعها النظام لا الذاكرة.",
        en: "Contracts and renewals with their dates, tracked by the system rather than memory.",
      },
      primitive: "time",
    },
    {
      id: "financials",
      src: "/world/evidence/malek/financials.png",
      alt: {
        ar: "الشاشة المالية في MALEK: التحصيل والمتأخرات",
        en: "The financials screen in MALEK: collection and arrears",
      },
      capability: {
        ar: "التحصيل والمتأخرات والتقارير المالية في مسار واحد.",
        en: "Collection, arrears and financial reporting in one path.",
      },
      primitive: "money",
    },
    {
      id: "maintenance",
      src: "/world/evidence/malek/maintenance.png",
      alt: {
        ar: "شاشة طلبات الصيانة في MALEK",
        en: "The maintenance requests screen in MALEK",
      },
      capability: {
        ar: "طلبات الصيانة تُسجَّل وتُتابَع حتى الإغلاق.",
        en: "Maintenance requests logged and followed through to closure.",
      },
      primitive: "workflow",
    },
    {
      id: "mobile",
      src: "/world/evidence/malek/mobile.png",
      alt: {
        ar: "واجهة MALEK على الجوال",
        en: "The MALEK interface on a phone",
      },
      capability: {
        ar: "الوحدات والعقود تُدار من الجوال أثناء التنقل.",
        en: "Units and contracts operated from a phone on the move.",
      },
    },
  ],

  /**
   * Wellness (Lara Beauty) — real application surfaces captured from
   * the running centre system: sign-in, daily dashboard, appointment
   * scheduling, point of sale, records, services, reports, and mobile flows.
   */
  wellness: [
    {
      id: "wellness-entry",
      src: "/world/evidence/wellness/login.png",
      alt: {
        ar: "شاشة تسجيل الدخول إلى نظام مراكز التجميل والسبا",
        en: "Sign-in screen for the beauty and spa system",
      },
      capability: {
        ar: "نقطة دخول مخصصة لفريق العمل: إدارة متكاملة في جلسة واحدة.",
        en: "Dedicated entry point for staff: complete operations in one session.",
      },
    },
    {
      id: "wellness-dashboard",
      src: "/world/evidence/wellness/dashboard.png",
      alt: {
        ar: "لوحة تشغيل المركز: المواعيد وحالة اليوم في نظرة واحدة",
        en: "Operating dashboard: appointments and daily state at a glance",
      },
      capability: {
        ar: "نظرة تشغيل عامة تلخص المواعيد وجدول اليوم والأداء المالي.",
        en: "An operating overview summarizing appointments, schedule and financial state.",
      },
      primitive: "insight",
    },
    {
      id: "wellness-appointments",
      src: "/world/evidence/wellness/appointments.png",
      alt: {
        ar: "شاشة المواعيد والحجوزات وجداول المتخصصات",
        en: "The appointments and schedule screen",
      },
      capability: {
        ar: "إدارة المواعيد وتوزيع الجداول بدقة دون تضارب.",
        en: "Appointment scheduling and conflict-free staff assignment.",
      },
      primitive: "time",
    },
    {
      id: "wellness-pos",
      src: "/world/evidence/wellness/pos.png",
      alt: {
        ar: "شاشة نقطة البيع وإصدار الفواتير",
        en: "Point of sale and receipt generation",
      },
      capability: {
        ar: "نقطة بيع فورية مع طرق دفع متعددة وفواتير مرقّمة.",
        en: "Instant point of sale with multiple payment methods and receipts.",
      },
      primitive: "money",
    },
    {
      id: "wellness-records",
      src: "/world/evidence/wellness/records.png",
      alt: {
        ar: "شاشة سجلات المستفيدات وتاريخ الزيارات",
        en: "Visitor records and visit history screen",
      },
      capability: {
        ar: "سجلات الزيارات والملاحظات الخاصة بكل مستفيدة في مكان واحد.",
        en: "Visit records and individual preferences organized in one place.",
      },
      primitive: "relationships",
    },
    {
      id: "wellness-services",
      src: "/world/evidence/wellness/services.png",
      alt: {
        ar: "شاشة الخدمات والتسعير والتصنيفات",
        en: "Services, pricing and categories screen",
      },
      capability: {
        ar: "هيكلة الخدمات والمدد الزمنية والتسعير لكل قسم.",
        en: "Structuring services, durations and pricing across departments.",
      },
      primitive: "workflow",
    },
    {
      id: "wellness-reports",
      src: "/world/evidence/wellness/reports.png",
      alt: {
        ar: "شاشة التقارير والتحليلات التشغيلية",
        en: "Operational reports and performance analytics",
      },
      capability: {
        ar: "تقارير تشغيلية ومالية واضحة لحركة المركز والأقسام.",
        en: "Clear operational and financial reporting on centre performance.",
      },
      primitive: "insight",
    },
    {
      id: "wellness-mobile-dashboard",
      src: "/world/evidence/wellness/mobile-dashboard.png",
      alt: {
        ar: "لوحة التحكم من شاشة الجوال",
        en: "Mobile dashboard interface",
      },
      capability: {
        ar: "متابعة أداء المركز والمواعيد مباشرة من الجوال.",
        en: "Monitoring operations and appointments directly from mobile.",
      },
      primitive: "assets",
    },
    {
      id: "wellness-mobile-appointments",
      src: "/world/evidence/wellness/mobile-appointments.png",
      alt: {
        ar: "إدارة المواعيد من الجوال",
        en: "Mobile appointments management",
      },
      capability: {
        ar: "حجز وتعديل المواعيد ومتابعة الجدول أثناء الحركة.",
        en: "Booking and managing appointments on the move.",
      },
      primitive: "people",
    },
    {
      id: "wellness-mobile-pos",
      src: "/world/evidence/wellness/mobile-pos.png",
      alt: {
        ar: "واجهة نقطة البيع من الجوال",
        en: "Mobile point-of-sale interface",
      },
      capability: {
        ar: "تنفيذ عمليات البيع والتحصيل السريع من أي جهاز محمول.",
        en: "Handling fast sales and payments directly from mobile devices.",
      },
      primitive: "money",
    },
  ],

  /**
   * Carmen Gallery — real application surfaces captured from the running
   * showroom system (signed in as the gallery manager). The public landing
   * is not included here: it may be shown as a separate project.
   */
  rental: [
    {
      id: "carmen-entry",
      src: "/world/evidence/carmen/login.png",
      alt: {
        ar: "شاشة تسجيل الدخول إلى كارمن جالري",
        en: "The Carmen Gallery sign-in screen",
      },
      capability: {
        ar: "نقطة دخول إدارة المعرض: جلسة واحدة تدخل إلى المخزون والحجز والتسليم.",
        en: "Showroom operations entry: one session into inventory, reservations and handover.",
      },
    },
    {
      id: "carmen-dashboard",
      src: "/world/evidence/carmen/dashboard.png",
      alt: {
        ar: "لوحة تشغيل كارمن جالري على الكمبيوتر: التحصيل والمتابعات وحالة اليوم",
        en: "Carmen Gallery computer dashboard: collection, follow-ups and the day at a glance",
      },
      capability: {
        ar: "نظرة تشغيل عامة تجمع التحصيل والمتأخرات وتسليمات اليوم.",
        en: "An operating overview that gathers collection, arrears and today's handovers.",
      },
    },
    {
      id: "carmen-inventory",
      src: "/world/evidence/carmen/inventory.png",
      alt: {
        ar: "شاشة مخزون القطع في كارمن جالري: الحالة والمقاس والسعر",
        en: "The piece inventory screen in Carmen Gallery: status, size and price",
      },
      capability: {
        ar: "كل قطعة لها سجل: متاحة أو محجوزة أو خارجة، مع المقاس والسعر.",
        en: "Every piece has a record: available, reserved or out, with size and price.",
      },
      primitive: "assets",
    },
    {
      id: "carmen-availability",
      src: "/world/evidence/carmen/availability.png",
      alt: {
        ar: "شاشة المتاح في فترة المناسبة في كارمن جالري",
        en: "The occasion-window availability screen in Carmen Gallery",
      },
      capability: {
        ar: "ما هو متاح فعلًا لتاريخ المناسبة، لا ما يبدو متاحًا اليوم.",
        en: "What is genuinely free for the occasion dates, not what merely looks free today.",
      },
      primitive: "time",
    },
    {
      id: "carmen-reservations",
      src: "/world/evidence/carmen/reservations.png",
      alt: {
        ar: "شاشة الحجوزات والتقويم في كارمن جالري",
        en: "The reservations and calendar screen in Carmen Gallery",
      },
      capability: {
        ar: "الحجز مرتبط بتاريخ المناسبة، فلا تُحجز القطعة مرتين.",
        en: "A reservation is tied to the occasion date, so nothing is double-booked.",
      },
      primitive: "time",
    },
    {
      id: "carmen-delivery",
      src: "/world/evidence/carmen/delivery-return.png",
      alt: {
        ar: "شاشة التسليم والاسترجاع في كارمن جالري",
        en: "The handover and return screen in Carmen Gallery",
      },
      capability: {
        ar: "خروج القطعة وعودتها يُسجَّلان حتى تُغلق العملية.",
        en: "Piece checkout and return are logged through to close.",
      },
      primitive: "workflow",
    },
    {
      id: "carmen-payments",
      src: "/world/evidence/carmen/payments.png",
      alt: {
        ar: "دفتر التحصيل اليدوي والتأمينات في كارمن جالري",
        en: "The cash collection and deposit ledger in Carmen Gallery",
      },
      capability: {
        ar: "العربون والتحصيل والمتبقي في دفتر واحد داخل المعرض.",
        en: "Deposits, collection and remaining balances in one in-showroom ledger.",
      },
      primitive: "money",
    },
    {
      id: "carmen-customers",
      src: "/world/evidence/carmen/customers.png",
      alt: {
        ar: "شاشة العميلات والحجوزات المرتبطة في كارمن جالري",
        en: "The customers screen in Carmen Gallery, with linked reservations",
      },
      capability: {
        ar: "سجل العميلة وحجوزاتها والمبالغ عليها في مكان واحد.",
        en: "Each customer's record, reservations and outstanding amounts in one place.",
      },
      primitive: "relationships",
    },
    {
      id: "carmen-appointments",
      src: "/world/evidence/carmen/appointments.png",
      alt: {
        ar: "شاشة مواعيد التجربة في كارمن جالري",
        en: "The fitting-appointment screen in Carmen Gallery",
      },
      capability: {
        ar: "مواعيد التجربة تُثبَّت على التقويم بدل الرسائل المتفرقة.",
        en: "Fitting appointments sit on the calendar instead of scattered messages.",
      },
      primitive: "time",
    },
    {
      id: "carmen-sales",
      src: "/world/evidence/carmen/sales.png",
      alt: {
        ar: "شاشة المبيعات والمرتجعات في كارمن جالري",
        en: "The sales and returns screen in Carmen Gallery",
      },
      capability: {
        ar: "البيع والإرجاع يُسجَّلان على القطعة لا في دفتر جانبي.",
        en: "Sales and returns are recorded against the piece, not a side notebook.",
      },
      primitive: "money",
    },
    {
      id: "carmen-reports",
      src: "/world/evidence/carmen/reports.png",
      alt: {
        ar: "شاشة التقارير التشغيلية والمالية في كارمن جالري",
        en: "The operating and financial reports screen in Carmen Gallery",
      },
      capability: {
        ar: "صورة واحدة للتحصيل والمصروف وحركة القطع.",
        en: "One view of collection, costs and piece movement.",
      },
    },
    {
      id: "carmen-mobile-dashboard",
      src: "/world/evidence/carmen/mobile-dashboard.png",
      alt: {
        ar: "لوحة كارمن جالري على الجوال",
        en: "The Carmen Gallery dashboard on a phone",
      },
      capability: {
        ar: "متابعة التحصيل والمتأخرات من الجوال أثناء العمل في المعرض.",
        en: "Collection and arrears followed from a phone on the showroom floor.",
      },
    },
    {
      id: "carmen-mobile-reservations",
      src: "/world/evidence/carmen/mobile-reservations.png",
      alt: {
        ar: "الحجوزات على جوال كارمن جالري",
        en: "Reservations on the Carmen Gallery phone interface",
      },
      capability: {
        ar: "الحجز والتواريخ تُدار من الجوال داخل المعرض.",
        en: "Reservations and dates operated from a phone inside the showroom.",
      },
      primitive: "time",
    },
    {
      id: "carmen-mobile-delivery",
      src: "/world/evidence/carmen/mobile-delivery.png",
      alt: {
        ar: "التسليم والاسترجاع على جوال كارمن جالري",
        en: "Handover and return on the Carmen Gallery phone interface",
      },
      capability: {
        ar: "تسليم القطعة واسترجاعها يُسجَّلان من الجوال لحظة الحركة.",
        en: "Handover and return logged from a phone at the moment of movement.",
      },
      primitive: "workflow",
    },
  ],
};

/** Real evidence for one system, or undefined when none exists yet. */
export function evidenceFor(systemId: string): EvidenceSurface[] | undefined {
  return ALL_SYSTEM_EVIDENCE[systemId as SystemId];
}

/** The operating dashboard plate only — never a mobile crop, never a stand-in. */
export function dashboardEvidenceFor(systemId: string): EvidenceSurface | undefined {
  return evidenceFor(systemId)?.find(
    (surface) => /(?:^|-)dashboard$/.test(surface.id) && !surface.id.includes("mobile"),
  );
}

/** First surface of a system that demonstrates a given operating root. */
export function evidenceForPrimitive(
  systemId: string,
  primitiveId: OperatingPrimitiveId,
): EvidenceSurface | undefined {
  return evidenceFor(systemId)?.find((surface) => surface.primitive === primitiveId);
}

// دمج أدلة نيل في السجل القياسي: `evidenceFor()` تقرأ من هنا، فتصبح الأنظمة
// السبعة «موثّقة» بنفس القاعدة التي تحكم غيرها، بلا فرع خاص في أي مكوّن.
export const ALL_SYSTEM_EVIDENCE: Partial<Record<SystemId, EvidenceSurface[]>> = {
  ...SYSTEM_EVIDENCE,
  ...nileEvidence(),
};
