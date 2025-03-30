import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { 
  DollarSign, 
  Percent, 
  BarChart3, 
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react"

interface SalesStats {
  totalSales: number
  totalRevenue: number
  totalCommission: number
  averageCommissionRate: number
  salesThisMonth: number
  monthOverMonthGrowth: number
  averageListingPrice: number
  invalidListings: number
}

interface AgentSalesAnalyticsProps {
  agentId: string
  listingId?: string
}

export function AgentSalesAnalytics({ agentId, listingId }: AgentSalesAnalyticsProps) {
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalCommission: 0,
    averageCommissionRate: 0,
    salesThisMonth: 0,
    monthOverMonthGrowth: 0,
    averageListingPrice: 0,
    invalidListings: 0
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        let query = supabase
          .from("agent_sales")
          .select("*")
          .eq("agent_id", agentId)
          .eq("status", "completed")
          .gte("sale_amount", 1000) // Only include listings >= $1000

        if (listingId) {
          query = query.eq("listing_id", listingId)
        }

        const { data: sales, error } = await query

        if (error) throw error

        // Get invalid listings count (under $1000)
        const { count: invalidCount } = await supabase
          .from("agent_sales")
          .select("*", { count: "exact" })
          .eq("agent_id", agentId)
          .eq("status", "completed")
          .lt("sale_amount", 1000)

        // Calculate total stats
        const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.sale_amount), 0)
        const totalCommission = sales.reduce((sum, sale) => sum + Number(sale.commission_amount), 0)
        const averageCommissionRate = sales.length > 0
          ? sales.reduce((sum, sale) => sum + Number(sale.commission_rate), 0) / sales.length
          : 0
        const averageListingPrice = sales.length > 0
          ? totalRevenue / sales.length
          : 0

        // Calculate monthly stats
        const salesThisMonth = sales.filter(sale => 
          new Date(sale.completed_at) >= firstDayOfMonth
        ).length

        const salesLastMonth = sales.filter(sale =>
          new Date(sale.completed_at) >= firstDayLastMonth &&
          new Date(sale.completed_at) < firstDayOfMonth
        ).length

        const monthOverMonthGrowth = salesLastMonth > 0
          ? ((salesThisMonth - salesLastMonth) / salesLastMonth) * 100
          : 0

        setStats({
          totalSales: sales.length,
          totalRevenue,
          totalCommission,
          averageCommissionRate,
          salesThisMonth,
          monthOverMonthGrowth,
          averageListingPrice,
          invalidListings: invalidCount || 0
        })
      } catch (error) {
        console.error("Error fetching sales stats:", error)
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
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <p className="text-sm text-yellow-700">
          Only listings over $1,000 are eligible for agent representation. 
          {stats.invalidListings > 0 && ` You have ${stats.invalidListings} listing${stats.invalidListings === 1 ? '' : 's'} below this threshold.`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCommissionRate.toFixed(1)}%</div>
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
            <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.salesThisMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthOverMonthGrowth.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 