'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addFavorite, removeFavorite, isFavorite } from '@/lib/supabase/client-api'
import { useToast } from '@/components/ui/use-toast'

interface FavoriteButtonProps {
  listingId: string
  userId: string
  className?: string
}

export function FavoriteButton({ listingId, userId, className }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function checkFavoriteStatus() {
      const status = await isFavorite(userId, listingId)
      setIsFavorited(status)
    }
    checkFavoriteStatus()
  }, [userId, listingId])

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add favorites',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      if (isFavorited) {
        const success = await removeFavorite(userId, listingId)
        if (success) {
          setIsFavorited(false)
          toast({
            title: 'Removed from favorites',
            description: 'The listing has been removed from your favorites',
          })
        }
      } else {
        const success = await addFavorite(userId, listingId)
        if (success) {
          setIsFavorited(true)
          toast({
            title: 'Added to favorites',
            description: 'The listing has been added to your favorites',
          })
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>
  )
} 