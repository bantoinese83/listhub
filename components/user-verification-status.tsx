import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VerificationStatusBadge } from "@/components/verification-status-badge"

interface UserVerificationStatusProps {
  userId: string
}

interface VerificationStatus {
  email_verified: boolean
  phone_verified: boolean
  identity_verified: boolean
  is_verified: boolean
}

export function UserVerificationStatus({ userId }: UserVerificationStatusProps) {
  const [status, setStatus] = useState<VerificationStatus>({
    email_verified: false,
    phone_verified: false,
    identity_verified: false,
    is_verified: false
  })
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_verified, phone_verified, identity_verified, is_verified')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching verification status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVerificationStatus()
  }, [userId])

  const handleVerificationComplete = () => {
    fetchVerificationStatus()
  }

  if (isLoading) {
    return <div>Loading verification status...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
        <CardDescription>
          Verify your account to unlock additional features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VerificationStatusBadge
          userId={userId}
          type="email"
          isVerified={status.email_verified}
          onVerificationComplete={handleVerificationComplete}
        />
        <VerificationStatusBadge
          userId={userId}
          type="phone"
          isVerified={status.phone_verified}
          onVerificationComplete={handleVerificationComplete}
        />
        <VerificationStatusBadge
          userId={userId}
          type="identity"
          isVerified={status.identity_verified}
          onVerificationComplete={handleVerificationComplete}
        />
      </CardContent>
    </Card>
  )
} 