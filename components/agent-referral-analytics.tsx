import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { 
  Users, 
  Eye, 
  HandshakeIcon, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  AlertCircle,
  DollarSign
} from "lucide-react"

interface ReferralStats {
  total: number
  contacted: number
  viewing: number
  offer: number
  completed: number
  cancelled: number
  conversionRate: number
  ineligibleReferrals: number
  averageListingPrice: number
}

interface AgentReferralAnalyticsProps {
  agentId: string
  listingId?: string
}

export function AgentReferralAnalytics({ agentId, listingId }: AgentReferralAnalyticsProps) {
  const [stats, setStats] = useState<ReferralStats>({
    total: 0,
    contacted: 0,
    viewing: 0,
    offer: 0,
    completed: 0,
    cancelled: 0,
    conversionRate: 0,
    ineligibleReferrals: 0,
    averageListingPrice: 0
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let query = supabase
          .from("agent_referrals")
          .select("*, listings(price)")
          .eq("agent_id", agentId)

        if (listingId) {
          query = query.eq("listing_id", listingId)
        }

        const { data, error } = await query

        if (error) throw error

        // Filter out referrals for listings under $1000
        const eligibleReferrals = data.filter(r => r.listings?.price >= 1000)
        const ineligibleReferrals = data.filter(r => r.listings?.price < 1000)

        const statsData: ReferralStats = {
          total: eligibleReferrals.length,
          contacted: eligibleReferrals.filter(r => r.status === "contacted").length,
          viewing: eligibleReferrals.filter(r => r.status === "viewing").length,
          offer: eligibleReferrals.filter(r => r.status === "offer").length,
          completed: eligibleReferrals.filter(r => r.status === "completed").length,
          cancelled: eligibleReferrals.filter(r => r.status === "cancelled").length,
          conversionRate: 0,
          ineligibleReferrals: ineligibleReferrals.length,
          averageListingPrice: eligibleReferrals.length > 0
            ? eligibleReferrals.reduce((sum, r) => sum + (r.listings?.price || 0), 0) / eligibleReferrals.length
            : 0
        }

        // Calculate conversion rate (completed / total excluding cancelled)
        const activeReferrals = statsData.total - statsData.cancelled
        statsData.conversionRate = activeReferrals > 0 
          ? (statsData.completed / activeReferrals) * 100 
          : 0

        setStats(statsData)
      } catch (error) {
        console.error("Error fetching referral stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [agentId, listingId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {stats.ineligibleReferrals > 0 && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            {stats.ineligibleReferrals} referral{stats.ineligibleReferrals === 1 ? ' is' : 's are'} for listings under $1,000 and {stats.ineligibleReferrals === 1 ? 'is' : 'are'} not eligible for agent representation.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers</CardTitle>
            <HandshakeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offer}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Listing Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageListingPrice)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 