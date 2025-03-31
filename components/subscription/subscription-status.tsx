"use client"

import { useSubscription } from "@/lib/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SubscriptionStatus() {
  const {
    status,
    isLoading,
    error,
    hasFeature,
    getLimit,
    isActive,
    isTrialing,
    isCanceled,
    isPastDue,
    isUnpaid,
    getDaysUntilRenewal,
  } = useSubscription()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Error loading subscription status
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return null
  }

  const getStatusColor = () => {
    if (isActive()) return "text-green-500"
    if (isTrialing()) return "text-blue-500"
    if (isCanceled()) return "text-yellow-500"
    if (isPastDue()) return "text-orange-500"
    if (isUnpaid()) return "text-red-500"
    return "text-gray-500"
  }

  const getStatusText = () => {
    if (isActive()) return "Active"
    if (isTrialing()) return "Trialing"
    if (isCanceled()) return "Canceled"
    if (isPastDue()) return "Past Due"
    if (isUnpaid()) return "Unpaid"
    return "Unknown"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>
            Current plan: {status.tier.charAt(0).toUpperCase() + status.tier.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              {isActive() && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Days until renewal</span>
                    <span>{getDaysUntilRenewal()} days</span>
                  </div>
                  <Progress
                    value={(getDaysUntilRenewal() / 30) * 100}
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Listings</span>
                  <span className="text-sm">
                    {getLimit("listings") === -1 ? "Unlimited" : getLimit("listings")}
                  </span>
                </div>
                <Progress
                  value={75}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Images per Listing</span>
                  <span className="text-sm">
                    {getLimit("imagesPerListing") === -1
                      ? "Unlimited"
                      : getLimit("imagesPerListing")}
                  </span>
                </div>
                <Progress
                  value={60}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Featured Duration</span>
                  <span className="text-sm">
                    {getLimit("featuredDuration") === -1
                      ? "Unlimited"
                      : `${getLimit("featuredDuration")} days`}
                  </span>
                </div>
                <Progress
                  value={40}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Access</span>
                  <span className="text-sm">
                    {hasFeature("apiAccess") ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Progress
                  value={hasFeature("apiAccess") ? 100 : 0}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button asChild className="w-full">
            <Link href="/dashboard/subscription">
              {isActive() ? "Manage Subscription" : "Upgrade Plan"}
            </Link>
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
          <CardDescription>
            Features available in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    hasFeature("prioritySupport")
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">Priority Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    hasFeature("customDomain")
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">Custom Domain</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    hasFeature("advancedAnalytics")
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    hasFeature("bulkUpload")
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">Bulk Upload</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 