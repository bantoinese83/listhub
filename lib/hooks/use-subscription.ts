import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { subscriptionFeatures, SubscriptionTier } from "@/lib/types/subscription"

interface SubscriptionStatus {
  tier: SubscriptionTier
  status: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  limits: {
    listings: number
    imagesPerListing: number
    featuredDuration: number
    prioritySupport: boolean
    customDomain: boolean
    advancedAnalytics: boolean
    bulkUpload: boolean
    apiAccess: boolean
  }
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data: subscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select()
          .single()

        if (subscriptionError) throw subscriptionError

        const tier = subscription?.tier || "free"
        const features = subscriptionFeatures[tier as keyof typeof subscriptionFeatures]

        setStatus({
          tier,
          status: subscription?.status || "active",
          currentPeriodEnd: subscription?.current_period_end || new Date().toISOString(),
          cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
          limits: features.limits,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch subscription"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()

    // Subscribe to subscription changes
    const subscription = supabase
      .channel("subscription_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
        },
        (payload) => {
          if (payload.new) {
            const tier = payload.new.tier || "free"
            const features = subscriptionFeatures[tier as keyof typeof subscriptionFeatures]

            setStatus({
              tier,
              status: payload.new.status || "active",
              currentPeriodEnd: payload.new.current_period_end || new Date().toISOString(),
              cancelAtPeriodEnd: payload.new.cancel_at_period_end || false,
              limits: features.limits,
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const hasFeature = (feature: keyof SubscriptionStatus["limits"]) => {
    if (!status) return false
    return status.limits[feature] === true || status.limits[feature] === -1
  }

  const getLimit = (feature: keyof SubscriptionStatus["limits"]) => {
    if (!status) return 0
    return status.limits[feature]
  }

  const isActive = () => {
    if (!status) return false
    return status.status === "active"
  }

  const isTrialing = () => {
    if (!status) return false
    return status.status === "trialing"
  }

  const isCanceled = () => {
    if (!status) return false
    return status.status === "canceled" || status.cancelAtPeriodEnd
  }

  const isPastDue = () => {
    if (!status) return false
    return status.status === "past_due"
  }

  const isUnpaid = () => {
    if (!status) return false
    return status.status === "unpaid"
  }

  const getDaysUntilRenewal = () => {
    if (!status) return 0
    const endDate = new Date(status.currentPeriodEnd)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return {
    status,
    isLoading,
    error,
    hasFeature,
    getLimit,
    isActive,
    isTrialing,
    isCanceled,
    isPastDue,
    isUnpaid,
    getDaysUntilRenewal,
  }
} 