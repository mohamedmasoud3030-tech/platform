/**
 * Where the visitor was standing in the register.
 *
 * The World page is one long ruled sheet; a chamber is a page inside it. When
 * a visitor opens a chamber and comes back, landing at the top of the sheet
 * loses the place she was reading — and the register's own welcome line says
 * "the entry for MALEK is ready", which is only useful if the entry is where
 * she left it. This is the one number that keeps that promise.
 *
 * Rules:
 *   - sessionStorage, because this is one visit, not a preference;
 *   - versioned, so a future shape change invalidates old records cleanly;
 *   - never throws (private mode, hostile storage → first-visit behaviour);
 *   - a position is clamped to the readable range on read, because the sheet
 *     can be shorter on a smaller window than the one it was saved on.
 */

const REGISTER_POSITION_KEY = "lena-digital-house.register-position";
const REGISTER_POSITION_VERSION = 1 as const;

type StoredPosition = {
  v: typeof REGISTER_POSITION_VERSION;
  y: number;
  at: number;
};

function storage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Remember the reading position of the register (pixels from the top). */
export function saveRegisterPosition(y: number, now = Date.now()): void {
  const store = storage();
  if (!store) return;
  try {
    const record: StoredPosition = {
      v: REGISTER_POSITION_VERSION,
      y: Math.max(0, Math.round(y)),
      at: now,
    };
    store.setItem(REGISTER_POSITION_KEY, JSON.stringify(record));
  } catch {
    /* storage full or blocked: the register simply opens at the top */
  }
}

/** Read the remembered position, or null when there is nothing usable. */
export function readRegisterPosition(): number | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(REGISTER_POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPosition> | null;
    if (!parsed || parsed.v !== REGISTER_POSITION_VERSION) return null;
    if (typeof parsed.y !== "number" || !Number.isFinite(parsed.y)) return null;
    return Math.max(0, Math.round(parsed.y));
  } catch {
    return null;
  }
}

/** Forget the position (tests, and any future "start at the top" control). */
export function clearRegisterPosition(): void {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(REGISTER_POSITION_KEY);
  } catch {
    /* nothing to clear */
  }
}

/**
 * The position a return should actually land at: the remembered pixel, kept
 * inside the sheet that exists right now.
 */
export function clampRegisterPosition(y: number, scrollHeight: number, innerHeight: number): number {
  const max = Math.max(0, scrollHeight - innerHeight);
  return Math.min(Math.max(0, Math.round(y)), max);
}
