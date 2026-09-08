import { expect, test } from "@playwright/test";
import { openApp, VIEWPORTS } from "../helpers/app.mjs";
import { GUARDIAN_CONFIG } from "../helpers/config.mjs";

/**
 * House Ledger — register journey smoke.
 *
 * Home → World (the systems register) → MALEK Chamber (a record leaf) with
 * browser Back support at both steps. Asserts navigation outcomes and clean
 * state (no stuck overlay, no aria-busy, no pointer-blocking layer), never
 * animation frames. The register carries one real figure preview for MALEK;
 * the leaf opens its seven documented plates.
 */
const journey = GUARDIAN_CONFIG.spatialJourney;

test("register journey: Home → World → MALEK Chamber → Back → Back", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "full journey (en)" },
    { type: "viewport", description: "1280x800" },
    { type: "locale", description: "en" },
    { type: "theme", description: "dark" },
  );

  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  // 1 → 2: Home → World via the primary gateway CTA.
  await page.getByRole("link", { name: /Enter the world/i }).click();
  await page.waitForURL(`**${journey.world}`, { timeout: 20_000 });
  await expect(page.locator(".ledger-sheet"), "the register sheet is open").toBeVisible();
  await expect(page.locator(".ledger-entry"), "six record entries in one house").toHaveCount(6);

  // The MALEK entry is a documented record: seal + a real first figure.
  const malekEntry = page.locator('.ledger-entry[data-system="property"]');
  await expect(malekEntry).toBeVisible();
  await expect(malekEntry.getByText("DOCUMENTED", { exact: true })).toBeVisible();
  await expect(malekEntry.locator('[data-testid="ledger-preview"] img')).toBeVisible();

  // 3: open the MALEK chamber through the entry's own CTA.
  await malekEntry.getByRole("link", { name: /Open system chamber/i }).click();
  await page.waitForURL(`**${journey.chamber}`, { timeout: 20_000 });

  // 4: the chamber is a ledger leaf with documented plates.
  await expect(page.locator("main.lena-system-chamber")).toBeVisible();
  await expect(page.locator(".lena-chamber-back")).toBeVisible();
  await expect(page.locator(journey.leaf)).toBeVisible();
  await expect(page.locator(".ledger-plates")).toBeVisible();
  await expect(page.locator(".ledger-plate")).toBeVisible();
  await expect(page.locator(".ledger-plate-tab").first()).toBeVisible();
  await expect(page.locator(".ledger-entrytag", { hasText: "ENTRY 03" })).toBeVisible();

  // Clean state: no stuck portal layer / aria-busy / disabled pointer layer.
  await expect(page.locator(".lena-world.is-portal, .lena-world.is-portal-resolve")).toHaveCount(0);
  await expect(page.locator("[aria-busy='true']")).toHaveCount(0);
  const blocked = await page.evaluate(() => {
    const target = document.querySelector("main");
    if (!target) return true;
    const element = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    if (!element) return true;
    const style = getComputedStyle(element);
    return style.pointerEvents === "none" && !element.closest(".lena-whatsapp-fab");
  });
  expect(blocked, "no pointer-blocking layer over the page center").toBe(false);

  // Browser Back works through the path: chamber → world → home.
  await page.goBack();
  await page.waitForURL(`**${journey.world}`, { timeout: 20_000 });
  await expect(page.locator(".ledger-sheet")).toBeVisible();
  await expect(page.locator("[aria-busy='true']")).toHaveCount(0);
  await expect(page.locator(".ledger-entry").first()).toBeVisible();

  await page.goBack();
  await page.waitForURL("**/en", { timeout: 20_000 });
  await expect(page.getByRole("link", { name: /Enter the world/i })).toBeVisible();
});
