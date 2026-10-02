import { NextRequest, NextResponse } from "next/server";

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await _request.json();

  return NextResponse.json({
    data: { id, ...body, updated_at: new Date().toISOString() },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ ok: true });
}
