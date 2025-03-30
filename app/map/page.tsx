import { Suspense } from "react"
import { ListingService } from "@/lib/services/listing-service"
import { parseSearchParams } from "@/lib/utils/search-params"
import MapView from "@/components/map-view"
import MapSkeleton from "@/components/map-skeleton"
import MapFilters from "@/components/map-filters"
import { constructMetadata } from "@/lib/metadata"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, List, Filter } from "lucide-react"
import Link from "next/link"

export const metadata = constructMetadata({
  title: "Map View | Find Listings Near You",
  description: "Browse listings on an interactive map to find items near your location",
  pathname: "/map",
})

interface MapPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await parseSearchParams(searchParams)
  const { listings } = await ListingService.getListings(params)

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Map View</h1>
            <p className="text-muted-foreground">Find listings near you on the map</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/browse">
                <List className="mr-2 h-4 w-4" />
                List View
              </Link>
            </Button>
            <MapFilters searchParams={params} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="h-[calc(100vh-220px)] min-h-[500px] w-full rounded-lg border overflow-hidden">
              <Suspense fallback={<MapSkeleton />}>
                <MapView 
                  latitude={37.7749}
                  longitude={-122.4194}
                  name="San Francisco"
                  listings={listings}
                />
              </Suspense>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use the search box to find specific locations</p>
                <p>• Click the location button to center on your position</p>
                <p>• Click on markers to view listing details</p>
                <p>• Use the zoom controls to adjust the map view</p>
                <p>• Switch to list view for a different browsing experience</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Active Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {params.q && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Search:</span>
                    <span className="font-medium">{params.q}</span>
                  </div>
                )}
                {params.category && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{params.category}</span>
                  </div>
                )}
                {params.distance && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Distance:</span>
                    <span className="font-medium">{params.distance} miles</span>
                  </div>
                )}
                {params.tag && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tag:</span>
                    <span className="font-medium">{params.tag}</span>
                  </div>
                )}
                {!params.q && !params.category && !params.distance && !params.tag && (
                  <p className="text-sm text-muted-foreground">No active filters</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

