import { Playfair_Display } from "next/font/google";
import { Footer, TenantRoot } from "@workspace/tenant-ui";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { PostHogProvider } from "@/providers/PostHogProvider";
import SuspendedPostHogPageView from "@/components/dashboard/atomes/PostHogPageView";
import tenantConfig from "@/tenant.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantRoot config={tenantConfig}>
      <PostHogProvider>
        <div className={playfair.variable}>
          <link rel="preconnect" href="https://images.unsplash.com" />
          <link rel="dns-prefetch" href="https://images.unsplash.com" />
          <link rel="preconnect" href="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com" />
          <link rel="dns-prefetch" href="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com" />
          <SuspendedPostHogPageView />
          <NavbarWrapper />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </PostHogProvider>
    </TenantRoot>
  );
}
