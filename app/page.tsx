import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getListings, getSiteStats, getCategories } from "@/lib/supabase/api"
import CategoryMarquee from "@/components/category-marquee"
import FeaturedListings from "@/components/featured-listings"
import VideoHero from "@/components/video-hero"
import TrendingCategories from "@/components/trending-categories"
import StatsCounter from "@/components/stats-counter"
import CategoryGrid from "@/components/category-grid"

export default async function Home() {
  // Fetch featured listings
  const featuredListings = await getListings({ featured: true, limit: 6 })

  // Fetch site statistics
  const stats = await getSiteStats()

  // Fetch categories
  const categories = await getCategories()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Video Hero Section */}
      <VideoHero />

      {/* Stats Counter Section */}
      <StatsCounter
        listings={stats.listings}
        users={stats.users}
        locations={stats.locations}
        messages={stats.messages}
      />

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse Categories</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find exactly what you're looking for in our organized categories
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl py-8">
            <CategoryGrid categories={categories} />
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <TrendingCategories />

      {/* Featured Listings Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Listings</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out these popular items from our community
              </p>
            </div>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl py-8">
            <FeaturedListings listings={featuredListings} />
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/browse">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple steps to buy and sell on our platform
              </p>
            </div>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl py-8">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold">Create an Account</h3>
                <p className="text-center text-muted-foreground">
                  Sign up for free and set up your profile to start buying and selling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold">Post Your Listing</h3>
                <p className="text-center text-muted-foreground">
                  Create a detailed listing with photos, description, and price. Reach thousands of potential buyers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold">Connect & Sell</h3>
                <p className="text-center text-muted-foreground">
                  Chat with interested buyers, negotiate prices, and complete the sale safely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

