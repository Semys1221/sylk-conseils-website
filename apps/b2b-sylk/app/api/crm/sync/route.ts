import { NextResponse } from "next/server";
import { syncCRMData } from "@/lib/crm-sync";

export async function POST(req: Request) {
  const { tenant_id } = await req.json();
  if (!tenant_id) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  const result = await syncCRMData(tenant_id);
  return NextResponse.json({ data: result });
}
