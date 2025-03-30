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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { validateReferralCreation } from "@/lib/agent-validation"
import { createBrowserClient } from "@supabase/ssr"

interface AgentReferralButtonProps {
  agentId: string
  listingId: string
}

export function AgentReferralButton({ agentId, listingId }: AgentReferralButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCreateReferral = async () => {
    if (!buyerEmail || !buyerPhone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide buyer's email and phone number"
      })
      return
    }

    setIsLoading(true)
    try {
      // First validate referral creation
      const validation = await validateReferralCreation(agentId, listingId)
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Cannot Create Referral",
          description: validation.error
        })
        return
      }

      // Create referral record
      const { error } = await supabase
        .from('agent_referrals')
        .insert([
          {
            agent_id: agentId,
            listing_id: listingId,
            buyer_email: buyerEmail,
            buyer_phone: buyerPhone,
            notes,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Referral created successfully"
      })
      setShowDialog(false)
      setBuyerEmail("")
      setBuyerPhone("")
      setNotes("")
    } catch (error) {
      console.error('Error creating referral:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create referral"
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
        {isLoading ? "Processing..." : "Create Referral"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Referral</DialogTitle>
            <DialogDescription>
              Add a potential buyer referral for this listing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Buyer's Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="buyer@example.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Buyer's Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 555-5555"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the buyer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
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
                onClick={handleCreateReferral}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 