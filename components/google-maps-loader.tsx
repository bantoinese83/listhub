"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface GoogleMapsLoaderProps {
  children: React.ReactNode
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google) {
      setIsLoaded(true)
      return
    }

    // Create and load the script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load Google Maps. Please try again later.",
        variant: "destructive",
      })
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script)
    }
  }, [toast])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
} 