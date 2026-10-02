import { CMS_MEDIA_FALLBACKS, resolveMediaUrl } from "@/lib/cms/media-fallbacks";
import type { HomeMediaContent } from "@/lib/cms/schema";

export type ResolvedHomeMedia = {
  [K in keyof typeof CMS_MEDIA_FALLBACKS]: string;
};

export function resolveHomeMedia(media: HomeMediaContent): ResolvedHomeMedia {
  return {
    heroPortraitUrl: resolveMediaUrl(media.heroPortraitUrl, "heroPortraitUrl"),
    expertiseBannerImageUrl: resolveMediaUrl(
      media.expertiseBannerImageUrl,
      "expertiseBannerImageUrl",
    ),
    funnelVideoUrl: resolveMediaUrl(media.funnelVideoUrl, "funnelVideoUrl"),
    funnelVideoPosterUrl: resolveMediaUrl(media.funnelVideoPosterUrl, "funnelVideoPosterUrl"),
    funnelLogoUrl: resolveMediaUrl(media.funnelLogoUrl, "funnelLogoUrl"),
  };
}
