import { NextResponse } from "next/server";

const CALENDLY_API = "https://api.calendly.com";

interface Invitee {
  uuid: string;
  name: string;
  email: string;
  text_reminder_number: string | null;
  status: string;
  created_at: string;
  tracking: {
    utm_campaign?: string;
    utm_source?: string;
    utm_medium?: string;
  };
  questions_and_answers: Array<{
    question: string;
    answer: string;
  }>;
}

interface CalEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location: { type: string; location: string } | null;
  invitees: Invitee[];
}

export async function GET() {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CALENDLY_API_KEY not set", data: [] });
  }

  try {
    // Get current user URI
    const userRes = await fetch(`${CALENDLY_API}/users/me`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: `Calendly user API ${userRes.status}`, data: [] });
    }
    const userData = await userRes.json();
    const userUri = userData.resource?.uri;
    if (!userUri) {
      return NextResponse.json({ error: "No user URI found", data: [] });
    }

    // Fetch upcoming scheduled events
    const now = new Date().toISOString();
    const eventsRes = await fetch(
      `${CALENDLY_API}/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${now}&count=20`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(5000) }
    );

    if (!eventsRes.ok) {
      return NextResponse.json({ error: `Calendly events API ${eventsRes.status}`, data: [] });
    }

    const eventsData = await eventsRes.json();
    const events: CalEvent[] = [];

    for (const evt of eventsData.collection || []) {
      // Fetch invitees for each event
      const invRes = await fetch(
        `${CALENDLY_API}/scheduled_events/${evt.uri?.split("/").pop()}/invitees?status=active`,
        { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(5000) }
      );
      const invData = invRes.ok ? await invRes.json() : { collection: [] };

      events.push({
        uri: evt.uri,
        name: evt.name,
        status: evt.status,
        start_time: evt.start_time,
        end_time: evt.end_time,
        event_type: evt.event_type,
        location: evt.location || null,
        invitees: (invData.collection || []).map((i: any) => ({
          uuid: i.uuid,
          name: i.name,
          email: i.email,
          text_reminder_number: i.text_reminder_number,
          status: i.status,
          created_at: i.created_at,
          tracking: i.tracking || {},
          questions_and_answers: i.questions_and_answers || [],
        })),
      });
    }

    // Also fetch past events (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const pastRes = await fetch(
      `${CALENDLY_API}/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${weekAgo}&max_start_time=${now}&count=20`,
      { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(5000) }
    );

    const pastEvents: CalEvent[] = [];
    if (pastRes.ok) {
      const pastData = await pastRes.json();
      for (const evt of pastData.collection || []) {
        const invRes = await fetch(
          `${CALENDLY_API}/scheduled_events/${evt.uri?.split("/").pop()}/invitees?status=active`,
          { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(5000) }
        );
        const invData = invRes.ok ? await invRes.json() : { collection: [] };
        pastEvents.push({
          uri: evt.uri,
          name: evt.name,
          status: evt.status,
          start_time: evt.start_time,
          end_time: evt.end_time,
          event_type: evt.event_type,
          location: evt.location || null,
          invitees: (invData.collection || []).map((i: any) => ({
            uuid: i.uuid,
            name: i.name,
            email: i.email,
            text_reminder_number: i.text_reminder_number,
            status: i.status,
            created_at: i.created_at,
            tracking: i.tracking || {},
            questions_and_answers: i.questions_and_answers || [],
          })),
        });
      }
    }

    return NextResponse.json({
      error: null,
      data: { upcoming: events, past: pastEvents },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), data: null });
  }
}
