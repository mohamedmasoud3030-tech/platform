import { afterEach, describe, expect, it, vi } from "vitest";
import { WORLD_SIGNAL_PROTOCOL, normalizeSourcePayload } from "./contract";
import {
  readWorldSignalSource,
  resetWorldSignalSourceCache,
  worldSignalSourceConfig,
  type WorldSignalSourceConfig,
} from "./source";

afterEach(() => {
  resetWorldSignalSourceCache();
  vi.unstubAllEnvs();
});

const CONFIG: WorldSignalSourceConfig = {
  url: "https://example.com/api/signals",
  token: "s3cret-token",
  timeoutMs: 50,
  ttlMs: 60_000,
};

function payload(overrides: Record<string, unknown> = {}) {
  return {
    protocol: WORLD_SIGNAL_PROTOCOL,
    observedAt: "2026-10-01T08:00:00.000Z",
    worlds: ["property"],
    signals: [
      {
        id: "contract-renewal-q4",
        world: "property",
        kind: "attention-needed",
        severity: "attention",
        timestamp: "2026-10-01T07:40:00.000Z",
        title: { ar: "عقود تجديد", en: "Renewals due" },
        description: { ar: "تفاصيل", en: "Details" },
        targetPath: "/world/property",
        lifecycle: "new",
      },
    ],
    ...overrides,
  };
}

function jsonResponse(body: unknown, init: { status?: number } = {}): Response {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json" },
  });
}

describe("worldSignalSourceConfig", () => {
  it("is null until an endpoint is configured", () => {
    expect(worldSignalSourceConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(worldSignalSourceConfig({ LENA_WORLD_SIGNAL_SOURCE_URL: "   " } as NodeJS.ProcessEnv)).toBeNull();
  });

  it("defaults timeouts and clamps absurd values", () => {
    const configured = worldSignalSourceConfig({
      LENA_WORLD_SIGNAL_SOURCE_URL: "https://example.com/signals",
      LENA_WORLD_SIGNAL_TIMEOUT_MS: "99999999",
      LENA_WORLD_SIGNAL_TTL_MS: "-4",
    } as NodeJS.ProcessEnv);
    expect(configured?.timeoutMs).toBe(15_000);
    expect(configured?.ttlMs).toBe(60_000);
    expect(configured?.token).toBeNull();
  });
});

describe("readWorldSignalSource", () => {
  it("stays not-configured without an endpoint, and never calls fetch", async () => {
    const fetchImpl = vi.fn();
    const read = await readWorldSignalSource({
      config: null,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(read).toEqual({ status: "unavailable", reason: "not-configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reads a valid payload and normalizes it", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        payload({
          worlds: ["property", "wellness"],
          signals: [
            payload().signals[0],
            {
              ...payload().signals[0],
              id: "wellness-quiet",
              world: "wellness",
              severity: "information",
              kind: "activity",
              timestamp: "2026-10-01T06:00:00.000Z",
              targetPath: "https://example.com/steal",
              lifecycle: "active",
            },
          ],
        }),
      ),
    );

    const read = await readWorldSignalSource({ config: CONFIG, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(read.status).toBe("available");
    if (read.status !== "available") return;
    expect(read.snapshot.coversWorlds).toEqual(["property", "wellness"]);
    expect(read.snapshot.signals).toHaveLength(2);
    const wellness = read.snapshot.signals.find((signal) => signal.world === "wellness");
    expect(wellness?.targetPath).toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.credentials).toBe("omit");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer s3cret-token");
  });

  it("widens coverage with observed worlds and keeps the newest duplicate", async () => {
    const read = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () =>
        jsonResponse(
          payload({
            worlds: ["property"],
            signals: [
              { ...payload().signals[0], id: "same", timestamp: "2026-10-01T05:00:00.000Z", severity: "ambient" },
              { ...payload().signals[0], id: "same", timestamp: "2026-10-01T09:00:00.000Z", severity: "critical" },
              { ...payload().signals[0], id: "elsewhere", world: "recycling" },
            ],
          }),
        )) as unknown as typeof fetch,
    });
    expect(read.status).toBe("available");
    if (read.status !== "available") return;
    expect(read.snapshot.coversWorlds).toEqual(["property", "recycling"]);
    expect(read.snapshot.signals.map((signal) => signal.id)).toEqual(["same", "elsewhere"]);
    expect(read.snapshot.signals[0].severity).toBe("critical");
  });

  it.each([
    ["protocol-mismatch", payload({ protocol: "lena.world-signals/999" })],
    ["invalid-signal", payload({ signals: [{ ...payload().signals[0], severity: "catastrophic" }] })],
    ["missing-worlds", { protocol: WORLD_SIGNAL_PROTOCOL, observedAt: "2026-10-01T08:00:00.000Z" }],
    ["invalid-observed-at", payload({ observedAt: "yesterday" })],
  ])("rejects a malformed payload as %s without leaking detail", async (_label, body) => {
    const read = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () => jsonResponse(body)) as unknown as typeof fetch,
    });
    expect(read.status).toBe("unavailable");
    if (read.status !== "unavailable") return;
    expect(read.reason).toBe("invalid-payload");
    expect(JSON.stringify(read)).not.toContain("s3cret-token");
  });

  it("classifies non-2xx, network failure, timeout and oversized bodies", async () => {
    resetWorldSignalSourceCache();
    const rejected = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () => jsonResponse({ error: "nope" }, { status: 503 })) as unknown as typeof fetch,
    });
    expect(rejected).toEqual({ status: "unavailable", reason: "rejected" });

    resetWorldSignalSourceCache();
    const unreachable = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () => {
        throw new Error("ECONNREFUSED");
      }) as unknown as typeof fetch,
    });
    expect(unreachable).toEqual({ status: "unavailable", reason: "unreachable" });

    resetWorldSignalSourceCache();
    const timeout = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        throw error;
      }) as unknown as typeof fetch,
    });
    expect(timeout).toEqual({ status: "unavailable", reason: "timeout" });

    resetWorldSignalSourceCache();
    const oversized = await readWorldSignalSource({
      config: CONFIG,
      fetchImpl: (async () => new Response("x".repeat(300_000))) as unknown as typeof fetch,
    });
    expect(oversized).toEqual({ status: "unavailable", reason: "too-large" });
  });

  it("caches within the TTL, re-reads after it, and single-flights bursts", async () => {
    let clock = 1_000;
    const fetchImpl = vi.fn(async () => jsonResponse(payload()));
    const config = { ...CONFIG, ttlMs: 1_000 };

    await readWorldSignalSource({ config, fetchImpl: fetchImpl as unknown as typeof fetch, now: () => clock });
    clock += 500;
    await readWorldSignalSource({ config, fetchImpl: fetchImpl as unknown as typeof fetch, now: () => clock });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    clock += 700;
    await readWorldSignalSource({ config, fetchImpl: fetchImpl as unknown as typeof fetch, now: () => clock });
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    clock += 100;
    resetWorldSignalSourceCache();
    const burst = await Promise.all([
      readWorldSignalSource({ config, fetchImpl: fetchImpl as unknown as typeof fetch, now: () => clock }),
      readWorldSignalSource({ config, fetchImpl: fetchImpl as unknown as typeof fetch, now: () => clock }),
    ]);
    expect(burst.every((read) => read.status === "available")).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("honours `fresh` as an operator cache bypass", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(payload()));
    await readWorldSignalSource({ config: CONFIG, fetchImpl: fetchImpl as unknown as typeof fetch });
    await readWorldSignalSource({ config: CONFIG, fetchImpl: fetchImpl as unknown as typeof fetch, fresh: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe("normalizeSourcePayload", () => {
  it("declares invalid shapes rather than guessing", () => {
    expect(normalizeSourcePayload("[]")).toEqual({ ok: false, reason: "not-an-object" });
    expect(normalizeSourcePayload([])).toEqual({ ok: false, reason: "not-an-object" });
    expect(normalizeSourcePayload({})).toEqual({ ok: false, reason: "protocol-mismatch" });
  });

  it("caps how much a single snapshot can carry", () => {
    const many = Array.from({ length: 200 }, (_, index) => ({
      ...payload().signals[0],
      id: `signal-${index}`,
    }));
    expect(normalizeSourcePayload(payload({ signals: many }))).toEqual({
      ok: false,
      reason: "invalid-signal",
    });
  });
});
