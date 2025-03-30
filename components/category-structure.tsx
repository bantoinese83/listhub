"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Folder, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { getCategoryCounts } from "@/lib/supabase/client-api"
import type { Category } from "@/lib/supabase/schema"

interface CategoryStructureProps {
  categories: Category[]
  initialOpenCategories?: string[]
  showCounts?: boolean
  onCategorySelect?: (categoryId: string, subcategoryId?: string) => void
  selectedCategory?: string
  selectedSubcategory?: string
}

export default function CategoryStructure({
  categories: initialCategories,
  initialOpenCategories = [],
  showCounts = false,
  onCategorySelect,
  selectedCategory,
  selectedSubcategory,
}: CategoryStructureProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [openCategories, setOpenCategories] = useState<string[]>(initialOpenCategories)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCategoryCounts() {
      if (!showCounts) return

      try {
        const counts = await getCategoryCounts()
        setCategoryCounts(counts)
      } catch (error) {
        console.error("Error fetching category counts:", error)
      }
    }

    fetchCategoryCounts()
  }, [showCounts])

  // Toggle category open/closed state
  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Get top-level categories
  const topLevelCategories = categories.filter((cat) => !cat.parent_id)

  // Get subcategories for a parent category
  const getSubcategories = (parentId: string) => {
    return categories.filter((cat) => cat.parent_id === parentId)
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId, subcategoryId)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {topLevelCategories.map((category) => (
        <Collapsible
          key={category.id}
          open={openCategories.includes(category.id)}
          onOpenChange={() => toggleCategory(category.id)}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-between rounded-none ${
                selectedCategory === category.id && !selectedSubcategory
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : ""
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                <span>{category.name}</span>
                {showCounts && categoryCounts[category.id] && (
                  <Badge variant="secondary" className="ml-2">
                    {categoryCounts[category.id]}
                  </Badge>
                )}
              </div>
              {openCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="bg-muted/30">
            <div className="p-2 space-y-1">
              {getSubcategories(category.id).map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant="ghost"
                  className={`w-full justify-start pl-6 ${
                    selectedSubcategory === subcategory.id
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => handleCategorySelect(category.id, subcategory.id)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  <span>{subcategory.name}</span>
                  {showCounts && categoryCounts[subcategory.id] && (
                    <Badge variant="secondary" className="ml-2">
                      {categoryCounts[subcategory.id]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

