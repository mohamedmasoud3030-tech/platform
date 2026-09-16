import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import LenaLogo from "@/design-system/brand/LenaLogo";
import { PUBLIC_NAVIGATION } from "@/content/navigation";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import { track } from "@/lib/analytics";
import { usePreferences } from "@/providers/preferences";

export default function FloatingHeader() {
  const copy = useSiteCopy();
  const { locale, theme, toggleLocale, toggleTheme } = usePreferences();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // The mobile navigation is a real overlay: lock the page behind it, move
  // focus into the menu, and let Escape close it without trapping the visitor.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => firstMobileLinkRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      menuToggleRef.current?.focus();
    };
  }, [open]);

  // Track scroll for header style
  useEffect(() => {
    let isScrolled = window.scrollY > 20;
    setScrolled(isScrolled);

    const update = () => {
      const nextScrolled = window.scrollY > 20;
      if (nextScrolled === isScrolled) return;
      isScrolled = nextScrolled;
      setScrolled(nextScrolled);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const active = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);
  const startLabel = copy.nav.start;

  return (
    <header className={`lena-header${scrolled ? " lena-header-scrolled" : ""}`}>
      <nav
        className="lena-glass lena-nav"
        aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
      >
        <Link to="/" className="lena-brand-link">
          <LenaLogo />
        </Link>

        <div className="lena-desktop-nav">
          {PUBLIC_NAVIGATION.map((item) => (
            <Link
              key={item.to}
              className={`lena-nav-link${active(item.to) ? " active" : ""}`}
              to={item.to}
            >
              {copy.nav[item.copyKey]}
            </Link>
          ))}
        </div>

        <div className="lena-nav-actions">
          {/*
            The two registers are a choice, not a setting: one press moves the
            whole house between the ink operating room and the warm-paper
            register. It lives beside the language switch because it is the same
            kind of decision, and it is the only way the light palette — which
            ships complete in styles/tokens.css — is reachable at all.
          */}
          <button
            type="button"
            className="lena-icon-button"
            onClick={() => {
              track("theme_switched", { theme: theme === "dark" ? "light" : "dark", surface: "header" });
              toggleTheme();
            }}
            aria-pressed={theme === "light"}
            aria-label={
              theme === "dark"
                ? (locale === "ar" ? "التبديل إلى السجل الفاتح" : "Switch to the paper register")
                : (locale === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to the ink register")
            }
          >
            {theme === "dark" ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
          </button>

          <button
            type="button"
            className="lena-icon-button"
            onClick={() => {
              track("language_switched", { locale, surface: "header" });
              toggleLocale();
            }}
            aria-label={
              locale === "ar" ? "Switch to English" : "التبديل إلى العربية"
            }
          >
            <span className="lena-lang-code">{locale === "ar" ? "EN" : "ع"}</span>
          </button>

          <Link
            className="lena-primary lena-nav-cta"
            onClick={() =>
              track("primary_action_clicked", { surface: "header", locale })
            }
            to="/contact"
          >
            {startLabel}
          </Link>

          <button
            ref={menuToggleRef}
            type="button"
            className="lena-icon-button lena-menu-toggle"
            aria-expanded={open}
            aria-controls="lena-mobile-menu"
            aria-label={
              open
                ? locale === "ar"
                  ? "إغلاق القائمة"
                  : "Close menu"
                : locale === "ar"
                  ? "فتح القائمة"
                  : "Open menu"
            }
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <>
          <button
            type="button"
            className="lena-mobile-backdrop"
            aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
            onClick={() => setOpen(false)}
          />
          <div
            id="lena-mobile-menu"
            className="lena-glass lena-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={locale === "ar" ? "قائمة التنقل" : "Navigation menu"}
          >
            {PUBLIC_NAVIGATION.map((item, index) => (
              <Link
                key={item.to}
                ref={index === 0 ? firstMobileLinkRef : undefined}
                className={`lena-mobile-link${active(item.to) ? " active" : ""}`}
                to={item.to}
              >
                {copy.nav[item.copyKey]}
              </Link>
            ))}

            <Link
              className="lena-primary lena-mobile-cta"
              onClick={() =>
                track("primary_action_clicked", {
                  surface: "mobile_menu",
                  locale,
                })
              }
              to="/contact"
            >
              {startLabel}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
