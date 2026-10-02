import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  if (!tenantId) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (priority && priority !== "all") {
    query = query.eq("priority", priority);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count: todoCount } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .in("status", ["todo", "in_progress"]);

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    active: todoCount || 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    tenant_id,
    title,
    description,
    status,
    priority,
    due_date,
    assigned_to,
    related_to,
    related_id,
  } = body;

  if (!tenant_id || !title) {
    return NextResponse.json({ error: "tenant_id and title required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      tenant_id,
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      due_date,
      assigned_to,
      related_to,
      related_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
