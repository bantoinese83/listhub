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

  namespace places {
    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
      addListener(eventName: string, handler: () => void): void
      getPlace(): Place
    }

    interface AutocompleteOptions {
      types?: string[]
    }

    interface Place {
      name?: string
      formatted_address?: string
      address_components?: Array<{
        long_name: string
        short_name: string
        types: string[]
      }>
      geometry?: {
        location: LatLng
      }
      types?: string[]
    }
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    mapTypeControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
    zoomControl?: boolean
    zoomControlOptions?: ZoomControlOptions
  }

  interface MarkerOptions {
    position?: LatLng | LatLngLiteral
    map?: Map
    title?: string
    icon?: string | Icon | Symbol
    animation?: Animation
    zIndex?: number
  }

  interface InfoWindowOptions {
    content?: string
  }

  interface LatLng {
    lat(): number
    lng(): number
  }

  interface LatLngBounds {
    extend(point: LatLng): void
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
    RIGHT_BOTTOM = 0,
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

  interface GeocoderResult {
    address_components: Array<{
      long_name: string
      short_name: string
      types: string[]
    }>
    formatted_address: string
    geometry: {
      location: LatLng
    }
  }

  type GeocoderStatus = "OK" | "ZERO_RESULTS" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "INVALID_REQUEST"

  interface Geocoder {
    geocode(
      request: GeocoderRequest,
      callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
    ): void
  }

  interface GeocoderRequest {
    address?: string
    location?: LatLng | LatLngLiteral
    placeId?: string
    region?: string
    bounds?: LatLngBounds | LatLngBoundsLiteral
    componentRestrictions?: GeocoderComponentRestrictions
  }

  interface GeocoderComponentRestrictions {
    country: string | string[]
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface LatLngBoundsLiteral {
    north: number
    south: number
    east: number
    west: number
  }

  interface Autocomplete {
    addListener(eventName: string, handler: () => void): void
    getPlace(): Place
  }

  interface AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (
        predictions: AutocompletePrediction[] | null,
        status: PlacesServiceStatus
      ) => void
    ): void
  }

  interface AutocompletionRequest {
    input: string
    bounds?: LatLngBounds | LatLngBoundsLiteral
    componentRestrictions?: GeocoderComponentRestrictions
    location?: LatLng
    offset?: number
    radius?: number
    types?: string[]
  }

  interface AutocompletePrediction {
    description: string
    matched_substrings: Array<{
      length: number
      offset: number
    }>
    place_id: string
    reference: string
    structured_formatting?: {
      main_text: string
      secondary_text: string
      main_text_matched_substrings: Array<{
        length: number
        offset: number
      }>
      secondary_text_matched_substrings: Array<{
        length: number
        offset: number
      }>
    }
    terms: Array<{
      offset: number
      value: string
    }>
    types: string[]
  }

  type PlacesServiceStatus =
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"

  interface PlacesService {
    findPlaceFromQuery(
      request: TextSearchRequest,
      callback: (
        results: Place[] | null,
        status: PlacesServiceStatus,
        pagination: PlacesSearchPagination
      ) => void
    ): void
  }

  interface TextSearchRequest {
    query: string
    bounds?: LatLngBounds | LatLngBoundsLiteral
    location?: LatLng
    radius?: number
    type?: string
  }

  interface PlacesSearchPagination {
    hasNextPage: boolean
  }
} 