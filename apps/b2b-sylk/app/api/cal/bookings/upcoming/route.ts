import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  const now = new Date().toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, prospect_name, prospect_email, start_time, duration, status, metadata, lead_id")
    .eq("tenant_id", tenantId)
    .gte("start_time", now)
    .in("status", ["confirmed", "pending"])
    .order("start_time", { ascending: true })
    .limit(10);

  const { data: tenant } = await supabase
    .from("tenants")
    .select("config")
    .eq("tenant_id", tenantId)
    .single();

  const config = (tenant?.config as Record<string, unknown>) ?? {};
  const dailyRoomUrl = (config.dailyRoomUrl as string) ?? "";
  const calApiKey = (config.calApiKey as string) ?? "";

  return NextResponse.json({
    data: appointments ?? [],
    config: {
      dailyRoomUrl,
      hasCalApi: Boolean(calApiKey),
    },
  });
}
