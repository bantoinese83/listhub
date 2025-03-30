import { createBrowserClient } from "@supabase/ssr"
import { Twilio } from "twilio"
import { Resend } from 'resend'

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const resend = new Resend(process.env.RESEND_API_KEY)

interface PhoneVerificationResult {
  success: boolean
  message: string
  verificationId?: string
}

interface VerifyCodeResult {
  success: boolean
  message: string
}

interface VerificationResult {
  success: boolean
  message: string
  verificationId?: string
}

interface UpdateVerificationStatusParams {
  userId: string
  type: 'email' | 'phone' | 'identity'
  verified: boolean
}

export async function sendPhoneVerification(
  userId: string,
  phoneNumber: string
): Promise<PhoneVerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    // Create verification record
    const { data: verification, error } = await supabase
      .from("phone_verifications")
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
        attempts: 0
      })
      .select()
      .single()

    if (error) throw error

    // Send SMS via Twilio
    await twilio.messages.create({
      body: `Your ListHub verification code is: ${verificationCode}. Valid for 15 minutes.`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    })

    return {
      success: true,
      message: "Verification code sent successfully",
      verificationId: verification.id
    }
  } catch (error) {
    console.error("Error sending phone verification:", error)
    return {
      success: false,
      message: "Failed to send verification code. Please try again."
    }
  }
}

export async function verifyPhoneCode(
  userId: string,
  verificationId: string,
  code: string
): Promise<VerifyCodeResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get verification record
    const { data: verification, error } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("id", verificationId)
      .eq("user_id", userId)
      .single()

    if (error) throw error

    if (!verification) {
      return {
        success: false,
        message: "Verification not found"
      }
    }

    // Check if verification has expired
    if (new Date(verification.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired"
      }
    }

    // Check if too many attempts
    if (verification.attempts >= 3) {
      return {
        success: false,
        message: "Too many attempts. Please request a new code."
      }
    }

    // Update attempts
    await supabase
      .from("phone_verifications")
      .update({ attempts: verification.attempts + 1 })
      .eq("id", verificationId)

    // Check if code matches
    if (verification.verification_code !== code) {
      return {
        success: false,
        message: "Invalid verification code"
      }
    }

    // Mark phone as verified
    const now = new Date().toISOString()
    await Promise.all([
      // Update verification record
      supabase
        .from("phone_verifications")
        .update({ verified_at: now })
        .eq("id", verificationId),
      
      // Update user profile
      supabase
        .from("profiles")
        .update({ 
          phone_verified: true,
          phone_number: verification.phone_number
        })
        .eq("id", userId)
    ])

    return {
      success: true,
      message: "Phone number verified successfully"
    }
  } catch (error) {
    console.error("Error verifying phone code:", error)
    return {
      success: false,
      message: "Failed to verify code. Please try again."
    }
  }
}

export async function sendEmailVerification(userId: string, email: string): Promise<VerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store verification code in database
    const { error: dbError } = await supabase
      .from('email_verifications')
      .insert([
        {
          user_id: userId,
          email,
          verification_code: verificationCode,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          attempts: 0
        }
      ])

    if (dbError) throw dbError

    // Send verification email
    await resend.emails.send({
      from: 'ListHub <verification@listhub.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify your email address</h1>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `
    })

    return {
      success: true,
      message: "Verification code sent successfully"
    }
  } catch (error) {
    console.error('Error sending email verification:', error)
    return {
      success: false,
      message: "Failed to send verification code"
    }
  }
}

export async function verifyEmailCode(userId: string, code: string): Promise<VerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Get verification record
    const { data: verification, error: fetchError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('verification_code', code)
      .single()

    if (fetchError) throw fetchError

    // Check if verification has expired
    if (new Date(verification.expires_at) < new Date()) {
      return {
        success: false,
        message: "Verification code has expired"
      }
    }

    // Check if too many attempts
    if (verification.attempts >= 3) {
      return {
        success: false,
        message: "Too many failed attempts. Please request a new code."
      }
    }

    // Update verification record
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({
        verified_at: new Date().toISOString(),
        attempts: verification.attempts + 1
      })
      .eq('id', verification.id)

    if (updateError) throw updateError

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('id', userId)

    if (profileError) throw profileError

    return {
      success: true,
      message: "Email verified successfully"
    }
  } catch (error) {
    console.error('Error verifying email code:', error)
    return {
      success: false,
      message: "Failed to verify code"
    }
  }
}

export async function initiateIdentityVerification(userId: string): Promise<VerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Create verification record
    const { data: verification, error: createError } = await supabase
      .from('identity_verifications')
      .insert([
        {
          user_id: userId,
          status: 'pending',
          verification_type: 'document',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (createError) throw createError

    // Here you would integrate with an identity verification service
    // For example, Jumio, Onfido, or similar
    // For now, we'll just return the verification ID

    return {
      success: true,
      message: "Identity verification initiated",
      verificationId: verification.id
    }
  } catch (error) {
    console.error('Error initiating identity verification:', error)
    return {
      success: false,
      message: "Failed to initiate identity verification"
    }
  }
}

export async function checkIdentityVerificationStatus(verificationId: string): Promise<VerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data: verification, error } = await supabase
      .from('identity_verifications')
      .select('*')
      .eq('id', verificationId)
      .single()

    if (error) throw error

    // Here you would check the status with your identity verification service
    // For now, we'll simulate a successful verification
    const { error: updateError } = await supabase
      .from('identity_verifications')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', verificationId)

    if (updateError) throw updateError

    // Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ identity_verified: true })
      .eq('id', verification.user_id)

    if (profileError) throw profileError

    return {
      success: true,
      message: "Identity verified successfully"
    }
  } catch (error) {
    console.error('Error checking identity verification status:', error)
    return {
      success: false,
      message: "Failed to check verification status"
    }
  }
}

export async function updateVerificationStatus({
  userId,
  type,
  verified
}: UpdateVerificationStatusParams): Promise<VerificationResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const column = `${type}_verified`
    const { error } = await supabase
      .from('profiles')
      .update({ [column]: verified })
      .eq('id', userId)

    if (error) throw error

    return {
      success: true,
      message: `${type} verification status updated successfully`
    }
  } catch (error) {
    console.error(`Error updating ${type} verification status:`, error)
    return {
      success: false,
      message: `Failed to update ${type} verification status`
    }
  }
} 