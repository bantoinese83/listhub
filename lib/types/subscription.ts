import { z } from "zod"

export const subscriptionTiers = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const

export type SubscriptionTier = typeof subscriptionTiers[keyof typeof subscriptionTiers]

export const subscriptionFeatures = {
  [subscriptionTiers.FREE]: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Up to 3 active listings",
      "Basic listing features",
      "Standard support",
      "Basic analytics",
      "Email notifications",
    ],
    limits: {
      listings: 3,
      imagesPerListing: 5,
      featuredDuration: 0,
      prioritySupport: false,
      customDomain: false,
      advancedAnalytics: false,
      bulkUpload: false,
      apiAccess: false,
    },
  },
  [subscriptionTiers.BASIC]: {
    name: "Basic",
    price: 9.99,
    priceId: "price_basic", // Replace with actual Stripe price ID
    features: [
      "Up to 10 active listings",
      "Priority listing placement",
      "Priority support",
      "Advanced analytics",
      "SMS notifications",
      "Basic API access",
      "Bulk listing upload",
    ],
    limits: {
      listings: 10,
      imagesPerListing: 10,
      featuredDuration: 7, // days
      prioritySupport: true,
      customDomain: false,
      advancedAnalytics: true,
      bulkUpload: true,
      apiAccess: true,
    },
  },
  [subscriptionTiers.PRO]: {
    name: "Pro",
    price: 24.99,
    priceId: "price_pro", // Replace with actual Stripe price ID
    features: [
      "Unlimited active listings",
      "Featured listings",
      "24/7 priority support",
      "Advanced analytics & insights",
      "Custom domain",
      "Full API access",
      "Bulk listing management",
      "Advanced SEO tools",
      "Lead generation tools",
    ],
    limits: {
      listings: -1, // unlimited
      imagesPerListing: 20,
      featuredDuration: 30, // days
      prioritySupport: true,
      customDomain: true,
      advancedAnalytics: true,
      bulkUpload: true,
      apiAccess: true,
    },
  },
  [subscriptionTiers.ENTERPRISE]: {
    name: "Enterprise",
    price: 99.99,
    priceId: "price_enterprise", // Replace with actual Stripe price ID
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "Advanced security features",
      "Custom reporting",
      "Team management",
      "Priority feature requests",
    ],
    limits: {
      listings: -1, // unlimited
      imagesPerListing: 50,
      featuredDuration: 90, // days
      prioritySupport: true,
      customDomain: true,
      advancedAnalytics: true,
      bulkUpload: true,
      apiAccess: true,
    },
  },
}

export const subscriptionSchema = z.object({
  tier: z.enum([subscriptionTiers.FREE, subscriptionTiers.BASIC, subscriptionTiers.PRO, subscriptionTiers.ENTERPRISE]),
  status: z.enum(["active", "canceled", "past_due", "unpaid", "trialing"]),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string().optional(),
})

export type Subscription = z.infer<typeof subscriptionSchema>

// Helper function to check if a feature is available for a subscription tier
export function hasFeature(tier: SubscriptionTier, feature: keyof typeof subscriptionFeatures[SubscriptionTier]["limits"]) {
  const limits = subscriptionFeatures[tier].limits
  return limits[feature] === true || limits[feature] === -1
}

// Helper function to get the limit for a feature
export function getFeatureLimit(tier: SubscriptionTier, feature: keyof typeof subscriptionFeatures[SubscriptionTier]["limits"]) {
  return subscriptionFeatures[tier].limits[feature]
} 