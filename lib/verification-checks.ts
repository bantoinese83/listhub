import { createBrowserClient } from "@supabase/ssr"
import { AuthChangeEvent, Session } from "@supabase/supabase-js"

interface VerificationStatus {
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  lastChecked: Date
}

interface VerificationUpdate {
  success: boolean
  message: string
  updatedStatus?: VerificationStatus
}

export async function runAutomaticVerificationChecks(userId: string): Promise<VerificationStatus> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get current verification status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_verified, email_verified, phone_verified, identity_verified, last_verification_check")
      .eq("id", userId)
      .single()

    if (profileError) throw profileError

    // Check if we need to run verification (every 24 hours)
    const lastCheck = profile?.last_verification_check ? new Date(profile.last_verification_check) : null
    const needsCheck = !lastCheck || (new Date().getTime() - lastCheck.getTime()) > 24 * 60 * 60 * 1000

    if (!needsCheck && profile.is_verified) {
      return {
        isVerified: profile.is_verified,
        emailVerified: profile.email_verified,
        phoneVerified: profile.phone_verified,
        identityVerified: profile.identity_verified,
        lastChecked: lastCheck || new Date()
      }
    }

    // Run verification checks
    const verificationStatus = {
      emailVerified: await checkEmailVerification(userId, supabase),
      phoneVerified: await checkPhoneVerification(userId, supabase),
      identityVerified: await checkIdentityVerification(userId, supabase),
      lastChecked: new Date()
    }

    // Update overall verification status
    const isVerified = verificationStatus.emailVerified && 
                      verificationStatus.phoneVerified && 
                      verificationStatus.identityVerified

    // Update profile with new verification status
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_verified: isVerified,
        email_verified: verificationStatus.emailVerified,
        phone_verified: verificationStatus.phoneVerified,
        identity_verified: verificationStatus.identityVerified,
        last_verification_check: verificationStatus.lastChecked
      })
      .eq("id", userId)

    if (updateError) throw updateError

    return {
      isVerified,
      ...verificationStatus
    }
  } catch (error) {
    console.error("Error running verification checks:", error)
    throw error
  }
}

async function checkEmailVerification(userId: string, supabase: any): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser()
    return user?.user?.email_confirmed_at != null
  } catch (error) {
    console.error("Error checking email verification:", error)
    return false
  }
}

async function checkPhoneVerification(userId: string, supabase: any): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("phone_verifications")
      .select("verified_at")
      .eq("user_id", userId)
      .single()

    return data?.verified_at != null
  } catch (error) {
    console.error("Error checking phone verification:", error)
    return false
  }
}

async function checkIdentityVerification(userId: string, supabase: any): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("identity_verifications")
      .select("status")
      .eq("user_id", userId)
      .single()

    return data?.status === "verified"
  } catch (error) {
    console.error("Error checking identity verification:", error)
    return false
  }
}

export async function initiateVerificationProcess(
  userId: string,
  type: 'email' | 'phone' | 'identity'
): Promise<VerificationUpdate> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    switch (type) {
      case 'email':
        const user = await supabase.auth.getUser()
        const email = user.data.user?.email
        if (!email) throw new Error("No email found for user")
        
        const { error: emailError } = await supabase.auth.resend({
          type: 'signup',
          email
        })
        if (emailError) throw emailError
        return {
          success: true,
          message: "Verification email sent. Please check your inbox."
        }

      case 'phone':
        // Implement phone verification logic
        // This could involve sending an SMS code
        return {
          success: true,
          message: "Phone verification code sent."
        }

      case 'identity':
        // Implement identity verification logic
        // This could involve redirecting to an ID verification service
        return {
          success: true,
          message: "Identity verification process initiated."
        }

      default:
        throw new Error("Invalid verification type")
    }
  } catch (error) {
    console.error(`Error initiating ${type} verification:`, error)
    return {
      success: false,
      message: `Failed to initiate ${type} verification. Please try again.`
    }
  }
}

export async function setupVerificationWebhooks(supabase: any) {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
    if (event === 'USER_UPDATED' && session?.user) {
      // Run verification checks when user is updated
      await runAutomaticVerificationChecks(session.user.id)
    }
  })

  // Listen for realtime changes on verification tables
  supabase
    .channel('verification-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'phone_verifications'
      },
      async (payload: any) => {
        if (payload.new.verified_at && !payload.old.verified_at) {
          await runAutomaticVerificationChecks(payload.new.user_id)
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'identity_verifications'
      },
      async (payload: any) => {
        if (payload.new.status === 'verified' && payload.old.status !== 'verified') {
          await runAutomaticVerificationChecks(payload.new.user_id)
        }
      }
    )
    .subscribe()
} 