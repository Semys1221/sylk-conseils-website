import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      sessionId: string;
      tenantId?: string;
      clientName: string;
      signature: string;
      contractType: string;
    };

    const { sessionId, tenantId = "sylk-conseils", clientName, signature, contractType } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contracts")
      .insert({
        session_id: sessionId,
        tenant_id: tenantId,
        client_name: clientName,
        contract_type: contractType,
        status: "signed",
        signed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const signedUrl = `/api/contract/generate?contractId=${data.id}&clientName=${encodeURIComponent(clientName)}&type=${encodeURIComponent(contractType)}`;

    return NextResponse.json({ signedUrl, success: true, contract: data });
  } catch (error) {
    console.error("contract sign error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
