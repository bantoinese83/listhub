"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subscriptionFeatures, subscriptionTiers } from "@/lib/types/subscription"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface SubscriptionActionsProps {
  currentTier: string
  stripeCustomerId: string
  stripeSubscriptionId?: string
}

export default function SubscriptionActions({
  currentTier,
  stripeCustomerId,
  stripeSubscriptionId,
}: SubscriptionActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string>(currentTier)
  const router = useRouter()
  const supabase = createClient()

  const handleUpgrade = async () => {
    try {
      setIsLoading(true)
      const priceId = subscriptionFeatures[selectedTier as keyof typeof subscriptionFeatures].priceId
      if (!priceId) {
        throw new Error("Invalid subscription tier")
      }

      if (stripeSubscriptionId) {
        // Update existing subscription
        const { error } = await supabase.functions.invoke("update-subscription", {
          body: {
            subscriptionId: stripeSubscriptionId,
            priceId,
          },
        })

        if (error) throw error
      } else {
        // Create new subscription
        const { error } = await supabase.functions.invoke("create-subscription", {
          body: {
            customerId: stripeCustomerId,
            priceId,
          },
        })

        if (error) throw error
      }

      toast.success("Subscription updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast.error("Failed to update subscription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    try {
      setIsLoading(true)
      if (!stripeSubscriptionId) {
        throw new Error("No active subscription")
      }

      const { error } = await supabase.functions.invoke("cancel-subscription", {
        body: {
          subscriptionId: stripeSubscriptionId,
        },
      })

      if (error) throw error

      toast.success("Subscription canceled successfully")
      router.refresh()
    } catch (error) {
      console.error("Error canceling subscription:", error)
      toast.error("Failed to cancel subscription")
    } finally {
      setIsLoading(false)
    }
  }

  const availableTiers = Object.entries(subscriptionFeatures).filter(
    ([tier]) => tier !== currentTier
  )

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            Change Plan
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Subscription Plan</DialogTitle>
            <DialogDescription>
              Select a new plan to upgrade or downgrade your subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedTier}
              onValueChange={setSelectedTier}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {availableTiers.map(([tier, plan]) => (
                  <SelectItem key={tier} value={tier}>
                    {plan.name} - ${plan.price}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpgrade}
              disabled={isLoading || selectedTier === currentTier}
            >
              {isLoading ? "Processing..." : "Change Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {stripeSubscriptionId && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              Cancel Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription? You'll continue
                to have access until the end of your current billing period.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cancel Subscription"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 