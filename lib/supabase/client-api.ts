import { supabase } from './client'
import type { ListingWithDetails } from './schema'

export async function getFavorites(userId: string) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        listing:listings!favorites_listing_id_fkey(
          *,
          category:categories!listings_category_id_fkey(*),
          subcategory:categories!listings_subcategory_id_fkey(*),
          user:profiles!listings_user_id_fkey(*),
          location:locations(*),
          images:listing_images(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return []
    }

    return data.map((favorite: { listing: ListingWithDetails }) => favorite.listing)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
}

export async function addFavorite(userId: string, listingId: string) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return false
  }

  try {
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        listing_id: listingId,
      })

    if (error) {
      console.error('Error adding favorite:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error adding favorite:', error)
    return false
  }
}

export async function removeFavorite(userId: string, listingId: string) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return false
  }

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId)

    if (error) {
      console.error('Error removing favorite:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error removing favorite:', error)
    return false
  }
}

export async function isFavorite(userId: string, listingId: string) {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return false
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .single()

    if (error) {
      console.error('Error checking favorite:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking favorite:', error)
    return false
  }
}

export async function getCategoryCounts() {
  if (!supabase) {
    console.error('Supabase client is not initialized')
    return {}
  }

  try {
    const { data: listings, error } = await supabase
      .from("listings")
      .select("category_id")
      .eq("status", "active")

    if (error) throw error

    // Count listings per category
    const counts: Record<string, number> = {}
    listings?.forEach(listing => {
      counts[listing.category_id] = (counts[listing.category_id] || 0) + 1
    })

    return counts
  } catch (error) {
    console.error("Error fetching category counts:", error)
    return {}
  }
} 