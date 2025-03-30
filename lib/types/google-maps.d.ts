declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google.maps {
  class Map {
    constructor(element: HTMLElement, options?: MapOptions)
    setCenter(latLng: LatLng | LatLngLiteral): void
    setZoom(zoom: number): void
    getZoom(): number
    fitBounds(bounds: LatLngBounds): void
  }

  class Marker {
    constructor(options?: MarkerOptions)
    setMap(map: Map | null): void
    getPosition(): LatLng
  }

  class InfoWindow {
    constructor(options?: InfoWindowOptions)
    setContent(content: string): void
    open(map: Map, marker: Marker): void
    close(): void
  }

  class LatLng {
    constructor(lat: number, lng: number)
  }

  class LatLngBounds {
    constructor()
    extend(latLng: LatLng): void
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    mapTypeControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
    zoomControlOptions?: ZoomControlOptions
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    map?: Map | null
    title?: string
    icon?: string | Icon | Symbol
    animation?: Animation
    zIndex?: number
  }

  interface InfoWindowOptions {
    content?: string
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface Icon {
    url: string
    scaledSize?: Size
    origin?: Point
    anchor?: Point
  }

  interface Symbol {
    path: SymbolPath
    scale: number
    fillColor?: string
    fillOpacity?: number
    strokeColor?: string
    strokeWeight?: number
  }

  interface Size {
    width: number
    height: number
  }

  interface Point {
    x: number
    y: number
  }

  interface ZoomControlOptions {
    position?: ControlPosition
  }

  enum ControlPosition {
    TOP = 0,
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM = 4,
    BOTTOM_RIGHT = 5,
    LEFT_TOP = 6,
    RIGHT_TOP = 7,
    LEFT_BOTTOM = 8,
    RIGHT_BOTTOM = 9,
    LEFT = 10,
    RIGHT = 11,
  }

  enum Animation {
    BOUNCE = 1,
    DROP = 2,
  }

  enum SymbolPath {
    CIRCLE = 0,
    BACKWARD_CLOSED_ARROW = 1,
    BACKWARD_OPEN_ARROW = 2,
    FORWARD_CLOSED_ARROW = 3,
    FORWARD_OPEN_ARROW = 4,
  }
} 