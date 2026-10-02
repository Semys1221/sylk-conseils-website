import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase/admin";
import { syncCRMData } from "@/lib/crm-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const { data: tenants } = await supabase.from("tenants").select("tenant_id");
  const results: Record<string, unknown>[] = [];

  if (tenants) {
    for (const t of tenants) {
      const result = await syncCRMData(t.tenant_id);
      results.push({ tenant_id: t.tenant_id, ...result });
    }
  }

  return NextResponse.json({ data: results });
}
