import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { PreferencesProvider } from "@/providers/preferences";
import RoseEngine from "./RoseEngine";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function renderEngine(locale: "ar" | "en" = "en") {
  const router = createMemoryRouter(
    [{ path: "*", element: <RoseEngine /> }],
    { initialEntries: ["/"] },
  );
  render(
    <PreferencesProvider initialLocale={locale}>
      <RouterProvider router={router} />
    </PreferencesProvider>,
  );
}

afterEach(cleanup);

describe("RoseEngine", () => {
  it("renders the six systems as chamber links in owner order", () => {
    renderEngine();
    const group = screen.getByRole("group", {
      name: "The Rose Engine: six systems around the LENA core",
    });
    const chips = within(group).getAllByRole("link");
    expect(chips.map((chip) => chip.getAttribute("href"))).toEqual([
      "/world/wellness",
      "/world/rental",
      "/world/property",
      "/world/hospitality",
      "/world/investment",
      "/world/recycling",
    ]);
  });

  it("lights documented systems plus the owner-ready directive", () => {
    renderEngine();
    const group = screen.getByRole("group", {
      name: "The Rose Engine: six systems around the LENA core",
    });
    const chips = within(group).getAllByRole("link");
    const lit = chips
      .filter((chip) => chip.getAttribute("data-lit") === "true")
      .map((chip) => chip.getAttribute("data-system"))
      .sort();
    expect(lit).toEqual(["hospitality", "property", "rental", "wellness"]);
  });

  it("renders the renamed Carmen Gallery chip in both locales", () => {
    renderEngine("en");
    const enChip = screen.getByRole("link", { name: /Carmen Gallery/ });
    expect(enChip.getAttribute("href")).toBe("/world/rental");
    cleanup();
    renderEngine("ar");
    const arChip = screen.getByRole("link", { name: /كارمن جالري/ });
    expect(arChip.getAttribute("href")).toBe("/world/rental");
  });

  it("numbers the chips with ledger numerals in the active locale", () => {
    renderEngine("ar");
    const group = screen.getByRole("group", {
      name: "وردة الباني: الأنظمة الستة حول نواة لينا",
    });
    // Arabic-Indic digits: the first chip carries ٠١.
    expect(within(group).getByText("٠١")).toBeTruthy();
  });
});
