"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import GoogleMapsLoader from "@/components/google-maps-loader"

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.Place) => void
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

function GooglePlacesAutocompleteInput({
  onPlaceSelect,
  placeholder = "Search location...",
  className = "",
  value,
  onChange,
  disabled = false,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!inputRef.current) return

    // Initialize Google Places Autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    })

    // Store the autocomplete instance
    autocompleteRef.current = autocomplete

    // Add place changed listener
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        onPlaceSelect(place)
      }
    })

    // Cleanup
    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener)
      }
    }
  }, [onPlaceSelect])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}

export default function GooglePlacesAutocomplete(props: GooglePlacesAutocompleteProps) {
  return (
    <GoogleMapsLoader>
      <GooglePlacesAutocompleteInput {...props} />
    </GoogleMapsLoader>
  )
} 