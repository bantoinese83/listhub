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

export async function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }): Promise<ListingSearchParams> {
  const params = await Promise.resolve(searchParams)
  
  return {
    category: typeof params.category === 'string' ? params.category : undefined,
    subcategory: typeof params.subcategory === 'string' ? params.subcategory : undefined,
    location: typeof params.location === 'string' ? params.location : undefined,
    minPrice: typeof params.minPrice === 'string' ? params.minPrice : undefined,
    maxPrice: typeof params.maxPrice === 'string' ? params.maxPrice : undefined,
    sort: typeof params.sort === 'string' ? params.sort : undefined,
    tag: typeof params.tag === 'string' ? params.tag : undefined,
    q: typeof params.q === 'string' ? params.q : undefined,
    distance: typeof params.distance === 'string' ? params.distance : undefined,
  }
} 