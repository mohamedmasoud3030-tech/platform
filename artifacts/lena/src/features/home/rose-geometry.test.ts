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
  towEndpoints,
  type RoseMirror,
} from "./rose-geometry";

const mod = (n: number) => ((n % 360) + 360) % 360;

describe("rose fan geometry", () => {
  for (const mirror of [1, -1] as RoseMirror[]) {
    const dir = mirror === 1 ? "LTR" : "RTL";

    it(`[${dir}] spaces the six petals 60 degrees apart in full sectors`, () => {
      for (let i = 0; i < 6; i++) {
        const span = petalSpanDeg(i, mirror);
        const next = petalSpanDeg((i + 1) % 6, mirror);
        const width = mod((span.end - span.start) * mirror);
        expect(width, `petal ${i} width`).toBeCloseTo(60, 9);
        const gap = mod((next.start - span.end) * mirror);
        expect(gap, `gap after petal ${i}`).toBeCloseTo(0, 9);
      }
    });

    it(`[${dir}] trails every chip behind its petal by the tow lag`, () => {
      for (let i = 0; i < 6; i++) {
        const lag = mod((petalCenterDeg(i, mirror) - chipAngleDeg(i, mirror)) * mirror);
        expect(lag, `chip ${i} lag`).toBeCloseTo(15, 9);
      }
    });

    it(`[${dir}] draws a closed leaf-slice through the tip on its centre`, () => {
      for (let i = 0; i < 6; i++) {
        const path = petalPath(petalCenterDeg(i, mirror), mirror);
        expect(path.startsWith(`M ${ROSE_CX.toFixed(2)} ${ROSE_CY.toFixed(2)}`)).toBe(true);
        expect(path.trim().endsWith("Z"), "closed slice").toBe(true);
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
        expect(length, `rope ${i} length`).toBeLessThan(70);
      }
    });

    it(`[${dir}] spans every light-bridge exactly between neighbouring chips`, () => {
      for (let j = 0; j < 6; j++) {
        const { from, to } = bridgeAngles(j, mirror);
        const span = mod((to - from) * mirror);
        expect(span, `bridge ${j} span`).toBeCloseTo(42, 9);
        expect(bridgePath(from, to, 234, mirror)).toContain(mirror === 1 ? "0 0 1" : "0 0 0");
      }
    });
  }

  it("mirrors every station angle between LTR and RTL", () => {
    for (let i = 0; i < 6; i++) {
      expect(chipAngleDeg(i, -1)).toBe(-chipAngleDeg(i, 1));
      expect(petalCenterDeg(i, -1)).toBe(-petalCenterDeg(i, 1));
    }
  });
});
