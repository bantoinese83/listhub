import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/supabase/schema"

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Get top-level categories (those without a parent)
  const topLevelCategories = categories.filter((cat) => !cat.parent_id)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {topLevelCategories.map((category) => {
        // Get subcategories for this category
        const subcategories = categories.filter((cat) => cat.parent_id === category.id)

        return (
          <Card key={category.id} className="group overflow-hidden transition-all hover:shadow-lg">
            <Link href={`/categories/${category.slug}`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image_url || "/placeholder.svg?height=300&width=400"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2 mb-4">{category.description}</p>
                  {subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subcategories.slice(0, 3).map((sub) => (
                        <Badge key={sub.id} variant="secondary" className="bg-white/10 hover:bg-white/20">
                          {sub.name}
                        </Badge>
                      ))}
                      {subcategories.length > 3 && (
                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">
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

