import { NextRequest, NextResponse } from "next/server";
import { uploadCmsAsset } from "@/lib/cms/upload-asset";
import { verifyAdminCredentials } from "@/lib/cms/verify-admin";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    const slug = form.get("slug")?.toString() ?? "media";
    const file = form.get("file");

    const auth = verifyAdminCredentials({ email, password });
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    const { url } = await uploadCmsAsset(file, slug);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("admin/cms/upload error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    const status = message.includes("BLOB_READ_WRITE_TOKEN") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
