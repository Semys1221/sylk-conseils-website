import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      tenantId: string;
      config: Record<string, unknown>;
    };

    const { tenantId, config } = body;

    const supabase = await createClient();
    const { error } = await supabase
      .from("call_config")
      .upsert(
        { tenant_id: tenantId, config, updated_at: new Date().toISOString() },
        { onConflict: "tenant_id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("call-config save error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
