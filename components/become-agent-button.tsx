"use client"

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
import { validateAgentEligibility } from "@/lib/agent-validation"
import { createBrowserClient } from "@supabase/ssr"

interface BecomeAgentButtonProps {
  userId: string
}

export function BecomeAgentButton({ userId }: BecomeAgentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleBecomeAgent = async () => {
    setIsLoading(true)
    try {
      // First validate eligibility
      const validation = await validateAgentEligibility(userId)
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Cannot Become Agent",
          description: validation.error
        })
        return
      }

      // Create agent record
      const { error } = await supabase
        .from('agents')
        .insert([
          {
            user_id: userId,
            status: 'active',
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      toast({
        title: "Success!",
        description: "You are now a ListHub agent. You can start representing listings."
      })
      setShowDialog(false)
    } catch (error) {
      console.error('Error becoming agent:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register as an agent. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Become an Agent"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Become a ListHub Agent</DialogTitle>
            <DialogDescription>
              As a ListHub agent, you can help sellers find buyers for their listings.
              You'll earn commission on successful sales.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Verified account</li>
                <li>Valid phone number</li>
                <li>Identity verification</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Benefits:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Earn commission on successful sales</li>
                <li>Access to premium listings</li>
                <li>Professional tools and analytics</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBecomeAgent}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 