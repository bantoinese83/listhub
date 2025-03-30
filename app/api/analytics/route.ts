import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserAnalytics } from '@/lib/supabase/api'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const analytics = await getUserAnalytics(user.id)

    if (!analytics) {
      return new NextResponse('Failed to fetch analytics', { status: 500 })
    }

    // Transform the data into the expected structure
    const transformedAnalytics = {
      totalViews: analytics.filter(event => event.event_type === 'view').length,
      totalMessages: analytics.filter(event => event.event_type === 'message').length,
      totalFavorites: analytics.filter(event => event.event_type === 'favorite').length,
      totalShares: analytics.filter(event => event.event_type === 'share').length,
      recentActivity: analytics.slice(0, 50) // Limit to 50 most recent events
    }

    return NextResponse.json(transformedAnalytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 