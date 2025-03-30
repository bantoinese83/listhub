import { createBrowserClient } from "@supabase/ssr"

interface ValidationResult {
  isValid: boolean
  error?: string
}

interface UserProfile {
  id: string
  is_verified: boolean
  email: string
  full_name: string
}

export async function validateAgentEligibility(userId: string): Promise<ValidationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Check if user exists and is verified
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_verified, email_verified, phone_verified, identity_verified')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (!profile) {
      return {
        isValid: false,
        error: "User profile not found"
      }
    }

    if (!profile.is_verified) {
      return {
        isValid: false,
        error: "User must be fully verified to become an agent"
      }
    }

    // Check if user is already an agent
    const { data: existingAgent, error: agentError } = await supabase
      .from('agents')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (agentError && agentError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw agentError
    }

    if (existingAgent) {
      return {
        isValid: false,
        error: "User is already an agent"
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error validating agent eligibility:', error)
    return {
      isValid: false,
      error: "Failed to validate agent eligibility"
    }
  }
}

export async function validateListingOwnerEligibility(userId: string): Promise<ValidationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Check if user exists and is verified
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_verified, email, full_name")
      .eq("id", userId)
      .single()

    if (profileError) throw profileError

    if (!profile) {
      return {
        isValid: false,
        error: "User profile not found."
      }
    }

    if (!profile.is_verified) {
      return {
        isValid: false,
        error: "You must be a verified user to accept agents for your listings. Please verify your account first."
      }
    }

    return { 
      isValid: true 
    }
  } catch (error) {
    console.error("Error validating listing owner eligibility:", error)
    return {
      isValid: false,
      error: "Failed to validate listing owner eligibility. Please try again."
    }
  }
}

export async function validateListingEligibility(listingId: string, userId: string): Promise<ValidationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Check if listing exists and belongs to user
    const { data: listing, error } = await supabase
      .from('listings')
      .select('id, price, user_id')
      .eq('id', listingId)
      .single()

    if (error) throw error

    if (!listing) {
      return {
        isValid: false,
        error: "Listing not found"
      }
    }

    if (listing.user_id !== userId) {
      return {
        isValid: false,
        error: "Only the listing owner can manage agent requests"
      }
    }

    // Check if listing price meets minimum requirement
    if (listing.price < 1000) {
      return {
        isValid: false,
        error: "Listings must be priced at $1,000 or more to accept agents"
      }
    }

    // Check if listing already has an agent
    const { data: existingAgent, error: agentError } = await supabase
      .from('agent_listings')
      .select('id')
      .eq('listing_id', listingId)
      .single()

    if (agentError && agentError.code !== 'PGRST116') {
      throw agentError
    }

    if (existingAgent) {
      return {
        isValid: false,
        error: "Listing already has an agent"
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error validating listing eligibility:', error)
    return {
      isValid: false,
      error: "Failed to validate listing eligibility"
    }
  }
}

export async function validateAgentListingRequest(agentId: string, listingId: string): Promise<ValidationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Check if agent exists and is active
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, status')
      .eq('id', agentId)
      .single()

    if (agentError) throw agentError

    if (!agent || agent.status !== 'active') {
      return {
        isValid: false,
        error: "Agent is not active"
      }
    }

    // Check if listing exists and is available
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, status')
      .eq('id', listingId)
      .single()

    if (listingError) throw listingError

    if (!listing || listing.status !== 'active') {
      return {
        isValid: false,
        error: "Listing is not available"
      }
    }

    // Check if agent already has a pending request for this listing
    const { data: existingRequest, error: requestError } = await supabase
      .from('agent_requests')
      .select('id')
      .eq('agent_id', agentId)
      .eq('listing_id', listingId)
      .eq('status', 'pending')
      .single()

    if (requestError && requestError.code !== 'PGRST116') {
      throw requestError
    }

    if (existingRequest) {
      return {
        isValid: false,
        error: "Agent already has a pending request for this listing"
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error validating agent listing request:', error)
    return {
      isValid: false,
      error: "Failed to validate agent listing request"
    }
  }
}

export async function validateReferralCreation(agentId: string, listingId: string): Promise<ValidationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Check if agent is assigned to the listing
    const { data: agentListing, error: agentListingError } = await supabase
      .from('agent_listings')
      .select('id')
      .eq('agent_id', agentId)
      .eq('listing_id', listingId)
      .single()

    if (agentListingError) throw agentListingError

    if (!agentListing) {
      return {
        isValid: false,
        error: "Agent is not assigned to this listing"
      }
    }

    // Check if listing is still active
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, status')
      .eq('id', listingId)
      .single()

    if (listingError) throw listingError

    if (!listing || listing.status !== 'active') {
      return {
        isValid: false,
        error: "Listing is no longer active"
      }
    }

    // Check if agent has reached maximum referrals for this listing
    const { count, error: countError } = await supabase
      .from('agent_referrals')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .eq('listing_id', listingId)

    if (countError) throw countError

    if (count && count >= 5) {
      return {
        isValid: false,
        error: "Maximum number of referrals reached for this listing"
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error('Error validating referral creation:', error)
    return {
      isValid: false,
      error: "Failed to validate referral creation"
    }
  }
} 