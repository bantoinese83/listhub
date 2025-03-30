'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ReviewDialog } from '@/components/review-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Review {
  id: string
  reviewer_id: string
  reviewed_id: string
  listing_id: string
  rating: number
  content: string
  created_at: string
  reviewer: {
    id: string
    full_name: string
    avatar_url: string
  }
}

interface ReviewListProps {
  listingId: string
  reviewedId: string
  initialReviews: Review[]
  userId?: string
}

export function ReviewList({ listingId, reviewedId, initialReviews, userId }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews)

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-5 w-5 ${
                value <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Review Button */}
      {userId && userId !== reviewedId && (
        <ReviewDialog
          trigger={
            <Button>
              Write a Review
            </Button>
          }
          listingId={listingId}
          reviewedId={reviewedId}
        />
      )}

      {/* Reviews List */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id}>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={review.reviewer.avatar_url || '/placeholder.svg'}
                      alt={review.reviewer.full_name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{review.reviewer.full_name}</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`h-4 w-4 ${
                            value <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                    {review.content}
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 