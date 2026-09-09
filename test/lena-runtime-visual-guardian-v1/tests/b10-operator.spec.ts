import { expect, test } from "@playwright/test";
import { expectAppReady, openApp, VIEWPORTS } from "../helpers/app.mjs";

/**
 * Phase 11 — B-10/D6 operator-record contract (browser layer).
 *
 * Mirrors the content-truth contracts in
 * `features/world/content/operator.test.ts` at the rendered layer:
 *  - evidence-bearing chambers (property/MALEK, wellness/Lara Beauty) MUST
 *    show the operator record section in both locales;
 *  - chambers without registered evidence MUST NOT show one — the record is
 *    evidence-gated, so nothing leaks onto a pending chamber ahead of real
 *    evidence, and its honest pending state stays untouched.
 *
 * The record content itself (word counts, verbatim register fragments, open
 * D6 aspects) is pinned by the unit contracts; this spec guards the surface
 * truth: visible where evidence exists, absent where it does not.
 */
const WITH_RECORD = [
  { route: "/world/property", product: "MALEK" },
  { route: "/world/wellness", product: "Lara Beauty" },
];

const WITHOUT_RECORD = [
  "/world/rental",
  "/world/investment",
  "/world/hospitality",
  "/world/recycling",
];

const LOCALES = ["en", "ar"];

for (const { route, product } of WITH_RECORD) {
  for (const locale of LOCALES) {
    test(`b-10 operator record present: ${route} (${locale})`, async ({ page }) => {
      test.info().annotations.push(
        { type: "route", description: `/${locale}${route}` },
        { type: "locale", description: locale },
        { type: "contract", description: `B-10 operator record visible for ${product}` },
      );

      await openApp(page, { route, locale, theme: "dark", viewport: VIEWPORTS.desktop });
      await expectAppReady(page, locale);

      const section = page.locator("section.ledger-operator");
      await expect(section).toBeVisible({ timeout: 20_000 });
      await expect(section.locator(".ledger-operator-answer")).not.toBeEmpty();
      // The honest open-aspects line must render (never a silent gap).
      await expect(section.locator(".ledger-operator-open")).not.toBeEmpty();

      const label = await section.getAttribute("aria-label");
      expect(label?.length, "operator section is labelled").toBeGreaterThan(0);
    });
  }
}

for (const route of WITHOUT_RECORD) {
  for (const locale of LOCALES) {
    test(`b-10 operator record evidence-gated absent: ${route} (${locale})`, async ({ page }) => {
      test.info().annotations.push(
        { type: "route", description: `/${locale}${route}` },
        { type: "locale", description: locale },
        { type: "contract", description: "No operator record before registered evidence" },
      );

      await openApp(page, { route, locale, theme: "dark", viewport: VIEWPORTS.desktop });
      await expectAppReady(page, locale);

      await expect(page.locator("section.ledger-operator")).toHaveCount(0);
    });
  }
}
