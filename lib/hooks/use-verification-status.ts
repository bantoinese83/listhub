import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface VerificationStatus {
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  isLoading: boolean
  error: Error | null
}

export function useVerificationStatus(userId: string): VerificationStatus {
  const [status, setStatus] = useState<VerificationStatus>({
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchVerificationStatus() {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email_verified, phone_verified, identity_verified')
          .eq('id', userId)
          .single()

        if (error) throw error

        setStatus({
          emailVerified: profile.email_verified || false,
          phoneVerified: profile.phone_verified || false,
          identityVerified: profile.identity_verified || false,
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching verification status:', error)
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error
        }))
      }
    }

    if (userId) {
      fetchVerificationStatus()
    }
  }, [userId])

  return status
} 