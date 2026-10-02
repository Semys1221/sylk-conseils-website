import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!tenantId) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("cold_leads")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabaseAdmin
    .from("cold_leads")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", today.toISOString());

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    today: todayCount || 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    tenant_id,
    email,
    first_name,
    last_name,
    company_name,
    source,
    status,
    phone_number,
    location,
    linkedin_url,
  } = body;

  if (!tenant_id || !email) {
    return NextResponse.json({ error: "tenant_id and email required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("cold_leads")
    .insert({
      tenant_id,
      email,
      first_name,
      last_name,
      company_name,
      source: source || "manual",
      status: status || "raw",
      phone_number,
      location,
      linkedin_url,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
