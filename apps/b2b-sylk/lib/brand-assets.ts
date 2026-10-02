/** Public SYLK Vercel Blob store (`b2b-sylk-cms-assets`). */
export const SYLK_BLOB_ORIGIN =
  "https://9xk9ufsvv7crsreb.public.blob.vercel-storage.com" as const;

export const FUNNEL_LOGO_URL =
  `${SYLK_BLOB_ORIGIN}/cms/assets/brand/funnel-logo-circle.webp` as const;

export const FUNNEL_VIDEO_URL =
  `${SYLK_BLOB_ORIGIN}/cms/assets/funnel/video-cgp.mp4` as const;

/** Favicon / apple-touch (same mark as funnel logo). */
export const BRAND_ICON_URL = FUNNEL_LOGO_URL;
