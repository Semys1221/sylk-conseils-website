import { NextRequest, NextResponse } from "next/server";

type ServiceId = "pusher" | "n8n" | "cal" | "daily" | "posthog";

async function testPusher(): Promise<{ ok: boolean; message: string }> {
  const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  if (!appId || !key || !secret || secret === "not-set") {
    return { ok: false, message: "Variables non configurées" };
  }
  const isValid = appId.length > 0 && key.length > 0 && secret.length > 0;
  return isValid
    ? { ok: true, message: "Credentials présents" }
    : { ok: false, message: "Credentials invalides" };
}

async function testN8N(): Promise<{ ok: boolean; message: string }> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, message: "N8N_WEBHOOK_URL non défini" };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok || res.status < 500, message: `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
}

async function testCal(): Promise<{ ok: boolean; message: string }> {
  const calUrl = process.env.NEXT_PUBLIC_CAL_COM_URL;
  if (!calUrl) {
    return { ok: false, message: "NEXT_PUBLIC_CAL_COM_URL non défini" };
  }
  return { ok: true, message: "URL configurée" };
}

async function testDaily(): Promise<{ ok: boolean; message: string }> {
  const tenantConfig = await import("@/tenant.config").then((m) => m.default);
  const roomUrl = tenantConfig.dailyRoomUrl;
  if (!roomUrl) {
    return { ok: false, message: "dailyRoomUrl non défini dans tenant.config" };
  }
  return { ok: true, message: roomUrl };
}

async function testPostHog(): Promise<{ ok: boolean; message: string }> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
  if (!key || key === "phc_not-set") {
    return { ok: false, message: "NEXT_PUBLIC_POSTHOG_KEY non défini" };
  }
  try {
    const res = await fetch(`${host}/decide?v=3`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: key, distinct_id: "health-check" }),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok
      ? { ok: true, message: `HTTP ${res.status}` }
      : { ok: false, message: `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
}

export async function GET(request: NextRequest) {
  const service = request.nextUrl.searchParams.get("service") as ServiceId | null;

  const start = Date.now();
  let result: { ok: boolean; message: string };

  switch (service) {
    case "pusher":
      result = await testPusher();
      break;
    case "n8n":
      result = await testN8N();
      break;
    case "cal":
      result = await testCal();
      break;
    case "daily":
      result = await testDaily();
      break;
    case "posthog":
      result = await testPostHog();
      break;
    default:
      return NextResponse.json({ ok: false, message: "Service inconnu" }, { status: 400 });
  }

  return NextResponse.json({
    ...result,
    latency: Date.now() - start,
    service,
  });
}
