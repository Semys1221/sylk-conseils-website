import { NextResponse } from "next/server";
import { syncCRMData } from "@/lib/crm-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const tenantId = process.env.TENANT_ID ?? "sylk-conseils";
  const result = await syncCRMData(tenantId);
  return NextResponse.json({ data: [{ tenant_id: tenantId, ...result }] });
}
