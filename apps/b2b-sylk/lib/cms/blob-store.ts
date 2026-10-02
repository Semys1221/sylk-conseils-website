import { head, put } from "@vercel/blob";
import type { SiteContent } from "@/lib/cms/schema";

export const CMS_BLOB_PATH = "cms/site-content.json";

export async function readCmsBlobOverrides(): Promise<Partial<SiteContent> | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return null;
  }

  try {
    const meta = await head(CMS_BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Partial<SiteContent>;
  } catch {
    return null;
  }
}

export async function writeCmsBlobOverrides(content: Partial<SiteContent>): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await put(CMS_BLOB_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
