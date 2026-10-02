import { NextResponse } from "next/server";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

export async function GET() {
  if (!POSTHOG_API_KEY) {
    return NextResponse.json(
      { error: "POSTHOG_PERSONAL_API_KEY not set", data: null },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(`${POSTHOG_HOST}/api/projects/@current/query/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POSTHOG_API_KEY}`,
      },
      body: JSON.stringify({
        query: {
          kind: "TrendsQuery",
          series: [
            { kind: "EventsNode", event: "$pageview", name: "Pageviews" },
            { kind: "EventsNode", event: "$pageleave", name: "Sessions" },
          ],
          dateRange: { date_from: "-30d" },
          interval: "day",
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `PostHog API: ${res.status} ${text}`, data: null });
    }

    const json = await res.json();
    return NextResponse.json({ error: null, data: json });
  } catch (e) {
    return NextResponse.json({ error: String(e), data: null });
  }
}
