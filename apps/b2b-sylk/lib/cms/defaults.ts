import siteContentJson from "@/content/cms/site-content.json";
import { parseSiteContent, type SiteContent } from "@/lib/cms/schema";

/** Committed French copy — fallback when Blob is empty or unavailable. */
export function getDefaultSiteContent(): SiteContent {
  return parseSiteContent(siteContentJson);
}
