/**
 * Rose Engine geometry — pure math for the tow.
 *
 * One module owns every angle so the petals, tow-ropes, bridges and chips
 * can never drift apart: six thin open-curve petals (the mason's original
 * linework, full 60° sectors). THE CORE PULLS: each chip trails its petal
 * by a fixed lag, each rope running petal tip → chip so energy flows
 * outward from the hub, each bridge spanning the ring between neighbouring
 * chips.
 *
 * Mirror: +1 for LTR, −1 for RTL. Every wheel reverses in RTL, so the tow
 * lag always falls on the trailing side of motion.
 */
export const ROSE_CX = 300;
export const ROSE_CY = 300;
export const ROSE_R = 150;
/** How far (in degrees) each chip trails behind its petal. */
export const ROSE_TRAIL_DEG = 15;
export const ROSE_PETAL_HALF_DEG = 30;
export const ROSE_TIP_RADIUS = ROSE_R * 1.02;
/** Half-gap (in degrees) where a light-bridge plugs into a chip. */
export const ROSE_BRIDGE_GAP_DEG = 9;

export type RoseMirror = 1 | -1;

/** Chip station angle for system *i*, in degrees. */
export function chipAngleDeg(index: number, mirror: RoseMirror): number {
  return (index * 60 - 60) * mirror;
}

/** Petal-centre angle — the chip's angle plus the tow lag, so the petal leads. */
export function petalCenterDeg(index: number, mirror: RoseMirror): number {
  return chipAngleDeg(index, mirror) + ROSE_TRAIL_DEG * mirror;
}

/** Petal angular span [start, end] in degrees of travel. */
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
 * A thin open-curve petal centred on *centerDeg*: the original mason
 * linework — out from the hub to the tip and back, drawn in two strokes.
 */
export function petalPath(centerDeg: number, mirror: RoseMirror): string {
  const half = (ROSE_PETAL_HALF_DEG * Math.PI) / 180;
  const center = (centerDeg * Math.PI) / 180;
  const a1 = center - half * mirror;
  const a2 = center + half * mirror;
  const tip = ROSE_CX + Math.cos((a1 + a2) / 2) * (ROSE_R * 1.02);
  const tipY = ROSE_CY + Math.sin((a1 + a2) / 2) * (ROSE_R * 1.02);
  const p1x = ROSE_CX + Math.cos(a1) * (ROSE_R * 0.62);
  const p1y = ROSE_CY + Math.sin(a1) * (ROSE_R * 0.62);
  const p2x = ROSE_CX + Math.cos(a2) * (ROSE_R * 0.62);
  const p2y = ROSE_CY + Math.sin(a2) * (ROSE_R * 0.62);
  const ctr = ROSE_CX + Math.cos((a1 + a2) / 2) * (ROSE_R * 1.28);
  const ctrY = ROSE_CY + Math.sin((a1 + a2) / 2) * (ROSE_R * 1.28);
  return (
    `M ${f2(ROSE_CX)} ${f2(ROSE_CY)} ` +
    `Q ${f2(p1x * 1.2 - ROSE_CX * 0.2)} ${f2(p1y * 1.2 - ROSE_CY * 0.2)} ` +
    `${f2(tip)} ${f2(tipY)} ` +
    `M ${f2(tip)} ${f2(tipY)} Q ${f2(ctr)} ${f2(ctrY)} ${f2(ROSE_CX)} ${f2(ROSE_CY)}`
  );
}

export function petalTip(index: number, mirror: RoseMirror): { x: number; y: number } {
  return polar(ROSE_TIP_RADIUS, petalCenterDeg(index, mirror));
}

/** Tow-rope endpoints, drawn tip → chip so energy flows from the core outward. */
export function towEndpoints(
  index: number,
  mirror: RoseMirror,
  orbitUnits: number,
  chipInset = 8,
): { x1: number; y1: number; x2: number; y2: number } {
  const chip = polar(orbitUnits - chipInset, chipAngleDeg(index, mirror));
  const tip = petalTip(index, mirror);
  return { x1: tip.x, y1: tip.y, x2: chip.x, y2: chip.y };
}

/** Circular arc through explicit sweep. */
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
