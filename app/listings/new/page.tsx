import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import NewListingForm from "@/components/new-listing-form"
import { constructMetadata } from "@/lib/metadata"
import { getCategories, getLocations } from "@/lib/supabase/api"

export const metadata: Metadata = constructMetadata({
  title: "Post a New Listing",
  description: "Create a new listing on ListingHub to sell your items or services",
  pathname: "/listings/new",
})

export default async function NewListingPage() {
  // Check if user is authenticated
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/auth/signin?redirect=/listings/new")
  }

  // Fetch categories and locations for the form
  const categories = await getCategories()
  const locations = await getLocations()

  return (
    <div className="container max-w-3xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a New Listing</h1>
          <p className="text-muted-foreground mt-2">Fill out the form below to create your listing</p>
        </div>

        <NewListingForm categories={categories} locations={locations} userId={data.session.user.id} />
      </div>
    </div>
  )
}

