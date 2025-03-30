import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ListingWithDetails } from '@/lib/supabase/schema'
import type { ListingSearchParams } from '@/lib/hooks/use-search-params'

interface GetListingsResponse {
  listings: ListingWithDetails[]
  total: number
}

export class ListingService {
  private static async getClient() {
    return await createServerSupabaseClient()
  }

  static async getListings(params: ListingSearchParams, page = 1, limit = 12): Promise<GetListingsResponse> {
    const supabase = await this.getClient()
    const offset = (page - 1) * limit

    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        subcategory:categories!listings_subcategory_id_fkey(*),
        user:profiles!user_id(*),
        location:locations(*),
        images:listing_images(*)
      `, { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (params.category) {
      query = query.eq('category_id', params.category)
    }
    if (params.q) {
      query = query.ilike('title', `%${params.q}%`)
    }
    if (params.tag) {
      query = query.contains('tags', [params.tag])
    }
    if (params.minPrice) {
      query = query.gte('price', parseFloat(params.minPrice))
    }
    if (params.maxPrice) {
      query = query.lte('price', parseFloat(params.maxPrice))
    }
    if (params.location) {
      query = query.eq('location_id', params.location)
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching listings:', error)
      return { listings: [], total: 0 }
    }

    return {
      listings: data as ListingWithDetails[],
      total: count || 0,
    }
  }

  static async getListingById(id: string): Promise<ListingWithDetails | null> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        subcategory:categories!listings_subcategory_id_fkey(*),
        user:profiles!listings_user_id_fkey(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching listing:', error)
      return null
    }

    return data as ListingWithDetails
  }
} 