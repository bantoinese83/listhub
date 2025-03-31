import { useEffect, useState } from "react"

// Singleton to track loading state
let isLoading = false
let loadPromise: Promise<void> | null = null
let scriptElement: HTMLScriptElement | null = null

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
      // Check if script is already in the document
      scriptElement = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement
      
      if (scriptElement) {
        // If script exists but not loaded yet, wait for it
        if (!window.google?.maps) {
          scriptElement.onload = () => {
            if (window.google?.maps) {
              setIsLoaded(true)
              resolve()
            } else {
              const error = new Error("Google Maps failed to load")
              setError(error)
              reject(error)
            }
          }
        } else {
          setIsLoaded(true)
          resolve()
        }
        return
      }

      // Create and load the script
      scriptElement = document.createElement("script")
      scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
      scriptElement.async = true
      scriptElement.defer = true

      scriptElement.onload = () => {
        if (window.google?.maps) {
          setIsLoaded(true)
          resolve()
        } else {
          const error = new Error("Google Maps failed to load")
          setError(error)
          reject(error)
        }
      }

      scriptElement.onerror = () => {
        const error = new Error("Failed to load Google Maps script")
        setError(error)
        reject(error)
      }

      document.head.appendChild(scriptElement)
    })

    // Cleanup function
    return () => {
      // Only remove the script if we were the ones who added it
      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement)
        scriptElement = null
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
    google?: {
      maps: any
    }
  }
} 