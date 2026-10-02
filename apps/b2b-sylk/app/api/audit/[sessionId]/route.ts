import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("audit_data")
      .select("audit")
      .eq("session_id", sessionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ audit: null });
      }
      throw error;
    }

    return NextResponse.json({ audit: data.audit });
  } catch (error) {
    console.error("audit GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
