"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"
import { useGoogleMaps } from "@/lib/hooks/use-google-maps"
import type { ListingWithDetails } from "@/lib/supabase/schema"

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
  const isLoaded = useGoogleMaps()

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      // Add center marker
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: newMap,
        title: name,
      })
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
          // TODO: Handle marker click (e.g., show listing details)
          console.log("Clicked listing:", listing.id)
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

  return (
    <div className="relative h-full w-full">
      {(!isLoaded || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}

