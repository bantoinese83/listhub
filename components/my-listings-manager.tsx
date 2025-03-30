"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash,
  Eye,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { deleteListing, updateListingStatus } from "@/app/listings/actions"
import { getListingVerificationStatus } from "@/lib/verification/listing-verification"
import PriceReductionDialog from "@/components/price-reduction-dialog"
import type { ListingWithDetails } from "@/lib/supabase/schema"

interface MyListingsManagerProps {
  listings: ListingWithDetails[]
  user: any
  searchParams: {
    status?: string
    sort?: string
    q?: string
  }
}

export default function MyListingsManager({ listings, user, searchParams }: MyListingsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const [filteredListings, setFilteredListings] = useState<ListingWithDetails[]>(listings)
  const [searchTerm, setSearchTerm] = useState(searchParams.q || "")
  const [activeTab, setActiveTab] = useState(searchParams.status || "all")
  const [sortOption, setSortOption] = useState(searchParams.sort || "newest")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, any>>({})

  // Fetch verification statuses for all listings
  useEffect(() => {
    const fetchVerificationStatuses = async () => {
      const statuses: Record<string, any> = {}

      for (const listing of listings) {
        try {
          const status = await getListingVerificationStatus(listing.id)
          statuses[listing.id] = status
        } catch (error) {
          console.error(`Error fetching verification status for listing ${listing.id}:`, error)
        }
      }

      setVerificationStatuses(statuses)
    }

    fetchVerificationStatuses()
  }, [listings])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...listings]

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter((listing) => listing.status === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (listing) => listing.title.toLowerCase().includes(term) || listing.description.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "views":
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
    }

    setFilteredListings(result)
  }, [listings, activeTab, searchTerm, sortOption])

  // Update URL with filters
  const updateUrlWithFilters = () => {
    const params = new URLSearchParams()

    if (activeTab !== "all") {
      params.set("status", activeTab)
    }

    if (sortOption !== "newest") {
      params.set("sort", sortOption)
    }

    if (searchTerm) {
      params.set("q", searchTerm)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlWithFilters()
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setTimeout(() => {
      updateUrlWithFilters()
    }, 0)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value)
    setTimeout(() => {
      updateUrlWithFilters()
    }, 0)
  }

  // Handle delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      setIsDeleting(listingId)

      try {
        const result = await deleteListing(listingId)

        if (result.success) {
          toast({
            title: "Listing deleted",
            description: "Your listing has been deleted successfully.",
          })

          // Remove the deleted listing from the state
          setFilteredListings((prev) => prev.filter((listing) => listing.id !== listingId))
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete listing",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting listing:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  // Handle update listing status
  const handleUpdateStatus = async (listingId: string, status: "active" | "pending" | "sold" | "expired") => {
    setIsUpdatingStatus(listingId)

    try {
      const result = await updateListingStatus(listingId, status)

      if (result.success) {
        toast({
          title: "Status updated",
          description: `Listing has been marked as ${status}.`,
        })

        // Update the status in the state
        setFilteredListings((prev) =>
          prev.map((listing) => (listing.id === listingId ? { ...listing, status } : listing)),
        )
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating listing status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Pending
          </Badge>
        )
      case "sold":
        return (
          <Badge variant="default" className="bg-blue-500">
            Sold
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Expired
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "flagged":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            Flagged
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get verification status badge
  const getVerificationBadge = (listingId: string) => {
    const status = verificationStatuses[listingId]

    if (!status || !status.status) {
      return null
    }

    switch (status.status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Under Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSortChange("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("oldest")}>Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("price-high")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("price-low")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("views")}>Most Views</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredListings.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No listings found</h3>
            <p className="text-muted-foreground">
              {activeTab === "all"
                ? "You haven't created any listings yet."
                : `You don't have any ${activeTab} listings.`}
            </p>
            <Button asChild className="mt-4">
              <Link href="/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Listing
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                  <Image
                    src={listing.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                        {getStatusBadge(listing.status)}
                        {getVerificationBadge(listing.id)}
                        {listing.price_reduced && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            <TrendingDown className="mr-1 h-3 w-3" />
                            {listing.price_reduction_percentage}% Off
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{listing.category.name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Posted {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-primary font-medium">
                        {listing.price ? (
                          <span className="flex items-end gap-2">
                            ${listing.price.toFixed(2)}
                            {listing.original_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${listing.original_price.toFixed(2)}
                              </span>
                            )}
                          </span>
                        ) : (
                          "Price not specified"
                        )}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views} views</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${listing.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${listing.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {listing.status === "active" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(listing.id, "sold")}
                                disabled={isUpdatingStatus === listing.id}
                              >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Mark as Sold
                              </DropdownMenuItem>

                              {listing.price && (
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                                  <PriceReductionDialog
                                    listingId={listing.id}
                                    currentPrice={listing.price}
                                    title={listing.title}
                                  >
                                    <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer">
                                      <TrendingDown className="mr-2 h-4 w-4" />
                                      Reduce Price
                                    </div>
                                  </PriceReductionDialog>
                                </DropdownMenuItem>
                              )}
                            </>
                          )}

                          {listing.status !== "active" && listing.status !== "rejected" && (
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(listing.id, "active")}
                              disabled={isUpdatingStatus === listing.id}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate Listing
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleDeleteListing(listing.id)}
                            disabled={isDeleting === listing.id}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {verificationStatuses[listing.id]?.status === "rejected" && (
                    <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Listing Rejected</p>
                          <p className="text-sm">
                            {verificationStatuses[listing.id]?.reviewerNotes ||
                              "This listing was rejected. Please review our guidelines and edit your listing."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {listing.status === "pending" && (
                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Listing Under Review</p>
                          <p className="text-sm">
                            Your listing is being reviewed by our team. This usually takes 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

