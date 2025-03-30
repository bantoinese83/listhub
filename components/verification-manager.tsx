import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { EmailVerificationDialog } from "@/components/email-verification-dialog"
import { PhoneVerificationDialog } from "@/components/phone-verification-dialog"
import { IdentityVerificationDialog } from "@/components/identity-verification-dialog"
import { useVerificationStatus } from "@/lib/hooks/use-verification-status"

interface VerificationManagerProps {
  userId: string
  email: string
}

export function VerificationManager({
  userId,
  email
}: VerificationManagerProps) {
  const { emailVerified, phoneVerified, identityVerified, isLoading, error } = useVerificationStatus(userId)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [identityDialogOpen, setIdentityDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Failed to load verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error.message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
          <CardDescription>
            Complete verification to unlock additional features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Email Verification</h4>
                {emailVerified ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Verify your email address to receive important notifications
              </p>
            </div>
            {!emailVerified && (
              <Button
                variant="outline"
                onClick={() => setEmailDialogOpen(true)}
              >
                Verify Email
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Phone Verification</h4>
                {phoneVerified ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Verify your phone number for secure communication
              </p>
            </div>
            {!phoneVerified && (
              <Button
                variant="outline"
                onClick={() => setPhoneDialogOpen(true)}
              >
                Verify Phone
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Identity Verification</h4>
                {identityVerified ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Verify your identity to become a ListHub agent
              </p>
            </div>
            {!identityVerified && (
              <Button
                variant="outline"
                onClick={() => setIdentityDialogOpen(true)}
              >
                Verify Identity
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EmailVerificationDialog
        userId={userId}
        email={email}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
      />

      <PhoneVerificationDialog
        userId={userId}
        open={phoneDialogOpen}
        onOpenChange={setPhoneDialogOpen}
      />

      <IdentityVerificationDialog
        userId={userId}
        open={identityDialogOpen}
        onOpenChange={setIdentityDialogOpen}
      />
    </div>
  )
} 