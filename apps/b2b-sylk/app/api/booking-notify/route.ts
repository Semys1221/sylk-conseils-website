import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const CALENDLY_API = "https://api.calendly.com";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function durationMinutes(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

function emailHtml(opts: {
  inviteeName: string;
  inviteeEmail: string;
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  answers: Record<string, string>;
}) {
  const answerLabels: Record<string, string> = {
    statut: "Statut de la structure",
    imposition: "Tranche d'imposition annuelle",
    leviers: "Leviers d'optimisation existants",
  };
  const answerValues: Record<string, string> = {
    solo: "Solo",
    associe: "Associé en société",
    moins_10k: "< 10k€",
    "10k_30k": "10k€ – 30k€",
    plus_30k: "+ 30k€",
    oui: "Oui",
    non: "Non",
  };

  const answerRows = Object.entries(opts.answers)
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${answerLabels[k] ?? k}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:600;">${answerValues[v] ?? v}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 24px;border-bottom:2px solid #111827;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;letter-spacing:-0.02em;">Nouveau rendez-vous</h1>
                    <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Un prospect a réservé un échange de objectif</p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;color:#059669;background:#ecfdf5;border:1px solid #a7f3d0;">Confirmé</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking details -->
          <tr>
            <td style="padding:24px 36px 8px;">
              <h2 style="margin:0;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Détails du rendez-vous</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Date</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${opts.date}</td>
                      </tr>
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Horaire</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${opts.startTime} – ${opts.endTime} (${opts.duration} min)</td>
                      </tr>
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Type</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${opts.eventName}</td>
                      </tr>
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Lieu</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${opts.location}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client info -->
          <tr>
            <td style="padding:24px 36px 8px;">
              <h2 style="margin:0;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Prospect</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Nom</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;">${opts.inviteeName}</td>
                      </tr>
                      <tr>
                        <td width="80" style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
                        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#111827;"><a href="mailto:${opts.inviteeEmail}" style="color:#2563eb;text-decoration:none;">${opts.inviteeEmail}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Qualification answers -->
          ${
            opts.answers && Object.keys(opts.answers).length > 0
              ? `
          <tr>
            <td style="padding:24px 36px 8px;">
              <h2 style="margin:0;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Pré-qualification</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
                <thead>
                  <tr style="background:#f3f4f6;">
                    <th style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Question</th>
                    <th style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:600;color:#6b7280;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Réponse</th>
                  </tr>
                </thead>
                <tbody>
                  ${answerRows}
                </tbody>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                Cet email est envoyé automatiquement depuis le tunnel de réservation
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;text-align:center;font-style:italic;">
                Montis Media
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { eventUri, inviteeUri, answers, tenantId, testEmail } = await request.json();

    const apiKey = process.env.CALENDLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "CALENDLY_API_KEY not set" }, { status: 500 });
    }

    // Fetch event details from Calendly API
    const eventRes = await fetch(eventUri, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    let eventName = "Échange de objectif";
    let startTime = "";
    let endTime = "";
    let location = "Visio";

    if (eventRes.ok) {
      const eventData = await eventRes.json();
      const resource = eventData.resource;
      if (resource) {
        eventName = resource.name ?? eventName;
        startTime = resource.start_time ?? "";
        endTime = resource.end_time ?? "";
        location = resource.location?.location ?? resource.location?.type ?? "Visio";
      }
    }

    // Fetch invitee details
    let inviteeName = "Non renseigné";
    let inviteeEmail = "Non renseigné";

    if (inviteeUri) {
      const invRes = await fetch(inviteeUri, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        const invResource = invData.resource;
        if (invResource) {
          inviteeName = invResource.name ?? inviteeName;
          inviteeEmail = invResource.email ?? inviteeEmail;
        }
      }
    }

    // Build email
    const html = emailHtml({
      inviteeName,
      inviteeEmail,
      eventName,
      date: startTime ? formatDate(startTime) : "Non renseigné",
      startTime: startTime ? formatTime(startTime) : "—",
      endTime: endTime ? formatTime(endTime) : "—",
      duration: startTime && endTime ? durationMinutes(startTime, endTime) : 0,
      location,
      answers: answers ?? {},
    });

    // Discord webhook notification (local & production)
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `**Nouvel échange de objectif** — ${inviteeName} (${inviteeEmail})`,
          embeds: [
            {
              title: "Détails du rendez-vous",
              fields: [
                { name: "Date", value: startTime ? formatDate(startTime) : "—", inline: true },
                { name: "Horaire", value: startTime ? `${formatTime(startTime)} (${startTime && endTime ? durationMinutes(startTime, endTime) : "?"} min)` : "—", inline: true },
                { name: "Type", value: eventName, inline: true },
                ...Object.entries(answers ?? {}).map(([k, v]) => ({
                  name: k,
                  value: String(v),
                  inline: true,
                })),
              ],
              color: 0x059669,
            },
          ],
        }),
      }).catch(() => {});
    }

    // Resend email (production only)
    if (!process.env.VERCEL_ENV) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
    }

    const recipients = testEmail
      ? [testEmail]
      : ["sylkconseils@outlook.com", "responsable-neuf@sylkconseil.com", "hello@montismedia.com"];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Montis Media <no-reply@montismedia.com>",
        to: recipients,
        subject: `Nouvel échange de objectif — ${inviteeName} — ${startTime ? formatDate(startTime) : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", errBody);
      return NextResponse.json({ error: "Resend send failed" }, { status: 500 });
    }

    // Also log to CRM
    if (tenantId) {
      try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
              setAll(cookiesToSet) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  );
                } catch {}
              },
            },
          }
        );

        await supabase.from("crm_activities").insert({
          tenant_id: tenantId,
          type: "booking_notification",
          source: "funnel",
          source_id: crypto.randomUUID(),
          metadata: {
            event_uri: eventUri,
            invitee_uri: inviteeUri,
            invitee_name: inviteeName,
            invitee_email: inviteeEmail,
            event_name: eventName,
            start_time: startTime,
            end_time: endTime,
            answers,
          },
          occurred_at: new Date().toISOString(),
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Booking notify error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
