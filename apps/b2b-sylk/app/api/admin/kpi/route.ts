import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");

  if (!tenantId) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [leadsTotal, leadsMonth, leadsToday] = await Promise.all([
    supabaseAdmin
      .from("cold_leads")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    supabaseAdmin
      .from("cold_leads")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("created_at", firstOfMonth.toISOString()),
    supabaseAdmin
      .from("cold_leads")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("created_at", today.toISOString()),
  ]);

  const [apptsTotal, apptsUpcoming, apptsCompleted] = await Promise.all([
    supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .gte("date", today.toISOString().split("T")[0])
      .neq("status", "cancelled"),
    supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "completed"),
  ]);

  const [tasksTotal, tasksActive, tasksDone] = await Promise.all([
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .in("status", ["todo", "in_progress"]),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "done"),
  ]);

  const count = (res: { count: number | null }) => res.count || 0;

  return NextResponse.json({
    leads: {
      total: count(leadsTotal),
      thisMonth: count(leadsMonth),
      today: count(leadsToday),
    },
    appointments: {
      total: count(apptsTotal),
      upcoming: count(apptsUpcoming),
      completed: count(apptsCompleted),
    },
    tasks: {
      total: count(tasksTotal),
      active: count(tasksActive),
      done: count(tasksDone),
      completionRate:
        count(tasksTotal) > 0 ? Math.round((count(tasksDone) / count(tasksTotal)) * 100) : 0,
    },
  });
}
