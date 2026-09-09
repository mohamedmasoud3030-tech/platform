/**
 * Rose Engine geometry — pure math for the fan.
 *
 * One module owns every angle so the blades, tow-ropes, bridges, streaks and
 * chips can never drift apart: six FREE-FLOATING blades (20° half-width,
 * 20° breathing gaps, rounded bases floating at r70 — attached to NOTHING
 * but their chip's tow-rope), each trailing its chip by a fixed tow lag,
 * each rope running chip → blade tip, each bridge spanning the ring between
 * neighbouring chips, and each chip dragging a tapering motion streak
 * behind it so the tow direction is unmistakable. The hub is a separate
 * crank-pinned motor core, never a blade root.
 *
 * Mirror: +1 for LTR, −1 for RTL. Every wheel reverses in RTL, so the tow
 * lag and the streaks always fall on the trailing side of motion.
 */
export const ROSE_CX = 300;
export const ROSE_CY = 300;
export const ROSE_R = 150;
/** How far (in degrees) each system trails behind its chip. */
export const ROSE_TRAIL_DEG = 32;
export const ROSE_PETAL_HALF_DEG = 20;
export const ROSE_TIP_RADIUS = ROSE_R * 1.02;
/** Blade base corners float here — clear of the r30 hub. */
export const ROSE_BASE_RADIUS = 70;
/** Control radius rounding the blade's butt inward. */
export const ROSE_BASE_ROUND_RADIUS = 60;
/** Half-gap (in degrees) where a light-bridge plugs into a chip. */
export const ROSE_BRIDGE_GAP_DEG = 9;
/** Motion-streak span behind each chip, in degrees of travel. */
export const ROSE_STREAK_FROM_DEG = 10;
export const ROSE_STREAK_TO_DEG = 24;

export type RoseMirror = 1 | -1;

/** Chip station angle for system *i*, in degrees. */
export function chipAngleDeg(index: number, mirror: RoseMirror): number {
  return (index * 60 - 60) * mirror;
}

/** Blade-centre angle — the chip's angle minus the tow lag. */
export function petalCenterDeg(index: number, mirror: RoseMirror): number {
  return chipAngleDeg(index, mirror) - ROSE_TRAIL_DEG * mirror;
}

/** Blade angular span [start, end] in degrees of travel. */
export function petalSpanDeg(index: number, mirror: RoseMirror): { start: number; end: number } {
  const c = petalCenterDeg(index, mirror);
  return { start: c - ROSE_PETAL_HALF_DEG * mirror, end: c + ROSE_PETAL_HALF_DEG * mirror };
}

export function polar(radius: number, deg: number): { x: number; y: number } {
  const a = (deg * Math.PI) / 180;
  return { x: ROSE_CX + Math.cos(a) * radius, y: ROSE_CY + Math.sin(a) * radius };
}

const f2 = (n: number) => n.toFixed(2);

/**
 * A closed free-floating fan blade: a leaf from its rounded floating base
 * to the tip, sides bowed along the sector edges so the gild gradient has
 * real area to live in. Nothing touches the hub.
 */
export function petalLeafPath(index: number, mirror: RoseMirror): string {
  const c = petalCenterDeg(index, mirror);
  const half = ROSE_PETAL_HALF_DEG * mirror;
  const b1 = polar(ROSE_BASE_RADIUS, c - half);
  const b2 = polar(ROSE_BASE_RADIUS, c + half);
  const c1 = polar(115, c - half);
  const c2 = polar(115, c + half);
  const tip = polar(ROSE_TIP_RADIUS, c);
  const butt = polar(ROSE_BASE_ROUND_RADIUS, c);
  return (
    `M ${f2(b1.x)} ${f2(b1.y)} Q ${f2(c1.x)} ${f2(c1.y)} ${f2(tip.x)} ${f2(tip.y)} ` +
    `Q ${f2(c2.x)} ${f2(c2.y)} ${f2(b2.x)} ${f2(b2.y)} Q ${f2(butt.x)} ${f2(butt.y)} ` +
    `${f2(b1.x)} ${f2(b1.y)} Z`
  );
}

/** The blade's central vein, base to near-tip. */
export function petalVeinPath(index: number, mirror: RoseMirror): string {
  const c = petalCenterDeg(index, mirror);
  const base = polar(ROSE_BASE_RADIUS + 8, c);
  const tip = polar(ROSE_TIP_RADIUS - 4, c);
  return `M ${f2(base.x)} ${f2(base.y)} L ${f2(tip.x)} ${f2(tip.y)}`;
}

export function petalTip(index: number, mirror: RoseMirror): { x: number; y: number } {
  return polar(ROSE_TIP_RADIUS, petalCenterDeg(index, mirror));
}

/** Tow-rope endpoints, drawn chip → tip so energy flows with the pull. */
export function towEndpoints(
  index: number,
  mirror: RoseMirror,
  orbitUnits: number,
  chipInset = 8,
): { x1: number; y1: number; x2: number; y2: number } {
  const chip = polar(orbitUnits - chipInset, chipAngleDeg(index, mirror));
  const tip = petalTip(index, mirror);
  return { x1: chip.x, y1: chip.y, x2: tip.x, y2: tip.y };
}

/** Circular arc through explicit sweep (bridges go with motion, streaks back). */
export function arcPath(fromDeg: number, toDeg: number, radius: number, sweep: 0 | 1): string {
  const from = (fromDeg * Math.PI) / 180;
  const to = (toDeg * Math.PI) / 180;
  const x1 = ROSE_CX + Math.cos(from) * radius;
  const y1 = ROSE_CY + Math.sin(from) * radius;
  const x2 = ROSE_CX + Math.cos(to) * radius;
  const y2 = ROSE_CY + Math.sin(to) * radius;
  return `M ${f2(x1)} ${f2(y1)} A ${f2(radius)} ${f2(radius)} 0 0 ${sweep} ${f2(x2)} ${f2(y2)}`;
}

/** Light-bridge arc angles joining chip *j* to chip *j+1*, in degrees. */
export function bridgeAngles(
  j: number,
  mirror: RoseMirror,
  count = 6,
): { from: number; to: number } {
  return {
    from: chipAngleDeg(j, mirror) + ROSE_BRIDGE_GAP_DEG * mirror,
    to: chipAngleDeg((j + 1) % count, mirror) - ROSE_BRIDGE_GAP_DEG * mirror,
  };
}

export function bridgePath(fromDeg: number, toDeg: number, radius: number, mirror: RoseMirror): string {
  return arcPath(fromDeg, toDeg, radius, mirror === 1 ? 1 : 0);
}

/** Motion-streak arc angles trailing behind chip *i*, in degrees. */
export function streakAngles(index: number, mirror: RoseMirror): { from: number; to: number } {
  const a = chipAngleDeg(index, mirror);
  return { from: a - ROSE_STREAK_FROM_DEG * mirror, to: a - ROSE_STREAK_TO_DEG * mirror };
}

export function streakPath(index: number, mirror: RoseMirror, orbitUnits: number): string {
  const { from, to } = streakAngles(index, mirror);
  return arcPath(from, to, orbitUnits, mirror === 1 ? 0 : 1);
}
