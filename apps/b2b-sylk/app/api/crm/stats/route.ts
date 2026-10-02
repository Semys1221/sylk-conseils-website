import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  const { data: activities } = await supabase
    .from("crm_activities")
    .select("type")
    .eq("tenant_id", tenantId);

  const interested_count = activities?.filter((a) => a.type === "interested_prospect").length ?? 0;
  const website_visit_count = activities?.filter((a) => a.type === "website_visit").length ?? 0;
  const booked_call_count = activities?.filter((a) => a.type === "booked_call").length ?? 0;

  return NextResponse.json({
    data: {
      interested_count,
      website_visit_count,
      booked_call_count,
      total: activities?.length ?? 0,
    },
  });
}
