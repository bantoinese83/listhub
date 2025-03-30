import { createServerSupabaseClient } from "@/lib/supabase/server"
import { sendVerificationEmail, sendVerificationSMS } from "./notification-service"
import { generateVerificationCode } from "./utils"

// Verification levels
export enum VerificationLevel {
  NONE = "none",
  EMAIL = "email",
  PHONE = "phone",
  ID = "id",
  TRUSTED = "trusted",
}

// Verification status
export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

// Verification types
export enum VerificationType {
  EMAIL = "email",
  PHONE = "phone",
  ID = "id",
  ADDRESS = "address",
}

// Request email verification
export async function requestEmailVerification(userId: string, email: string) {
  try {
    const supabase = createServerSupabaseClient()
    const verificationCode = generateVerificationCode(6)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Code expires in 24 hours

    // Store verification code in database
    const { error } = await supabase.from("verification_codes").insert({
      user_id: userId,
      type: VerificationType.EMAIL,
      code: verificationCode,
      expires_at: expiresAt.toISOString(),
      target: email,
    })

    if (error) throw error

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    return { success: true }
  } catch (error) {
    console.error("Error requesting email verification:", error)
    return { success: false, error: "Failed to send verification email" }
  }
}

// Verify email with code
export async function verifyEmail(userId: string, code: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if code exists and is valid
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("type", VerificationType.EMAIL)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    // Update user's verification level
    await supabase.from("user_verifications").upsert({
      user_id: userId,
      email_verified: true,
      email_verified_at: new Date().toISOString(),
    })

    // Update user's verification level in profiles
    await supabase
      .from("profiles")
      .update({
        verification_level: VerificationLevel.EMAIL,
      })
      .eq("id", userId)

    return { success: true }
  } catch (error) {
    console.error("Error verifying email:", error)
    return { success: false, error: "Failed to verify email" }
  }
}

// Request phone verification
export async function requestPhoneVerification(userId: string, phoneNumber: string) {
  try {
    const supabase = createServerSupabaseClient()
    const verificationCode = generateVerificationCode(6)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code expires in 10 minutes

    // Store verification code in database
    const { error } = await supabase.from("verification_codes").insert({
      user_id: userId,
      type: VerificationType.PHONE,
      code: verificationCode,
      expires_at: expiresAt.toISOString(),
      target: phoneNumber,
    })

    if (error) throw error

    // Send verification SMS
    await sendVerificationSMS(phoneNumber, verificationCode)

    return { success: true }
  } catch (error) {
    console.error("Error requesting phone verification:", error)
    return { success: false, error: "Failed to send verification SMS" }
  }
}

// Verify phone with code
export async function verifyPhone(userId: string, code: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if code exists and is valid
    const { data, error } = await supabase
      .from("verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("type", VerificationType.PHONE)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: "Invalid or expired verification code" }
    }

    // Mark code as used
    await supabase.from("verification_codes").update({ used: true }).eq("id", data.id)

    // Update user's verification level
    await supabase.from("user_verifications").upsert({
      user_id: userId,
      phone_verified: true,
      phone_verified_at: new Date().toISOString(),
    })

    // Check if user already has email verification
    const { data: userVerification } = await supabase
      .from("user_verifications")
      .select("email_verified")
      .eq("user_id", userId)
      .single()

    // Update user's verification level in profiles
    await supabase
      .from("profiles")
      .update({
        verification_level: userVerification?.email_verified ? VerificationLevel.PHONE : VerificationLevel.EMAIL,
      })
      .eq("id", userId)

    return { success: true }
  } catch (error) {
    console.error("Error verifying phone:", error)
    return { success: false, error: "Failed to verify phone" }
  }
}

// Submit ID verification
export async function submitIDVerification(userId: string, idType: string, idNumber: string, idImageUrl: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Create ID verification request
    const { error } = await supabase.from("id_verifications").insert({
      user_id: userId,
      id_type: idType,
      id_number: idNumber,
      id_image_url: idImageUrl,
      status: VerificationStatus.PENDING,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error submitting ID verification:", error)
    return { success: false, error: "Failed to submit ID verification" }
  }
}

// Get user verification status
export async function getUserVerificationStatus(userId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get user verification level
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("verification_level")
      .eq("id", userId)
      .single()

    if (error) throw error

    // Get detailed verification info
    const { data: verifications, error: verificationError } = await supabase
      .from("user_verifications")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (verificationError && verificationError.code !== "PGRST116") throw verificationError

    // Get ID verification status if any
    const { data: idVerification, error: idError } = await supabase
      .from("id_verifications")
      .select("status, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (idError && idError.code !== "PGRST116") throw idError

    return {
      success: true,
      verificationLevel: profile?.verification_level || VerificationLevel.NONE,
      details: {
        email: verifications?.email_verified || false,
        phone: verifications?.phone_verified || false,
        id: idVerification
          ? {
              status: idVerification.status,
              submittedAt: idVerification.created_at,
              updatedAt: idVerification.updated_at,
            }
          : null,
      },
    }
  } catch (error) {
    console.error("Error getting user verification status:", error)
    return {
      success: false,
      error: "Failed to get verification status",
      verificationLevel: VerificationLevel.NONE,
      details: {
        email: false,
        phone: false,
        id: null,
      },
    }
  }
}

// Check if user can post listings
export async function canUserPostListings(userId: string) {
  try {
    const { verificationLevel } = await getUserVerificationStatus(userId)

    // Users need at least email verification to post listings
    return {
      canPost: verificationLevel !== VerificationLevel.NONE,
      requiredLevel: VerificationLevel.EMAIL,
    }
  } catch (error) {
    console.error("Error checking if user can post listings:", error)
    return { canPost: false, requiredLevel: VerificationLevel.EMAIL }
  }
}

// Check if listing requires review
export async function doesListingRequireReview(userId: string) {
  try {
    const { verificationLevel } = await getUserVerificationStatus(userId)

    // Only trusted users can post without review
    return verificationLevel !== VerificationLevel.TRUSTED
  } catch (error) {
    console.error("Error checking if listing requires review:", error)
    return true // Default to requiring review
  }
}

