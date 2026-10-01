#!/usr/bin/env node
/**
 * DEVELOPMENT FIXTURE — NOT PRODUCT TRUTH.
 *
 * Serves one payload in the `lena.world-signals/1` contract so World Command can
 * be exercised locally, or in a review environment, against a source that
 * actually answers. It is a harness, never a deployment:
 *
 *   node tools/world-signal-fixture.mjs 8099
 *   LENA_WORLD_SIGNAL_SOURCE_URL=http://127.0.0.1:8099/signals pnpm --filter @workspace/api-server dev
 *
 * Nothing in this file is imported by the application, and production never
 * points at it. The signals below are illustrative shapes, not claims about any
 * product's real operations.
 */
import { createServer } from "node:http";

const port = Number.parseInt(process.argv[2] ?? "8099", 10);
const startedAt = Date.now();

const minutesAgo = (minutes) => new Date(startedAt - minutes * 60_000).toISOString();

/** Illustrative shapes only. Real signals come from a real product endpoint. */
function fixturePayload() {
  return {
    protocol: "lena.world-signals/1",
    observedAt: new Date().toISOString(),
    worlds: ["property", "wellness", "recycling"],
    signals: [
      {
        id: "fixture-property-renewals",
        world: "property",
        kind: "attention-needed",
        severity: "attention",
        timestamp: minutesAgo(42),
        title: {
          ar: "عقود تقترب من موعد التجديد",
          en: "Contracts approaching renewal",
        },
        description: {
          ar: "طلب تجريبي لفحص غرفة القيادة: دفعة تجديدات تحتاج مراجعة هذا الأسبوع.",
          en: "Fixture request for exercising the command room: a renewal batch needs review this week.",
        },
        targetPath: "/world/property",
        lifecycle: "new",
      },
      {
        id: "fixture-wellness-day",
        world: "wellness",
        kind: "activity",
        severity: "information",
        timestamp: minutesAgo(95),
        title: {
          ar: "حركة مواعيد اليوم",
          en: "Appointment movement today",
        },
        description: {
          ar: "طلب تجريبي: حركة تشغيل اعتيادية داخل عالم الجمال.",
          en: "Fixture request: ordinary operating movement inside the beauty world.",
        },
        targetPath: "/world/wellness",
        lifecycle: "active",
      },
      {
        id: "fixture-recycling-weigh-point",
        world: "recycling",
        kind: "degraded",
        severity: "critical",
        timestamp: minutesAgo(12),
        title: {
          ar: "نقطة الوزن تحتاج تدخلًا",
          en: "Weigh point needs intervention",
        },
        description: {
          ar: "طلب تجريبي: تدفق يومي متعطل عند نقطة الوزن.",
          en: "Fixture request: daily flow stalled at the weigh point.",
        },
        targetPath: "/world/recycling",
        lifecycle: "new",
      },
      {
        id: "fixture-recycling-resolved",
        world: "recycling",
        kind: "resolved",
        severity: "ambient",
        timestamp: minutesAgo(240),
        title: {
          ar: "أُغلق تنبيه سابق",
          en: "Earlier alert closed",
        },
        description: {
          ar: "طلب تجريبي: إشارة عادت إلى الهدوء بعد المعالجة.",
          en: "Fixture request: a signal returned to calm after handling.",
        },
        targetPath: "/world/recycling",
        lifecycle: "resolved",
      },
    ],
  };
}

const server = createServer((request, response) => {
  if (request.url?.split("?")[0] !== "/signals") {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not-found" }));
    return;
  }
  response.writeHead(200, {
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(fixturePayload()));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[world-signal-fixture] DEVELOPMENT FIXTURE listening on http://127.0.0.1:${port}/signals`);
  console.log("[world-signal-fixture] not product truth — never point production at this harness");
});
