import { expect, test } from "@playwright/test";
import {
  contrastRatio,
  findCoveringOverlays,
  horizontalOverflow,
  openApp,
  VIEWPORTS,
} from "../helpers/app.mjs";
// The canonical evidence registry is the source of truth the DOM is checked
// against. Importing only the data (types are erased) keeps the guardian
// black-box about behaviour while making every documented/pending claim
// derived rather than remembered.
import { SYSTEM_EVIDENCE } from "../../../artifacts/lena/src/features/world/content/evidence";
import { publicSystems } from "../../../artifacts/lena/src/content/systems";
import { ROSE_OWNER_READY } from "../../../artifacts/lena/src/features/home/rose-system-bodies";
import {
  expectCoreCssContract,
  expectSettledOpacity,
  HOME_CORE,
  probeCore,
} from "../helpers/core.mjs";

/**
 * Phases 3, 5, 6, 7 — mobile viewport safety, RTL/LTR, dark/light theme,
 * reduced-motion behavior.
 */

/* ----------------------------- mobile safety ----------------------------- */

const MOBILE_ROUTES = ["/", "/world", "/world/property"];

for (const viewport of [VIEWPORTS.mobile, VIEWPORTS.narrow]) {
  for (const route of MOBILE_ROUTES) {
    test(`mobile no-overflow + usable nav: ${route} @ ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      test.info().annotations.push(
        { type: "route", description: `/en${route}` },
        { type: "viewport", description: `${viewport.width}x${viewport.height}` },
        { type: "theme", description: "dark" },
        { type: "locale", description: "en" },
      );
      await openApp(page, { route, locale: "en", theme: "dark", viewport });

      const overflow = await horizontalOverflow(page);
      expect(
        overflow.documentWidth,
        `document must not overflow horizontally (${JSON.stringify(overflow)})`,
      ).toBeLessThanOrEqual(overflow.viewportWidth + 1);
      expect(
        overflow.bodyWidth,
        `body must not overflow horizontally (${JSON.stringify(overflow)})`,
      ).toBeLessThanOrEqual(overflow.viewportWidth + 1);

      const overlays = await findCoveringOverlays(page);
      expect(overlays, "no giant fixed element may cover the viewport").toEqual([]);

      // Menu control on-screen and usable.
      await expect(page.locator("button.lena-menu-toggle")).toBeVisible();
      await page.locator("button.lena-menu-toggle").click();
      await expect(page.locator(".lena-mobile-menu")).toBeVisible();
      await expect(page.locator(".lena-mobile-menu a").first()).toBeVisible();
      await page.keyboard.press("Escape");
      await page.locator("button.lena-menu-toggle").click();

      // Headings readable (never collapsed).
      await expect(page.locator("h1").first()).toBeVisible();
      const heading = await page.evaluate(() => {
        const el = document.querySelector("h1");
        const style = getComputedStyle(el);
        return { size: parseFloat(style.fontSize), line: parseFloat(style.lineHeight) };
      });
      expect(heading.size, `h1 font-size (${JSON.stringify(heading)})`).toBeGreaterThanOrEqual(18);
      expect(heading.line, `h1 line-height (${JSON.stringify(heading)})`).toBeGreaterThanOrEqual(18);
    });
  }
}

for (const viewport of [VIEWPORTS.mobile, VIEWPORTS.narrow]) {
  test(`Command unavailable state stays explicit and contained @ ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.info().annotations.push(
      { type: "route", description: "/en/world/command" },
      { type: "viewport", description: `${viewport.width}x${viewport.height}` },
      { type: "theme", description: "dark" },
      { type: "locale", description: "en" },
    );
    await openApp(page, { route: "/world/command", locale: "en", theme: "dark", viewport });

    const command = page.locator('[data-testid="world-command"]');
    await expect(command).toHaveAttribute("data-signal-availability", "unavailable");
    await expect(command.getByText("Live product signals are not connected yet.")).toBeVisible();
    await expect(command.locator(".lena-command-unavailable-panel")).toBeVisible();
    await expect(command.locator(".lena-command-grid")).toHaveCount(0);
    await expect(command.locator("button")).toHaveCount(0);
    await expect(command.locator(".lena-cmd-actions")).toHaveCount(0);

    const overflow = await horizontalOverflow(page);
    expect(overflow.documentWidth, `Command document overflow (${JSON.stringify(overflow)})`).toBeLessThanOrEqual(
      overflow.viewportWidth + 1,
    );
    expect(overflow.bodyWidth, `Command body overflow (${JSON.stringify(overflow)})`).toBeLessThanOrEqual(
      overflow.viewportWidth + 1,
    );
  });
}

for (const viewport of [VIEWPORTS.mobile, VIEWPORTS.narrow]) {
  test(`World register entries stay in-bounds with a reachable chamber CTA @ ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    test.info().annotations.push(
      { type: "route", description: "/en/world" },
      { type: "viewport", description: `${viewport.width}x${viewport.height}` },
      { type: "theme", description: "dark" },
      { type: "locale", description: "en" },
    );
    await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport });

    const entries = page.locator(".ledger-entry");
    await expect(entries).toHaveCount(6);

    // Every entry card stays inside the viewport horizontally.
    const geometry = await page.evaluate(() => {
      const read = (selector) =>
        [...document.querySelectorAll(selector)].map((element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        });
      return { viewport: window.innerWidth, cards: read(".ledger-entry") };
    });
    for (const rect of geometry.cards) {
      expect(rect.left, "entry stays inside the viewport").toBeGreaterThanOrEqual(-1);
      expect(rect.right, "entry does not overflow right").toBeLessThanOrEqual(geometry.viewport + 1);
    }

    // The MALEK chamber CTA is on-screen and usable in the entry's footer.
    const cta = page.locator('.ledger-entry[data-system="property"] .ledger-open');
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box.x, "CTA not clipped left").toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, "CTA not clipped right").toBeLessThanOrEqual(geometry.viewport + 1);
  });
}

test("the register is honest: the MALEK exemplar previews; evidence stays in chambers", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en/world" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
    { type: "locale", description: "en" },
  );
  await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  // The rule, not a snapshot of it: the register is honest when every entry
  // that carries a DOCUMENTED seal is documented in the canonical evidence
  // registry, and every entry that does not is pending. Reading the registry —
  // rather than pinning two system ids — is what keeps this honest when a real
  // product adds surfaces, which is exactly what happened when Carmén Gallery's
  // captures landed: a pinned test would have called the truth a regression.
  const documentedIds = Object.entries(SYSTEM_EVIDENCE)
    .filter(([, surfaces]) => (surfaces?.length ?? 0) > 0)
    .map(([id]) => id);
  const pendingIds = publicSystems()
    .map((system) => system.id)
    .filter((id) => !documentedIds.includes(id));
  expect(documentedIds.length, "the registry documents at least one system").toBeGreaterThan(0);

  // MALEK is the direction's exemplar: DOCUMENTED seal + the real preview.
  const malek = page.locator('.ledger-entry[data-system="property"]');
  await expect(malek.getByText("DOCUMENTED", { exact: true })).toBeVisible();
  await expect(malek.locator('[data-testid="ledger-preview"]')).toBeVisible();
  const previewLoaded = await malek.locator('[data-testid="ledger-preview"] img').evaluate((img) => ({
    w: img.naturalWidth,
    h: img.naturalHeight,
  }));
  expect(previewLoaded.w, "the MALEK preview is a real image").toBeGreaterThan(0);

  // A documented system keeps its plates inside its chamber: no preview rolls
  // across the index, and no pending claim is made for it.
  for (const id of documentedIds.filter((systemId) => systemId !== "property")) {
    const entry = page.locator(`.ledger-entry[data-system="${id}"]`);
    await expect(entry.getByText("DOCUMENTED", { exact: true }), `${id} carries the documented seal`).toBeVisible();
    await expect(entry.locator("[data-testid='ledger-preview']"), `${id} previews nowhere`).toHaveCount(0);
    await expect(entry.locator(".ledger-nofigure"), `${id} is not marked pending`).toHaveCount(0);
  }

  // Systems without evidence get a RECORD PENDING seal and no imagery at all.
  for (const id of pendingIds) {
    const pending = page.locator(`.ledger-entry[data-system="${id}"]`);
    await expect(pending.getByText("RECORD PENDING"), `${id} is pending`).toBeVisible();
    await expect(pending.locator("[data-testid='ledger-preview']")).toHaveCount(0);
    const pendingImages = await pending.locator("img").count();
    expect(pendingImages, `no fabricated imagery on the pending record ${id}`).toBe(0);
    await expect(pending.locator(".ledger-nofigure")).toBeVisible();
  }
});

test("MALEK Chamber keeps the external auth boundary explicit", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en/world/property" },
    { type: "viewport", description: "390x844" },
    { type: "theme", description: "dark" },
    { type: "locale", description: "en" },
  );
  await openApp(page, { route: "/world/property", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile });

  await expect(page.getByText(/Authentication stays with MALEK/)).toBeVisible();
  const handoff = page.locator('[data-testid="malek-product-handoff"]');
  await expect(handoff).toHaveAttribute("href", "https://malek-plus.vercel.app/");
  await expect(handoff).toHaveAttribute("target", "_blank");
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("mobile (390x844): primary CTA and Rose core are visible and not clipped", async ({ page }) => {
  test.info().annotations.push(
    { type: "route", description: "/en" },
    { type: "viewport", description: "390x844" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.mobile });

  const cta = page.locator(".lena-hero .lena-primary");
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box.x, "CTA not clipped left").toBeGreaterThanOrEqual(0);
  expect(box.x + box.width, "CTA not clipped right").toBeLessThanOrEqual(390 + 1);

  const probe = await probeCore(page, HOME_CORE, "Home core mobile");
  expectCoreCssContract(probe, page);
  expect(probe.rect.width, "core width inside safe bounds").toBeGreaterThanOrEqual(140);
  expect(probe.rect.left, "core not off-screen left").toBeGreaterThanOrEqual(-1);
  expect(probe.rect.left + probe.rect.width, "core not off-screen right").toBeLessThanOrEqual(391);
});

/* ------------------------------ theme safety ------------------------------ */

for (const theme of ["dark", "light"]) {
  for (const route of ["/", "/world", "/world/property"]) {
    test(`theme ${theme}: ${route} stays readable`, async ({ page }) => {
      test.info().annotations.push(
        { type: "route", description: `/en${route}` },
        { type: "viewport", description: "1280x800" },
        { type: "theme", description: theme },
        { type: "locale", description: "en" },
      );
      await openApp(page, { route, locale: "en", theme, viewport: VIEWPORTS.desktop });

      await expect(page.locator(`html.${theme}`)).toHaveCount(1);
      await expect(page.locator(`html[data-theme="${theme}"]`)).toHaveCount(1);

      const metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const heading = document.querySelector("h1");
        const styleOf = (selector) => getComputedStyle(document.querySelector(selector));
        // Ledger surfaces carry their own sheet background (paper/ink); on
        // those pages contrast is measured against the sheet, not the page.
        const sheet = document.querySelector(".ledger-sheet, .ledger-leaf");
        const background = sheet
          ? getComputedStyle(sheet).backgroundColor
          : styleOf(".lena-public").getPropertyValue("--lena-bg").trim();
        return {
          rootClass: root.className,
          bodyBg: background,
          headingColor: getComputedStyle(heading).color,
          glassSurface: styleOf(".lena-glass").getPropertyValue("--lena-card").trim(),
        };
      });

      // The Home core stays healthy in every theme; ledger surfaces carry no core.
      if (route === "/") {
        const probe = await probeCore(page, HOME_CORE, `${route} core (${theme})`);
        expectCoreCssContract(probe, page);
      } else {
        await expect(page.locator(".ledger-sheet, .ledger-leaf").first(), "record surface present").toBeVisible();
      }

      // Sanity contrast: large heading vs surface background (not a full WCAG audit).
      const ratio = contrastRatio(metrics.headingColor, metrics.bodyBg);
      expect(ratio, `heading/background contrast in ${theme} (${JSON.stringify(metrics)})`).toBeGreaterThan(3);

      // Glass hierarchy: nav surface differs from the page background.
      expect(metrics.glassSurface, `glass surface must differ from page bg (${JSON.stringify(metrics)})`).not.toBe(
        metrics.bodyBg,
      );
    });
  }
}

/* ------------------------------- RTL / LTR -------------------------------- */

for (const locale of ["ar", "en"]) {
  for (const route of ["/", "/world", "/world/property"]) {
    test(`direction ${locale}: ${route} layout stays coherent (mobile)`, async ({ page }) => {
      test.info().annotations.push(
        { type: "route", description: `/${locale}${route}` },
        { type: "viewport", description: "390x844" },
        { type: "theme", description: "dark" },
        { type: "locale", description: locale },
      );
      await openApp(page, { route, locale, theme: "dark", viewport: VIEWPORTS.mobile });

      const expectedDir = locale === "ar" ? "rtl" : "ltr";
      expect(await page.locator("html").getAttribute("dir"), "document direction").toBe(expectedDir);
      expect(await page.locator("html").getAttribute("lang"), "document language").toBe(locale);

      // No text clipping / overflow in either direction.
      const overflow = await horizontalOverflow(page);
      expect(overflow.documentWidth, `${locale} horizontal overflow`).toBeLessThanOrEqual(
        overflow.viewportWidth + 1,
      );

      // Navigation alignment follows direction.
      const alignment = await page.evaluate(() => {
        const brand = document.querySelector(".lena-brand-link")?.getBoundingClientRect();
        const actions = document.querySelector(".lena-nav-actions")?.getBoundingClientRect();
        return brand && actions ? { brandX: brand.x, actionsX: actions.x } : null;
      });
      expect(alignment).not.toBeNull();
      if (locale === "ar") expect(alignment.brandX).toBeGreaterThan(alignment.actionsX);
      else expect(alignment.brandX).toBeLessThan(alignment.actionsX);

      // Chamber back arrow flips with direction.
      if (route.startsWith("/world/")) {
        const rotate = await page
          .locator(".lena-chamber-back > span")
          .first()
          .evaluate((el) => getComputedStyle(el).transform);
        if (locale === "ar") expect(rotate, "RTL back arrow must flip").toContain("matrix");
        else expect(rotate, "LTR back arrow must not flip").toBe("none");
      }

      // Mobile menu works in both directions.
      await page.locator("button.lena-menu-toggle").click();
      await expect(page.locator(".lena-mobile-menu")).toBeVisible();
      await expect(page.locator(".lena-mobile-menu a").first()).toBeVisible();
    });
  }
}

/* ----------------------------- reduced motion ----------------------------- */

test("reduced motion: Home Rose never vanishes and navigation still works", async ({
  page,
}) => {
  test.info().annotations.push(
    { type: "route", description: "/en" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
    { type: "locale", description: "en" },
  );
  await openApp(page, { route: "/", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  // The classic trap: animation removed → element left at opacity: 0.
  // Each check waits for the scene to settle, then asserts the settled
  // value — a stuck opacity: 0 fails the poll.
  await expectSettledOpacity(page, ".rose-stage", 0.99, "rose stage opacity (reduced motion)");

  // Real lit/dim correctness (House Ledger, Rose era): the Rose carries
  // exactly the six public systems as chips; `documented` stays purely
  // evidence-based (same rule as every other surface), while `lit` is the
  // Rose's wider flame — documented systems plus the owner-declared READY
  // pair (rental + hospitality). Never a lifecycle word.
  const chips = page.locator(".rose-chip");
  await expect(chips, "six rose chips present").toHaveCount(6);
  // Derived from the registry for the same reason as the register test above:
  // the count is the registry's truth, not a number frozen on the day.
  const documentedCount = Object.values(SYSTEM_EVIDENCE).filter((surfaces) => (surfaces?.length ?? 0) > 0).length;
  await expect(
    page.locator('.rose-chip[data-documented="true"]'),
    `${documentedCount} documented chips, matching the registry`,
  ).toHaveCount(documentedCount);
  await expect(
    page.locator('.rose-chip[data-documented="false"]'),
    `${6 - documentedCount} not-yet-documented chips`,
  ).toHaveCount(6 - documentedCount);

  // Flags must agree with the rule, and the rule's own sources are the ones
  // checked against: the evidence registry says what is documented, and the
  // owner's declared READY pair says what gilds early on the Rose. Both are
  // read from the modules that own them, so a system that becomes documented —
  // as Carmén Gallery did when its captures landed — moves this test with the
  // product instead of breaking it.
  const documentedFromRegistry = Object.entries(SYSTEM_EVIDENCE)
    .filter(([, surfaces]) => (surfaces?.length ?? 0) > 0)
    .map(([id]) => id)
    .sort();
  const chipStates = await page.evaluate(() =>
    [...document.querySelectorAll(".rose-chip")].map((node) => ({
      id: node.getAttribute("data-system"),
      documented: node.getAttribute("data-documented"),
      lit: node.getAttribute("data-lit"),
    })),
  );
  expect(chipStates).toHaveLength(6);
  for (const chip of chipStates) {
    const expectedLit = chip.documented === "true" || (ROSE_OWNER_READY as readonly string[]).includes(chip.id ?? "");
    expect(chip.lit, `"${chip.id}" lit flag must equal documented || owner-ready`).toBe(
      String(expectedLit),
    );
  }
  const documentedIds = chipStates
    .filter((chip) => chip.documented === "true")
    .map((chip) => chip.id ?? "")
    .sort();
  expect(documentedIds, "the documented chips are exactly the registry's documented systems").toEqual(
    documentedFromRegistry,
  );
  const litIds = chipStates
    .filter((chip) => chip.lit === "true")
    .map((chip) => chip.id)
    .sort();
  expect(litIds, "lit chips are the registry's documented systems plus the owner-declared READY pair").toEqual(
    [...new Set([...documentedFromRegistry, ...(ROSE_OWNER_READY as readonly string[])])].sort(),
  );

  // The light is real: lit and dim chips render different, non-transparent
  // surfaces (a lit chip is never an empty frame).
  const chipSurfaces = await page.evaluate(() => {
    const read = (selector) => {
      const node = document.querySelector(selector);
      return node ? getComputedStyle(node).backgroundColor : null;
    };
    return {
      lit: read('.rose-chip[data-lit="true"]'),
      dim: read('.rose-chip[data-lit="false"]'),
    };
  });
  expect(chipSurfaces.lit, "lit chip has a rendered surface").not.toBe("rgba(0, 0, 0, 0)");
  expect(chipSurfaces.dim, "dim chip has a rendered surface").not.toBe("rgba(0, 0, 0, 0)");
  expect(chipSurfaces.lit, "lit chip visibly differs from a dim chip").not.toBe(chipSurfaces.dim);

  // The status key is visible (honesty at the surface, not only in data
  // attributes): READY for lit systems, RECORD PENDING for the rest.
  // The legend that once sat under the Rose (`.night-key`, dropped with the
  // reading cards in d45bcfd2) is not in the product any more, so this test no
  // longer claims to find it. What stays true is checked instead: the flags are
  // registry-backed (above), the hero makes no seal claim of its own, and the
  // Rose still works as a truthful map — every chip points at its own chamber.
  const chipLinks = await page.evaluate(() =>
    [...document.querySelectorAll(".rose-chip")].map((node) => ({
      id: node.getAttribute("data-system"),
      href: node.getAttribute("href"),
    })),
  );
  expect(chipLinks).toHaveLength(6);
  for (const link of chipLinks) {
    expect(link.href, `${link.id} chip points at its own chamber`).toBe(`/en/world/${link.id}`);
  }
  await expect(
    page.locator(".rose-stage").getByText("DOCUMENTED", { exact: true }),
    "the hero claims no documentation of its own — evidence lives in the chambers",
  ).toHaveCount(0);

  const stageOpacity = await page.locator(".rose-stage").evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(stageOpacity, `rose stage opacity under reduced motion`).toBe(1);

  const probe = await probeCore(page, HOME_CORE, "Home core reduced motion");
  expectCoreCssContract(probe, page);

  // Routes remain usable: the gateway CTA navigates immediately-ish.
  await page.getByRole("link", { name: /Enter the world/i }).click();
  await page.waitForURL("**/en/world", { timeout: 20_000 });
  await expect(page.locator(".ledger-sheet")).toBeVisible();
});

test("reduced motion: register entries and the chamber leaf are never left invisible", async ({
  page,
}) => {
  test.info().annotations.push(
    { type: "route", description: "/en/world + /en/world/property" },
    { type: "viewport", description: "1280x800" },
    { type: "theme", description: "dark" },
  );
  await openApp(page, { route: "/world", locale: "en", theme: "dark", viewport: VIEWPORTS.desktop });

  // Reduced motion must render the register fully present — a record entry
  // stuck at its pre-arrival opacity (0) would fail the poll.
  await expectSettledOpacity(page, ".ledger-sheet", 0.99, "register sheet opacity (reduced motion)");
  const register = await page.evaluate(() => {
    const entries = [...document.querySelectorAll(".ledger-entry")].map((node) =>
      Number(getComputedStyle(node).opacity),
    );
    return { count: entries.length, entries };
  });
  expect(register.count, "six record entries present").toBe(6);
  expect(
    Math.min(...register.entries),
    `no entry left at opacity 0 (${JSON.stringify(register.entries)})`,
  ).toBeGreaterThan(0.9);

  await page.goto("http://127.0.0.1:4173/en/world/property");
  await expectSettledOpacity(page, ".ledger-leaf", 0.99, "chamber leaf opacity (reduced motion)");
  await page.waitForTimeout(200);
  const leaf = await page.evaluate(() => {
    const read = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return { present: false };
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        present: true,
        opacity: Number(style.opacity),
        visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none",
      };
    };
    return {
      leaf: read(".ledger-leaf"),
      blocks: [...document.querySelectorAll(".ledger-record-block")].map((node) => ({
        opacity: Number(getComputedStyle(node).opacity),
      })),
      plates: read(".ledger-plates"),
    };
  });
  expect(leaf.leaf.present, "leaf present").toBe(true);
  expect(leaf.leaf.visible, "leaf must not be stuck invisible").toBe(true);
  expect(leaf.plates.present, "evidence plates present").toBe(true);
  expect(leaf.blocks.length, "record blocks present").toBeGreaterThan(0);
  expect(
    Math.min(...leaf.blocks.map((block) => block.opacity)),
    `no record block left at opacity 0`,
  ).toBeGreaterThan(0.9);
});
