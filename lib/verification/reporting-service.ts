import { createServerSupabaseClient } from "@/lib/supabase/server"

// Report reasons
export enum ReportReason {
  SCAM = "scam",
  PROHIBITED_ITEM = "prohibited_item",
  MISLEADING = "misleading",
  OFFENSIVE = "offensive",
  DUPLICATE = "duplicate",
  OTHER = "other",
}

// Report a listing
export async function reportListing(listingId: string, reporterId: string, reason: ReportReason, details: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Create report record
    const { error } = await supabase.from("listing_reports").insert({
      listing_id: listingId,
      reporter_id: reporterId,
      reason,
      details,
    })

    if (error) throw error

    // Check if this listing has multiple reports
    const { count } = await supabase
      .from("listing_reports")
      .select("*", { count: "exact", head: true })
      .eq("listing_id", listingId)

    // If listing has 3+ reports, flag it for review
    if (count && count >= 3) {
      await supabase
        .from("listings")
        .update({
          status: "flagged",
        })
        .eq("id", listingId)
    }

    return { success: true }
  } catch (error) {
    console.error("Error reporting listing:", error)
    return { success: false, error: "Failed to report listing" }
  }
}

// Report a user
export async function reportUser(reportedUserId: string, reporterId: string, reason: string, details: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Create report record
    const { error } = await supabase.from("user_reports").insert({
      reported_user_id: reportedUserId,
      reporter_id: reporterId,
      reason,
      details,
    })

    if (error) throw error

    // Check if this user has multiple reports
    const { count } = await supabase
      .from("user_reports")
      .select("*", { count: "exact", head: true })
      .eq("reported_user_id", reportedUserId)

    // If user has 5+ reports, flag their account
    if (count && count >= 5) {
      await supabase
        .from("profiles")
        .update({
          is_flagged: true,
        })
        .eq("id", reportedUserId)
    }

    return { success: true }
  } catch (error) {
    console.error("Error reporting user:", error)
    return { success: false, error: "Failed to report user" }
  }
}

// Get reports for a listing (admin function)
export async function getListingReports(listingId: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("listing_reports")
      .select(`
        *,
        reporter:reporter_id (
          id,
          full_name,
          email
        )
      `)
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, reports: data }
  } catch (error) {
    console.error("Error getting listing reports:", error)
    return { success: false, error: "Failed to get listing reports", reports: [] }
  }
}

