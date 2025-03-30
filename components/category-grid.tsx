"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/supabase/schema"
import { categoryImages } from "@/lib/category-images"
import { useState } from "react"

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  // Get top-level categories (those without a parent)
  const topLevelCategories = categories.filter((cat) => !cat.parent_id)

  const handleImageError = (categorySlug: string) => {
    setImageErrors(prev => ({ ...prev, [categorySlug]: true }))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {topLevelCategories.map((category) => {
        // Get subcategories for this category
        const subcategories = categories.filter((cat) => cat.parent_id === category.id)
        const categoryImage = categoryImages[category.slug]

        return (
          <Card key={category.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/categories/${category.slug}`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                {imageErrors[category.slug] || !categoryImage ? (
                  <div className={`w-full h-full flex items-center justify-center ${categoryImage?.fallbackColor || 'bg-muted'}`}>
                    {categoryImage?.icon && (
                      <categoryImage.icon className="w-16 h-16 text-foreground/40" />
                    )}
                  </div>
                ) : (
                  <>
                    <Image
                      src={categoryImage.unsplash}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(category.slug)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Single strong gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {categoryImage?.icon && (
                      <categoryImage.icon className="w-6 h-6 text-white" />
                    )}
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm line-clamp-2 mb-4">{category.description}</p>
                  {subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subcategories.slice(0, 3).map((sub) => (
                        <Badge 
                          key={sub.id} 
                          variant="secondary" 
                          className="bg-black/40 hover:bg-black/50 text-white"
                        >
                          {sub.name}
                        </Badge>
                      ))}
                      {subcategories.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="bg-black/40 hover:bg-black/50 text-white"
                        >
                          +{subcategories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}

