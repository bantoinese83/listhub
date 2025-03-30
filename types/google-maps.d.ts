declare global {
  interface Window {
    google: typeof google
    initGoogleMaps: () => void
  }
}

declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions)
    setCenter(latLng: LatLng | LatLngLiteral): void
    setZoom(zoom: number): void
  }

  class Marker {
    constructor(options?: MarkerOptions)
    setMap(map: Map | null): void
    addListener(eventName: string, handler: () => void): void
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    mapTypeControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    map?: Map
    title?: string
  }

  interface LatLng {
    lat(): number
    lng(): number
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }
} 