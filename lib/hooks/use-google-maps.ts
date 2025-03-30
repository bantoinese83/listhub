import { useEffect, useState } from "react"

// Singleton to track loading state
let isLoading = false
let loadPromise: Promise<void> | null = null

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // If Google Maps is already loaded, don't load it again
    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    // If already loading, wait for the existing load promise
    if (isLoading) {
      loadPromise?.then(() => {
        if (window.google?.maps) {
          setIsLoaded(true)
        } else {
          setError(new Error("Google Maps failed to load"))
        }
      })
      return
    }

    // Start loading
    isLoading = true
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initGoogleMaps`
      script.async = true
      script.defer = true

      // Define the callback function that Google Maps will call when loaded
      window.initGoogleMaps = () => {
        if (window.google?.maps) {
          setIsLoaded(true)
          resolve()
        } else {
          const error = new Error("Google Maps failed to load")
          setError(error)
          reject(error)
        }
      }

      script.onerror = () => {
        const error = new Error("Failed to load Google Maps script")
        setError(error)
        reject(error)
      }

      document.head.appendChild(script)
    })

    // Cleanup function
    return () => {
      // Only remove the script if we were the ones who added it
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement
      if (script && document.head.contains(script)) {
        document.head.removeChild(script)
      }
      // Don't delete the callback if other instances might need it
      if (window.initGoogleMaps === script?.onload) {
        window.initGoogleMaps = () => {}
      }
    }
  }, [])

  if (error) {
    console.error("Google Maps loading error:", error)
  }

  return isLoaded
}

// Add type declaration for the callback
declare global {
  interface Window {
    initGoogleMaps: () => void
    google?: {
      maps: any
    }
  }
} 