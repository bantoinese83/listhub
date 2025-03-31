import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { constructEventFromPayload } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import { subscriptionSchema } from "@/lib/types/subscription"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable")
}

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return new NextResponse("No signature", { status: 400 })
    }

    const event = await constructEventFromPayload(body, signature, webhookSecret)
    const supabase = createClient()

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const userId = subscription.metadata.userId
        const tier = subscription.metadata.tier

        if (!userId || !tier) {
          return new NextResponse("Missing metadata", { status: 400 })
        }

        const subscriptionData = {
          tier,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: subscription.id,
        }

        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            ...subscriptionData,
          })

        if (error) throw error
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const userId = subscription.metadata.userId

        if (!userId) {
          return new NextResponse("Missing metadata", { status: 400 })
        }

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("user_id", userId)
          .eq("stripe_subscription_id", subscription.id)

        if (error) throw error
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any
        const subscription = await supabase
          .from("subscriptions")
          .select()
          .eq("stripe_subscription_id", invoice.subscription)
          .single()

        if (subscription.error) throw subscription.error

        // Update subscription status
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            currentPeriodStart: new Date(invoice.period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(invoice.period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", invoice.subscription)

        if (updateError) throw updateError
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any
        const subscription = await supabase
          .from("subscriptions")
          .select()
          .eq("stripe_subscription_id", invoice.subscription)
          .single()

        if (subscription.error) throw subscription.error

        // Update subscription status
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
          })
          .eq("stripe_subscription_id", invoice.subscription)

        if (updateError) throw updateError
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return new NextResponse("Webhook error", { status: 400 })
  }
} 