'use client'

import { useRouter } from 'next/navigation'
import CategoryStructure from './category-structure'
import type { Category } from '@/lib/supabase/schema'

interface CategoryStructureWrapperProps {
  categories: Category[]
  initialOpenCategories: string[]
  showCounts?: boolean
  selectedCategory?: string
  selectedSubcategory?: string
}

export function CategoryStructureWrapper({
  categories,
  initialOpenCategories,
  showCounts = false,
  selectedCategory,
  selectedSubcategory,
}: CategoryStructureWrapperProps) {
  const router = useRouter()

  const handleCategorySelect = (categoryId: string, subcategoryId?: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('category', categoryId)
    if (subcategoryId) {
      url.searchParams.set('subcategory', subcategoryId)
    } else {
      url.searchParams.delete('subcategory')
    }
    router.push(url.toString())
  }

  return (
    <CategoryStructure
      categories={categories}
      initialOpenCategories={initialOpenCategories}
      showCounts={showCounts}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      onCategorySelect={handleCategorySelect}
    />
  )
} 