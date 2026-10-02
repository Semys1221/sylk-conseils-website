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
    active: 0,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenant_id, title } = body;

  if (!tenant_id || !title) {
    return NextResponse.json({ error: "tenant_id and title required" }, { status: 400 });
  }

  return NextResponse.json(
    {
      data: {
        id: crypto.randomUUID(),
        ...body,
        status: body.status || "todo",
        priority: body.priority || "medium",
        created_at: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}
