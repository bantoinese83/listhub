import Stripe from "stripe"
import { subscriptionTiers } from "@/lib/types/subscription"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })
  return customer
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata,
  })
  return subscription
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })
  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string,
  metadata?: Record<string, string>
) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    items: [{ price: priceId }],
    metadata,
  })
  return subscription
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export async function getCustomer(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId)
  return customer
}

export async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  })
  return subscriptions
}

export async function createUsageRecord(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: number
) {
  const usageRecord = await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      timestamp: timestamp || Math.floor(Date.now() / 1000),
      action: "increment",
    }
  )
  return usageRecord
}

export async function getUsageRecord(subscriptionItemId: string) {
  const usageRecord = await stripe.subscriptionItems.listUsageRecordSummaries(
    subscriptionItemId
  )
  return usageRecord
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
  })
  return paymentIntent
}

export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason,
  })
  return refund
}

export async function createWebhookEndpoint(url: string, events: string[]) {
  const webhookEndpoint = await stripe.webhookEndpoints.create({
    url,
    enabled_events: events,
  })
  return webhookEndpoint
}

export async function deleteWebhookEndpoint(webhookEndpointId: string) {
  const webhookEndpoint = await stripe.webhookEndpoints.del(webhookEndpointId)
  return webhookEndpoint
}

export async function getWebhookEndpoint(webhookEndpointId: string) {
  const webhookEndpoint = await stripe.webhookEndpoints.retrieve(webhookEndpointId)
  return webhookEndpoint
}

export async function listWebhookEndpoints() {
  const webhookEndpoints = await stripe.webhookEndpoints.list()
  return webhookEndpoints
}

export async function constructEventFromPayload(
  payload: string,
  signature: string,
  webhookSecret: string
) {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  )
  return event
} 