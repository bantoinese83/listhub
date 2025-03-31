import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useState } from 'react'

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

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date')

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (value) => {
    setFilter(value)
  }

  const handleSortChange = (value) => {
    setSort(value)
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

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="messages">Messages</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="shares">Shares</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnalyticsDashboard userId={user.id} searchTerm={searchTerm} filter={filter} sort={sort} />
      </div>
    </div>
  )
}
