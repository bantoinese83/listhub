import { ListingCard } from "@/components/listing-card"
import type { ListingWithDetails } from "@/lib/supabase/schema"

interface ListingGridProps {
  listings: ListingWithDetails[]
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No listings found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

