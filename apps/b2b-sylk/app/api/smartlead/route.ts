import { NextResponse } from "next/server";

const SMARTLEAD_API_BASE = "https://server.smartlead.ai/api/v1";

function normalizeAnalytics(raw: Record<string, any> | null) {
  if (!raw) return null;
  return {
    total_sent: Number(raw.sent_count) || 0,
    total_opened: Number(raw.open_count) || 0,
    total_clicked: Number(raw.click_count) || 0,
    total_replied: Number(raw.reply_count) || 0,
    total_bounced: Number(raw.bounce_count) || 0,
    total_leads: Number(raw.total_count) || 0,
  };
}

export async function GET() {
  const apiKey = process.env.SMARTLEAD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SMARTLEAD_API_KEY not set", data: [] });
  }

  try {
    const res = await fetch(`${SMARTLEAD_API_BASE}/campaigns/?api_key=${apiKey}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `SmartLead API ${res.status}`, data: [] });
    }

    const campaigns: any[] = await res.json();

    const enriched = await Promise.all(
      campaigns.map(async (c: any) => {
        try {
          const [statsRes] = await Promise.all([
            fetch(`${SMARTLEAD_API_BASE}/campaigns/${c.id}/analytics?api_key=${apiKey}`, {
              signal: AbortSignal.timeout(5000),
            }),
          ]);

          const rawStats = statsRes.ok ? await statsRes.json() : null;

          return {
            id: c.id,
            name: c.name,
            status: c.status,
            total_leads: Number(rawStats?.total_count) || 0,
            analytics: normalizeAnalytics(rawStats),
          };
        } catch {
          return { id: c.id, name: c.name, status: c.status, total_leads: 0, analytics: null };
        }
      })
    );

    return NextResponse.json({ error: null, data: enriched });
  } catch (e) {
    return NextResponse.json({ error: String(e), data: [] });
  }
}
