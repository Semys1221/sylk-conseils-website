import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  return NextResponse.json({
    data: {
      interested_count: 0,
      website_visit_count: 0,
      booked_call_count: 0,
      total: 0,
    },
  });
}
