import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Shield, MapPin, Users, Clock, DollarSign, Car, Phone, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Personal Safety Tips | Marketplace",
  description: "Learn how to stay safe when buying and selling items on our marketplace platform.",
}

export default function SafetyTipsPage() {
  const safetyCategories = [
    {
      title: "Meeting in Person",
      icon: MapPin,
      tips: [
        "Meet in public, well-lit places with plenty of people around",
        "Consider meeting at a police station, bank lobby, or coffee shop",
        "Avoid meeting at your home or inviting strangers to your residence",
        "Bring a friend or family member with you when possible",
        "Trust your instincts – if something feels wrong, cancel the meeting",
        "Let someone know where you're going, who you're meeting, and when you expect to return",
        "Share your location with a trusted friend or family member during the meeting",
      ],
    },
    {
      title: "Communication Safety",
      icon: Phone,
      tips: [
        "Keep all communication within our platform's messaging system",
        "Be wary of users who immediately try to move communication off-platform",
        "Don't share personal information like your home address, workplace, or daily routine",
        "Be cautious about sharing your phone number; consider using a temporary number app if needed",
        "Never share financial information like bank account or credit card details",
        "Be suspicious of urgent requests or pressure tactics",
        "Report users who ask for unnecessary personal information",
      ],
    },
    {
      title: "Transaction Safety",
      icon: DollarSign,
      tips: [
        "Use cash for in-person transactions whenever possible",
        "If the item is expensive, consider meeting at a bank",
        "Inspect the item thoroughly before paying",
        "For high-value items, consider bringing someone knowledgeable about the item",
        "Be wary of cashier's checks or money orders, which can be fraudulent",
        "Never wire money to someone you haven't met",
        "Don't accept checks for more than your asking price",
      ],
    },
    {
      title: "Transportation Safety",
      icon: Car,
      tips: [
        "Have your own transportation to and from the meeting place",
        "Don't get into someone else's vehicle",
        "Park in well-lit, visible areas",
        "Keep your car locked when you're not in it",
        "Have your keys ready when returning to your vehicle",
        "Consider having someone drive you and wait nearby",
        "Be aware of your surroundings when walking to and from your vehicle",
      ],
    },
    {
      title: "Timing Considerations",
      icon: Clock,
      tips: [
        "Meet during daylight hours whenever possible",
        "Avoid late-night meetings, especially in unfamiliar areas",
        "Give yourself plenty of time to inspect items without feeling rushed",
        "Be on time for meetings to avoid confusion or suspicion",
        "Have a time limit in mind and communicate it to someone who knows your plans",
        "If the other party is significantly late, consider rescheduling rather than waiting alone",
        "Trust your instincts about timing – if it feels wrong, it probably is",
      ],
    },
    {
      title: "Special Considerations for Sellers",
      icon: Users,
      tips: [
        "Remove location data from photos before posting them",
        "Don't post photos that show valuable possessions in the background",
        "Be cautious about how much information you share in your listing description",
        "Have someone with you when showing larger items at your home (if necessary)",
        "Keep valuables and personal information out of sight during home viewings",
        "Be wary of buyers who want to send someone else to pick up the item",
        "Trust your instincts about potential buyers",
      ],
    },
  ]

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/help" className="hover:text-foreground">
              Help Center
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-foreground font-medium">Personal Safety Tips</li>
        </ol>
      </nav>

      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Personal Safety Tips</h1>
        <p className="text-lg text-muted-foreground">Stay safe when buying and selling items on our marketplace</p>
      </div>

      <Alert className="mb-8 border-primary/50 bg-primary/10">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle>Your safety is our top priority</AlertTitle>
        <AlertDescription>
          While most marketplace transactions are safe and legitimate, it's important to take precautions when meeting
          strangers or handling transactions.
        </AlertDescription>
      </Alert>

      <div className="relative mb-8 overflow-hidden rounded-xl border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
        </div>
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Safe Meeting Checklist</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Meet in a public place with plenty of people around</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Bring a friend or family member with you</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Meet during daylight hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Tell someone where you're going and when you'll be back</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Trust your instincts - if something feels wrong, leave</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=200&width=200&text=Safety"
                alt="Safety illustration"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Safety Tips by Category</h2>

      <div className="space-y-6">
        {safetyCategories.map((category) => (
          <Card key={category.title} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {category.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Emergency Situations</h2>
        <p className="mb-4">If you ever feel you're in danger during a marketplace transaction:</p>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <span>Leave immediately and go to a safe place</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <span>Call emergency services (911 in the US) if you feel threatened</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <span>Report the incident to local police</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <span>Report the user on our platform</span>
          </li>
        </ul>
        <Link
          href="/help/abuse"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Report Abuse
        </Link>
      </div>
    </div>
  )
}

