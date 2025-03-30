import type { Metadata } from "next"
import { getCategoriesHierarchical } from "@/lib/supabase/api"
import CategoryGridHierarchical from "@/components/category-grid-hierarchical"

export const metadata: Metadata = {
  title: "Categories | ListingHub",
  description: "Browse all categories on ListingHub",
}

export default async function CategoriesPage() {
  const serverCategories = await getCategoriesHierarchical()
  
  // Transform the server categories to match the client component's expected format
  const clientCategories = serverCategories.map(category => ({
    ...category,
    subcategories: category.children || []
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

