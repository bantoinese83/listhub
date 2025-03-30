'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { BecomeAgentButton } from "@/components/become-agent-button"
import { ManageAgents } from "@/components/manage-agents"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { useSession } from "@/lib/hooks/use-session"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, MapPin, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ListingCardProps {
  listing: ListingWithDetails
  onFavoriteToggle?: (listingId: string) => void
}

export function ListingCard({ listing, onFavoriteToggle }: ListingCardProps) {
  const { session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isOwner = session?.user?.id === listing.user_id

  const handleClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return
    }
    setIsLoading(true)
    router.push(`/listings/${listing.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Image
              src={listing.images[0]?.url || "/placeholder.svg?height=200&width=300"}
              alt={listing.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              quality={80}
            />
            <div className="absolute top-2 right-2 z-10">
              {session?.user && (
                <FavoriteButton
                  listingId={listing.id}
                  userId={session.user.id}
                  className="bg-white/90 hover:bg-white"
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
            <p className="text-2xl font-bold text-primary">
              ${listing.price ? listing.price.toFixed(2) : "Price not specified"}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{listing.location.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/listings/${listing.id}`}>View Details</Link>
          </Button>
          
          {session?.user && (
            <>
              {isOwner ? (
                <ManageAgents
                  listingId={listing.id}
                  ownerId={listing.user_id}
                />
              ) : (
                <BecomeAgentButton
                  listingId={listing.id}
                  ownerId={listing.user_id}
                  isOwner={isOwner}
                />
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
} 