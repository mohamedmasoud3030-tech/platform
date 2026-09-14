import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { PreferencesProvider } from "@/providers/preferences";
import SystemGrid from "./SystemGrid";

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

function renderGrid(locale: "ar" | "en" = "en") {
  const router = createMemoryRouter([{ path: "*", element: <SystemGrid /> }], {
    initialEntries: ["/"],
  });
  render(
    <PreferencesProvider initialLocale={locale}>
      <RouterProvider router={router} />
    </PreferencesProvider>,
  );
}

afterEach(cleanup);

describe("SystemGrid opus plates", () => {
  it("renders the six systems in owner order with names beside the mark", () => {
    renderGrid();
    const cards = document.querySelectorAll(".lena-service-card");
    expect([...cards].map((card) => card.getAttribute("data-system"))).toEqual([
      "property",
      "investment",
      "wellness",
      "rental",
      "hospitality",
      "recycling",
    ]);
    expect(screen.getByRole("heading", { name: "MALEK" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Terranex" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Lara Beauty" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Carmen Gallery" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Hospitality & Events" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Kayyal" })).toBeTruthy();
  });

  it("marks FLAGSHIP on MALEK only", () => {
    renderGrid();
    const flagships = document.querySelectorAll('[data-flagship="true"]');
    expect(flagships).toHaveLength(1);
    expect(flagships[0]?.getAttribute("data-system")).toBe("property");
    expect(within(flagships[0] as HTMLElement).getByText("FLAGSHIP")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/FROM\s*\$/);
    expect(document.body.textContent).not.toContain("$14,000");
  });

  it("shows the dashboard capture only, never a mobile stand-in", () => {
    renderGrid();
    const malek = document.querySelector('[data-system="property"]') as HTMLElement;
    const lara = document.querySelector('[data-system="wellness"]') as HTMLElement;
    const terranex = document.querySelector('[data-system="investment"]') as HTMLElement;
    expect(within(malek).getByRole("img").getAttribute("src")).toContain("dashboard-dark.png");
    expect(within(lara).getByRole("img").getAttribute("src")).toContain("wellness/dashboard.png");
    expect(within(lara).queryByRole("img")?.getAttribute("src") ?? "").not.toContain("mobile");
    expect(within(terranex).queryByRole("img")).toBeNull();
  });

  it("makes undocumented systems an explicit evidence state instead of an empty card", () => {
    renderGrid();
    expect(screen.getAllByText("Evidence pending")).toHaveLength(3);
    expect(document.querySelectorAll('[data-evidence="pending"]')).toHaveLength(3);
    expect(document.querySelectorAll('[data-evidence="documented"]')).toHaveLength(3);
  });

  it("opens each chamber and switches names with the locale", () => {
    renderGrid();
    const opens = screen.getAllByRole("link", { name: /Open system/ });
    expect(opens.map((link) => link.getAttribute("href"))).toEqual([
      "/world/property",
      "/world/investment",
      "/world/wellness",
      "/world/rental",
      "/world/hospitality",
      "/world/recycling",
    ]);
    cleanup();
    renderGrid("ar");
    expect(screen.getByRole("heading", { name: "مالك" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "تيرانكس" })).toBeTruthy();
    expect(within(document.querySelector('[data-flagship="true"]') as HTMLElement).getByText("الرائد")).toBeTruthy();
  });
});
