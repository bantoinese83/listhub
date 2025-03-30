import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getListings } from "@/lib/supabase/api"
import ListingGrid from "@/components/listing-grid"
import { constructMetadata } from "@/lib/metadata"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const supabase = createServerSupabaseClient()
  const { data: category } = await supabase.from("categories").select("*").eq("slug", params.slug).single()

  if (!category) {
    return constructMetadata({
      title: "Category Not Found",
      description: "The category you're looking for doesn't exist.",
      noIndex: true,
    })
  }

  return constructMetadata({
    title: `${category.name} | Categories`,
    description: category.description || `Browse ${category.name} listings on ListingHub`,
    pathname: `/categories/${params.slug}`,
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createServerSupabaseClient()

  // Get the category
  const { data: category, error } = await supabase.from("categories").select("*").eq("slug", params.slug).single()

  if (error || !category) {
    notFound()
  }

  // Get subcategories
  const { data: subcategories } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", category.id)
    .order("order", { ascending: true })
    .order("name", { ascending: true })

  // Get listings for this category (including all subcategories)
  let listings = []

  if (subcategories && subcategories.length > 0) {
    // If there are subcategories, get listings from all subcategories
    const subcategoryIds = subcategories.map((sub) => sub.id)

    // Get listings where category_id is in the subcategory ids
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        category:categories(*),
        user:profiles(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq("status", "active")
      .in("category_id", subcategoryIds)
      .order("created_at", { ascending: false })
      .limit(12)

    if (!error && data) {
      listings = data
    }
  } else {
    // If no subcategories, get listings directly from this category
    listings = await getListings({ category: category.id, limit: 12 })
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-foreground font-medium">{category.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
        </div>

        {subcategories && subcategories.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/categories/${params.slug}/${subcategory.slug}`}>
                      <h3 className="font-medium">{subcategory.name}</h3>
                      {subcategory.description && (
                        <p className="text-sm text-muted-foreground mt-1">{subcategory.description}</p>
                      )}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Listings</h2>
            <Button asChild variant="outline">
              <Link href={`/browse?category=${category.id}`}>View All</Link>
            </Button>
          </div>

          <ListingGrid listings={listings.listings} />
        </div>
      </div>
    </div>
  )
}

