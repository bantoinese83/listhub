import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "3 active listings",
      "5 images per listing",
      "Basic search and filtering",
      "Standard placement",
      "Basic analytics",
    ],
    cta: "Get Started",
    href: "/auth/signup",
    popular: false,
  },
  {
    name: "Basic",
    price: "$9.99",
    period: "per month",
    description: "Best for growing businesses",
    features: [
      "10 active listings",
      "10 images per listing",
      "Priority placement",
      "Advanced search and filtering",
      "Basic analytics",
      "ListHub Agent access",
      "Email support",
    ],
    cta: "Upgrade to Basic",
    href: "/dashboard/subscription",
    popular: true,
  },
  {
    name: "Pro",
    price: "Coming Soon",
    description: "For power users",
    features: [
      "Unlimited listings",
      "20 images per listing",
      "Featured listings",
      "Advanced analytics",
      "Bulk management",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Coming Soon",
    href: "#",
    popular: false,
    disabled: true,
  },
  {
    name: "Enterprise",
    price: "Coming Soon",
    description: "For large organizations",
    features: [
      "All Pro features",
      "Custom domain support",
      "Team management",
      "Custom integrations",
      "Dedicated support",
      "White-label options",
      "Advanced AI features",
    ],
    cta: "Coming Soon",
    href: "#",
    popular: false,
    disabled: true,
  },
]

export function SubscriptionSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Plan</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Start with our free tier and upgrade as you grow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.popular ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {tier.name}
                  {tier.popular && (
                    <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      Popular
                    </span>
                  )}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-gray-500 dark:text-gray-400">/{tier.period}</span>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="w-4 h-4 mr-2 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  asChild
                  disabled={tier.disabled}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 