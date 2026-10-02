import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || "https://tenant1.stephane-conseils.fr";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/onboarding/", "/reunion/", "/salle-de-vente/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
