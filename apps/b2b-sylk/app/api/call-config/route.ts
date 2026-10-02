import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenant_id") ?? "sylk-conseils";

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("call_config")
      .select("config")
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ config: null });
      }
      throw error;
    }

    return NextResponse.json({ config: data.config });
  } catch (error) {
    console.error("call-config GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
