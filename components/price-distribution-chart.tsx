import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { BarChart3 } from "lucide-react"

interface PriceTier {
  range: string
  count: number
  min: number
  max: number | null
}

const PRICE_TIERS: PriceTier[] = [
  { range: "$1k - $5k", count: 0, min: 1000, max: 5000 },
  { range: "$5k - $10k", count: 0, min: 5000, max: 10000 },
  { range: "$10k - $25k", count: 0, min: 10000, max: 25000 },
  { range: "$25k - $50k", count: 0, min: 25000, max: 50000 },
  { range: "$50k - $100k", count: 0, min: 50000, max: 100000 },
  { range: "$100k+", count: 0, min: 100000, max: null }
]

interface PriceDistributionChartProps {
  agentId: string
  listingId?: string
  showIneligible?: boolean
}

export function PriceDistributionChart({ 
  agentId, 
  listingId,
  showIneligible = false 
}: PriceDistributionChartProps) {
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>(PRICE_TIERS)
  const [loading, setLoading] = useState(true)
  const [maxCount, setMaxCount] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchPriceDistribution = async () => {
      try {
        let query = supabase
          .from("agent_sales")
          .select("sale_amount")
          .eq("agent_id", agentId)
          .eq("status", "completed")

        if (!showIneligible) {
          query = query.gte("sale_amount", 1000)
        }
        
        if (listingId) {
          query = query.eq("listing_id", listingId)
        }

        const { data: sales, error } = await query

        if (error) throw error

        // Reset counts
        const updatedTiers = PRICE_TIERS.map(tier => ({ ...tier, count: 0 }))

        // Count sales in each tier
        sales.forEach(sale => {
          const amount = Number(sale.sale_amount)
          const tier = updatedTiers.find(t => 
            amount >= t.min && (!t.max || amount < t.max)
          )
          if (tier) tier.count++
        })

        // Find max count for bar scaling
        const max = Math.max(...updatedTiers.map(t => t.count))
        setMaxCount(max)
        setPriceTiers(updatedTiers)
      } catch (error) {
        console.error("Error fetching price distribution:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPriceDistribution()
  }, [agentId, listingId, showIneligible])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Price Distribution</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {priceTiers.map(tier => (
            <div key={tier.range} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="w-24 text-muted-foreground">{tier.range}</span>
                <span className="font-medium">{tier.count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ 
                    width: `${maxCount ? (tier.count / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 