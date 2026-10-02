import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");

  if (!tenantId) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  }

  return NextResponse.json({
    leads: { total: 0, thisMonth: 0, today: 0 },
    appointments: { total: 0, upcoming: 0, completed: 0 },
    tasks: { total: 0, active: 0, done: 0, completionRate: 0 },
  });
}
