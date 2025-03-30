import type { Metadata } from "next"
import { getCategoriesHierarchical, getCategoryCounts } from "@/lib/supabase/api"
import CategoryGridHierarchical from "@/components/category-grid-hierarchical"

export const metadata: Metadata = {
  title: "Categories | ListingHub",
  description: "Browse all categories on ListingHub",
}

export default async function CategoriesPage() {
  const [serverCategories, categoryCounts] = await Promise.all([
    getCategoriesHierarchical(),
    getCategoryCounts()
  ])
  
  // Transform the server categories to match the client component's expected format
  const clientCategories = serverCategories.map(category => ({
    ...category,
    subcategories: category.children || [],
    listingCount: categoryCounts[category.id] || 0
  }))

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse listings by category to find exactly what you're looking for
          </p>
        </div>

        <CategoryGridHierarchical initialCategories={clientCategories} />
      </div>
    </div>
  )
}

