import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export const metadata: Metadata = {
  title: 'Analytics | ListHub',
  description: 'View your listing analytics and engagement metrics.',
}

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in to view analytics</h1>
          <p className="text-muted-foreground mt-2">
            You need to be signed in to view your listing analytics.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your listing performance and user engagement.
          </p>
        </div>

        <AnalyticsDashboard userId={user.id} />
      </div>
    </div>
  )
} 