import { useState, type ReactNode } from "react";
import {
  ExternalLink,
  FolderKanban,
  HelpCircle,
  Inbox,
  Languages,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import LenaLogo from "@/design-system/brand/LenaLogo";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/providers/preferences";
import { trpc } from "@/providers/trpc";
import CosmicBackdrop from "@/components/CosmicBackdrop";

export default function AdminShell({ children }: { children: ReactNode }) {
  const { locale, toggleLocale } = usePreferences();
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const newInquiries = trpc.inquiries.countNew.useQuery(undefined, { enabled: isAdmin });
  const inquiryBadge = newInquiries.data ?? 0;
  const ar = locale === "ar";
  const onDashboard = pathname.endsWith("/dashboard") || pathname.includes("/dashboard/");
  const onProjects = pathname.includes("/projects-editor");

  const close = () => setOpen(false);

  return (
    <div className={`lena-admin${open ? " is-desk-open" : ""}`}>
      <CosmicBackdrop />
      <a className="skip-link" href="#admin-content">
        {ar ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>

      <button
        type="button"
        className="owner-desk-toggle"
        aria-expanded={open}
        aria-controls="owner-desk"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        <span>{ar ? "مكتب المالك" : "Owner desk"}</span>
      </button>

      <div className="owner-desk-scrim" onClick={close} aria-hidden="true" />

      <aside id="owner-desk" className="owner-desk" aria-label={ar ? "لوحة تحكم المالك" : "Owner desk"}>
        <div className="owner-desk-brand">
          <Link to="/" className="lena-brand-link" onClick={close}>
            <LenaLogo />
          </Link>
          <button type="button" className="owner-desk-close" onClick={close} aria-label={ar ? "إغلاق" : "Close"}>
            <X size={16} />
          </button>
        </div>

        <div className="owner-desk-workspace">
          <span className="owner-desk-workspace-mark" aria-hidden="true">
            L
          </span>
          <span>
            <strong>{ar ? "مساحة لينا" : "LENA workspace"}</strong>
            <small>
              <i />
              {ar ? "مكتب حي" : "LIVE DESK"}
            </small>
          </span>
        </div>

        <nav className="owner-desk-nav">
          <NavLink
            to="/dashboard"
            className={() => `owner-desk-link${onDashboard && !onProjects ? " is-active" : ""}`}
            onClick={close}
          >
            <LayoutDashboard size={17} />
            {ar ? "نظرة عامة" : "Overview"}
          </NavLink>
          <NavLink
            to="/dashboard"
            className={() => `owner-desk-link${onDashboard && !onProjects ? " is-active" : ""}`}
            onClick={close}
          >
            <Inbox size={17} />
            {ar ? "الاستفسارات" : "Inquiries"}
            {inquiryBadge > 0 ? <em>{inquiryBadge}</em> : null}
          </NavLink>
          <NavLink
            to="/dashboard/projects-editor"
            className={() => `owner-desk-link${onProjects ? " is-active" : ""}`}
            onClick={close}
          >
            <FolderKanban size={17} />
            {ar ? "المشاريع" : "Projects"}
          </NavLink>
          <Link to="/help" className="owner-desk-link" onClick={close}>
            <HelpCircle size={17} />
            {ar ? "المساعدة" : "Help center"}
          </Link>
          <button type="button" className="owner-desk-link" onClick={toggleLocale}>
            <Languages size={17} />
            {ar ? "English" : "العربية"}
          </button>
        </nav>

        <Link to="/" className="owner-desk-live" onClick={close}>
          {ar ? "شوف البيت الحي" : "View live house"}
          <ExternalLink size={14} />
        </Link>
      </aside>

      <main id="admin-content" className="lena-admin-main">
        {children}
      </main>
    </div>
  );
}
