import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SubscriptionManager from "@/components/subscription/subscription-manager"

export default async function SubscriptionPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select()
    .eq("user_id", user.id)
    .single()

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
      </div>

      <SubscriptionManager
        userId={user.id}
        currentTier={subscription?.tier || "free"}
        stripeCustomerId={profile.stripe_customer_id}
      />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can change your plan at any time. When upgrading, you'll be
              charged the difference for the current billing period. When
              downgrading, the changes will take effect at the start of your next
              billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and bank transfers for
              annual plans. All payments are processed securely through Stripe.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is there a refund policy?</h3>
            <p className="text-muted-foreground">
              Yes, we offer a 30-day money-back guarantee for all paid plans. If
              you're not satisfied with our service, contact our support team
              within 30 days of your purchase for a full refund.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">What happens if I exceed my plan limits?</h3>
            <p className="text-muted-foreground">
              If you reach your plan's limits, you'll be prompted to upgrade to a
              higher tier. We'll notify you before any service interruptions occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 