import { FunnelFlow } from "@/components/funnel-flow/funnel-flow";
import { getPageContent } from "@/lib/cms/get-content";
import { resolveCalendlyUrl } from "@/lib/cms/resolve-calendly";
import { resolveHomeMedia } from "@/lib/cms/resolve-media";

export const dynamic = "force-dynamic";

export default async function FunnelPage() {
  const [home, tunnel] = await Promise.all([
    getPageContent("home"),
    getPageContent("tunnel"),
  ]);

  return (
    <FunnelFlow
      media={resolveHomeMedia(home.media)}
      calendlyUrl={resolveCalendlyUrl(tunnel.calendlyUrl)}
    />
  );
}
