import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { PreferencesProvider } from "@/providers/preferences";
import {
  SignalRuntimeProvider,
  UNAVAILABLE_SIGNAL_SOURCE,
  worldSignalStore,
} from "@/features/world/signals";
import { applyWorldSignalSnapshot } from "@/features/world/signals/transport";
import WorldCommand from "./WorldCommand";

afterEach(() => {
  cleanup();
  // Back to the true production default — not a transport failure.
  worldSignalStore.hydrate({ source: UNAVAILABLE_SIGNAL_SOURCE, signals: [] });
});

function renderCommand(locale: "ar" | "en" = "en") {
  const router = createMemoryRouter(
    [{ path: "/world/command", element: <WorldCommand /> }],
    { initialEntries: ["/world/command"] },
  );
  render(
    <PreferencesProvider initialLocale={locale}>
      <SignalRuntimeProvider>
        <RouterProvider router={router} />
      </SignalRuntimeProvider>
    </PreferencesProvider>,
  );
}

describe("World Command unavailable source", () => {
  it("states that live product signals are not connected without fabricating a pulse", () => {
    renderCommand();
    const command = screen.getByTestId("world-command");
    expect(command.getAttribute("data-signal-availability")).toBe("unavailable");
    expect(command.getAttribute("data-graph-available")).toBe("true");
    expect(command.getAttribute("data-core-state")).toBeTruthy();
    expect(screen.getByText("Live product signals are not connected yet.")).toBeTruthy();
    expect(command.textContent).not.toContain("active worlds");
    expect(command.textContent).not.toContain("attention pressure");
    expect(command.querySelector("button")).toBeNull();
  });

  it("keeps the unavailable message bilingual", () => {
    renderCommand("ar");
    const command = screen.getByTestId("world-command");
    expect(screen.getByText("الإشارات الحية للمنتجات غير متصلة بعد.")).toBeTruthy();
    expect(command.textContent).not.toContain("عوالم نشطة");
    expect(command.textContent).not.toContain("ضغط الانتباه");
  });
});

/**
 * The live room. These cases exist because the room's promise is symmetric: it
 * must show an observation exactly as it arrived, and it must show nothing when
 * the source is silent. Both halves are asserted here, against the same store
 * the browser uses.
 */
describe("World Command with an authorized source", () => {
  const snapshot = {
    availability: "available",
    reason: null,
    observedAt: "2026-10-01T08:00:00.000Z",
    writable: false,
    coversWorlds: ["property"],
    signals: [
      {
        id: "contract-renewal-q4",
        world: "property",
        kind: "attention-needed",
        severity: "attention",
        timestamp: "2026-10-01T07:40:00.000Z",
        title: { ar: "عقود تحتاج مراجعة", en: "Contracts need review" },
        description: { ar: "قبل دورة التجديد.", en: "Before the renewal cycle." },
        targetPath: "/world/property",
        lifecycle: "new",
      },
    ],
  };

  it("renders the observed pulse, the attention field and covered presence", () => {
    applyWorldSignalSnapshot(snapshot);
    renderCommand();

    const command = screen.getByTestId("world-command");
    expect(command.getAttribute("data-signal-availability")).toBe("available");
    expect(command.textContent).toContain("Contracts need review");
    expect(command.textContent).toContain("attention pressure");
    expect(command.textContent).not.toContain("not connected yet");
  });

  it("marks a world the source does not observe as unavailable, never calm", () => {
    applyWorldSignalSnapshot(snapshot);
    renderCommand();

    const property = screen.getByTestId("command-world-property");
    const wellness = screen.getByTestId("command-world-wellness");
    expect(property.textContent).toContain("attention");
    expect(wellness.textContent).toContain("unavailable");
    expect(wellness.textContent).not.toContain("quiet");
  });

  it("returns to a closed room with no pulse when the source stops answering", () => {
    applyWorldSignalSnapshot(snapshot);
    renderCommand();
    expect(screen.getByTestId("world-command").textContent).toContain("Contracts need review");

    cleanup();
    worldSignalStore.hydrate({
      source: {
        availability: "unavailable",
        reason: "unreachable",
        observedAt: null,
        writable: false,
        coversWorlds: [],
      },
      signals: [],
    });
    renderCommand();

    const command = screen.getByTestId("world-command");
    expect(command.getAttribute("data-signal-availability")).toBe("unavailable");
    expect(command.textContent).toContain("The authorized signal source did not answer.");
    expect(command.textContent).not.toContain("Contracts need review");
    expect(worldSignalStore.getSnapshot()).toEqual([]);
  });
});
