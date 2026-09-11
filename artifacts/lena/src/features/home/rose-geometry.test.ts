import { describe, expect, it } from "vitest";
import {
  bridgeAngles,
  bridgePath,
  chipAngleDeg,
  petalCenterDeg,
  petalPath,
  petalSpanDeg,
  petalTip,
  ROSE_CX,
  ROSE_CY,
  ROSE_SLOTS,
  ROSE_STEP_DEG,
  ROSE_SYSTEM_SLOTS,
  ROSE_VACANT_SLOTS,
  slotAngleDeg,
  towEndpoints,
  vacantPetalCenterDeg,
  type RoseMirror,
} from "./rose-geometry";

const mod = (n: number) => ((n % 360) + 360) % 360;

describe("rose fan geometry", () => {
  it("keeps ten equal seats: six systems and four vacant", () => {
    expect(ROSE_SLOTS).toBe(10);
    expect(ROSE_STEP_DEG).toBe(36);
    expect([...ROSE_SYSTEM_SLOTS]).toEqual([0, 2, 3, 5, 7, 8]);
    expect([...ROSE_VACANT_SLOTS]).toEqual([1, 4, 6, 9]);
    const used = [...ROSE_SYSTEM_SLOTS, ...ROSE_VACANT_SLOTS].sort((a, b) => a - b);
    expect(used).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  for (const mirror of [1, -1] as RoseMirror[]) {
    const dir = mirror === 1 ? "LTR" : "RTL";

    it(`[${dir}] spaces every seat 36 degrees apart`, () => {
      for (let slot = 0; slot < ROSE_SLOTS; slot++) {
        const here = slotAngleDeg(slot, mirror);
        const next = slotAngleDeg((slot + 1) % ROSE_SLOTS, mirror);
        expect(mod((next - here) * mirror)).toBeCloseTo(36, 9);
      }
    });

    it(`[${dir}] sits vacant seats between systems, never on a system centre`, () => {
      const systemAngles = ROSE_SYSTEM_SLOTS.map((slot) => mod(slotAngleDeg(slot, mirror)));
      for (const slot of ROSE_VACANT_SLOTS) {
        const vacant = mod(slotAngleDeg(slot, mirror));
        expect(systemAngles.includes(vacant)).toBe(false);
        expect(mod((vacantPetalCenterDeg(slot, mirror) - slotAngleDeg(slot, mirror)) * mirror)).toBeCloseTo(15, 9);
      }
    });

    it(`[${dir}] draws system petals 32 degrees wide so they do not collide`, () => {
      for (let i = 0; i < 6; i++) {
        const span = petalSpanDeg(i, mirror);
        const width = mod((span.end - span.start) * mirror);
        expect(width, `petal ${i} width`).toBeCloseTo(42, 9);
      }
    });

    it(`[${dir}] trails every chip behind its petal by the tow lag`, () => {
      for (let i = 0; i < 6; i++) {
        const lag = mod((petalCenterDeg(i, mirror) - chipAngleDeg(i, mirror)) * mirror);
        expect(lag, `chip ${i} lag`).toBeCloseTo(15, 9);
      }
    });

    it(`[${dir}] draws a two-stroke petal through the tip on its centre`, () => {
      for (let i = 0; i < 6; i++) {
        const path = petalPath(petalCenterDeg(i, mirror), mirror);
        expect(path.startsWith(`M ${ROSE_CX.toFixed(2)} ${ROSE_CY.toFixed(2)}`)).toBe(true);
        expect(path.split(" M ").length, "two strokes").toBe(2);
        const tip = petalTip(i, mirror);
        const radius = Math.hypot(tip.x - ROSE_CX, tip.y - ROSE_CY);
        expect(radius, `petal ${i} tip radius`).toBeCloseTo(186, 9);
        expect(path).toContain(`${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`);
      }
    });

    it(`[${dir}] runs every tow-rope from the petal tip out to its chip`, () => {
      for (let i = 0; i < 6; i++) {
        const ends = towEndpoints(i, mirror, 234);
        const tip = petalTip(i, mirror);
        expect(ends.x1).toBeCloseTo(tip.x, 9);
        expect(ends.y1).toBeCloseTo(tip.y, 9);
        const chipRadius = Math.hypot(ends.x2 - ROSE_CX, ends.y2 - ROSE_CY);
        expect(chipRadius, `rope ${i} chip end`).toBeCloseTo(226, 9);
        const length = Math.hypot(ends.x2 - ends.x1, ends.y2 - ends.y1);
        expect(length, `rope ${i} length`).toBeGreaterThan(25);
        expect(length, `rope ${i} length`).toBeLessThan(80);
      }
    });

    it(`[${dir}] spans every light-bridge between neighbouring chips`, () => {
      for (let j = 0; j < 6; j++) {
        const { from, to } = bridgeAngles(j, mirror);
        const span = mod((to - from) * mirror);
        expect(span, `bridge ${j} span`).toBeGreaterThan(10);
        expect(bridgePath(from, to, 234, mirror)).toContain(mirror === 1 ? "0 0 1" : "0 0 0");
      }
    });
  }

  it("mirrors every station angle between LTR and RTL", () => {
    for (let i = 0; i < 6; i++) {
      expect(chipAngleDeg(i, -1)).toBe(-chipAngleDeg(i, 1));
      expect(petalCenterDeg(i, -1)).toBe(-petalCenterDeg(i, 1));
    }
    for (const slot of ROSE_VACANT_SLOTS) {
      expect(vacantPetalCenterDeg(slot, -1)).toBe(-vacantPetalCenterDeg(slot, 1));
    }
  });
});
