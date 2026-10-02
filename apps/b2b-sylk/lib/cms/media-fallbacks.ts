import { FUNNEL_LOGO_URL, FUNNEL_VIDEO_URL } from "@/lib/brand-assets";

/** Hardcoded fallbacks when CMS media URL is empty. */
export const CMS_MEDIA_FALLBACKS = {
  heroPortraitUrl:
    "https://9xk9ufsvv7crsreb.public.blob.vercel-storage.com/cms/assets/home/hero-portrait-4k.webp",
  expertiseBannerImageUrl:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  funnelVideoUrl: FUNNEL_VIDEO_URL,
  funnelVideoPosterUrl:
    "https://image.mux.com/601I74ydXCKONbHE02Sz00NPIYZJNk6usdBL00q77FwUkvw/thumbnail.jpg",
  funnelLogoUrl: FUNNEL_LOGO_URL,
} as const;

export type CmsMediaKey = keyof typeof CMS_MEDIA_FALLBACKS;

export function resolveMediaUrl(cmsUrl: string | undefined, key: CmsMediaKey): string {
  const trimmed = cmsUrl?.trim();
  return trimmed || CMS_MEDIA_FALLBACKS[key];
}
