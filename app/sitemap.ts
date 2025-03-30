import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"
import { getCategories, getListings } from "@/lib/supabase/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all categories
  const categories = await getCategories()

  // Get all listings (limit to recent ones for performance)
  const listings = await getListings({ limit: 100 })

  // Static routes
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]

  // Category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Listing routes
  const listingRoutes = listings.map((listing) => ({
    url: `${SITE_URL}/listings/${listing.id}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...routes, ...categoryRoutes, ...listingRoutes]
}

