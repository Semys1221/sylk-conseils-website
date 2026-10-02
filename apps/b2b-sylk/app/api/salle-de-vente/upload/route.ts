import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = (formData.get("sessionId") as string | null) ?? "unknown";
    const category = (formData.get("category") as string | null) ?? "other";

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "File too large (20 MB max)" }, { status: 400 });
    }

    const supabase = await createClient();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `salle-de-vente/${sessionId}/${category}/${Date.now()}_${safeFileName}`;

    const { error } = await supabase.storage
      .from("client-documents")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Upload error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, path });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
