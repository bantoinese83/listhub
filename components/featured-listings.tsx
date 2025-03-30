import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import type { ListingsResponse } from "@/lib/supabase/api"

interface FeaturedListingsProps {
  listings: ListingsResponse
}

export default function FeaturedListings({ listings }: FeaturedListingsProps) {
  if (!listings?.listings || listings.listings.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No featured listings available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      {listings.listings.map((listing) => (
        <Link key={listing.id} href={`/listings/${listing.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={listing.images?.[0]?.url || "/placeholder.svg?height=200&width=300"}
                alt={`${listing.title} - ${listing.description.substring(0, 50)}...`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={80}
              />
              {listing.is_featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
              <p className="text-primary font-medium mt-1">
                {listing.price ? `$${listing.price.toFixed(2)}` : "Price not specified"}
              </p>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{listing.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
              <span>{listing.location?.name || "Location not specified"}</span>
              <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </>
  )
}

