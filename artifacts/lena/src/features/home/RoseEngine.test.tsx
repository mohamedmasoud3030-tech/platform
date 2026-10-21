import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
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
      "/world/property",
      "/world/investment",
      "/world/wellness",
      "/world/rental",
      "/world/hospitality",
      "/world/recycling",
    ]);
  });

  it("draws four unlit vacant petals with no chamber chips", () => {
    renderEngine();
    const vacants = document.querySelectorAll(".rose-petal[data-vacant=\"true\"]");
    expect(vacants).toHaveLength(4);
    for (const petal of vacants) {
      expect(petal.getAttribute("data-lit")).toBe("false");
    }
    const group = screen.getByRole("group", {
      name: "The Rose Engine: six systems around the LENA core",
    });
    expect(within(group).getAllByRole("link")).toHaveLength(6);
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
    expect(lit).toEqual(["hospitality", "investment", "property", "recycling", "rental", "wellness"]);
  });

  it("renders bilingual names that switch with the locale", () => {
    renderEngine("en");
    expect(screen.getByRole("link", { name: /MALEK/ }).getAttribute("href")).toBe("/world/property");
    expect(screen.getByRole("link", { name: /Terranex/ }).getAttribute("href")).toBe("/world/investment");
    expect(screen.getByRole("link", { name: /Carmen Gallery/ }).getAttribute("href")).toBe("/world/rental");
    cleanup();
    renderEngine("ar");
    expect(screen.getByRole("link", { name: /مالك/ }).getAttribute("href")).toBe("/world/property");
    expect(screen.getByRole("link", { name: /تيرانكس/ }).getAttribute("href")).toBe("/world/investment");
    expect(screen.getByRole("link", { name: /كارمن جالري/ }).getAttribute("href")).toBe("/world/rental");
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

/**
 * The calm-pulse gate. Reduced motion stops the wheels; the hub pulse is the
 * one exception, and it is only allowed once the page has settled — so a
 * scheduled capture (which runs right after load) photographs the still window
 * and the guardian's visual baselines stay meaningful.
 */
describe("RoseEngine calm-pulse gate", () => {
  function mockReducedMotion(matches: boolean) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion") ? matches : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  it("leaves the window still while the page is still loading", () => {
    mockReducedMotion(true);
    renderEngine();
    expect(document.querySelector(".rose-stage")?.getAttribute("data-calm")).toBeNull();
  });

  it("never marks the stage settled without a reduced-motion preference", () => {
    mockReducedMotion(false);
    renderEngine();
    expect(document.querySelector(".rose-stage")?.getAttribute("data-calm")).toBeNull();
  });

  it("arms the pulse once the window reports it has loaded and settled", async () => {
    vi.useFakeTimers();
    try {
      mockReducedMotion(true);
      renderEngine();
      const stage = () => document.querySelector(".rose-stage");
      expect(stage()?.getAttribute("data-calm")).toBeNull();

      await act(async () => {
        window.dispatchEvent(new Event("load"));
        await vi.advanceTimersByTimeAsync(2000);
      });
      expect(stage()?.getAttribute("data-calm")).toBe("true");
    } finally {
      vi.useRealTimers();
    }
  });
});
