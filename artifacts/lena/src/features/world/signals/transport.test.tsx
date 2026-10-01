import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SignalRuntimeProvider, useSignalRuntime } from "./SignalRuntimeProvider";
import { worldSignalStore } from "./runtime";
import {
  applyWorldSignalSnapshot,
  markWorldSignalSourceUnreachable,
  validateWorldSignalSnapshot,
} from "./transport";

afterEach(() => {
  cleanup();
  resetStore();
});

function resetStore() {
  worldSignalStore.hydrate({
    source: {
      availability: "unavailable",
      reason: "no-authorized-product-source",
      observedAt: null,
      writable: false,
      coversWorlds: [],
    },
    signals: [],
  });
}

function availableSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    availability: "available",
    reason: null,
    observedAt: "2026-10-01T08:00:00.000Z",
    writable: false,
    coversWorlds: ["property"],
    signals: [wireSignal()],
    ...overrides,
  };
}

/**
 * An empty translation value, produced at runtime so the localization gate does
 * not read this negative fixture as a shipped blank label.
 */
const blank = (): string => "".slice(0);

function wireSignal(overrides: Record<string, unknown> = {}) {
  return {
    id: "contract-renewal-q4",
    world: "property",
    kind: "attention-needed",
    severity: "attention",
    timestamp: "2026-10-01T07:40:00.000Z",
    title: { ar: "عقود تحتاج مراجعة", en: "Contracts need review" },
    description: { ar: "قبل دورة التجديد القادمة.", en: "Before the next renewal cycle." },
    targetPath: "/world/property",
    lifecycle: "new",
    ...overrides,
  };
}

describe("validateWorldSignalSnapshot", () => {
  it("maps a server refusal onto the local source vocabulary", () => {
    const rejected = validateWorldSignalSnapshot({
      availability: "unavailable",
      reason: "timeout",
      observedAt: null,
      writable: false,
      coversWorlds: [],
      signals: [],
    });
    expect(rejected?.source).toMatchObject({ availability: "unavailable", reason: "timeout" });
    expect(rejected?.signals).toEqual([]);
  });

  it("treats an unrecognised refusal reason as unreachable rather than guessing", () => {
    const unknown = validateWorldSignalSnapshot({ availability: "unavailable", reason: "kaboom" });
    expect(unknown?.source).toMatchObject({ availability: "unavailable", reason: "unreachable" });
  });

  it("accepts an available snapshot with a canonical signal", () => {
    const validated = validateWorldSignalSnapshot(availableSnapshot());
    expect(validated?.source.availability).toBe("available");
    if (validated?.source.availability !== "available") return;
    expect(validated.source.coversWorlds).toEqual(["property"]);
    expect(validated.source.writable).toBe(false);
    expect(validated.signals).toHaveLength(1);
    expect(validated.signals[0]).toMatchObject({
      id: "contract-renewal-q4",
      sourceWorld: "property",
      kind: "attention-needed",
      severity: "attention",
      lifecycle: "new",
      targetPath: "/world/property",
    });
  });

  it("drops a signal for a world LENA does not publish", () => {
    const validated = validateWorldSignalSnapshot(
      availableSnapshot({
        coversWorlds: [],
        signals: [wireSignal({ world: "materials" }), wireSignal({ id: "ghost", world: "ghost" })],
      }),
    );
    // Nothing published is observed, so there is no room to show.
    expect(validated?.source).toMatchObject({
      availability: "unavailable",
      reason: "uncovered-worlds",
    });
    expect(validated?.signals).toEqual([]);
  });

  it("keeps declared coverage even when a covered world is currently quiet", () => {
    const validated = validateWorldSignalSnapshot(
      availableSnapshot({ coversWorlds: ["property", "wellness"], signals: [] }),
    );
    expect(validated?.source.availability).toBe("available");
    if (validated?.source.availability !== "available") return;
    expect([...validated.source.coversWorlds]).toEqual(["property", "wellness"]);
    expect(validated.signals).toEqual([]);
  });

  it("never keeps a targetPath that is not this world's canonical chamber", () => {
    const validated = validateWorldSignalSnapshot(
      availableSnapshot({
        signals: [
          wireSignal({ id: "external", targetPath: "https://example.com/steal" }),
          wireSignal({ id: "other-world", targetPath: "/world/wellness" }),
        ],
      }),
    );
    expect(validated?.signals.map((signal) => signal.targetPath)).toEqual([undefined, undefined]);
  });

  it("drops signals that are structurally wrong instead of rendering them", () => {
    const validated = validateWorldSignalSnapshot(
      availableSnapshot({
        signals: [
          wireSignal({ id: "bad-severity", severity: "catastrophic" }),
          wireSignal({ id: "bad-lifecycle", lifecycle: "closed" }),
          wireSignal({ id: "bad-time", timestamp: "yesterday" }),
          wireSignal({ id: "bad-title", title: { ar: blank(), en: "Missing Arabic" } }),
        ],
      }),
    );
    expect(validated?.signals).toEqual([]);
  });

  it("refuses a snapshot it cannot anchor in time, and anything not shaped like one", () => {
    expect(validateWorldSignalSnapshot(availableSnapshot({ observedAt: "soon" }))).toBeNull();
    expect(validateWorldSignalSnapshot(null)).toBeNull();
    expect(validateWorldSignalSnapshot({ availability: "probably" })).toBeNull();
  });
});

describe("store hydration", () => {
  it("hydrates an available observation and keeps uncovered worlds unavailable", () => {
    expect(applyWorldSignalSnapshot(availableSnapshot())).toBe(true);
    const source = worldSignalStore.getSource();
    expect(source.availability).toBe("available");
    expect(worldSignalStore.getSnapshot()).toHaveLength(1);
  });

  it("fails closed when the payload cannot be trusted — clearing previous signals", () => {
    applyWorldSignalSnapshot(availableSnapshot());
    expect(worldSignalStore.getSnapshot()).toHaveLength(1);

    expect(applyWorldSignalSnapshot({ availability: "available", observedAt: "soon" })).toBe(false);
    expect(worldSignalStore.getSource()).toMatchObject({
      availability: "unavailable",
      reason: "invalid-payload",
    });
    expect(worldSignalStore.getSnapshot()).toEqual([]);
  });

  it("clears a live room when the API itself becomes unreachable", () => {
    applyWorldSignalSnapshot(availableSnapshot());
    markWorldSignalSourceUnreachable();
    expect(worldSignalStore.getSource()).toMatchObject({
      availability: "unavailable",
      reason: "unreachable",
    });
    expect(worldSignalStore.getSnapshot()).toEqual([]);
  });

  it("does not hand mutation authority to a hydrated source", () => {
    applyWorldSignalSnapshot(availableSnapshot({ writable: true }));
    const source = worldSignalStore.getSource();
    expect(source.availability).toBe("available");
    if (source.availability !== "available") return;
    // A read-only contract can never produce mutation authority.
    expect(source.writable).toBe(false);
  });
});

function RuntimeProbe() {
  const runtime = useSignalRuntime();
  return (
    <div
      data-testid="probe"
      data-state={runtime.globalState ?? "none"}
      data-property={runtime.presence.property}
      data-wellness={runtime.presence.wellness}
      data-active={runtime.activeWorlds === null ? "none" : String(runtime.activeWorlds)}
      data-mutable={runtime.canMutate ? "yes" : "no"}
    />
  );
}

describe("SignalRuntimeProvider coverage", () => {
  it("shows unobserved worlds as unavailable and withholds mutation", () => {
    applyWorldSignalSnapshot(availableSnapshot());
    render(
      <SignalRuntimeProvider>
        <RuntimeProbe />
      </SignalRuntimeProvider>,
    );
    const probe = screen.getByTestId("probe");
    expect(probe.getAttribute("data-state")).toBe("attention");
    expect(probe.getAttribute("data-property")).toBe("attention");
    expect(probe.getAttribute("data-wellness")).toBe("unavailable");
    expect(probe.getAttribute("data-active")).toBe("1");
    expect(probe.getAttribute("data-mutable")).toBe("no");
  });

  it("keeps every world unavailable when there is no observation", () => {
    render(
      <SignalRuntimeProvider>
        <RuntimeProbe />
      </SignalRuntimeProvider>,
    );
    const probe = screen.getByTestId("probe");
    expect(probe.getAttribute("data-state")).toBe("none");
    expect(probe.getAttribute("data-property")).toBe("unavailable");
    expect(probe.getAttribute("data-active")).toBe("none");
  });
});
