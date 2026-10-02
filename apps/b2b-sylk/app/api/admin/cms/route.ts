import { NextRequest, NextResponse } from "next/server";
import { savePageContent } from "@/lib/cms/save-content";
import { getSiteContent } from "@/lib/cms/get-content";
import { cmsPageIds, type CmsPageId } from "@/lib/cms/schema";
import { verifyAdminCredentials } from "@/lib/cms/verify-admin";

export async function GET(request: NextRequest) {
  const auth = verifyAdminCredentials({
    email: request.headers.get("x-admin-email") ?? undefined,
    password: request.headers.get("x-admin-pin") ?? undefined,
  });

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const page = request.nextUrl.searchParams.get("page");
  if (!page || !cmsPageIds.includes(page as CmsPageId)) {
    return NextResponse.json({ error: "page requise" }, { status: 400 });
  }

  const site = await getSiteContent();
  return NextResponse.json({ page, content: site[page as CmsPageId] });
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      page?: string;
      content?: unknown;
    };

    const auth = verifyAdminCredentials({
      email: body.email,
      password: body.password,
    });

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { page, content } = body;
    if (!page || !cmsPageIds.includes(page as CmsPageId)) {
      return NextResponse.json({ error: "Page invalide" }, { status: 400 });
    }

    if (content === undefined) {
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
    }

    const pageId = page as CmsPageId;
    await savePageContent(pageId, content);
    const site = await getSiteContent();
    return NextResponse.json({ success: true, page, content: site[pageId] });
  } catch (error) {
    console.error("admin/cms PUT error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    const status = message.includes("BLOB_READ_WRITE_TOKEN") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
