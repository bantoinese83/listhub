import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { Badge } from "@/components/ui/badge"

interface UserListingsProps {
  listings: ListingWithDetails[]
}

export default function UserListings({ listings }: UserListingsProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't posted any listings yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listings/${listing.id}`}>
          <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={listing.images[0]?.url || "/placeholder.svg?height=64&width=64"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{listing.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{listing.category.name}</Badge>
                <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{listing.price ? `$${listing.price.toFixed(2)}` : "No price"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

