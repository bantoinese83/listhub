import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface ProfileStats {
  views: number
  likes: number
  shares: number
  messages: number
  followers: number
  following: number
  ratings: number
  averageRating: number
  viewsHistory: Array<{ date: string; views: number }>
  monthlyGrowth: {
    views: number
    likes: number
    shares: number
    followers: number
  }
  quickFacts: {
    mostActiveDay: string
    peakHours: string
    topEngagementSource: string
  }
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const supabase = createServerComponentClient({ cookies })
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Get current month's stats
  const { data: currentStats } = await supabase
    .from('profile_views')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Get previous month's stats for growth calculation
  const { data: previousStats } = await supabase
    .from('profile_views')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  // Get current month's followers
  const { data: currentFollowers } = await supabase
    .from('follows')
    .select('created_at')
    .eq('following_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Get previous month's followers
  const { data: previousFollowers } = await supabase
    .from('follows')
    .select('created_at')
    .eq('following_id', userId)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  // Get likes with timestamps
  const { data: currentLikes } = await supabase
    .from('likes')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { data: previousLikes } = await supabase
    .from('likes')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  // Get shares with timestamps
  const { data: currentShares } = await supabase
    .from('shares')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { data: previousShares } = await supabase
    .from('shares')
    .select('created_at')
    .eq('profile_id', userId)
    .gte('created_at', sixtyDaysAgo.toISOString())
    .lt('created_at', thirtyDaysAgo.toISOString())

  // Get messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('recipient_id', userId)
    .eq('status', 'active')

  // Get followers and following
  const { data: followers } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('following_id', userId)

  const { data: following } = await supabase
    .from('follows')
    .select('*', { count: 'exact' })
    .eq('follower_id', userId)

  // Get ratings
  const { data: ratings } = await supabase
    .from('ratings')
    .select('rating')
    .eq('profile_id', userId)

  // Calculate activity patterns
  const activityByDay = new Array(7).fill(0)
  const activityByHour = new Array(24).fill(0)
  const engagementSources = {
    direct: 0,
    search: 0,
    referral: 0,
    social: 0
  }

  currentStats?.forEach(view => {
    const date = new Date(view.created_at)
    activityByDay[date.getDay()]++
    activityByHour[date.getHours()]++
    
    // For this example, we're counting all views as direct
    // In a real app, you'd have a source field in your views table
    engagementSources.direct++
  })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const mostActiveDay = days[activityByDay.indexOf(Math.max(...activityByDay))]

  const peakHourStart = activityByHour.indexOf(Math.max(...activityByHour))
  const peakHourEnd = peakHourStart + 2
  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const h = hour % 12 || 12
    return `${h}${ampm}`
  }
  const peakHours = `${formatHour(peakHourStart)} - ${formatHour(peakHourEnd)}`

  const topSource = Object.entries(engagementSources)
    .sort(([,a], [,b]) => b - a)[0][0]
    .charAt(0).toUpperCase() + Object.entries(engagementSources)
    .sort(([,a], [,b]) => b - a)[0][0]
    .slice(1)

  // Calculate counts and growth
  const currentViewsCount = currentStats?.length || 0
  const previousViewsCount = previousStats?.length || 0
  const currentLikesCount = currentLikes?.length || 0
  const previousLikesCount = previousLikes?.length || 0
  const currentSharesCount = currentShares?.length || 0
  const previousSharesCount = previousShares?.length || 0
  const currentFollowersCount = currentFollowers?.length || 0
  const previousFollowersCount = previousFollowers?.length || 0

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Calculate average rating
  const ratingValues = ratings?.map(r => r.rating) || []
  const averageRating = ratingValues.length > 0
    ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    : 0

  // Process views history
  const viewsByDate = currentStats?.reduce((acc: { [key: string]: number }, view) => {
    const date = new Date(view.created_at).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {}) || {}

  const viewsHistoryArray = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    return {
      date,
      views: viewsByDate[date] || 0,
    }
  })

  return {
    views: currentViewsCount,
    likes: currentLikesCount,
    shares: currentSharesCount,
    messages: messages?.[0]?.count || 0,
    followers: followers?.[0]?.count || 0,
    following: following?.[0]?.count || 0,
    ratings: ratingValues.length,
    averageRating,
    viewsHistory: viewsHistoryArray,
    monthlyGrowth: {
      views: calculateGrowth(currentViewsCount, previousViewsCount),
      likes: calculateGrowth(currentLikesCount, previousLikesCount),
      shares: calculateGrowth(currentSharesCount, previousSharesCount),
      followers: calculateGrowth(currentFollowersCount, previousFollowersCount)
    },
    quickFacts: {
      mostActiveDay,
      peakHours,
      topEngagementSource: `${topSource} Profile Views`
    }
  }
} 