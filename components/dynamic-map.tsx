"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"
import { useGoogleMaps } from "@/lib/hooks/use-google-maps"
import type { ListingWithDetails } from "@/lib/supabase/schema"

interface DynamicMapProps {
  listings: ListingWithDetails[]
  isLoading?: boolean
}

export default function DynamicMap({ listings, isLoading = false }: DynamicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [error, setError] = useState<Error | null>(null)
  const isLoaded = useGoogleMaps()

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    const mapOptions = {
      center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }

    try {
      if (!window.google?.maps) {
        throw new Error("Google Maps not loaded")
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)
    } catch (error) {
      console.error("Error initializing map:", error)
      setError(error instanceof Error ? error : new Error("Failed to initialize map"))
    }

    return () => {
      // Cleanup markers when component unmounts
      markers.forEach(marker => marker.setMap(null))
    }
  }, [isLoaded, map])

  // Update markers when listings change
  useEffect(() => {
    if (!map || !listings.length || !window.google?.maps) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Add markers for each listing
    listings.forEach(listing => {
      if (listing.location?.latitude && listing.location?.longitude) {
        try {
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
            // TODO: Handle marker click (e.g., show listing details)
            console.log("Clicked listing:", listing.id)
          })

          newMarkers.push(marker)
        } catch (error) {
          console.error("Error creating marker:", error)
          setError(error instanceof Error ? error : new Error("Failed to create marker"))
        }
      }
    })

    setMarkers(newMarkers)

    // Cleanup
    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, listings])

  if (!isLoaded || isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/50">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/50">
        <div className="text-center">
          <p className="text-red-500">Failed to load map</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full" />
}

