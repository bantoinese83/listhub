import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { stripe } from "../../lib/stripe/client.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const { customerId, priceId } = await req.json()

    if (!customerId || !priceId) {
      throw new Error("Missing required parameters")
    }

    // Create the subscription in Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    // Get the customer's user ID from the profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single()

    if (profileError) throw profileError

    // Create the subscription in the database
    const { error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: profile.id,
        tier: subscription.metadata.tier,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
      })

    if (subscriptionError) throw subscriptionError

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
}) 