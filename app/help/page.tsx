import type { Metadata } from "next"
import Link from "next/link"
import { HelpCircle, Shield, AlertTriangle, Scale, FileText, Users } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Help Center | Marketplace",
  description: "Get help with using our marketplace platform and find answers to common questions.",
}

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions about using our platform",
      icon: HelpCircle,
      href: "/help/faq",
    },
    {
      title: "Avoid Scams & Fraud",
      description: "Learn how to recognize and avoid common scams and fraudulent listings",
      icon: AlertTriangle,
      href: "/help/avoid-scams",
    },
    {
      title: "Personal Safety Tips",
      description: "Stay safe when meeting with buyers and sellers in person",
      icon: Shield,
      href: "/help/safety-tips",
    },
    {
      title: "Report Abuse",
      description: "Report suspicious listings, users, or inappropriate content",
      icon: Users,
      href: "/help/abuse",
    },
    {
      title: "Legal Information",
      description: "Terms of service, privacy policy, and other legal information",
      icon: Scale,
      href: "/help/legal",
    },
    {
      title: "User Guides",
      description: "Step-by-step guides for using our platform",
      icon: FileText,
      href: "/help/guides",
    },
  ]

  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Help Center</h1>
        <p className="text-lg text-muted-foreground">
          Find answers, learn how to stay safe, and get support for using our marketplace
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((category) => (
          <Link key={category.title} href={category.href} className="group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Need more help?</h2>
        <p className="mb-4">If you can't find the information you're looking for, please contact our support team.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Contact Support
          </Link>
          <Link
            href="/help/faq"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Browse FAQs
          </Link>
        </div>
      </div>
    </div>
  )
}

