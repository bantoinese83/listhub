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

    const { subscriptionId } = await req.json()

    if (!subscriptionId) {
      throw new Error("Missing subscription ID")
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.cancel(subscriptionId)

    // Update the subscription in the database
    const { error } = await supabaseClient
      .from("subscriptions")
      .update({
        status: "canceled",
        cancel_at_period_end: true,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
}) 