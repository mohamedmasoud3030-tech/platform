import { test, expect } from "@playwright/test";
import {
  expectCoreArtworkHealthy,
  expectCoreCssContract,
  HOME_CORE,
  probeCore,
  WORLD_REGISTER,
} from "../helpers/core.mjs";
import { openApp, VIEWPORTS } from "../helpers/app.mjs";

/**
 * Phase 2 — Home core integrity contract in the browser (Rose era).
 *
 * R5 (owner direction) replaced the retired Sacred Core frontage with the
 * Rose Engine. Beyond the static verifier, this suite proves the Rose stage
 * really renders on Home: stage contract (canonical sigil artwork, decoded,
 * non-zero geometry), and in-browser decode/paint of the embedded artwork.
 *
 * House Ledger: the World register and chamber leaves are record surfaces —
 * by direction they carry no core. The retired-scene check is replaced by an
 * explicit absence contract.
 *
 * The regression test at the bottom is the explicit guard for:
 *   "Rose atmosphere glowing while the sigil artwork is missing"
 * (the halos/comets keep shining while the sigil image fails to load) —
 * this MUST fail CI when it happens again.
 */

async function expectCoreHealthy(page, selector, label, { viewport, minSize } = {}) {
  const probe = await probeCore(page, selector, label);
  expectCoreCssContract(probe);
  expect(probe.rect.width, `${label} desktop size`).toBeGreaterThanOrEqual(minSize ?? 150);
  if (viewport) {
    const { width } = await page.evaluate(() => ({
      width: window.innerWidth,
    }));
    expect(probe.rect.left, `${label} inside viewport (left)`).toBeGreaterThanOrEqual(-1);
    expect(probe.rect.left + probe.rect.width, `${label} inside viewport (right)`).toBeLessThanOrEqual(
      width + 1,
    );
  }
  const assertion = await expectCoreArtworkHealthy(page, probe);
  return { probe, assertion };
}

test("Rose Engine renders on Home (dark, desktop)", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });
  const { probe } = await expectCoreHealthy(page, HOME_CORE, "Home core (.rose-stage)");
  await testInfoAttachCore(page, probe);
});

test("Rose Engine stays visible and inside safe bounds on mobile (390x844)", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en" },
    { type: "viewport", description: "390x844" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile });
  const { probe } = await expectCoreHealthy(page, HOME_CORE, "Home core mobile", {
    viewport: true,
    minSize: 140,
  });
  await testInfoAttachCore(page, probe);
});

test("World register surfaces carry no core by direction", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en/world + /en/world/property" },
    { type: "viewport", description: "390x844" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile });
  await expect(page.locator(WORLD_REGISTER), "register sheet visible").toBeVisible();
  // The record surface must not resurrect the retired frontage core, the
  // retired scene core, or the Home-only Rose stage.
  await expect(page.locator(".lena-world-core, .lena-house, .rose-stage")).toHaveCount(0);
  await page.goto("http://127.0.0.1:4173/en/world/property");
  await expect(page.locator("main.lena-system-chamber")).toBeVisible();
  await expect(page.locator(".ledger-leaf")).toBeVisible();
  await expect(page.locator(".lena-house, .lena-world-core, .rose-stage")).toHaveCount(0);
});

test("REGRESSION: Rose atmosphere may never outlive a missing sigil artwork", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en (regression canary)" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  // Guard 1: stage exists and is visible; the atmosphere (halos + comets) is alive.
  const probe = await probeCore(page, HOME_CORE, "Home core (regression canary)");
  expect(probe.atmosphere.haloCount, "the halo rings are rendered").toBeGreaterThan(0);
  expect(probe.atmosphere.cometCount, "the comets are rendered").toBeGreaterThan(0);
  expect(Number(probe.css.opacity), "element not left at opacity 0").toBeGreaterThan(0.9);

  // Guard 2: the embedded sigil artwork itself must decode and paint.
  await expectCoreArtworkHealthy(page, probe, { minPaintedRatio: 0.05, minIdentityRatio: 0.004 });

  await testInfoAttachCore(page, probe);
});

/** Attach element + page screenshots to the report for diagnosability. */
async function testInfoAttachCore(page, probe) {
  try {
    const elementShot = await page.locator(probe.selector).screenshot({
      path: `test-results/core-${probe.label.replace(/\W+/g, "-")}.png`,
      animations: "disabled",
      timeout: 15_000,
    });
    await test.info().attach(`core-${probe.label}`, {
      body: elementShot,
      contentType: "image/png",
    });
  } catch {
    /* visual attachment is best-effort; the assertions above are the gate */
  }
}
