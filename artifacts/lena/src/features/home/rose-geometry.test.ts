import { describe, expect, it } from "vitest";
import {
  bridgeAngles,
  bridgePath,
  chipAngleDeg,
  petalCenterDeg,
  petalLeafPath,
  petalSpanDeg,
  petalTip,
  ROSE_CX,
  ROSE_CY,
  streakAngles,
  streakPath,
  towEndpoints,
  type RoseMirror,
} from "./rose-geometry";

const mod = (n: number) => ((n % 360) + 360) % 360;

describe("rose fan geometry", () => {
  for (const mirror of [1, -1] as RoseMirror[]) {
    const dir = mirror === 1 ? "LTR" : "RTL";

    it(`[${dir}] spaces the six blades 60 degrees apart with 20-degree gaps`, () => {
      for (let i = 0; i < 6; i++) {
        const span = petalSpanDeg(i, mirror);
        const next = petalSpanDeg((i + 1) % 6, mirror);
        const width = mod((span.end - span.start) * mirror);
        expect(width, `blade ${i} width`).toBeCloseTo(40, 9);
        const gap = mod((next.start - span.end) * mirror);
        expect(gap, `gap after blade ${i}`).toBeCloseTo(20, 9);
      }
    });

    it(`[${dir}] trails every blade behind its chip by the tow lag`, () => {
      for (let i = 0; i < 6; i++) {
        const lag = mod((chipAngleDeg(i, mirror) - petalCenterDeg(i, mirror)) * mirror);
        expect(lag, `blade ${i} lag`).toBeCloseTo(32, 9);
      }
    });

    it(`[${dir}] draws a closed leaf with the tip on the blade centre`, () => {
      for (let i = 0; i < 6; i++) {
        const path = petalLeafPath(i, mirror);
        expect(path.startsWith("M ")).toBe(true);
        expect(path.endsWith(" Z")).toBe(true);
        const tip = petalTip(i, mirror);
        const radius = Math.hypot(tip.x - ROSE_CX, tip.y - ROSE_CY);
        expect(radius, `blade ${i} tip radius`).toBeCloseTo(153, 9);
        expect(path).toContain(`${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`);
      }
    });

    it(`[${dir}] floats every blade free of the hub on a rounded base`, () => {
      for (let i = 0; i < 6; i++) {
        const [mx, my] = petalLeafPath(i, mirror).slice(2).split(" Q")[0].split(" ").map(Number);
        const baseRadius = Math.hypot(mx - ROSE_CX, my - ROSE_CY);
        // Path text rounds to 2 decimals, so 1-digit precision fits the output.
        expect(baseRadius, `blade ${i} base corner radius`).toBeCloseTo(70, 1);
      }
    });

    it(`[${dir}] runs every tow-rope from the chip ring to its own blade tip`, () => {
      for (let i = 0; i < 6; i++) {
        const ends = towEndpoints(i, mirror, 234);
        const tip = petalTip(i, mirror);
        expect(ends.x2).toBeCloseTo(tip.x, 9);
        expect(ends.y2).toBeCloseTo(tip.y, 9);
        const chipRadius = Math.hypot(ends.x1 - ROSE_CX, ends.y1 - ROSE_CY);
        expect(chipRadius, `rope ${i} chip end`).toBeCloseTo(226, 9);
        const length = Math.hypot(ends.x2 - ends.x1, ends.y2 - ends.y1);
        expect(length, `rope ${i} length`).toBeGreaterThan(110);
        expect(length, `rope ${i} length`).toBeLessThan(140);
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

    it(`[${dir}] trails a 14-degree motion streak behind every chip`, () => {
      for (let i = 0; i < 6; i++) {
        const { from, to } = streakAngles(i, mirror);
        const span = mod((from - to) * mirror);
        expect(span, `streak ${i} span`).toBeCloseTo(14, 9);
        expect(streakPath(i, mirror, 234)).toContain(mirror === 1 ? "0 0 0" : "0 0 1");
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
