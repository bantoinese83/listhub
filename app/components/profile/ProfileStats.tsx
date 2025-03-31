import React from 'react'

interface ProfileStatsProps {
  stats: {
    listings: {
      total: number
      active: number
      sold: number
      pending: number
    }
    views: {
      total: number
      unique: number
      average: number
    }
    contacts: {
      total: number
      responded: number
      pending: number
    }
  }
  onTimeRangeChange?: (range: string) => void
  onExport?: (data: any) => void
}

export default function ProfileStats({ stats, onTimeRangeChange, onExport }: ProfileStatsProps) {
  return (
    <div>
      <div>
        <h3>Listings</h3>
        <p>{stats.listings.total} total listings</p>
        <p>{stats.listings.active} active listings</p>
        <p>{stats.listings.sold} sold listings</p>
        <p>{stats.listings.pending} pending listings</p>
      </div>

      <div>
        <h3>Views</h3>
        <p>{stats.views.total} total views</p>
        <p>{stats.views.unique} unique views</p>
        <p>{stats.views.average} average views per listing</p>
      </div>

      <div>
        <h3>Contacts</h3>
        <p>{stats.contacts.total} total contacts</p>
        <p>{stats.contacts.responded} responded</p>
        <p>{stats.contacts.pending} pending</p>
      </div>

      <div>
        <label htmlFor="timeRange">Time Range</label>
        <select
          id="timeRange"
          onChange={(e) => onTimeRangeChange?.(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <button onClick={() => onExport?.(stats)}>Export Stats</button>
    </div>
  )
} 