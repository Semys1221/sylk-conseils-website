import { NextRequest, NextResponse } from "next/server";
import { getCallConfig } from "@/lib/server-memory-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenant_id") ?? "sylk-conseils";

    const config = getCallConfig(tenantId);
    return NextResponse.json({ config: config ?? null });
  } catch (error) {
    console.error("call-config GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
