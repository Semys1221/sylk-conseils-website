import { NextRequest, NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms/get-content";
import { cmsPageIds, type CmsPageId } from "@/lib/cms/schema";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page");

  if (page) {
    if (!cmsPageIds.includes(page as CmsPageId)) {
      return NextResponse.json({ error: "Page inconnue" }, { status: 400 });
    }
    const site = await getSiteContent();
    return NextResponse.json({ page, content: site[page as CmsPageId] });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}
