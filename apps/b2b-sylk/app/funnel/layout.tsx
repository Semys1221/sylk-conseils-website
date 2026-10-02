import type { Metadata } from "next";
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
      <link rel="preconnect" href="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com" />
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  );
}
