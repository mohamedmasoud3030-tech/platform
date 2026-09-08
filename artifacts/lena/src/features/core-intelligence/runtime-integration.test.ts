import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());

function read(path: string): string {
  return readFileSync(resolve(root, path), "utf8");
}

describe("LENA Intelligence runtime activation contract", () => {
  it("has one canonical React intelligence seam wired to every canonical runtime", () => {
    const hook = read("src/features/core-intelligence/useLenaIntelligence.ts");

    expect(hook).toContain("deriveLenaIntelligence");
    expect(hook).toContain("useSpatialContext");
    expect(hook).toContain("useWorldMemory");
    expect(hook).toContain("useSignalRuntime");
    expect(hook).toContain("worldRegistry");
    expect(hook).toContain("WORLD_ENTITIES");
    expect(hook).toContain("canonicalWorldGraphAdapter");
  });

  it("keeps the canonical intelligence result bound to a real surface — Command, not ledger records", () => {
    // House Ledger: the World register is a record, so runtime intelligence
    // must never leak into ledger record surfaces. The one remaining World
    // intelligence surface is Command.
    const command = read("src/features/world/command/WorldCommand.tsx");
    const leaf = read("src/pages/WorldSystem.tsx");
    const index = read("src/pages/World.tsx");

    expect(command).toContain("useLenaIntelligence");
    expect(command).toContain("data-core-state={core.state}");
    expect(leaf).not.toContain("useLenaIntelligence");
    expect(leaf).not.toContain("data-core-state");
    expect(index).not.toContain("useLenaIntelligence");
    expect(index).not.toContain("data-core-state");
  });

  it("passes source authority into the intelligence snapshot", () => {
    const hook = read("src/features/core-intelligence/useLenaIntelligence.ts");
    const runtime = read("src/features/world/signals/runtime.ts");
    const provider = read("src/features/world/signals/SignalRuntimeProvider.tsx");
    const barrel = read("src/features/world/signals/index.ts");

    expect(hook).toContain("signalSource: source");
    expect(runtime).toContain("seed: WorldSignal[] = []");
    expect(runtime).not.toContain("DEMO_SIGNALS");
    expect(runtime).toContain("getSource");
    expect(provider).toContain("unavailablePresence");
    expect(provider).toContain("source.availability");
    expect(barrel).not.toContain("export * from \"./fixtures.ts\"");
  });

  it("keeps intelligence read-only at the presentation seam", () => {
    const hook = read("src/features/core-intelligence/useLenaIntelligence.ts");

    expect(hook).not.toMatch(/acknowledge\s*\(/);
    expect(hook).not.toMatch(/resolve\s*\(/);
    expect(hook).not.toMatch(/navigate\s*\(/);
    expect(hook).not.toMatch(/worldMemory\.remember/);
  });

  it("treats CanonicalWorldGraphAdapter as the live graph seam, not a future landing", () => {
    const readme = read("src/features/core-intelligence/README.md");
    const adapter = read("src/features/core-intelligence/graph/GraphContextAdapter.ts");
    const canonical = read("src/features/core-intelligence/graph/CanonicalWorldGraphAdapter.ts");

    expect(readme).toContain("CanonicalWorldGraphAdapter");
    expect(readme).toContain("@/graph");
    expect(readme).not.toContain("When the real World Graph lands");
    expect(adapter).not.toContain("later integration connects the real World Graph");
    expect(adapter).not.toContain("future integration seam tomorrow");
    expect(canonical).toContain('from "@/graph"');
  });

  it("World Command reads source authority from intelligence and mutates only through the signal adapter", () => {
    const cmd = read("src/features/world/command/WorldCommand.tsx");

    expect(cmd).toContain("useLenaIntelligence");
    expect(cmd).toContain("context.signals.source");
    expect(cmd).toContain("useSignalRuntime");
    expect(cmd).toMatch(/acknowledge\(signal\.id\)/);
    expect(cmd).not.toContain("DEMO_SIGNALS");
    expect(cmd).not.toContain("publicProjects");
    expect(cmd).not.toMatch(/worldMemory\.remember/);
  });
});
