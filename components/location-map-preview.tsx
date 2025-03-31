"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import GoogleMapsLoader from "@/components/google-maps-loader"

interface LocationMapPreviewProps {
  latitude: number
  longitude: number
  locationName: string
  className?: string
}

function LocationMapPreviewContent({
  latitude,
  longitude,
  locationName,
  className = "",
}: LocationMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current!, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      mapInstanceRef.current = map

      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: locationName,
      })

      markerRef.current = marker
    }

    if (window.google?.maps) {
      initMap()
    }
  }, [latitude, longitude, locationName])

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-[200px]" />
      </CardContent>
    </Card>
  )
}

export default function LocationMapPreview(props: LocationMapPreviewProps) {
  return (
    <GoogleMapsLoader>
      <LocationMapPreviewContent {...props} />
    </GoogleMapsLoader>
  )
} 