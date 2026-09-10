import { describe, expect, it } from "vitest";
import { cosmicStars } from "./cosmic-stars";

describe("cosmic star-chart", () => {
  it("deals a full sky of 140 stars by default", () => {
    expect(cosmicStars()).toHaveLength(140);
  });

  it("deals the same sky for the same seed", () => {
    expect(cosmicStars(84, 7)).toEqual(cosmicStars(84, 7));
  });

  it("deals a different sky for a different seed", () => {
    expect(cosmicStars(84, 7)).not.toEqual(cosmicStars(84, 8));
  });

  it("keeps every star inside the viewport with sane twinkle bounds", () => {
    for (const star of cosmicStars(200, 99)) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(100);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(100);
      expect(star.size).toBeGreaterThanOrEqual(1);
      expect(star.size).toBeLessThanOrEqual(3);
      expect(star.delay).toBeGreaterThanOrEqual(0);
      expect(star.delay).toBeLessThanOrEqual(5);
      expect(star.duration).toBeGreaterThanOrEqual(2.6);
      expect(star.duration).toBeLessThanOrEqual(5.4);
      expect([0, 1, 2]).toContain(star.tint);
    }
  });
});
