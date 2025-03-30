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
import { sendPhoneVerification, verifyPhoneCode, updateVerificationStatus } from "@/lib/verification-service"

interface PhoneVerificationDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PhoneVerificationDialog({
  userId,
  open,
  onOpenChange
}: PhoneVerificationDialogProps) {
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [verificationId, setVerificationId] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your phone number"
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await sendPhoneVerification(userId, phoneNumber)
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId)
        setStep('verify')
        toast({
          title: "Success",
          description: "Verification code sent to your phone"
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
    if (!code || !verificationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code"
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyPhoneCode(userId, verificationId, code)
      if (result.success) {
        const updateResult = await updateVerificationStatus({
          userId,
          type: 'phone',
          verified: true
        })

        if (updateResult.success) {
          toast({
            title: "Success",
            description: "Phone number verified successfully"
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
    setStep('phone')
    setPhoneNumber('')
    setCode('')
    setVerificationId(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phone Verification</DialogTitle>
          <DialogDescription>
            Verify your phone number for secure communication
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSendCode}
                disabled={isLoading || !phoneNumber}
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
                  placeholder="Enter the code sent to your phone"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('phone')}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleVerifyCode}
                  disabled={isLoading || !code}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 