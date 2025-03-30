import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { initiateIdentityVerification, checkIdentityVerificationStatus, updateVerificationStatus } from "@/lib/verification-service"

interface IdentityVerificationDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IdentityVerificationDialog({
  userId,
  open,
  onOpenChange
}: IdentityVerificationDialogProps) {
  const [step, setStep] = useState<'init' | 'upload' | 'processing'>('init')
  const [verificationId, setVerificationId] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleStartVerification = async () => {
    setIsLoading(true)
    try {
      const result = await initiateIdentityVerification(userId)
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId)
        setStep('upload')
        toast({
          title: "Success",
          description: "Identity verification initiated"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      }
    } catch (error) {
      console.error('Error starting identity verification:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start identity verification"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = async () => {
    if (!verificationId) return

    setIsLoading(true)
    setStep('processing')
    try {
      const result = await checkIdentityVerificationStatus(verificationId)
      if (result.success) {
        const updateResult = await updateVerificationStatus({
          userId,
          type: 'identity',
          verified: true
        })

        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Identity verified successfully"
          })
          onOpenChange(false)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: updateResult.message
          })
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check verification status"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('init')
    setVerificationId(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogDescription>
            Verify your identity to unlock additional features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'init' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Required Documents:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Government-issued ID (passport, driver's license, etc.)</li>
                  <li>Clear photo of the document</li>
                  <li>Selfie with the document</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Security:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Documents are encrypted and securely stored</li>
                  <li>Information is only used for verification</li>
                  <li>Data is deleted after verification</li>
                </ul>
              </div>

              <Button
                className="w-full"
                onClick={handleStartVerification}
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Verification"}
              </Button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Upload Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Please upload clear photos of your ID and a selfie
                </p>
              </div>

              {/* Here you would integrate with your document upload service */}
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Document upload interface would go here
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleUploadComplete}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Complete Upload"}
              </Button>
            </div>
          )}

          {step === 'processing' && (
            <div className="space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Verifying your identity...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 