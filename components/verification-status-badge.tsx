import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhoneVerificationDialog } from "@/components/phone-verification-dialog"
import { CheckCircle2, XCircle } from "lucide-react"

interface VerificationStatusBadgeProps {
  userId: string
  type: 'phone' | 'email' | 'identity'
  isVerified: boolean
  onVerificationComplete?: () => void
}

export function VerificationStatusBadge({
  userId,
  type,
  isVerified,
  onVerificationComplete
}: VerificationStatusBadgeProps) {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)

  const getVerificationLabel = () => {
    switch (type) {
      case 'phone':
        return 'Phone'
      case 'email':
        return 'Email'
      case 'identity':
        return 'Identity'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isVerified ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        {isVerified ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {getVerificationLabel()}
      </Badge>
      
      {!isVerified && type === 'phone' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVerificationDialog(true)}
          >
            Verify Now
          </Button>
          
          <PhoneVerificationDialog
            userId={userId}
            open={showVerificationDialog}
            onOpenChange={setShowVerificationDialog}
            onVerificationComplete={onVerificationComplete}
          />
        </>
      )}
    </div>
  )
} 