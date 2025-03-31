import { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/api"
import { constructMetadata } from "@/lib/metadata"
import ProfileClient from "@/app/components/profile/ProfileClient"
import { getProfileStats } from "@/lib/services/profile-stats-service"

export const metadata: Metadata = constructMetadata({
  title: "Profile",
  description: "Manage your profile settings",
  pathname: "/profile",
})

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
          <p className="text-muted-foreground mt-2">
            You need to be signed in to view and edit your profile.
          </p>
        </div>
      </div>
    )
  }

  const profile = await getUserProfile(user.id)

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground mt-2">
            We couldn't find your profile. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const stats = await getProfileStats(user.id)

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, settings, and view your statistics.
          </p>
        </div>

        <ProfileClient
          user={{
            id: user.id,
            email: user.email || null
          }}
          profile={profile}
          stats={stats}
        />
      </div>
    </div>
  )
} 