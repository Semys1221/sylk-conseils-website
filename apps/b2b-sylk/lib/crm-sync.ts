import { supabaseAdmin as supabase } from "@/lib/supabase/admin";
import type { CRMSyncResult } from "@workspace/shared-types";

export async function syncCRMData(tenantId: string): Promise<CRMSyncResult> {
  const result: CRMSyncResult = {
    synced: 0,
    interested: 0,
    website_visits: 0,
    booked_calls: 0,
    last_sync: new Date().toISOString(),
  };

  try {
    const { data: interestedReplies } = await supabase
      .from("warm_emails")
      .select(
        "id, lead_id, replied_at, reply_sentiment, cold_leads!inner(id, email, first_name, last_name, tenant_id)"
      )
      .eq("cold_leads.tenant_id", tenantId)
      .eq("reply_sentiment", "interesse")
      .not("replied_at", "is", null);

    if (interestedReplies) {
      const rows = interestedReplies
        .map((r) => {
          const lead = (r as any).cold_leads;
          return {
            tenant_id: tenantId,
            type: "interested_prospect" as const,
            lead_id: lead?.id ?? r.lead_id,
            prospect_name: lead
              ? `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim() || null
              : null,
            prospect_email: lead?.email ?? null,
            source: "smartlead",
            source_id: r.id,
            occurred_at: r.replied_at,
          };
        })
        .filter((r) => r.occurred_at);
      if (rows.length > 0) {
        const { error } = await supabase
          .from("crm_activities")
          .upsert(rows, { onConflict: "tenant_id,type,source_id" });
        if (!error) {
          result.interested = rows.length;
          result.synced += rows.length;
        }
      }
    }

    const { data: clickedEmails } = await supabase
      .from("warm_emails")
      .select(
        "id, lead_id, clicked_at, metadata, cold_leads!inner(id, email, first_name, last_name, tenant_id)"
      )
      .eq("cold_leads.tenant_id", tenantId)
      .not("clicked_at", "is", null);

    if (clickedEmails) {
      const rows = clickedEmails
        .map((e) => {
          const lead = (e as any).cold_leads;
          return {
            tenant_id: tenantId,
            type: "website_visit" as const,
            lead_id: lead?.id ?? e.lead_id,
            prospect_name: lead
              ? `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim() || null
              : null,
            prospect_email: lead?.email ?? null,
            source: "smartlead",
            source_id: e.id,
            metadata: e.metadata ?? {},
            occurred_at: e.clicked_at,
          };
        })
        .filter((r) => r.occurred_at);
      if (rows.length > 0) {
        const { error } = await supabase
          .from("crm_activities")
          .upsert(rows, { onConflict: "tenant_id,type,source_id" });
        if (!error) {
          result.website_visits = rows.length;
          result.synced += rows.length;
        }
      }
    }

    const { data: bookings } = await supabase
      .from("appointments")
      .select("id, lead_id, prospect_name, prospect_email, start_time, source, metadata")
      .eq("tenant_id", tenantId)
      .in("status", ["confirmed", "pending"])
      .not("start_time", "is", null);

    if (bookings) {
      const rows = bookings.map((b) => ({
        tenant_id: tenantId,
        type: "booked_call" as const,
        lead_id: b.lead_id,
        prospect_name: b.prospect_name,
        prospect_email: b.prospect_email,
        source: b.source ?? "calendly",
        source_id: b.id,
        metadata: b.metadata ?? {},
        occurred_at: b.start_time,
      }));
      if (rows.length > 0) {
        const { error } = await supabase
          .from("crm_activities")
          .upsert(rows, { onConflict: "tenant_id,type,source_id" });
        if (!error) {
          result.booked_calls = rows.length;
          result.synced += rows.length;
        }
      }
    }
  } catch (err) {
    result.errors = [err instanceof Error ? err.message : "Unknown error"];
  }

  return result;
}
