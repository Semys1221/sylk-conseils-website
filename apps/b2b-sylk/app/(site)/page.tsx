import { LandingFunnel } from "@/components/landing-funnel";
import { getPageContent } from "@/lib/cms/get-content";
import { resolveCalendlyUrl } from "@/lib/cms/resolve-calendly";
import { resolveHomeMedia } from "@/lib/cms/resolve-media";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [content, tunnel] = await Promise.all([
    getPageContent("home"),
    getPageContent("tunnel"),
  ]);
  return (
    <LandingFunnel
      content={content}
      media={resolveHomeMedia(content.media)}
      calendlyUrl={resolveCalendlyUrl(tunnel.calendlyUrl)}
    />
  );
}
