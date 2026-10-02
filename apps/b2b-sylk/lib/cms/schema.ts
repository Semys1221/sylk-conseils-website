import { z } from "zod";

const heroHomeSchema = z.object({
  imageLabel: z.string(),
  founderLine: z.string(),
  linkedinBadge: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(),
  subtitle: z.string(),
  ctaVideo: z.string(),
  ctaLinkedin: z.string(),
});

const statSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const homeMediaSchema = z.object({
  /** Portrait in the landing hero (left column). */
  heroPortraitUrl: z.string(),
  /** Background image on the expertise banner section. */
  expertiseBannerImageUrl: z.string(),
  /** Main video in the qualification funnel (welcome step). */
  funnelVideoUrl: z.string(),
  /** Poster/thumbnail while the funnel video loads. */
  funnelVideoPosterUrl: z.string(),
  /** Logo shown in the funnel overlay (top-left). */
  funnelLogoUrl: z.string(),
});

export const tunnelPageSchema = z.object({
  /** When set, overrides NEXT_PUBLIC_CALENDLY_URL for the funnel. */
  calendlyUrl: z.string(),
});

export const homePageSchema = z.object({
  hero: heroHomeSchema,
  media: homeMediaSchema,
  cabinetSection: z.object({
    label: z.string(),
    title: z.string(),
    paragraph1: z.string(),
    paragraph2: z.string(),
    cta: z.string(),
  }),
  stats: z.array(statSchema).length(4),
  expertiseBanner: z.object({
    title: z.string(),
    description: z.string(),
    cta: z.string(),
  }),
});

export const leCabinetPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  intro: z.string(),
  approach: z.object({
    title: z.string(),
    paragraph1: z.string(),
    paragraph2: z.string(),
  }),
  domains: z.object({
    title: z.string(),
    paragraph: z.string(),
  }),
  closingLine: z.string(),
});

export const expertisesPageSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  cardCta: z.string(),
  cards: z.array(
    z.object({
      slug: z.enum(["fiscalite", "patrimoine", "transmission", "retraite"]),
      title: z.string(),
      description: z.string(),
    }),
  ).length(4),
});

export const siteContentSchema = z.object({
  home: homePageSchema,
  tunnel: tunnelPageSchema,
  leCabinet: leCabinetPageSchema,
  expertises: expertisesPageSchema,
});

export type HomeMediaContent = z.infer<typeof homeMediaSchema>;
export type TunnelPageContent = z.infer<typeof tunnelPageSchema>;
export type HomePageContent = z.infer<typeof homePageSchema>;
export type LeCabinetPageContent = z.infer<typeof leCabinetPageSchema>;
export type ExpertisesPageContent = z.infer<typeof expertisesPageSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;

export const cmsPageIds = ["home", "tunnel", "leCabinet", "expertises"] as const;
export type CmsPageId = (typeof cmsPageIds)[number];

const pageSchemaById = {
  home: homePageSchema,
  tunnel: tunnelPageSchema,
  leCabinet: leCabinetPageSchema,
  expertises: expertisesPageSchema,
} as const;

export function parsePageContent<T extends CmsPageId>(
  pageId: T,
  data: unknown,
): z.infer<(typeof pageSchemaById)[T]> {
  return pageSchemaById[pageId].parse(data) as z.infer<(typeof pageSchemaById)[T]>;
}

export function parseSiteContent(data: unknown): SiteContent {
  return siteContentSchema.parse(data);
}
