import type { Metadata } from "next";
import { SYLK_BLOB_ORIGIN } from "@/lib/brand-assets";
import { PostHogProvider } from "@/providers/PostHogProvider";
import SuspendedPostHogPageView from "@/components/dashboard/atomes/PostHogPageView";

export const metadata: Metadata = {
  title: "Diagnostic Patrimonial | SYLK Conseils",
  description:
    "Initialisez votre diagnostic sur-mesure et découvrez comment reprendre le contrôle de votre trajectoire financière et fiscale.",
};

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <link rel="preconnect" href="https://image.mux.com" />
      <link rel="preconnect" href={SYLK_BLOB_ORIGIN} />
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}
