import type { ReactNode } from "react";
import { usePreferences } from "@/providers/preferences";
import FloatingHeader from "./FloatingHeader";
import PublicFooter from "./PublicFooter";
import WhatsAppFAB from "./WhatsAppFAB";
import LenaAssistant from "@/features/assistant/LenaAssistant";
import CosmicBackdrop from "@/components/CosmicBackdrop";

export default function PublicShell({ children }: { children: ReactNode }) {
  const { locale } = usePreferences();

  return (
    <div className="lena-public">
      <CosmicBackdrop />
      

      <a className="skip-link" href="#main-content">
        {locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>

      <FloatingHeader />

      <main id="main-content" className="lena-main">
        {children}
      </main>

      <PublicFooter />
      <WhatsAppFAB />
      <LenaAssistant />
    </div>
  );
}
