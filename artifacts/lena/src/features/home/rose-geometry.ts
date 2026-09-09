/**
 * Rose Engine geometry — pure math for the fan.
 *
 * One module owns every angle so the blades, tow-ropes, bridges and chips
 * can never drift apart: six blades (22° half-width, 16° breathing gaps so
 * the mason's proof shows between them like a real fan), each trailing its
 * chip by a fixed tow lag, each rope running chip → blade tip, each bridge
 * spanning the ring between neighbouring chips.
 *
 * Mirror: +1 for LTR, −1 for RTL. Every wheel reverses in RTL, so the tow
 * lag always falls on the trailing side of motion.
 */
export const ROSE_CX = 300;
export const ROSE_CY = 300;
export const ROSE_R = 150;
/** How far (in degrees) each system trails behind its chip. */
export const ROSE_TRAIL_DEG = 28;
export const ROSE_PETAL_HALF_DEG = 22;
export const ROSE_TIP_RADIUS = ROSE_R * 1.02;
export const ROSE_HUB_RADIUS = 28;
/** Half-gap (in degrees) where a light-bridge plugs into a chip. */
export const ROSE_BRIDGE_GAP_DEG = 9;

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
 * A closed fan blade: a leaf from the hub to the tip, sides bowed along the
 * sector edges so the gild gradient has real area to live in.
 */
export function petalLeafPath(index: number, mirror: RoseMirror): string {
  const c = petalCenterDeg(index, mirror);
  const half = ROSE_PETAL_HALF_DEG * mirror;
  const b1 = polar(ROSE_HUB_RADIUS, c - half);
  const b2 = polar(ROSE_HUB_RADIUS, c + half);
  const c1 = polar(105, c - half);
  const c2 = polar(105, c + half);
  const tip = polar(ROSE_TIP_RADIUS, c);
  return (
    `M ${f2(b1.x)} ${f2(b1.y)} Q ${f2(c1.x)} ${f2(c1.y)} ${f2(tip.x)} ${f2(tip.y)} ` +
    `Q ${f2(c2.x)} ${f2(c2.y)} ${f2(b2.x)} ${f2(b2.y)} Z`
  );
}

/** The blade's central vein, hub to near-tip. */
export function petalVeinPath(index: number, mirror: RoseMirror): string {
  const c = petalCenterDeg(index, mirror);
  const base = polar(ROSE_HUB_RADIUS + 6, c);
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
  const from = (fromDeg * Math.PI) / 180;
  const to = (toDeg * Math.PI) / 180;
  const x1 = ROSE_CX + Math.cos(from) * radius;
  const y1 = ROSE_CY + Math.sin(from) * radius;
  const x2 = ROSE_CX + Math.cos(to) * radius;
  const y2 = ROSE_CY + Math.sin(to) * radius;
  return (
    `M ${f2(x1)} ${f2(y1)} ` +
    `A ${f2(radius)} ${f2(radius)} 0 0 ${mirror === 1 ? 1 : 0} ` +
    `${f2(x2)} ${f2(y2)}`
  );
}
