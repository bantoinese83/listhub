"use client"

import { useGoogleMaps } from "@/lib/hooks/use-google-maps"
import { Loader2 } from "lucide-react"

interface GoogleMapsLoaderProps {
  children: React.ReactNode
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const isLoaded = useGoogleMaps()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
} 