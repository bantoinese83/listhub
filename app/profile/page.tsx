import { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/supabase/api"
import { constructMetadata } from "@/lib/metadata"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProfileSection } from "@/components/profile-section"
import { AccountSettingsDialog } from "@/components/account-settings-dialog"

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

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile settings and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProfileSection profile={profile} userEmail={user.email || ""} />

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates about your listings and messages</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
              </div>
              <Separator />
              <AccountSettingsDialog userId={user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 