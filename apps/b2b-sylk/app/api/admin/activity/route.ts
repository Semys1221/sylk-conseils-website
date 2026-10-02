import { NextResponse } from "next/server";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const SMARTLEAD_API_BASE = "https://server.smartlead.ai/api/v1";
const SMARTLEAD_KEY = process.env.SMARTLEAD_API_KEY;
const CALENDLY_API = "https://api.calendly.com";
const CALENDLY_KEY = process.env.CALENDLY_API_KEY;

interface ActivityItem {
  id: string;
  type: "visit" | "lead" | "rdv";
  title: string;
  subtitle: string;
  timestamp: string;
}

async function fetchPostHogVisits(): Promise<ActivityItem[]> {
  if (!POSTHOG_API_KEY) return [];
  try {
    const after = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const url = `${POSTHOG_HOST}/api/projects/@current/events/?event=${encodeURIComponent("$pageview")}&after=${encodeURIComponent(after)}&limit=50`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${POSTHOG_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const results: any[] = json.results ?? [];
    const EXCLUDED_PATHS = ["/admin", "/login", "/_next", "/api", "/analytics"];
    return results
      .filter((evt) => {
        const path = evt.properties?.$current_url?.replace(/https?:\/\/[^\/]+/, "") || "";
        return !EXCLUDED_PATHS.some((p) => path.startsWith(p));
      })
      .map((evt) => ({
        id: `visit-${evt.id}`,
        type: "visit" as const,
        title: "Visite site web",
        subtitle: evt.properties?.$current_url?.replace(/https?:\/\/[^\/]+/, "") || "/",
        timestamp: evt.timestamp || new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

async function fetchSmartLeadReplies(since: number): Promise<ActivityItem[]> {
  if (!SMARTLEAD_KEY) return [];
  try {
    const campRes = await fetch(`${SMARTLEAD_API_BASE}/campaigns/?api_key=${SMARTLEAD_KEY}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!campRes.ok) return [];
    const campaigns: any[] = await campRes.json();
    const items: ActivityItem[] = [];

    await Promise.all(
      campaigns.slice(0, 10).map(async (c: any) => {
        try {
          const r = await fetch(
            `${SMARTLEAD_API_BASE}/campaigns/${c.id}/statistics?api_key=${SMARTLEAD_KEY}&email_status=replied&limit=50`,
            { signal: AbortSignal.timeout(10000) }
          );
          if (!r.ok) return;
          const data = await r.json();
          const repliedLeads: any[] = data.data ?? [];
          for (const lead of repliedLeads) {
            if (lead.lead_category !== "Interested") continue;
            const replyTime = new Date(lead.reply_time).getTime();
            if (replyTime < since) continue;
            const name = lead.lead_name?.trim() || lead.lead_email || "Inconnu";
            items.push({
              id: `lead-${lead.stats_id ?? lead.lead_email}`,
              type: "lead",
              title: "Nouveau lead",
              subtitle: `${name} · ${c.name}`,
              timestamp: lead.reply_time,
            });
          }
        } catch {
          /* skip */
        }
      })
    );

    return items;
  } catch {
    return [];
  }
}

async function fetchCalendlyBookings(): Promise<ActivityItem[]> {
  if (!CALENDLY_KEY) return [];
  try {
    const userRes = await fetch(`${CALENDLY_API}/users/me`, {
      headers: { Authorization: `Bearer ${CALENDLY_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!userRes.ok) return [];
    const userData = await userRes.json();
    const userUri = userData.resource?.uri;
    if (!userUri) return [];

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await fetch(
      `${CALENDLY_API}/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${weekAgo}&count=10`,
      { headers: { Authorization: `Bearer ${CALENDLY_KEY}` }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items: ActivityItem[] = [];

    await Promise.all(
      (data.collection || []).map(async (evt: any) => {
        try {
          const eventUuid = evt.uri?.split("/").pop();
          if (!eventUuid) return;
          const invRes = await fetch(`${CALENDLY_API}/scheduled_events/${eventUuid}/invitees`, {
            headers: { Authorization: `Bearer ${CALENDLY_KEY}` },
            signal: AbortSignal.timeout(5000),
          });
          const invData = invRes.ok ? await invRes.json() : { collection: [] };
          for (const inv of invData.collection || []) {
            const invUuid = inv.uri?.split("/").pop() ?? inv.email;
            items.push({
              id: `rdv-${eventUuid}-${invUuid}`,
              type: "rdv",
              title: "Rendez-vous confirmé",
              subtitle: `${inv.name} — ${evt.name}`,
              timestamp: evt.start_time,
            });
          }
        } catch {
          /* skip */
        }
      })
    );

    return items;
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since") ?? "2026-06-02T00:00:00Z";
  const since = new Date(sinceParam).getTime();

  const [visits, leads, bookings] = await Promise.all([
    fetchPostHogVisits(),
    fetchSmartLeadReplies(since),
    fetchCalendlyBookings(),
  ]);

  const nerfedLeads = leads
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const items = [...visits, ...nerfedLeads, ...bookings].filter(
    (item) => new Date(item.timestamp).getTime() >= since
  );

  return NextResponse.json({ error: null, items });
}
