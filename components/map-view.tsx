"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Loader, X, MapPin, Search } from "lucide-react"
import { useGoogleMaps } from "@/lib/hooks/use-google-maps"
import type { ListingWithDetails } from "@/lib/supabase/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import MapLegend from "@/components/map-legend"
import { format } from "date-fns"

interface MapViewProps {
  latitude: number
  longitude: number
  name: string
  listings?: ListingWithDetails[]
  isLoading?: boolean
}

export default function MapView({ latitude, longitude, name, listings = [], isLoading = false }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [selectedListing, setSelectedListing] = useState<ListingWithDetails | null>(null)
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const isLoaded = useGoogleMaps()

  // Calculate statistics for the legend
  const legendData = useMemo(() => {
    if (!listings.length) return null

    const prices = listings.map(l => l.price).filter((price): price is number => price !== null)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const dates = listings.map(l => new Date(l.created_at))
    const startDate = format(new Date(Math.min(...dates.map(d => d.getTime()))), 'MMM d, yyyy')
    const endDate = format(new Date(Math.max(...dates.map(d => d.getTime()))), 'MMM d, yyyy')

    // Group listings by category
    const categoryCounts = listings.reduce((acc, listing) => {
      if (listing.category?.name) {
        acc[listing.category.name] = (acc[listing.category.name] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return {
      totalListings: listings.length,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      dateRange: {
        start: startDate,
        end: endDate,
      },
      categories,
    }
  }, [listings])

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      // Add center marker
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: newMap,
        title: name,
      })

      // Initialize search box
      const input = document.getElementById("location-search") as HTMLInputElement
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
        })
        setSearchBox(autocomplete)

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()
          if (place.geometry?.location) {
            newMap.setCenter(place.geometry.location)
            newMap.setZoom(14)
          }
        })
      }
    }
  }, [isLoaded, latitude, longitude, name])

  useEffect(() => {
    if (!map || !listings.length) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Add markers for each listing
    listings.forEach(listing => {
      if (listing.location?.latitude && listing.location?.longitude) {
        const marker = new window.google.maps.Marker({
          position: { 
            lat: listing.location.latitude, 
            lng: listing.location.longitude 
          },
          map,
          title: listing.title,
        })

        // Add click listener to marker
        marker.addListener("click", () => {
          setSelectedListing(listing)
        })

        newMarkers.push(marker)
      }
    })

    setMarkers(newMarkers)

    // Cleanup
    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, listings])

  const handleMyLocation = () => {
    if (!map) return
    setIsLocating(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.setCenter(pos)
          map.setZoom(14)
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        }
      )
    } else {
      setIsLocating(false)
    }
  }

  return (
    <div className="relative h-full w-full">
      {(!isLoaded || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location-search"
            placeholder="Search location..."
            className="pl-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleMyLocation}
          disabled={isLocating}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          {isLocating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map Legend */}
      {legendData && <MapLegend {...legendData} />}
      
      {/* Listing Preview Panel */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background rounded-lg shadow-lg border">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{selectedListing.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedListing(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={selectedListing.images?.[0]?.url || "/placeholder.png"}
                  alt={selectedListing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedListing.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">${selectedListing.price}</p>
                  <Button asChild size="sm">
                    <Link href={`/listings/${selectedListing.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

