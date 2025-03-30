import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sendListingApprovalNotification, sendListingRejectionNotification } from "./notification-service"
import { doesListingRequireReview } from "./verification-service"

// Prohibited keywords for basic content filtering
const PROHIBITED_KEYWORDS = [
  "scam",
  "illegal",
  "fake",
  "counterfeit",
  "replica",
  "knockoff",
  "stolen",
  "fraud",
  "pyramid scheme",
  "mlm",
  "multi-level marketing",
  "prescription",
  "narcotic",
  "weapon",
  "gun",
  "firearm",
]

// Listing verification status
export enum ListingVerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Submit a listing for verification
export async function submitListingForVerification(
  listingId: string,
  userId: string,
  title: string,
  description: string,
  category: string,
  price: number | null,
) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user needs review for listings
    const requiresReview = await doesListingRequireReview(userId)

    // Perform basic content screening
    const contentScreeningResult = performBasicContentScreening(title, description)

    // If content screening fails, mark as rejected immediately
    if (!contentScreeningResult.passed) {
      await supabase.from("listing_verifications").insert({
        listing_id: listingId,
        status: ListingVerificationStatus.REJECTED,
        reviewer_notes: `Automatic rejection: ${contentScreeningResult.reason}`,
        automated_review: true,
      })

      // Update listing status to rejected
      await supabase
        .from("listings")
        .update({
          status: "rejected",
        })
        .eq("id", listingId)

      // Get user email for notification
      const { data: user } = await supabase.from("profiles").select("email").eq("id", userId).single()

      if (user?.email) {
        await sendListingRejectionNotification(user.email, title, contentScreeningResult.reason)
      }

      return {
        success: false,
        status: ListingVerificationStatus.REJECTED,
        message: contentScreeningResult.reason,
      }
    }

    // If user doesn't require review and content screening passed, auto-approve
    if (!requiresReview) {
      await supabase.from("listing_verifications").insert({
        listing_id: listingId,
        status: ListingVerificationStatus.APPROVED,
        reviewer_notes: "Auto-approved for trusted user",
        automated_review: true,
      })

      return {
        success: true,
        status: ListingVerificationStatus.APPROVED,
        message: "Listing approved automatically",
      }
    }

    // Otherwise, create pending verification record
    await supabase.from("listing_verifications").insert({
      listing_id: listingId,
      status: ListingVerificationStatus.PENDING,
      automated_review: false,
    })

    return {
      success: true,
      status: ListingVerificationStatus.PENDING,
      message: "Listing submitted for review",
    }
  } catch (error) {
    console.error("Error submitting listing for verification:", error)
    return {
      success: false,
      error: "Failed to submit listing for verification",
      status: ListingVerificationStatus.PENDING,
    }
  }
}

// Perform basic content screening
function performBasicContentScreening(title: string, description: string) {
  // Convert to lowercase for case-insensitive matching
  const lowerTitle = title.toLowerCase()
  const lowerDescription = description.toLowerCase()

  // Check for prohibited keywords
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (lowerTitle.includes(keyword) || lowerDescription.includes(keyword)) {
      return {
        passed: false,
        reason: `Listing contains prohibited content: "${keyword}"`,
      }
    }
  }

  // Check minimum description length
  if (description.length < 20) {
    return {
      passed: false,
      reason: "Description is too short. Please provide more details.",
    }
  }

  // Check for excessive capitalization in title (potential spam)
  const uppercaseCount = (title.match(/[A-Z]/g) || []).length
  if (title.length > 0 && uppercaseCount / title.length > 0.5) {
    return {
      passed: false,
      reason: "Title contains excessive capitalization. Please use normal capitalization.",
    }
  }

  return { passed: true }
}

// Approve a listing (admin function)
export async function approveListing(listingId: string, reviewerId: string, notes = "") {
  try {
    const supabase = createServerSupabaseClient()

    // Update verification record
    await supabase
      .from("listing_verifications")
      .update({
        status: ListingVerificationStatus.APPROVED,
        reviewer_id: reviewerId,
        reviewer_notes: notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("listing_id", listingId)

    // Update listing status
    await supabase
      .from("listings")
      .update({
        status: "active",
      })
      .eq("id", listingId)

    // Get listing and user info for notification
    const { data: listing } = await supabase
      .from("listings")
      .select(`
        title,
        user_id,
        profiles:user_id (
          email
        )
      `)
      .eq("id", listingId)
      .single()

    if (listing?.profiles?.email) {
      await sendListingApprovalNotification(listing.profiles.email, listing.title)
    }

    return { success: true }
  } catch (error) {
    console.error("Error approving listing:", error)
    return { success: false, error: "Failed to approve listing" }
  }
}

// Reject a listing (admin function)
export async function rejectListing(listingId: string, reviewerId: string, reason: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Update verification record
    await supabase
      .from("listing_verifications")
      .update({
        status: ListingVerificationStatus.REJECTED,
        reviewer_id: reviewerId,
        reviewer_notes: reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq("listing_id", listingId)

    // Update listing status
    await supabase
      .from("listings")
      .update({
        status: "rejected",
      })
      .eq("id", listingId)

    // Get listing and user info for notification
    const { data: listing } = await supabase
      .from("listings")
      .select(`
        title,
        user_id,
        profiles:user_id (
          email
        )
      `)
      .eq("id", listingId)
      .single()

    if (listing?.profiles?.email) {
      await sendListingRejectionNotification(listing.profiles.email, listing.title, reason)
    }

    return { success: true }
  } catch (error) {
    console.error("Error rejecting listing:", error)
    return { success: false, error: "Failed to reject listing" }
  }
}

// Get listing verification status
export async function getListingVerificationStatus(listingId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("listing_verifications")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No verification record found
        return {
          success: true,
          status: null,
          message: "No verification record found",
        }
      }
      throw error
    }

    return {
      success: true,
      status: data.status,
      reviewerNotes: data.reviewer_notes,
      reviewedAt: data.reviewed_at,
      automatedReview: data.automated_review,
    }
  } catch (error) {
    console.error("Error getting listing verification status:", error)
    return {
      success: false,
      error: "Failed to get listing verification status",
      status: null,
    }
  }
}

