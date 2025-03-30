import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserListings } from "@/lib/supabase/api"
import DashboardNav from "@/components/dashboard-nav"
import MyListingsManager from "@/components/my-listings-manager"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "My Listings | Dashboard",
  description: "Manage all your listings in one place",
})

interface MyListingsPageProps {
  searchParams: {
    status?: string
    sort?: string
    q?: string
  }
}

export default async function MyListingsPage({ searchParams }: MyListingsPageProps) {
  // Check authentication
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/auth/signin?redirect=/dashboard/my-listings")
  }

  const userId = data.session.user.id

  // Get user's listings
  const userListings = await getUserListings(userId)

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <DashboardNav />
        </div>

        <div className="md:col-span-3">
          <MyListingsManager listings={userListings} user={profile} searchParams={searchParams} />
        </div>
      </div>
    </div>
  )
}

