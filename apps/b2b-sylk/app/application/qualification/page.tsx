"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QualificationForm } from "@/components/funnel-flow/qualification-form";
import { FUNNEL_LOGO_URL } from "@/lib/brand-assets";

function QualificationContent() {
  const searchParams = useSearchParams();
  const [eventUri, setEventUri] = useState<string | null>(null);
  const [inviteeUri, setInviteeUri] = useState<string | null>(null);

  useEffect(() => {
    const calendlyEventUrl = searchParams.get("calendly_event_url");
    const inviteeUuid = searchParams.get("invitee_uuid");

    if (calendlyEventUrl) {
      setEventUri(calendlyEventUrl);
      if (inviteeUuid) {
        setInviteeUri(`${calendlyEventUrl}/invitees/${inviteeUuid}`);
      }
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <img
          src={FUNNEL_LOGO_URL}
          alt="SYLK Conseils"
          className="w-14 h-14 rounded-full ring-1 ring-white/10"
        />
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <QualificationForm eventUri={eventUri} inviteeUri={inviteeUri} />
      </div>
    </div>
  );
}

export default function QualificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
          </div>
        }
      >
        <QualificationContent />
      </Suspense>
    </div>
  );
}
