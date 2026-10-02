import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, tenantId, result, answers } = await request.json();

    if (sessionId && tenantId) {
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

      await supabase.from("running_funnels").upsert(
        {
          session_id: sessionId,
          tenant_id: tenantId,
          current_step: 6,
          answers: { ...answers, _result: result, _status: "completed" },
          last_active_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "sylk-conseils-funnel",
          tenant_id: tenantId || "sylk-conseils",
          timestamp: new Date().toISOString(),
          result: result || "unknown",
          answers: answers || {},
        }),
      });
    }

    // Discord webhook notification (local & production)
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `**Nouveau diagnostic** — ${result === "qualified" ? "✅ Qualifié" : "❌ Non qualifié"}`,
          embeds: [
            {
              fields: Object.entries(answers || {}).map(([k, v]) => ({
                name: k,
                value: String(v),
                inline: true,
              })),
              color: result === "qualified" ? 0x059669 : 0xdc2626,
            },
          ],
        }),
      }).catch(() => {});
    }

    const apiKey = process.env.VERCEL_ENV ? process.env.RESEND_API_KEY : undefined;
    if (apiKey) {
      const answerItems = Object.entries(answers || {})
        .map(
          ([key, val]) =>
            `<tr><td style="padding:6px 12px;border:1px solid #e2e8f0;font-size:14px">${key}</td><td style="padding:6px 12px;border:1px solid #e2e8f0;font-size:14px">${val}</td></tr>`
        )
        .join("");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "hello@montismedia.com",
          to: ["hello@montismedia.com"],
          subject: `Nouveau diagnostic patrimonial — ${result === "qualified" ? "✅ Qualifié" : "❌ Non qualifié"}`,
          html: `
            <h2>Nouveau diagnostic patrimonial</h2>
            <p><strong>Résultat :</strong> ${result === "qualified" ? "Qualifié" : "Non qualifié"}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
            <table style="border-collapse:collapse;margin-top:12px">
              <thead><tr><th style="padding:6px 12px;border:1px solid #e2e8f0;background:#f8fafc;text-align:left">Question</th><th style="padding:6px 12px;border:1px solid #e2e8f0;background:#f8fafc;text-align:left">Réponse</th></tr></thead>
              <tbody>${answerItems}</tbody>
            </table>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Funnel submit error:", error);
    return NextResponse.json({ ok: true, error: String(error) });
  }
}
