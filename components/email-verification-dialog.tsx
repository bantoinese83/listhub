import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { sendEmailVerification, verifyEmailCode, updateVerificationStatus } from "@/lib/verification-service"

interface EmailVerificationDialogProps {
  userId: string
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailVerificationDialog({
  userId,
  email,
  open,
  onOpenChange
}: EmailVerificationDialogProps) {
  const [step, setStep] = useState<'send' | 'verify'>('send')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    setIsLoading(true)
    try {
      const result = await sendEmailVerification(userId, email)
      if (result.success) {
        setStep('verify')
        toast({
          title: "Success",
          description: "Verification code sent to your email"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification code"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) return

    setIsLoading(true)
    try {
      const result = await verifyEmailCode(userId, code)
      if (result.success) {
        const updateResult = await updateVerificationStatus({
          userId,
          type: 'email',
          verified: true
        })

        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Email verified successfully"
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
      console.error('Error verifying code:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify code"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('send')
    setCode('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            Verify your email address to receive important notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'send' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  disabled={isLoading}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyCode}
                disabled={isLoading || !code}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 