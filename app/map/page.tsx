import { Suspense } from "react"
import { ListingService } from "@/lib/services/listing-service"
import { parseSearchParams } from "@/lib/utils/search-params"
import MapView from "@/components/map-view"
import MapSkeleton from "@/components/map-skeleton"
import MapFilters from "@/components/map-filters"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Map View | Find Listings Near You",
  description: "Browse listings on an interactive map to find items near your location",
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
          <MapFilters searchParams={params} />
        </div>

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
    </div>
  )
}

