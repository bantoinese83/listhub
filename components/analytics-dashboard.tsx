'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Eye, MessageSquare, Heart, Share2, LineChart as LineChartIcon, PieChart as PieChartIcon, AlertCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'

interface AnalyticsEvent {
  id: string
  listing_id: string
  user_id: string
  event_type: 'view' | 'message' | 'favorite' | 'share'
  created_at: string
  listing: {
    id: string
    title: string
    price: number
    images: { url: string }[]
  }
}

interface AnalyticsDashboardProps {
  userId: string
  searchTerm: string
  filter: string
  sort: string
}

export function AnalyticsDashboard({ userId, searchTerm, filter, sort }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<{
    totalViews: number
    totalMessages: number
    totalFavorites: number
    totalShares: number
    recentActivity: AnalyticsEvent[]
  } | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      }
    }

    fetchAnalytics()
  }, [])

  if (!analytics) {
    return <div>Loading analytics...</div>
  }

  const chartData = [
    { name: 'Views', value: analytics.totalViews },
    { name: 'Messages', value: analytics.totalMessages },
    { name: 'Favorites', value: analytics.totalFavorites },
    { name: 'Shares', value: analytics.totalShares },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalFavorites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalShares}</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bar Chart</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <BarChart data={chartData} width={400} height={300}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Line Chart</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <LineChart data={chartData} width={400} height={300}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pie Chart</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}}>
              <PieChart width={400} height={300}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" label />
                <RechartsTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {analytics.recentActivity.map((event) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <img
                        src={event.listing.images[0]?.url || '/placeholder.svg'}
                        alt={event.listing.title}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{event.listing.title}</h4>
                      <span className="text-sm text-primary">${event.listing.price}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground capitalize">
                        {event.event_type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Actionable Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actionable Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium">Increase Listing Views</h4>
                <p className="text-sm text-muted-foreground">
                  Consider updating your listing title and description to include more relevant keywords.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium">Boost Engagement</h4>
                <p className="text-sm text-muted-foreground">
                  Respond to messages promptly to increase user engagement and satisfaction.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
