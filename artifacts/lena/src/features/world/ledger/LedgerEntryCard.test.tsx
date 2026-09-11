import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { PreferencesProvider } from "@/providers/preferences";
import { worldEntities, worldSystem, type WorldEntity } from "@/features/world/content/world";
import { evidenceFor } from "@/features/world/content/evidence";
import LedgerEntryCard from "./LedgerEntryCard";
import { figureCountLabel } from "./format";

function renderCard(entity: WorldEntity) {
  const system = worldSystem(entity);
  if (!system) throw new Error(`no system for ${entity.systemId}`);
  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: (
          <LedgerEntryCard
            entity={entity}
            system={system}
            remembered={false}
            onEnter={() => undefined}
          />
        ),
      },
    ],
    { initialEntries: ["/world"] },
  );
  render(
    <PreferencesProvider initialLocale="en">
      <RouterProvider router={router} />
    </PreferencesProvider>,
  );
  return { system };
}

afterEach(cleanup);

describe("LedgerEntryCard", () => {
  it("renders MALEK as a documented entry with a real preview figure", () => {
    const entity = worldEntities().find((item) => item.systemId === "property") as WorldEntity;
    const { system } = renderCard(entity);

    const heading = screen.getByRole("heading", { level: 3, name: system.name.en });
    const entry = heading.closest(".ledger-entry") as HTMLElement;
    expect(entry).not.toBeNull();

    // Entry number derives from the canonical owner order (MALEK is 01).
    expect(within(entry).getByText("01")).toBeTruthy();
    // The record seal states documentation, never lifecycle.
    expect(within(entry).getByText("DOCUMENTED")).toBeTruthy();

    // The figure count comes from the canonical evidence registry.
    const count = evidenceFor("property")?.length ?? 0;
    expect(count).toBeGreaterThanOrEqual(7);
    expect(within(entry).getByText(figureCountLabel(count, "en"))).toBeTruthy();

    // The first real evidence figure is shown as the preview.
    const preview = within(entry).getByTestId("ledger-preview");
    const img = preview.querySelector("img");
    expect(img?.getAttribute("src")).toContain("/world/evidence/malek/");

    // The chamber CTA relationship is preserved.
    const open = within(entry).getByRole("link", { name: /open system chamber/i });
    expect(open.getAttribute("href")).toBe("/world/property");
  });

  it("renders a pending entry honestly: no preview, no fabricated imagery", () => {
    const entity = worldEntities().find((item) => item.systemId === "rental") as WorldEntity;
    const { system } = renderCard(entity);

    expect(screen.getByText("RECORD PENDING")).toBeTruthy();
    expect(screen.getByText("No figures yet")).toBeTruthy();
    expect(screen.queryByTestId("ledger-preview")).toBeNull();
    const heading = screen.getByRole("heading", { level: 3, name: system.name.en });
    const entry = heading.closest(".ledger-entry") as HTMLElement;
    // The system emblem is a vector logo, not a photographic figure: no
    // evidence image may appear on a pending record.
    expect(entry.querySelector("img")).toBeNull();
    expect(within(entry).getByRole("link", { name: /open system chamber/i }).getAttribute("href")).toBe(
      `/world/${entity.systemId}`,
    );
  });
});
