import Link from "next/link"
import Image from "next/image"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface RelatedListingsProps {
  categoryId: string
  currentListingId: string
}

async function getRelatedListings(categoryId: string, currentListingId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        user:profiles!listings_user_id_fkey(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq("category_id", categoryId)
      .eq("status", "active")
      .neq("id", currentListingId)
      .order("created_at", { ascending: false })
      .limit(4)

    if (error) {
      console.error("Error fetching related listings:", error)
      return []
    }

    return data as ListingWithDetails[]
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return []
  }
}

export default async function RelatedListings({ categoryId, currentListingId }: RelatedListingsProps) {
  let listings: ListingWithDetails[] = []
  let supabaseError = false

  try {
    listings = await getRelatedListings(categoryId, currentListingId)
  } catch (error) {
    console.error("Error in RelatedListings:", error)
    supabaseError = true
  }

  if (supabaseError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
        <strong className="font-bold">Configuration Error: </strong>
        <span className="block sm:inline">
          Supabase is not properly configured. Please set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
          environment variables.
        </span>
      </div>
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No related listings found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listings/${listing.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={listing.images[0]?.url || "/placeholder.svg?height=200&width=300"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
              <p className="text-primary font-medium mt-1">
                {listing.price ? `$${listing.price.toFixed(2)}` : "Price not specified"}
              </p>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{listing.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">{listing.location.name}</CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

