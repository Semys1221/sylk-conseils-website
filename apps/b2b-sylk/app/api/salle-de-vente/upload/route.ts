import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "File too large (20 MB max)" }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Document upload is not configured (storage backend removed).",
      },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
