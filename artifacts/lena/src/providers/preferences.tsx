import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
  localeFromPath,
  storeLocale,
  stripLocale,
  withLocale,
} from "@/lib/locale";

export type AppTheme = "dark" | "light";
export type AppLocale = SupportedLocale;

type PreferencesContextValue = {
  theme: AppTheme;
  locale: AppLocale;
  direction: "rtl" | "ltr";
  setTheme: (theme: AppTheme) => void;
  setLocale: (locale: AppLocale) => void;
  toggleTheme: () => void;
  toggleLocale: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const THEME_STORAGE_KEY = "lena-digital-house.theme";

function isAppTheme(value: unknown): value is AppTheme {
  return value === "light" || value === "dark";
}

/**
 * The theme a visitor gets on the first paint of a visit.
 *
 * The House Ledger ships two complete palettes — the ink operating room and the
 * warm-paper register — and the stored choice decides between them. This was
 * hard-wired to `dark` while `styles/tokens.css` carried the whole light
 * palette, `styles/public.css` carried its overrides and the design system
 * promised both modes: a mode nobody could reach, and three red safety tests.
 * Dark stays the default for a first-time visitor, because that is the register
 * the house is introduced in.
 */
function getInitialTheme(): AppTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isAppTheme(stored)) return stored;
  } catch {
    /* A blocked storage must never stop the app from choosing the default. */
  }
  return "dark";
}

export function PreferencesProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: AppLocale;
}) {
  const [theme, setThemeState] = useState<AppTheme>(getInitialTheme);
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);
  const direction = locale === "ar" ? "rtl" : "ltr";

  /**
   * One place writes the theme to the document, and it writes both signals the
   * palettes and the guardian suite read: the `light`/`dark` class and
   * `data-theme`. Keeping them in one effect is what stops a surface that
   * checked only one of them from rendering the wrong register.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* Persisting is best-effort; the mode still applies for this visit. */
    }
  }, [theme]);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(isAppTheme(next) ? next : "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = direction;
  }, [direction, locale]);

  /**
   * Changing language changes the address. The visitor stays on the page they
   * were reading — only the language segment of the URL is swapped.
   */
  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState((current) => {
      if (current === next) return current;
      storeLocale(next);
      if (typeof window !== "undefined") {
        const { pathname, search, hash } = window.location;
        window.history.pushState(null, "", `${withLocale(next, pathname)}${search}${hash}`);
      }
      return next;
    });
  }, []);

  // Back/forward between language versions must be honoured, not fought.
  useEffect(() => {
    function onPopState() {
      const fromUrl = localeFromPath(window.location.pathname);
      if (fromUrl) setLocaleState(fromUrl);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      locale,
      direction,
      setTheme,
      setLocale,
      toggleTheme,
      toggleLocale: () => setLocale(locale === "ar" ? "en" : "ar"),
    }),
    [direction, locale, setLocale, setTheme, theme, toggleTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider");
  return value;
}

/** Router-relative path of the current page, i.e. without the language segment. */
export function currentRoutePath(): string {
  return typeof window === "undefined" ? "/" : stripLocale(window.location.pathname);
}
