import { readCmsBlobOverrides, writeCmsBlobOverrides } from "@/lib/cms/blob-store";
import { invalidateCmsCache } from "@/lib/cms/get-content";
import { parsePageContent, type CmsPageId } from "@/lib/cms/schema";

export async function savePageContent(pageId: CmsPageId, data: unknown): Promise<void> {
  const page = parsePageContent(pageId, data);
  const overrides = (await readCmsBlobOverrides()) ?? {};
  await writeCmsBlobOverrides({ ...overrides, [pageId]: page });
  invalidateCmsCache();
}
