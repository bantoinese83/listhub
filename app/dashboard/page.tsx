import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserListings } from "@/lib/supabase/api"
import DashboardNav from "@/components/dashboard-nav"
import UserListings from "@/components/user-listings"

export default async function DashboardPage() {
  // Check authentication
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/auth/signin")
  }

  const userId = data.session.user.id

  // Fetch user's listings
  const userListings = await getUserListings(userId, 3)

  // Get user's stats
  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { count: activeListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active")

  // Calculate total views
  const totalViews = userListings.reduce((total, listing) => total + (listing.views || 0), 0)

  // Calculate percentage change (this would be based on real data in a production app)
  const listingsChange = 0 // Could calculate this from previous month data
  const viewsChange = 0 // Could calculate this from previous month data
  const activeListingsChange = 0 // Could calculate this from previous month data

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <DashboardNav />
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalListings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {listingsChange > 0 ? "+" : ""}
                  {listingsChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  {viewsChange > 0 ? "+" : ""}
                  {viewsChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeListings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {activeListingsChange > 0 ? "+" : ""}
                  {activeListingsChange}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
              <CardDescription>Your most recently posted listings</CardDescription>
            </CardHeader>
            <CardContent>
              <UserListings listings={userListings} />

              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/listings">View All Listings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Button asChild>
                <Link href="/listings/new">Create New Listing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/messages">Check Messages</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/settings">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

