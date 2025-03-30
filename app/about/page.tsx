import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { getSiteStats } from "@/lib/supabase/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "About Us | Marketplace",
  description: "Learn more about our marketplace platform and our mission.",
}

// Helper function to format large numbers with commas and "+" suffix
function formatStatNumber(num: number): string {
  return num.toLocaleString() + "+"
}

export default async function AboutPage() {
  // Fetch real statistics from the database
  const stats = await getSiteStats()

  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <PageHeader
        heading="About Our Marketplace"
        subheading="Connecting buyers and sellers in your local community since 2023"
      />

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 my-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-primary md:text-4xl">{formatStatNumber(stats.users)}</div>
            <p className="text-sm text-muted-foreground md:text-base">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-primary md:text-4xl">{formatStatNumber(stats.listings)}</div>
            <p className="text-sm text-muted-foreground md:text-base">Listings Posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-primary md:text-4xl">{formatStatNumber(stats.locations)}</div>
            <p className="text-sm text-muted-foreground md:text-base">Cities Covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-primary md:text-4xl">{formatStatNumber(stats.messages)}</div>
            <p className="text-sm text-muted-foreground md:text-base">Messages Sent</p>
          </CardContent>
        </Card>
      </div>

      {/* Mission Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <p className="mb-4">
              Our marketplace is dedicated to creating a safe, easy-to-use platform where people in local communities
              can buy, sell, and trade goods and services.
            </p>
            <p className="mb-4">
              We believe in the power of local commerce to strengthen communities, reduce waste through reuse, and
              provide economic opportunities for everyone.
            </p>
            <p>
              By connecting neighbors directly with each other, we're building a more sustainable and connected world,
              one transaction at a time.
            </p>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="People trading goods at a local market"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Create a Listing</h3>
              <p className="text-muted-foreground mt-2">
                Sign up for an account and post your items for sale in just a few minutes. Add photos, descriptions, and
                set your price.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Connect with Buyers</h3>
              <p className="text-muted-foreground mt-2">
                Interested buyers will message you through our secure platform. Arrange a meeting time and place that
                works for both of you.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Complete the Sale</h3>
              <p className="text-muted-foreground mt-2">
                Meet safely, exchange the item and payment, and mark your listing as sold. Leave feedback to help build
                trust in our community.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-12 rounded-xl bg-muted p-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground mb-6">
          Join our growing community of buyers and sellers today. It's free to sign up and start browsing or listing
          your items.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/browse">Browse Listings</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

