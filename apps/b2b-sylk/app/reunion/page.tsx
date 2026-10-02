import type { Metadata } from "next";
import { ReunionFunnel } from "@/components/reunionfunnel/reunionfunnel";
import { UpcomingCallsCard } from "@workspace/tenant-ui";
import tenantConfig from "@/tenant.config";

export const metadata: Metadata = {
  title: "Salle de réunion | SYLK Conseils",
  description: "Interface de visioconférence sécurisée pour vos entretiens conseil.",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ mode?: string }>;
}

export default async function SalleDeVentePage({ searchParams }: Props) {
  const params = await searchParams;

  if (params.mode === "cgp") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <UpcomingCallsCard tenantId={tenantConfig.id} />
        </div>
      </div>
    );
  }

  return <ReunionFunnel />;
}
