import { Metadata } from 'next'
import { getListings } from '@/lib/supabase/api'
import { getCategories } from '@/lib/supabase/api'
import ListingGrid from '@/components/listing-grid'
import { CategoryStructureWrapper } from '@/components/category-structure-wrapper'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: 'Browse Listings',
  description: 'Browse all listings on ListHub',
  pathname: '/browse',
})

interface BrowsePageProps {
  searchParams: {
    q?: string
    category?: string
    subcategory?: string
    location?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    tag?: string
  }
}

async function ListingsContent({ searchParams }: { searchParams: BrowsePageProps["searchParams"] }) {
  const params = await Promise.resolve(searchParams)
  const response = await getListings({
    query: params.q,
    category: params.subcategory || params.category,
    location: params.location,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
    tag: params.tag,
  })

  return <ListingGrid listings={response.listings} />
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const categories = await getCategories()
  const params = await Promise.resolve(searchParams)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <CategoryStructureWrapper
            categories={categories}
            initialOpenCategories={params.category ? [params.category] : []}
            showCounts={true}
            selectedCategory={params.category}
            selectedSubcategory={params.subcategory}
          />
        </div>
        <div className="md:col-span-3">
          <ListingsContent searchParams={params} />
        </div>
      </div>
    </div>
  )
}

