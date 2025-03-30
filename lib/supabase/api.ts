import { createServerSupabaseClient } from './server'
import type { Database } from './schema'
import type { ListingWithDetails, Category, Location } from "./schema"

type CategoryWithChildren = Category & {
  children: CategoryWithChildren[]
}

/**
 * Fetch all categories from the database
 */
export async function getCategories() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

/**
 * Fetch categories in a hierarchical structure
 */
export async function getCategoriesHierarchical(): Promise<CategoryWithChildren[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Organize into parent-child hierarchy
  const topLevelCategories = data.filter((cat) => !cat.parent_id)
  const result = topLevelCategories.map((parent) => {
    const subcategories = data.filter((cat) => cat.parent_id === parent.id)
    return {
      ...parent,
      children: subcategories,
    }
  })

  return result
}

/**
 * Fetch subcategories for a parent category
 */
export async function getSubcategories(parentId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", parentId)
      .order("order", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching subcategories:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return []
  }
}

/**
 * Fetch all locations from the database
 */
export async function getLocations() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching locations:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return []
  }
}

/**
 * Fetch a listing by ID with all related data
 */
export async function getListingById(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        subcategory:categories!listings_subcategory_id_fkey(*),
        user:profiles!listings_user_id_fkey(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching listing:", error)
      return null
    }

    // Update view count
    await supabase
      .from("listings")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id)

    return data as ListingWithDetails
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return null
  }
}

export interface ListingsResponse {
  listings: ListingWithDetails[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export async function getListings({
  category,
  location,
  minPrice,
  maxPrice,
  sort = "newest",
  query,
  limit = 12,
  page = 1,
  featured = false,
  tag,
}: {
  category?: string
  location?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  query?: string
  limit?: number
  page?: number
  featured?: boolean
  tag?: string
}): Promise<ListingsResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    let queryBuilder = supabase
      .from("listings")
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        subcategory:categories!listings_subcategory_id_fkey(*),
        user:profiles!listings_user_id_fkey(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq("status", "active")

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      queryBuilder = queryBuilder.eq("category_id", category)
    }

    if (location) {
      queryBuilder = queryBuilder.eq("location_id", location)
    }

    if (minPrice) {
      queryBuilder = queryBuilder.gte("price", Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.lte("price", Number.parseFloat(maxPrice))
    }

    if (featured) {
      queryBuilder = queryBuilder.eq("is_featured", true)
    }

    // Filter by tag if provided
    if (tag) {
      queryBuilder = queryBuilder.contains("tags", [tag])
    }

    // Apply sorting
    if (sort === "price-asc") {
      queryBuilder = queryBuilder.order("price", { ascending: true })
    } else if (sort === "price-desc") {
      queryBuilder = queryBuilder.order("price", { ascending: false })
    } else {
      // Default sort by newest
      queryBuilder = queryBuilder.order("created_at", { ascending: false })
    }

    // Apply pagination
    const start = (page - 1) * limit
    queryBuilder = queryBuilder.range(start, start + limit - 1)

    const { data, error, count } = await queryBuilder

    if (error) {
      console.error("Error fetching listings:", error)
      return { listings: [], total: 0, page, totalPages: 0, limit }
    }

    return {
      listings: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      limit
    }
  } catch (error) {
    console.error("Error fetching listings:", error)
    return { listings: [], total: 0, page, totalPages: 0, limit }
  }
}

/**
 * Fetch listings by user ID with optional filters
 */
export async function getUserListings(
  userId: string,
  options?: {
    limit?: number
    status?: string
    sort?: string
    search?: string
  },
) {
  try {
    const supabase = await createServerSupabaseClient()
    let query = supabase
      .from("listings")
      .select(`
        *,
        category:categories!listings_category_id_fkey(*),
        user:profiles!listings_user_id_fkey(*),
        location:locations(*),
        images:listing_images(*)
      `)
      .eq("user_id", userId)

    // Apply status filter if provided
    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status)
    }

    // Apply search filter if provided
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    // Apply sorting
    if (options?.sort) {
      switch (options.sort) {
        case "oldest":
          query = query.order("created_at", { ascending: true })
          break
        case "price-high":
          query = query.order("price", { ascending: false })
          break
        case "price-low":
          query = query.order("price", { ascending: true })
          break
        case "views":
          query = query.order("views", { ascending: false })
          break
        default:
          query = query.order("created_at", { ascending: false })
      }
    } else {
      // Default sort by newest
      query = query.order("created_at", { ascending: false })
    }

    // Apply limit if specified
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching user listings:", error)
      return []
    }

    return data as ListingWithDetails[]
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return []
  }
}

/**
 * Get site statistics
 */
export async function getSiteStats() {
  try {
    const supabase = await createServerSupabaseClient()
    // Get total active listings
    const { count: listingsCount, error: listingsError } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total users
    const { count: usersCount, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    // Get total locations
    const { count: locationsCount, error: locationsError } = await supabase
      .from("locations")
      .select("*", { count: "exact", head: true })

    if (listingsError || usersError || locationsError) {
      console.error("Error fetching stats:", { listingsError, usersError, locationsError })
    }

    return {
      listings: listingsCount || 0,
      users: usersCount || 0,
      locations: locationsCount || 0,
      messages: Math.floor((usersCount || 0) * 4.2), // An estimate based on users
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return {
      listings: 0,
      users: 0,
      locations: 0,
      messages: 0,
    }
  }
}

export async function getFavorites(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
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
  try {
    const supabase = await createServerSupabaseClient()
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
  try {
    const supabase = await createServerSupabaseClient()
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
  try {
    const supabase = await createServerSupabaseClient()
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

// Messaging functions
export async function sendMessage(senderId: string, recipientId: string, listingId: string, content: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        listing_id: listingId,
        content,
      })

    if (error) {
      console.error('Error sending message:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending message:', error)
    return false
  }
}

export async function getMessages(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*),
        recipient:profiles(*),
        listing:listings(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

// Reporting functions
export async function createReport(reporterId: string, reportedId: string, listingId: string, reason: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: reporterId,
        reported_id: reportedId,
        listing_id: listingId,
        reason,
      })

    if (error) {
      console.error('Error creating report:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating report:', error)
    return false
  }
}

export async function getReports(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles(*),
        reported:profiles(*),
        listing:listings(*)
      `)
      .eq('reported_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

// Review functions
export async function createReview(reviewerId: string, reviewedId: string, listingId: string, rating: number, content?: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('reviews')
      .insert({
        reviewer_id: reviewerId,
        reviewed_id: reviewedId,
        listing_id: listingId,
        rating,
        content,
      })

    if (error) {
      console.error('Error creating review:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating review:', error)
    return false
  }
}

export async function getListingReviews(listingId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles(*),
        reviewed:profiles(*)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

// Analytics functions
export async function trackEvent(listingId: string, userId: string, eventType: 'view' | 'message' | 'favorite' | 'share') {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('analytics')
      .insert({
        listing_id: listingId,
        user_id: userId,
        event_type: eventType,
      })

    if (error) {
      console.error('Error tracking event:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error tracking event:', error)
    return false
  }
}

export async function getListingAnalytics(listingId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('listing_id', listingId)

    if (error) {
      console.error('Error fetching analytics:', error)
      return null
    }

    const analytics = {
      views: data.filter(event => event.event_type === 'view').length,
      messages: data.filter(event => event.event_type === 'message').length,
      favorites: data.filter(event => event.event_type === 'favorite').length,
      shares: data.filter(event => event.event_type === 'share').length
    }

    return analytics
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return null
  }
}

export async function getUserAnalytics(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('analytics')
      .select(`
        *,
        listing:listings!analytics_listing_id_fkey(
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
      console.error('Error fetching user analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching user analytics:', error)
    return []
  }
}

/**
 * Get the count of active listings for each category
 */
export async function getCategoryCounts() {
  try {
    const supabase = await createServerSupabaseClient()
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

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // First try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      // Profile doesn't exist, create one
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData.user) {
        console.error('Error fetching user data:', userError)
        return null
      }

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.user.user_metadata?.full_name || 'Anonymous User',
          avatar_url: userData.user.user_metadata?.avatar_url || null,
          role: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return null
      }

      return newProfile
    }

    if (fetchError) {
      console.error('Error fetching profile:', fetchError)
      return null
    }

    return existingProfile
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

