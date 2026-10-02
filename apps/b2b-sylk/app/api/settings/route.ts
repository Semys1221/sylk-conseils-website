import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase/admin";
import type { TenantSettings } from "@workspace/shared-types";

const DEFAULT_SETTINGS: TenantSettings = {
  callSettings: {
    defaultRecipients: ["hello@montismedia.com"],
    discoveryQuestions: [],
    screeningLevel: "simple",
  },
  websiteSettings: {
    domain: "",
    orias: "",
    legalMentions: "",
    tone: "Institutionnel",
    color: "Mesh blue",
  },
};

async function sendNotification(section: string, tenantId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const sectionLabel = section === "call" ? "Appels" : "Site web";
  const html = `
    <h2>Paramètres modifiés</h2>
    <p>La section <strong>${sectionLabel}</strong> a été mise à jour pour le tenant <strong>${tenantId}</strong>.</p>
    <p>Date : ${new Date().toLocaleString("fr-FR")}</p>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "hello@montismedia.com",
        to: ["hello@montismedia.com"],
        subject: `Configuration mise à jour — ${sectionLabel}`,
        html,
      }),
    });
  } catch {
    /* ignore notification errors */
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  const { data: tenant } = await supabase
    .from("tenants")
    .select("config")
    .eq("tenant_id", tenantId)
    .single();

  const settings: TenantSettings = {
    callSettings: {
      defaultRecipients:
        (tenant?.config as any)?.callSettings?.defaultRecipients ??
        DEFAULT_SETTINGS.callSettings.defaultRecipients,
      discoveryQuestions:
        (tenant?.config as any)?.callSettings?.discoveryQuestions ??
        DEFAULT_SETTINGS.callSettings.discoveryQuestions,
      screeningLevel:
        (tenant?.config as any)?.callSettings?.screeningLevel ??
        DEFAULT_SETTINGS.callSettings.screeningLevel,
    },
    websiteSettings: {
      domain:
        (tenant?.config as any)?.websiteSettings?.domain ?? DEFAULT_SETTINGS.websiteSettings.domain,
      orias:
        (tenant?.config as any)?.websiteSettings?.orias ?? DEFAULT_SETTINGS.websiteSettings.orias,
      legalMentions:
        (tenant?.config as any)?.websiteSettings?.legalMentions ??
        DEFAULT_SETTINGS.websiteSettings.legalMentions,
      tone: (tenant?.config as any)?.websiteSettings?.tone ?? DEFAULT_SETTINGS.websiteSettings.tone,
      color:
        (tenant?.config as any)?.websiteSettings?.color ?? DEFAULT_SETTINGS.websiteSettings.color,
    },
  };

  return NextResponse.json({ data: settings });
}

export async function PUT(req: Request) {
  const { tenant_id, settings, notify } = await req.json();
  if (!tenant_id || !settings)
    return NextResponse.json({ error: "tenant_id and settings are required" }, { status: 400 });

  const { data: tenant } = await supabase
    .from("tenants")
    .select("config")
    .eq("tenant_id", tenant_id)
    .single();

  const currentConfig = (tenant?.config as Record<string, unknown>) ?? {};
  const updatedConfig = {
    ...currentConfig,
    callSettings: {
      ...DEFAULT_SETTINGS.callSettings,
      ...((currentConfig as any)?.callSettings ?? {}),
      ...settings.callSettings,
    },
    websiteSettings: {
      ...DEFAULT_SETTINGS.websiteSettings,
      ...((currentConfig as any)?.websiteSettings ?? {}),
      ...settings.websiteSettings,
    },
  };

  const { error } = await supabase
    .from("tenants")
    .update({ config: updatedConfig })
    .eq("tenant_id", tenant_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (notify) {
    const section = settings.callSettings ? "call" : "website";
    await sendNotification(section, tenant_id);
  }

  return NextResponse.json({ data: { success: true } });
}
