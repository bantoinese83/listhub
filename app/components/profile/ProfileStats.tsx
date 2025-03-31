"use client"

import React from 'react'
import { BarChart3, Eye, Heart, MessageCircle, Share2, Star, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProfileStatsProps {
  stats: {
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
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const [activeTab, setActiveTab] = React.useState('overview')

  const StatCard = ({ icon: Icon, title, value, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Eye}
            title="Total Views"
            value={stats.views.toLocaleString()}
            description={`${stats.monthlyGrowth.views >= 0 ? '+' : ''}${stats.monthlyGrowth.views.toFixed(1)}% from last month`}
          />
          <StatCard
            icon={Users}
            title="Followers"
            value={stats.followers.toLocaleString()}
            description={`Following ${stats.following.toLocaleString()}`}
          />
          <StatCard
            icon={Star}
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            description={`From ${stats.ratings.toLocaleString()} ratings`}
          />
          <StatCard
            icon={MessageCircle}
            title="Messages"
            value={stats.messages.toLocaleString()}
            description="Active conversations"
          />
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>
              Your profile view statistics for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.viewsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="engagement" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Heart}
            title="Total Likes"
            value={stats.likes.toLocaleString()}
            description={`${stats.monthlyGrowth.likes >= 0 ? '+' : ''}${stats.monthlyGrowth.likes.toFixed(1)}% from last month`}
          />
          <StatCard
            icon={Share2}
            title="Total Shares"
            value={stats.shares.toLocaleString()}
            description={`${stats.monthlyGrowth.shares >= 0 ? '+' : ''}${stats.monthlyGrowth.shares.toFixed(1)}% from last month`}
          />
          <StatCard
            icon={TrendingUp}
            title="Engagement Rate"
            value={`${stats.views > 0 ? ((stats.likes + stats.shares) / stats.views * 100).toFixed(1) : '0'}%`}
            description="Based on total views"
          />
          <StatCard
            icon={BarChart3}
            title="Daily Average"
            value={(stats.views / 30).toFixed(0)}
            description="Views per day"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Summary</CardTitle>
            <CardDescription>
              A detailed breakdown of your profile engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Heart className="mb-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Likes</span>
                  <span className="text-2xl font-bold">{stats.likes.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Share2 className="mb-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Shares</span>
                  <span className="text-2xl font-bold">{stats.shares.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <MessageCircle className="mb-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Messages</span>
                  <span className="text-2xl font-bold">{stats.messages.toLocaleString()}</span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-medium">Quick Facts</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Most active day: {stats.quickFacts.mostActiveDay}</li>
                  <li>• Peak viewing hours: {stats.quickFacts.peakHours}</li>
                  <li>• Top engagement source: {stats.quickFacts.topEngagementSource}</li>
                  <li>• Follower growth rate: {stats.monthlyGrowth.followers >= 0 ? '+' : ''}{stats.monthlyGrowth.followers.toFixed(1)}% this month</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 