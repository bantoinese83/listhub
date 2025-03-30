import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://listhub.com"

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/categories/*",
        "/listings/*",
        "/help/*",
        "/contact",
        "/feedback",
        "/report",
        "/terms",
        "/privacy",
        "/cookies",
      ],
      disallow: [
        "/api/*",
        "/admin/*",
        "/dashboard/*",
        "/settings/*",
        "/messages/*",
        "/notifications/*",
        "/auth/*",
        "/_next/*",
        "/static/*",
        "/images/*",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

