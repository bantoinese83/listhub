"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from '@supabase/ssr'
import type { Location } from "@/lib/supabase/schema"

interface FilterSidebarProps {
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

export default function FilterSidebar({ searchParams }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // State for form values
  const [location, setLocation] = useState(searchParams.location || "")
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "")
  const [sort, setSort] = useState(searchParams.sort || "newest")
  const [tag, setTag] = useState(searchParams.tag || "")

  // State for locations
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch locations on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      // Fetch locations
      const { data: locationsData } = await supabase.from("locations").select("*").order("name")

      if (locationsData) setLocations(locationsData)

      setIsLoading(false)
    }

    fetchData()
  }, [supabase])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchParams.q) {
      params.set("q", searchParams.q)
    }

    if (searchParams.category) {
      params.set("category", searchParams.category)
    }

    if (searchParams.subcategory) {
      params.set("subcategory", searchParams.subcategory)
    }

    if (location) {
      params.set("location", location)
    }

    if (minPrice) {
      params.set("minPrice", minPrice)
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice)
    }

    if (sort) {
      params.set("sort", sort)
    }

    if (tag) {
      params.set("tag", tag)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    // Keep category and subcategory, reset everything else
    const params = new URLSearchParams()

    if (searchParams.q) {
      params.set("q", searchParams.q)
    }

    if (searchParams.category) {
      params.set("category", searchParams.category)
    }

    if (searchParams.subcategory) {
      params.set("subcategory", searchParams.subcategory)
    }

    setLocation("")
    setMinPrice("")
    setMaxPrice("")
    setSort("newest")
    setTag("")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6 sticky top-20">
      <div className="text-lg font-semibold">Filters</div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation} disabled={isLoading}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <span>to</span>
            <div className="flex-1">
              <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Input id="tag" placeholder="Search by tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

