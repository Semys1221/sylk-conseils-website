import { getDefaultSiteContent } from "@/lib/cms/defaults";
import { readCmsBlobOverrides } from "@/lib/cms/blob-store";
import { deepMerge } from "@/lib/cms/merge";
import {
  siteContentSchema,
  type CmsPageId,
  type HomePageContent,
  type LeCabinetPageContent,
  type ExpertisesPageContent,
  type SiteContent,
  type TunnelPageContent,
} from "@/lib/cms/schema";

let cachedMerged: SiteContent | null = null;
let cachedAt = 0;
const CACHE_MS = 30_000;

async function loadMergedSiteContent(): Promise<SiteContent> {
  const now = Date.now();
  if (cachedMerged && now - cachedAt < CACHE_MS) {
    return cachedMerged;
  }

  const defaults = getDefaultSiteContent();
  const overrides = await readCmsBlobOverrides();
  const mergedRaw = overrides
    ? deepMerge(defaults, overrides as Partial<SiteContent>)
    : defaults;
  const parsed = siteContentSchema.safeParse(mergedRaw);
  const merged = parsed.success ? parsed.data : defaults;

  cachedMerged = merged;
  cachedAt = now;
  return merged;
}

export function invalidateCmsCache(): void {
  cachedMerged = null;
  cachedAt = 0;
}

export async function getSiteContent(): Promise<SiteContent> {
  return loadMergedSiteContent();
}

export async function getPageContent(pageId: "home"): Promise<HomePageContent>;
export async function getPageContent(pageId: "tunnel"): Promise<TunnelPageContent>;
export async function getPageContent(pageId: "leCabinet"): Promise<LeCabinetPageContent>;
export async function getPageContent(pageId: "expertises"): Promise<ExpertisesPageContent>;
export async function getPageContent(pageId: CmsPageId) {
  const site = await loadMergedSiteContent();
  return site[pageId];
}
