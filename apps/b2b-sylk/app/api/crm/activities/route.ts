import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  const type = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  let query = supabase
    .from("crm_activities")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("occurred_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type && ["interested_prospect", "website_visit", "booked_call"].includes(type)) {
    query = query.eq("type", type);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count });
}
