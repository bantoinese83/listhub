import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Shield, ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface VerificationStatusProps {
  userId: string
  onVerificationComplete?: () => void
}

export function VerificationStatus({ 
  userId,
  onVerificationComplete 
}: VerificationStatusProps) {
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [verificationChecks, setVerificationChecks] = useState({
    emailVerified: false,
    phoneVerified: false,
    identityVerified: false
  })
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkVerificationStatus()
  }, [userId])

  const checkVerificationStatus = async () => {
    try {
      setIsLoading(true)
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_verified, email_verified, phone_verified, identity_verified")
        .eq("id", userId)
        .single()

      if (error) throw error

      if (profile) {
        setIsVerified(profile.is_verified)
        setVerificationChecks({
          emailVerified: profile.email_verified || false,
          phoneVerified: profile.phone_verified || false,
          identityVerified: profile.identity_verified || false
        })
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check verification status."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initiateVerification = async (type: 'email' | 'phone' | 'identity') => {
    try {
      // Here you would integrate with your verification service
      // For example, sending verification emails, SMS, or redirecting to ID verification
      
      toast({
        title: "Verification Initiated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} verification process started.`
      })
      
      // Refresh status after initiating verification
      await checkVerificationStatus()
    } catch (error) {
      console.error(`Error initiating ${type} verification:`, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to start ${type} verification.`
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Shield className="h-6 w-6 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Verification Status</CardTitle>
          {isVerified ? (
            <Badge className="bg-green-500">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Verified
            </Badge>
          ) : (
            <Badge variant="destructive">
              <ShieldAlert className="mr-1 h-4 w-4" />
              Unverified
            </Badge>
          )}
        </div>
        <CardDescription>
          Complete verification to access all ListHub features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {verificationChecks.emailVerified ? (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Email Verification</span>
            </div>
            {!verificationChecks.emailVerified && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => initiateVerification('email')}
              >
                Verify Email
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {verificationChecks.phoneVerified ? (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Phone Verification</span>
            </div>
            {!verificationChecks.phoneVerified && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => initiateVerification('phone')}
              >
                Verify Phone
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {verificationChecks.identityVerified ? (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span>Identity Verification</span>
            </div>
            {!verificationChecks.identityVerified && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => initiateVerification('identity')}
              >
                Verify Identity
              </Button>
            )}
          </div>
        </div>

        {!isVerified && (
          <div className="mt-6 rounded-lg bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Verification Required</p>
                <p>Complete all verification steps to become a verified user and access ListHub agent features.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 