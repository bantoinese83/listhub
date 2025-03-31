"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { subscriptionFeatures, subscriptionTiers } from "@/lib/types/subscription"
import { createCheckoutSession } from "@/lib/stripe/client"
import { toast } from "sonner"

interface SubscriptionManagerProps {
  userId: string
  currentTier: string
  stripeCustomerId: string
}

export default function SubscriptionManager({
  userId,
  currentTier,
  stripeCustomerId,
}: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (tier: string) => {
    try {
      setIsLoading(tier)
      const priceId = subscriptionFeatures[tier as keyof typeof subscriptionFeatures].priceId
      if (!priceId) {
        throw new Error("Invalid subscription tier")
      }

      const session = await createCheckoutSession(
        stripeCustomerId,
        priceId,
        `${window.location.origin}/dashboard?success=true`,
        `${window.location.origin}/dashboard?canceled=true`,
        {
          userId,
          tier,
        }
      )

      if (session.url) {
        router.push(session.url)
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast.error("Failed to start subscription process")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(subscriptionFeatures).map(([tier, plan]) => (
        <Card
          key={tier}
          className={`relative ${
            currentTier === tier ? "border-primary shadow-lg" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {currentTier === tier && (
                <span className="text-sm text-primary">Current Plan</span>
              )}
            </CardTitle>
            <CardDescription>
              {plan.price === 0 ? (
                "Free"
              ) : (
                <>
                  ${plan.price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={currentTier === tier ? "outline" : "default"}
              onClick={() => handleSubscribe(tier)}
              disabled={isLoading === tier || currentTier === tier}
            >
              {isLoading === tier
                ? "Processing..."
                : currentTier === tier
                ? "Current Plan"
                : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 