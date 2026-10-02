import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      sessionId: string;
      tenantId?: string;
      audit: Record<string, unknown>;
    };

    const { sessionId, tenantId = "sylk-conseils", audit } = body;

    const supabase = await createClient();
    const { error } = await supabase.from("audit_data").upsert(
      {
        session_id: sessionId,
        tenant_id: tenantId,
        audit,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("audit save error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
