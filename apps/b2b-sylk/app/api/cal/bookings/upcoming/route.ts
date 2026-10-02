import { NextResponse } from "next/server";
import tenantConfig from "@/tenant.config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id is required" }, { status: 400 });

  return NextResponse.json({
    data: [],
    config: {
      dailyRoomUrl: tenantConfig.dailyRoomUrl ?? "",
      hasCalApi: false,
    },
  });
}
