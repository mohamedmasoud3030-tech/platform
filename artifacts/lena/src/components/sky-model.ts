import type { AppLocale } from "@/providers/preferences";
import { roseBodies } from "@/features/home/rose-system-bodies";

/**
 * The documentation sky's rows: the six public systems in owner order.
 *
 * STRICT evidence rule — a thread lights iff the system is documented with
 * real interfaces. The Rose hero's temporary owner-ready gilding (`lit`)
 * must never leak in here: the sky's legend promises "documented with real
 * interfaces", and hospitality/Carmen readiness rides the hero only until
 * their evidence lands.
 */
export type SkyRow = {
  id: string;
  name: Record<AppLocale, string>;
  documented: boolean;
  href: string;
};

export function skyRows(): SkyRow[] {
  return roseBodies().map((body) => ({
    id: body.system.id,
    name: body.system.name,
    documented: body.documented,
    href: `/world/${body.system.id}`,
  }));
}
