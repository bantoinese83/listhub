import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import DashboardNav from "@/components/dashboard-nav"
import UserListingsManager from "@/components/user-listings-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getUserListings(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(*),
      user:profiles(*),
      location:locations(*),
      images:listing_images(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user listings:", error)
    return []
  }

  return data as ListingWithDetails[]
}

export default async function UserListingsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = session.user.id
  const userListings = await getUserListings(userId)
  
  // Get listing verification statuses
  const { data: verificationData } = await supabase
    .from("listing_verifications")
    .select("listing_id, status, reviewed_at, reviewer_notes")
    .in("listing_id", userListings.map(listing => listing.id))
  
  // Create a map of listing IDs to verification statuses
  const verificationMap = (verificationData || []).reduce((acc, item) => {
    acc[item.listing_id] = item;
    return acc;
  }, {} as Record<string, any>);
  
  // Count listings by status
  const activeCount = userListings.filter(l => l.status === "active").length;
  const pendingCount = userListings.filter(l => l.status === "pending").length;
  const soldCount = userListings.filter(l => l.status === "sold").length;
  const expiredCount = userListings.filter(l => l.status === "expired").length;
  const rejectedCount = userListings.filter(l => l.status === "rejected").length;

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <DashboardNav />
        </div>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All ({userListings.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1">
                Active ({activeCount})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="sold" className="flex-1">
                Sold ({soldCount})
              </TabsTrigger>
              <TabsTrigger value="other" className="flex-1">
                Other ({expiredCount + rejectedCount})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <UserListingsManager 
                listings={userListings} 
                verificationMap={verificationMap}
              />
            </TabsContent>
            
            <TabsContent value="active">
              <UserListingsManager 
                listings={userListings.filter(l => l.status === "active")} 
                verificationMap={verificationMap}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <UserListingsManager 
                listings={userListings.filter(l => l.status === "pending")} 
                verificationMap={verificationMap}
              />
            </TabsContent>
            
            <TabsContent value="sold">
              <UserListingsManager 
                listings={userListings.filter(l => l.status === "sold")} 
                verificationMap={verificationMap}
              />
            </TabsContent>
            
            <TabsContent value="other">
              <UserListingsManager 
                listings={userListings.filter(l => 
                  l.status === "expired" || l.status === "rejected"
                )} 
                verificationMap={verificationMap}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

