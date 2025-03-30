"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, SlidersHorizontal } from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'
import type { Category } from "@/lib/supabase/schema"
import type { ListingSearchParams } from "@/lib/utils/search-params"

interface MapFiltersProps {
  searchParams: ListingSearchParams
}

export default function MapFilters({ searchParams }: MapFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [searchTerm, setSearchTerm] = useState(searchParams.q || "")
  const [category, setCategory] = useState(searchParams.category || "")
  const [distance, setDistance] = useState(searchParams.distance || "50")
  const [tag, setTag] = useState(searchParams.tag || "")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true)
      const { data } = await supabase.from("categories").select("*").order("name")
      if (data) setCategories(data)
      setIsLoading(false)
    }

    fetchCategories()
  }, [supabase])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set("q", searchTerm)
    if (category) params.set("category", category)
    if (distance) params.set("distance", distance)
    if (tag) params.set("tag", tag)

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="w-full md:w-auto">
      <div className="flex flex-col md:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Map Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="p-0 focus:bg-transparent">
                <div className="px-2 py-1.5 w-full">
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0 focus:bg-transparent">
                <div className="px-2 py-1.5 w-full">
                  <label className="text-sm font-medium mb-1.5 block">Distance (miles)</label>
                  <Select value={distance} onValueChange={setDistance}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0 focus:bg-transparent">
                <div className="px-2 py-1.5 w-full">
                  <label className="text-sm font-medium mb-1.5 block">Tag</label>
                  <Input placeholder="Filter by tag" value={tag} onChange={(e) => setTag(e.target.value)} />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

