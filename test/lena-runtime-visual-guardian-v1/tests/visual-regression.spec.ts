import { expect, test } from "@playwright/test";
import { openApp, VIEWPORTS } from "../helpers/app.mjs";

/**
 * Phase 4 — visual regression for critical LENA surfaces.
 *
 * Baseline matrix (kept intentionally small):
 *   Home   — mobile dark, mobile light, desktop dark
 *   World  — mobile dark, desktop dark
 *   Chamber— mobile dark, desktop dark
 *   RTL    — Arabic mobile dark (required RTL screenshot)
 *
 * Stability:
 *   - reduced-motion emulation (frontage renders placed once, static),
 *   - theme pinned via localStorage before first paint,
 *   - fonts awaited, entry animations disabled for capture,
 *   - static House Ledger composition — no continuous scene motion.
 * Tolerance: 2% differing pixels + perceptual threshold — microscopic
 * anti-aliasing never fails the build; disappearance / layout collapse does.
 */
const MATRIX = [
  { name: "home-mobile-dark", route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile },
  { name: "home-mobile-light", route: "/", locale: "en", theme: "light", viewport: VIEWPORTS.mobile },
  // Desktop-dark tightened (0.008 / threshold 0.12 vs 0.02 / 0.25): a
  // dark-on-dark hero change once slipped under the global tolerance,
  // leaving a stale orbit-era baseline green against the frontage render.
  // The surface changed — the baseline must too, and subtle dark-region
  // regressions must register on this surface.
  { name: "home-desktop-dark", route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop, maxDiffPixelRatio: 0.008, threshold: 0.12 },
  { name: "world-mobile-dark", route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile },
  { name: "world-desktop-dark", route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop },
  { name: "chamber-mobile-dark", route: "/world/property", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile },
  { name: "chamber-desktop-dark", route: "/world/property", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop },
  { name: "home-ar-rtl-mobile-dark", route: "/", locale: "ar", theme: "dark", viewport: VIEWPORTS.mobile },
];

for (const entry of MATRIX) {
  test(`visual: ${entry.name}`, async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: "route", description: `/${entry.locale}${entry.route}` },
      { type: "viewport", description: `${entry.viewport.width}x${entry.viewport.height}` },
      { type: "theme", description: entry.theme },
      { type: "locale", description: entry.locale },
    );

    const watcher = await openApp(page, entry);

    // Deterministic capture.
    await page.evaluate(() => document.fonts?.ready);

    await expect(page).toHaveScreenshot(`${entry.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: entry.maxDiffPixelRatio ?? 0.02,
      threshold: entry.threshold ?? 0.25,
      animations: "disabled",
      caret: "hide",
      scale: "css",
      timeout: 30_000,
    });

    // A visual pass never overrides runtime safety.
    const pageErrors = watcher.pageErrors;
    expect(pageErrors, "no uncaught errors during visual capture").toEqual([]);
  });
}
