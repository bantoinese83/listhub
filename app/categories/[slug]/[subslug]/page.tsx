import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getListings } from "@/lib/supabase/api"
import ListingGrid from "@/components/listing-grid"
import FilterSidebar from "@/components/filter-sidebar"
import { constructMetadata } from "@/lib/metadata"

interface SubcategoryPageProps {
  params: {
    slug: string
    subslug: string
  }
  searchParams: {
    minPrice?: string
    maxPrice?: string
    sort?: string
    location?: string
  }
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const supabase = await createServerSupabaseClient()

  // Get the parent category
  const { data: parentCategory } = await supabase.from("categories").select("*").eq("slug", params.slug).single()

  if (!parentCategory) {
    return constructMetadata({
      title: "Category Not Found",
      description: "The category you're looking for doesn't exist.",
      noIndex: true,
      pathname: `/categories/${params.slug}/${params.subslug}`,
    })
  }

  // Get the subcategory
  const { data: subcategory } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.subslug)
    .eq("parent_id", parentCategory.id)
    .single()

  if (!subcategory) {
    return constructMetadata({
      title: "Subcategory Not Found",
      description: "The subcategory you're looking for doesn't exist.",
      noIndex: true,
      pathname: `/categories/${params.slug}/${params.subslug}`,
    })
  }

  return constructMetadata({
    title: `${subcategory.name} | ${parentCategory.name}`,
    description:
      subcategory.description || `Browse ${subcategory.name} listings in ${parentCategory.name} on ListingHub`,
    pathname: `/categories/${params.slug}/${params.subslug}`,
  })
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const supabase = await createServerSupabaseClient()

  // Get the parent category
  const { data: parentCategory, error: parentError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (parentError || !parentCategory) {
    notFound()
  }

  // Get the subcategory
  const { data: subcategory, error: subError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.subslug)
    .eq("parent_id", parentCategory.id)
    .single()

  if (subError || !subcategory) {
    notFound()
  }

  // Get listings for this subcategory
  const listings = await getListings({
    category: subcategory.id,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    location: searchParams.location,
  })

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
              <li>
                <Link href={`/categories/${params.slug}`} className="hover:text-foreground">
                  {parentCategory.name}
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-foreground font-medium">{subcategory.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
          {subcategory.description && <p className="text-muted-foreground mt-2">{subcategory.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <FilterSidebar searchParams={searchParams} />
          </div>

          <div className="md:col-span-3">
            <ListingGrid listings={listings.listings} />

            {listings.listings.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No listings found</h3>
                <p className="text-muted-foreground mt-2">Be the first to post in this category!</p>
                <Button asChild className="mt-4">
                  <Link href="/listings/new">Post a Listing</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

