import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || "https://tenant1.stephane-conseils.fr";

  const routes = [
    "",
    "/expertises",
    "/expertises/fiscalite",
    "/expertises/patrimoine",
    "/expertises/transmission",
    "/expertises/retraite",
    "/le-cabinet",
    "/blog",
    "/mentions-legales",
    "/cgu",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/blog" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
