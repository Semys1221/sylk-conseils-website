import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      sessionId: string;
      tenantId?: string;
      clientName: string;
      signature: string;
      contractType: string;
    };

    const { clientName, contractType } = body;
    const contractId = crypto.randomUUID();

    const signedUrl = `/api/contract/generate?contractId=${contractId}&clientName=${encodeURIComponent(clientName)}&type=${encodeURIComponent(contractType)}`;

    return NextResponse.json({
      signedUrl,
      success: true,
      contract: { id: contractId, status: "signed" },
    });
  } catch (error) {
    console.error("contract sign error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
