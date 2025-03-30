import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserVerificationStatus } from "@/lib/verification/verification-service"
import VerificationDashboard from "@/components/verification-dashboard"

export default async function VerificationPage() {
  // Check authentication
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/auth/signin?redirect=/dashboard/verification")
  }

  const userId = data.session.user.id

  // Get user verification status
  const verificationStatus = await getUserVerificationStatus(userId)

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Verification</h1>
          <p className="text-muted-foreground mt-2">Verify your account to build trust and unlock more features</p>
        </div>

        <VerificationDashboard user={profile} verificationStatus={verificationStatus} />
      </div>
    </div>
  )
}

