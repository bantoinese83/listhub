'use client'

import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { useSession } from "@/lib/hooks/use-session"

interface ListingCardProps {
  listing: ListingWithDetails
}

export function ListingCard({ listing }: ListingCardProps) {
  const { session } = useSession()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <Link href={`/listings/${listing.id}`}>
          <Image
            src={listing.images[0]?.url || "/placeholder.svg?height=200&width=300"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </Link>
        <div className="absolute top-2 right-2 flex gap-2">
          {listing.is_featured && <Badge>Featured</Badge>}
          {session?.user && (
            <FavoriteButton
              listingId={listing.id}
              userId={session.user.id}
              className="bg-white/90 hover:bg-white"
            />
          )}
        </div>
      </div>
      <Link href={`/listings/${listing.id}`}>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
          <p className="text-primary font-medium mt-1">
            {listing.price ? `$${listing.price.toFixed(2)}` : "Price not specified"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">{listing.category.name}</Badge>
            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {listing.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{listing.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{listing.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
          <span>{listing.location.name}</span>
          <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
        </CardFooter>
      </Link>
    </Card>
  )
} 