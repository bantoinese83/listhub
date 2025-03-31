// This file defines the database schema types for TypeScript

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      listings: {
        Row: Listing
        Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Listing, 'id' | 'created_at' | 'updated_at'>>
      }
      listing_details: {
        Row: ListingDetails
        Insert: Omit<ListingDetails, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ListingDetails, 'id' | 'created_at' | 'updated_at'>>
      }
      profiles: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      locations: {
        Row: Location
        Insert: Omit<Location, 'id'>
        Update: Partial<Omit<Location, 'id'>>
      }
      listing_images: {
        Row: ListingImage
        Insert: Omit<ListingImage, 'id'>
        Update: Partial<Omit<ListingImage, 'id'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id'>
        Update: Partial<Omit<Tag, 'id'>>
      }
    }
    Views: {
      listings_with_users: {
        Row: ListingWithDetails
        Insert: never
        Update: never
      }
    }
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parent_id: string | null
  image_url: string | null
  order: number
  created_at: string
  updated_at: string
}

export type Location = {
  id: string
  name: string
  state: string
  latitude: number
  longitude: number
}

export type User = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export type Listing = {
  id: string
  title: string
  description: string
  price: number | null
  category_id: string
  user_id: string
  location_id: string
  created_at: string
  updated_at: string
  status: "active" | "pending" | "sold" | "expired" | "rejected" | "flagged"
  views: number
  contact_info: string
  is_featured: boolean
  tags?: string[]
  subcategory_id?: string
  price_reduced?: boolean
  price_reduction_percentage?: number
  original_price?: number
}

export type ListingImage = {
  id: string
  listing_id: string
  url: string
  position: number
}

export type ListingDetails = {
  id: string
  listing_id: string
  created_at: string
  updated_at: string

  // Vehicle fields
  make?: string
  model?: string
  year?: number
  mileage?: number
  condition?: "new" | "like_new" | "good" | "fair" | "poor"
  transmission?: "automatic" | "manual" | "cvt" | "other"
  fuel_type?: "gasoline" | "diesel" | "electric" | "hybrid" | "other"
  color?: string
  vin?: string

  // Housing fields
  property_type?: "house" | "apartment" | "condo" | "townhouse" | "land" | "other"
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  furnished?: boolean
  available_date?: string
  lease_term?: "monthly" | "yearly" | "short_term"
  amenities?: string[]

  // Job fields
  employment_type?: "full_time" | "part_time" | "contract" | "temporary" | "internship"
  experience_level?: "entry" | "mid" | "senior" | "lead" | "executive"
  salary_range?: {
    min: number
    max: number
  }
  remote_work?: boolean
  required_skills?: string[]
  benefits?: string[]

  // Service fields
  service_type?: string
  availability?: {
    days: string[]
    hours: {
      start: string
      end: string
    }
  }
  service_area?: string[]
  pricing_type?: "fixed" | "hourly" | "custom"
  experience_years?: number
  certifications?: string[]
}

export type ListingWithDetails = Listing & {
  category: Category
  subcategory?: Category
  user: User
  location: Location
  images: ListingImage[]
  details?: ListingDetails
}

export type Tag = {
  id: string
  name: string
  slug: string
}

export type Subscription = {
  id: string
  user_id: string
  tier: "free" | "basic" | "pro" | "enterprise"
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_customer_id: string
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

