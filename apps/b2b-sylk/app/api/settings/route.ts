import { NextResponse } from "next/server";
import type { TenantSettings } from "@workspace/shared-types";
import { getTenantConfig, setTenantConfig } from "@/lib/server-memory-store";

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

  const tenant = getTenantConfig(tenantId);

  const settings: TenantSettings = {
    callSettings: {
      defaultRecipients:
        (tenant?.callSettings as TenantSettings["callSettings"])?.defaultRecipients ??
        DEFAULT_SETTINGS.callSettings.defaultRecipients,
      discoveryQuestions:
        (tenant?.callSettings as TenantSettings["callSettings"])?.discoveryQuestions ??
        DEFAULT_SETTINGS.callSettings.discoveryQuestions,
      screeningLevel:
        (tenant?.callSettings as TenantSettings["callSettings"])?.screeningLevel ??
        DEFAULT_SETTINGS.callSettings.screeningLevel,
    },
    websiteSettings: {
      domain:
        (tenant?.websiteSettings as TenantSettings["websiteSettings"])?.domain ??
        DEFAULT_SETTINGS.websiteSettings.domain,
      orias:
        (tenant?.websiteSettings as TenantSettings["websiteSettings"])?.orias ??
        DEFAULT_SETTINGS.websiteSettings.orias,
      legalMentions:
        (tenant?.websiteSettings as TenantSettings["websiteSettings"])?.legalMentions ??
        DEFAULT_SETTINGS.websiteSettings.legalMentions,
      tone:
        (tenant?.websiteSettings as TenantSettings["websiteSettings"])?.tone ??
        DEFAULT_SETTINGS.websiteSettings.tone,
      color:
        (tenant?.websiteSettings as TenantSettings["websiteSettings"])?.color ??
        DEFAULT_SETTINGS.websiteSettings.color,
    },
  };

  return NextResponse.json({ data: settings });
}

export async function PUT(req: Request) {
  const { tenant_id, settings, notify } = await req.json();
  if (!tenant_id || !settings)
    return NextResponse.json({ error: "tenant_id and settings are required" }, { status: 400 });

  const currentConfig = getTenantConfig(tenant_id) ?? {};
  const updatedConfig = {
    ...currentConfig,
    callSettings: {
      ...DEFAULT_SETTINGS.callSettings,
      ...((currentConfig.callSettings as object) ?? {}),
      ...settings.callSettings,
    },
    websiteSettings: {
      ...DEFAULT_SETTINGS.websiteSettings,
      ...((currentConfig.websiteSettings as object) ?? {}),
      ...settings.websiteSettings,
    },
  };

  setTenantConfig(tenant_id, updatedConfig);

  if (notify) {
    const section = settings.callSettings ? "call" : "website";
    await sendNotification(section, tenant_id);
  }

  return NextResponse.json({ data: { success: true } });
}
