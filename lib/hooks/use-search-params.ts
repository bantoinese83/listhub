'use client'

import { useSearchParams as useNextSearchParams } from 'next/navigation'

export interface ListingSearchParams {
  category?: string
  subcategory?: string
  location?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  tag?: string
  q?: string
  distance?: string
}

export function useSearchParams() {
  const searchParams = useNextSearchParams()

  const getParam = (key: keyof ListingSearchParams): string | undefined => {
    return searchParams.get(key) ?? undefined
  }

  const getParams = (): ListingSearchParams => {
    return {
      category: getParam('category'),
      subcategory: getParam('subcategory'),
      location: getParam('location'),
      minPrice: getParam('minPrice'),
      maxPrice: getParam('maxPrice'),
      sort: getParam('sort'),
      tag: getParam('tag'),
      q: getParam('q'),
      distance: getParam('distance'),
    }
  }

  return {
    getParam,
    getParams,
  }
}

// Server-side helper
export function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }): ListingSearchParams {
  return {
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    subcategory: typeof searchParams.subcategory === 'string' ? searchParams.subcategory : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    minPrice: typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined,
    maxPrice: typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined,
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : undefined,
    tag: typeof searchParams.tag === 'string' ? searchParams.tag : undefined,
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    distance: typeof searchParams.distance === 'string' ? searchParams.distance : undefined,
  }
} 