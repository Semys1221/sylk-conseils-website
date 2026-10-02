import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id");

  if (!tenantId) {
    return NextResponse.json({ error: "tenant_id required" }, { status: 400 });
  }

  return NextResponse.json({
    data: [],
    total: 0,
    today: 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenant_id, email } = body;

  if (!tenant_id || !email) {
    return NextResponse.json({ error: "tenant_id and email required" }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      id: crypto.randomUUID(),
      ...body,
      created_at: new Date().toISOString(),
    },
  });
}
