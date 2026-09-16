import { expect, test } from "@playwright/test";
import { openApp, VIEWPORTS } from "../helpers/app.mjs";
import { GUARDIAN_CONFIG } from "../helpers/config.mjs";
// The register's own order is the canonical numbering: the chamber prints
// `order` from this module, and the entry tag moved from ENTRY 03 to ENTRY 01
// when the owner's register order settled. Reading the order keeps the journey
// honest about the number the product prints instead of pinning the old one.
import { publicSystems } from "../../../artifacts/lena/src/content/systems";

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

test("register back-step: a chamber returns the visitor to the line she left", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/world → chamber → Back (register position)" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
    { type: "locale", description: "en" },
  );

  // The register is one long sheet and a chamber is a page inside it. Coming
  // back must land on the line the visitor was reading — the welcome line
  // ("the entry for X is ready") is only honest if the entry is where she left
  // it. This is also the promise the World page makes in its own copy.
  await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });
  await page.evaluate(() => window.sessionStorage.clear());

  const lastEntry = page.locator('.ledger-entry[data-system="recycling"]');
  await lastEntry.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const leftAt = await page.evaluate(() => window.scrollY);
  expect(leftAt, "the visitor is genuinely down the sheet").toBeGreaterThan(200);

  await lastEntry.getByRole("link", { name: /Open system chamber/i }).click();
  await page.waitForURL("**/world/recycling", { timeout: 20_000 });
  await page.goBack();
  await page.waitForURL("**/world", { timeout: 20_000 });
  await expect(page.locator(".ledger-sheet").first()).toBeVisible();

  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "the register returns to the line the visitor left",
      timeout: 5_000,
    })
    .toBeGreaterThan(100);

  const landed = await page.evaluate(() => window.scrollY);
  const rememberedTop = await page.evaluate(() => {
    const entry = document.querySelector('.ledger-entry[data-system="recycling"]');
    return entry ? entry.getBoundingClientRect().top : null;
  });
  expect(rememberedTop, "the entry she left is on screen, not the masthead").not.toBeNull();
  expect(rememberedTop as number, "the remembered entry is inside the viewport").toBeLessThan(800);
  expect(Math.abs(landed - leftAt), "and it is the same line, not an approximation").toBeLessThan(240);

  // A fresh visit still opens at the top: the memory is a return, not a trap.
  await page.evaluate(() => window.sessionStorage.clear());
  await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });
  expect(await page.evaluate(() => window.scrollY), "a first visit opens at the masthead").toBeLessThan(40);
});

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
  const propertyOrder = publicSystems().find((system) => system.id === "property")?.order;
  expect(propertyOrder, "the register numbers MALEK").toBeGreaterThan(0);
  await expect(
    page.locator(".ledger-entrytag", { hasText: `ENTRY ${String(propertyOrder).padStart(2, "0")}` }),
    "the chamber prints the register's own entry number",
  ).toBeVisible();

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
