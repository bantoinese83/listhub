"use client"

import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { useState, ChangeEvent } from 'react'

interface AnalyticsClientProps {
  userId: string
}

export function AnalyticsClient({ userId }: AnalyticsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date')

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handleSortChange = (value: string) => {
    setSort(value)
  }

  return (
    <div className="space-y-6">
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

      <AnalyticsDashboard userId={userId} searchTerm={searchTerm} filter={filter} sort={sort} />
    </div>
  )
} 