import type { OperatingPrimitiveId } from "@/content/systems";
import type { AppLocale } from "@/providers/preferences";
import { RECORD_STATUS_LABEL } from "@/features/world/ledger/format";
import { ROSE_READY_LABEL } from "@/features/home/rose-system-bodies";
import { OPERATING_PRIMITIVES } from "@/features/world/content/operating-primitives";

/**
 * The loom's warp order — derived from the canonical primitives registry so
 * the weave can never drift from the documented roots.
 */
export const ROOT_ORDER: OperatingPrimitiveId[] = OPERATING_PRIMITIVES.map((p) => p.id);

const labels = {} as Record<OperatingPrimitiveId, Record<AppLocale, string>>;
for (const primitive of OPERATING_PRIMITIVES) {
  labels[primitive.id] = { ...primitive.label };
}
export const PRIMITIVE_LABELS: Record<OperatingPrimitiveId, Record<AppLocale, string>> = labels;

/** Systems carried by each root — two or more proves a shared root. */
export function rootLoadFor(
  systems: readonly { operatingPrimitives: readonly OperatingPrimitiveId[] }[],
): number[] {
  return ROOT_ORDER.map(
    (root) => systems.filter((sys) => sys.operatingPrimitives.includes(root)).length,
  );
}

export type LoomBodyLike = { documented: boolean; ownerReady: boolean };

/**
 * The loom's three honest states, mirroring the Rose reading card:
 * documented (evidence-backed) → lit; owner-ready (declared, evidence
 * pending) → lit with the READY word; otherwise dim and pending.
 */
export function loomStatus(
  body: LoomBodyLike,
  locale: AppLocale,
): { text: string; lit: boolean } {
  const lit = body.documented || body.ownerReady;
  const text = body.documented
    ? RECORD_STATUS_LABEL.documented[locale]
    : body.ownerReady
      ? ROSE_READY_LABEL[locale]
      : RECORD_STATUS_LABEL.pending[locale];
  return { text, lit };
}
