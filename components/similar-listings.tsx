"use client"

import { useEffect, useState } from "react"
import { ListingCard } from "@/components/listing-card"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

interface SimilarListingsProps {
  currentListing: ListingWithDetails
  limit?: number
}

export function SimilarListings({ currentListing, limit = 4 }: SimilarListingsProps) {
  const [similarListings, setSimilarListings] = useState<ListingWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchSimilarListings() {
      try {
        // Get listings from the same category with similar or lower price
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            category:categories(*),
            location:locations(*),
            images:listing_images(*),
            user:profiles(*)
          `)
          .eq('category_id', currentListing.category_id)
          .neq('id', currentListing.id)
          .lte('price', currentListing.price ? currentListing.price * 1.2 : 0) // 20% higher than current price
          .gte('price', currentListing.price ? currentListing.price * 0.8 : 0) // 20% lower than current price
          .order('price', { ascending: true })
          .limit(limit)

        if (error) throw error

        setSimilarListings(data || [])
      } catch (error) {
        console.error('Error fetching similar listings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarListings()
  }, [currentListing.id, currentListing.category_id, currentListing.price, limit, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (similarListings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Similar Listings</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {similarListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
} 