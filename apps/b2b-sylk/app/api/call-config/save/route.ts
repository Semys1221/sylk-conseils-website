import { NextRequest, NextResponse } from "next/server";
import { setCallConfig } from "@/lib/server-memory-store";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      tenantId: string;
      config: Record<string, unknown>;
    };

    const { tenantId, config } = body;
    setCallConfig(tenantId, config);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("call-config save error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
