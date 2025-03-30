"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MAX_IMAGES_PER_LISTING } from "@/lib/constants"

interface CreateListingData {
  title: string
  description: string
  price: number | null
  category_id: string
  location_id: string
  contact_info: string
  user_id: string
}

export async function createListing(data: CreateListingData) {
  try {
    const supabase = createServerSupabaseClient()

    // Verify user is authenticated
    const { data: session } = await supabase.auth.getSession()
    if (!session.session || session.session.user.id !== data.user_id) {
      return { success: false, error: "Unauthorized" }
    }

    // Create the listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        user_id: data.user_id,
        location_id: data.location_id,
        contact_info: data.contact_info,
        status: "active",
      })
      .select()
      .single()

    if (listingError) {
      return { success: false, error: listingError.message }
    }

    // Revalidate the listings page
    revalidatePath("/browse")
    revalidatePath(`/listings/${listing.id}`)
    revalidatePath(`/dashboard/listings`)

    return {
      success: true,
      listingId: listing.id,
      uploadUrl: `/api/upload?listingId=${listing.id}`,
      maxImages: MAX_IMAGES_PER_LISTING,
    }
  } catch (error: any) {
    console.error("Error creating listing:", error)
    return { success: false, error: error.message || "Failed to create listing" }
  }
}

export async function updateListingStatus(listingId: string, status: "active" | "pending" | "sold" | "expired") {
  try {
    const supabase = createServerSupabaseClient()

    // Verify user is authenticated and owns the listing
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the listing to verify ownership
    const { data: listing } = await supabase.from("listings").select("user_id").eq("id", listingId).single()

    if (!listing || listing.user_id !== session.session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Update the listing status
    const { error } = await supabase.from("listings").update({ status }).eq("id", listingId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate the listing page
    revalidatePath(`/listings/${listingId}`)
    revalidatePath(`/dashboard/listings`)

    return { success: true }
  } catch (error: any) {
    console.error("Error updating listing status:", error)
    return { success: false, error: error.message || "Failed to update listing status" }
  }
}

export async function deleteListing(listingId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Verify user is authenticated and owns the listing
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the listing to verify ownership
    const { data: listing } = await supabase.from("listings").select("user_id").eq("id", listingId).single()

    if (!listing || listing.user_id !== session.session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Delete the listing images from storage
    const { data: images } = await supabase.from("listing_images").select("url").eq("listing_id", listingId)

    if (images && images.length > 0) {
      // Extract paths from URLs
      const paths = images.map((img) => {
        const url = new URL(img.url)
        return url.pathname.replace("/storage/v1/object/public/listing-images/", "")
      })

      // Delete images from storage
      await supabase.storage.from("listing-images").remove(paths)
    }

    // Delete image records
    await supabase.from("listing_images").delete().eq("listing_id", listingId)

    // Delete the listing
    const { error } = await supabase.from("listings").delete().eq("id", listingId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate paths
    revalidatePath("/browse")
    revalidatePath("/dashboard/listings")

    // Redirect to dashboard
    redirect("/dashboard/listings")
  } catch (error: any) {
    console.error("Error deleting listing:", error)
    return { success: false, error: error.message || "Failed to delete listing" }
  }
}

