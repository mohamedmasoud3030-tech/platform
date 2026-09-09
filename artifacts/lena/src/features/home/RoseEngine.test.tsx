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

  it("marks exactly the documented systems as gilded", () => {
    renderEngine();
    const group = screen.getByRole("group", {
      name: "The Rose Engine: six systems around the LENA core",
    });
    const chips = within(group).getAllByRole("link");
    const gilded = chips
      .filter((chip) => chip.getAttribute("data-documented") === "true")
      .map((chip) => chip.getAttribute("data-system"))
      .sort();
    expect(gilded).toEqual(["property", "wellness"]);
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
