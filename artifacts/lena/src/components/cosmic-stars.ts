/**
 * Deterministic star-chart for the cosmic backdrop: the same seed always
 * deals the same sky, so the first paint never shimmers between renders.
 */
export type CosmicTint = 0 | 1 | 2; // gold, ice, blue

export type CosmicStar = {
  /** Horizontal position, percent of viewport width. */
  x: number;
  /** Vertical position, percent of viewport height. */
  y: number;
  /** Diameter in pixels (1–3). */
  size: number;
  /** Twinkle animation delay, seconds. */
  delay: number;
  /** Twinkle animation duration, seconds. */
  duration: number;
  /** Starlight tint. */
  tint: CosmicTint;
};

/** Mulberry32 — a tiny seeded PRNG, no runtime cost worth naming. */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f2 = (n: number) => Math.round(n * 100) / 100;

export function cosmicStars(count = 84, seed = 20260909): CosmicStar[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: f2(rand() * 100),
    y: f2(rand() * 100),
    size: 1 + Math.floor(rand() * 3),
    delay: f2(rand() * 5),
    duration: f2(2.6 + rand() * 2.8),
    tint: Math.floor(rand() * 3) as CosmicTint,
  }));
}
