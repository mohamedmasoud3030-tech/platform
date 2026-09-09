import { expect, test } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openApp, VIEWPORTS } from "../helpers/app.mjs";

/**
 * Phase 10 — accessibility.
 *
 * Two layers:
 *  1. Lightweight sanity (duplicate IDs, unnamed interactives, landmark
 *     presence, skip link, keyboard reachability, focus visibility).
 *  2. Automated WCAG 2.x A/AA audit (axe-core) across the public route
 *     matrix in both locales and both themes. Axe is an automated layer:
 *     it guards the programmatically-checkable bar (contrast, names,
 *     structure, ARIA); an assistive-technology pass remains a separate,
 *     human-side activity (OPEN_DECISIONS B-11).
 *
 * The route matrix intentionally covers the ledger-heavy surfaces (World
 * index, documented + pending chambers) where the register's restrained
 * palette is most at risk of contrast regressions, plus marketing surfaces
 * in both languages.
 */

const specDir = dirname(fileURLToPath(import.meta.url));
const AXE_SOURCE = resolve(specDir, "..", "node_modules", "axe-core", "axe.min.js");

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** [route, locale, theme] — the audited public matrix. */
const AXE_MATRIX = [
  ["/", "en", "dark"],
  ["/", "ar", "dark"],
  ["/", "en", "light"],
  ["/world", "en", "dark"],
  ["/world", "ar", "dark"],
  ["/world/property", "en", "dark"],
  ["/world/property", "ar", "dark"],
  ["/world/property", "en", "light"],
  ["/world/rental", "en", "dark"],
  ["/world/wellness", "en", "dark"],
  ["/world/investment", "en", "dark"],
  ["/world/hospitality", "en", "dark"],
  ["/world/recycling", "en", "dark"],
  ["/world/wellness", "ar", "dark"],
  ["/world/rental", "ar", "dark"],
  ["/world/investment", "ar", "dark"],
  ["/world/hospitality", "ar", "dark"],
  ["/world/recycling", "ar", "dark"],
  ["/services", "en", "dark"],
  ["/services", "ar", "dark"],
  ["/about", "en", "dark"],
  ["/portfolio", "en", "dark"],
  ["/contact", "en", "dark"],
  ["/world/command", "en", "dark"],
  ["/world/atlas", "en", "dark"],
];

function annotate(testInfo, route, locale, theme = "dark") {
  testInfo.annotations.push(
    { type: "route", description: `/${locale}${route}` },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: theme },
    { type: "locale", description: locale },
  );
}

/* ------------------------------------------------------------------ */
/* Layer 1 — lightweight sanity                                        */
/* ------------------------------------------------------------------ */

for (const route of ["/", "/world", "/world/property", "/contact"]) {
  test(`a11y sanity: ${route} (en)`, async ({ page }) => {
    annotate(test.info(), route, "en");
    await openApp(page, { route, locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

    // Duplicate IDs would confuse labels / aria-labelledby / anchors.
    const duplicateIds = await page.evaluate(() => {
      const seen = new Map();
      for (const el of document.querySelectorAll("[id]")) {
        const id = el.getAttribute("id");
        seen.set(id, (seen.get(id) ?? 0) + 1);
      }
      return [...seen].filter(([, count]) => count > 1).map(([id, count]) => `${id} (${count})`);
    });
    expect(duplicateIds, "duplicate element ids").toEqual([]);

    // Interactive elements (excluding decorative) must have an accessible name.
    const unnamed = await page.evaluate(() => {
      const nameOf = (el) => {
        if (el.getAttribute("aria-label")?.trim()) return true;
        if (el.getAttribute("aria-labelledby")) return true;
        if (el.getAttribute("title")?.trim()) return true;
        if (el.getAttribute("alt")?.trim()) return true;
        return Boolean(el.textContent?.trim());
      };
      const picks = new Set();
      for (const el of document.querySelectorAll("button, a[href], [role='button']")) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (!nameOf(el)) {
          picks.add(
            `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(" ")[0]}` : ""}`,
          );
        }
      }
      return [...picks].slice(0, 30);
    });
    expect(unnamed, "interactive elements missing accessible names").toEqual([]);

    // Landmarks. Chamber pages legitimately render a nested <main> and section
    // <header> elements, so assert landmark roles present (≥1) and banner = 1.
    await expect
      .poll(() => page.getByRole("main").count(), { message: "main landmark present" })
      .toBeGreaterThanOrEqual(1);
    await expect(page.getByRole("banner"), "banner landmark").toHaveCount(1);
    await expect(page.getByRole("banner").locator("nav"), "primary navigation in banner").toBeVisible();

    // Skip link points to a real target and is focusable.
    const skip = page.locator(".skip-link");
    await expect(skip).toHaveCount(1);
    const skipTarget = await skip.getAttribute("href");
    expect(skipTarget?.startsWith("#"), "skip link targets an anchor").toBe(true);
    await expect(page.locator(skipTarget), "skip link target exists").toHaveCount(1);
  });
}

test("a11y sanity: keyboard reaches primary navigation with visible focus", async ({ page }) => {
  annotate(test.info(), "/", "en");
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  await page.locator("body").click({ position: { x: 4, y: 4 } }).catch(() => {});
  const focused = [];
  for (let i = 0; i < 16; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        tag: el.tagName,
        text: (el.textContent ?? "").trim().slice(0, 40),
        className: String(el.className).slice(0, 50),
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
      };
    });
    focused.push(info);
    if (info?.className?.includes("lena-nav-link")) break;
  }

  const reachedNav = focused.some((info) => info?.className?.includes("lena-nav-link"));
  expect(reachedNav, `keyboard must reach primary navigation (${JSON.stringify(focused)})`).toBe(true);

  const navLink = focused.find((info) => info?.className?.includes("lena-nav-link"));
  expect(
    parseFloat(navLink.outlineWidth) > 0 && navLink.outlineStyle !== "none",
    `focused navigation link must show a visible focus indicator (${JSON.stringify(navLink)})`,
  ).toBe(true);
});

/* ------------------------------------------------------------------ */
/* Layer 2 — axe-core WCAG 2.x A/AA audit                              */
/* ------------------------------------------------------------------ */

for (const [route, locale, theme] of AXE_MATRIX) {
  test(`axe WCAG A/AA: ${route} (${locale}, ${theme})`, async ({ page }) => {
    annotate(test.info(), route, locale, theme);
    test.setTimeout(60_000);
    await openApp(page, { route, locale, theme, viewport: VIEWPORTS.desktop });
    await page.addScriptTag({ path: AXE_SOURCE });

    const rows = await page.evaluate(async (tags) => {
      const r = await window.axe.run(document, {
        runOnly: { type: "tag", values: tags },
      });
      return r.violations.flatMap((v) =>
        v.nodes.map((n) => ({
          id: v.id,
          impact: v.impact,
          target: n.target.join(" "),
          why: (n.failureSummary ?? "").split("\n")[0],
        })),
      );
    }, WCAG_TAGS);

    // Automated bar: no serious/critical WCAG violations. Moderate/minor are
    // reported in the failure message when present so they stay visible
    // without blocking the build.
    const blocking = rows.filter((r) => r.impact === "serious" || r.impact === "critical");
    const advisory = rows.filter((r) => r.impact !== "serious" && r.impact !== "critical");
    const describe = (list) =>
      list
        .slice(0, 12)
        .map((r) => `${r.impact} ${r.id} @ ${r.target}`)
        .join("\n      ");
    expect(blocking, `serious/critical violations on ${locale}/${route}:\n      ${describe(blocking)}`).toEqual([]);
    expect(advisory, `advisory (minor/moderate) violations on ${locale}/${route}:\n      ${describe(advisory)}`).toEqual([]);
  });
}
