"use client"

import { useState, useEffect } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import GooglePlacesAutocomplete from "@/components/google-places-autocomplete"
import LocationMapPreview from "@/components/location-map-preview"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Control, UseFormSetValue } from "react-hook-form"
import type { FormValues } from "@/lib/types/form"

interface LocationFieldProps {
  control: Control<FormValues, any>
  setValue: UseFormSetValue<FormValues>
  disabled?: boolean
}

export default function LocationField({ control, setValue, disabled = false }: LocationFieldProps) {
  const [locationSearch, setLocationSearch] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get current location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  const handleGetCurrentLocation = () => {
    if (!currentLocation) return

    setIsLoadingLocation(true)
    const geocoder = new window.google.maps.Geocoder()
    const latlng = { lat: currentLocation.lat, lng: currentLocation.lng }

    geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      setIsLoadingLocation(false)
      if (status === "OK" && results?.[0]) {
        const place = results[0]
        const locationName = place.formatted_address || ""
        const state = place.address_components?.find(
          (component: { types: string[] }) => component.types.includes("administrative_area_level_1")
        )?.long_name || ""

        setLocationSearch(locationName)
        setValue("location", {
          name: locationName,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          state,
        })
      }
    })
  }

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <div className="space-y-4">
            <div className="flex gap-2">
              <FormControl>
                <GooglePlacesAutocomplete
                  value={locationSearch}
                  onChange={setLocationSearch}
                  onPlaceSelect={(place) => {
                    if (place.geometry?.location) {
                      const locationName = place.formatted_address || ""
                      const state = place.address_components?.find(
                        (component: { types: string[] }) => component.types.includes("administrative_area_level_1")
                      )?.long_name || ""
                      
                      field.onChange({
                        name: locationName,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        state,
                      })
                    }
                  }}
                  placeholder="Search for a location"
                  disabled={disabled}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGetCurrentLocation}
                disabled={disabled || isLoadingLocation || !currentLocation}
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
                  </svg>
                )}
              </Button>
            </div>
            {field.value?.latitude && 
             field.value?.longitude && 
             typeof field.value.latitude === 'number' && 
             typeof field.value.longitude === 'number' && 
             !isNaN(field.value.latitude) && 
             !isNaN(field.value.longitude) && (
              <LocationMapPreview
                latitude={field.value.latitude}
                longitude={field.value.longitude}
                locationName={field.value.name}
              />
            )}
          </div>
          <FormDescription>Enter the location where your item is available</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 