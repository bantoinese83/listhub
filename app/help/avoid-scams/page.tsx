import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, AlertTriangle, ShieldAlert, DollarSign, Mail, Globe, CreditCard, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Avoid Scams & Fraud | Marketplace",
  description: "Learn how to recognize and avoid common scams and fraudulent activities on our marketplace platform.",
}

export default function AvoidScamsPage() {
  const commonScams = [
    {
      title: "Payment Scams",
      icon: DollarSign,
      description:
        "Be wary of requests to use wire transfers, money orders, or payment apps to people you don't know. Scammers often ask for these payment methods because they're difficult to trace or reverse.",
      signs: [
        "Seller insists on wire transfer or money order payment",
        "Buyer offers to send a check for more than the asking price",
        "Requests to use payment apps for large transactions with strangers",
        "Pressure to finalize payment before seeing the item",
      ],
      prevention: [
        "Use cash for in-person transactions",
        "Never wire money to someone you haven't met",
        "Don't accept checks for more than your asking price",
        "Be suspicious of any request to send money back to a buyer",
      ],
    },
    {
      title: "Phishing Attempts",
      icon: Mail,
      description:
        "Scammers may pose as our marketplace or another trusted entity to trick you into sharing personal information or clicking on malicious links.",
      signs: [
        "Emails or messages asking for your password or financial information",
        "Messages with urgent requests to verify your account",
        "Poor spelling and grammar in official-looking communications",
        "Links that lead to websites that look similar to but aren't our official site",
      ],
      prevention: [
        "We will never ask for your password via email or message",
        "Check the sender's email address carefully",
        "Don't click on suspicious links; type our URL directly in your browser",
        "Enable two-factor authentication on your account",
      ],
    },
    {
      title: "Fake Listings",
      icon: FileText,
      description:
        "Some scammers create listings for items they don't actually have, often using stolen photos and offering prices that seem too good to be true.",
      signs: [
        "Price is significantly lower than market value",
        "Seller refuses to meet in person or show additional photos",
        "Images look professional or appear in other listings online",
        "Seller has a new account with no reviews or history",
      ],
      prevention: [
        "Research the typical price range for the item",
        "Ask for additional photos showing specific details",
        "Meet in person to see the item before paying",
        "Be suspicious of deals that seem too good to be true",
      ],
    },
    {
      title: "Rental Scams",
      icon: Globe,
      description:
        "Rental scammers post fake property listings, often at attractive prices, and try to collect deposits or fees without showing the property.",
      signs: [
        "Landlord claims to be out of the country or unable to show the property",
        "Requests for deposits or fees before viewing the property",
        "Rental price is unusually low for the area",
        "Listing has vague details or stock photos",
      ],
      prevention: [
        "Always view a property in person before paying anything",
        "Never wire money for a security deposit",
        "Research typical rental prices in the area",
        "Verify the landlord actually owns the property",
      ],
    },
    {
      title: "Identity Theft",
      icon: CreditCard,
      description:
        "Scammers may try to collect personal information that could be used for identity theft or other fraudulent activities.",
      signs: [
        "Requests for unnecessary personal information",
        "Buyer or seller asking for copies of identification documents",
        "Requests to continue conversation outside the platform",
        "Oversharing of their own personal information to gain trust",
      ],
      prevention: [
        "Only share information necessary for the transaction",
        "Never share government ID numbers, bank details, or passwords",
        "Keep communication on our platform for your protection",
        "Be cautious about what information you include in listings",
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
          <li className="text-foreground font-medium">Avoid Scams & Fraud</li>
        </ol>
      </nav>

      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Avoid Scams & Fraud</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to recognize and protect yourself from common marketplace scams
        </p>
      </div>

      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>If it seems too good to be true, it probably is</AlertTitle>
        <AlertDescription>
          Trust your instincts. Scammers often create a false sense of urgency or offer deals that are unrealistically
          good.
        </AlertDescription>
      </Alert>

      <div className="relative mb-8 overflow-hidden rounded-xl border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
        </div>
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">The Golden Rules of Safe Trading</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Meet in person in a public place for local transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Inspect the item thoroughly before paying</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Use cash for in-person transactions whenever possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Never send money to someone you haven't met</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Keep all communication within our platform</span>
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

      <h2 className="text-2xl font-bold mb-6">Common Scams to Watch For</h2>

      <div className="space-y-6">
        {commonScams.map((scam) => (
          <Card key={scam.title} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <scam.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{scam.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-muted-foreground">{scam.description}</p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Warning Signs</h3>
                  <ul className="space-y-1">
                    {scam.signs.map((sign, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How to Protect Yourself</h3>
                  <ul className="space-y-1">
                    {scam.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Report Suspicious Activity</h2>
        <p className="mb-4">
          If you encounter a suspicious listing or user, please report it immediately. Your reports help us keep our
          marketplace safe for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/help/abuse"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Report Abuse
          </Link>
          <Link
            href="/help/safety-tips"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            View Safety Tips
          </Link>
        </div>
      </div>
    </div>
  )
}

