"use client"

import Link from "next/link"
import {
  Home,
  Car,
  Briefcase,
  ShoppingBag,
  Sofa,
  Wrench,
  Shirt,
  Smartphone,
  Dumbbell,
  Gamepad2,
  Trophy,
  Users,
  Building,
  Hammer,
  Heart,
  Palette,
  Gift,
  Calendar,
  MessageCircle,
  HelpCircle,
} from "lucide-react"
import { getCategoriesHierarchicalClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/supabase/schema"
import { useEffect, useState } from "react"

// Map of category slugs to icons
const categoryIcons: Record<string, any> = {
  // Marketplace
  marketplace: ShoppingBag,
  vehicles: Car,
  electronics: Smartphone,
  "home-garden": Sofa,
  "clothing-health-beauty": Shirt,
  "hobbies-recreation": Dumbbell,
  "collectibles-business": Trophy,
  other: Gift,

  // Housing
  housing: Home,
  rentals: Building,
  "for-sale": Home,
  "other-housing": Building,

  // Jobs & Gigs
  "jobs-gigs": Briefcase,
  "full-time-part-time": Briefcase,
  "short-term-gigs": Hammer,
  "seeking-work": HelpCircle,

  // Services
  services: Wrench,
  "home-auto": Wrench,
  "personal-wellness": Heart,
  "business-creative": Palette,

  // Community
  community: Users,
  "activities-events": Calendar,
  "groups-clubs": Users,
  "lost-found": HelpCircle,

  // Discussions
  discussions: MessageCircle,
  "interests-hobbies": Gamepad2,
  "life-society": Users,
  "support-advice": Heart,
}

// Map of category slugs to colors
const categoryColors: Record<string, string> = {
  // Marketplace
  marketplace: "bg-blue-100 text-blue-700",
  vehicles: "bg-red-100 text-red-700",
  electronics: "bg-indigo-100 text-indigo-700",
  "home-garden": "bg-green-100 text-green-700",
  "clothing-health-beauty": "bg-pink-100 text-pink-700",
  "hobbies-recreation": "bg-purple-100 text-purple-700",
  "collectibles-business": "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",

  // Housing
  housing: "bg-emerald-100 text-emerald-700",
  rentals: "bg-teal-100 text-teal-700",
  "for-sale": "bg-cyan-100 text-cyan-700",
  "other-housing": "bg-sky-100 text-sky-700",

  // Jobs & Gigs
  "jobs-gigs": "bg-orange-100 text-orange-700",
  "full-time-part-time": "bg-amber-100 text-amber-700",
  "short-term-gigs": "bg-yellow-100 text-yellow-700",
  "seeking-work": "bg-lime-100 text-lime-700",

  // Services
  services: "bg-violet-100 text-violet-700",
  "home-auto": "bg-fuchsia-100 text-fuchsia-700",
  "personal-wellness": "bg-rose-100 text-rose-700",
  "business-creative": "bg-pink-100 text-pink-700",

  // Community
  community: "bg-emerald-100 text-emerald-700",
  "activities-events": "bg-green-100 text-green-700",
  "groups-clubs": "bg-lime-100 text-lime-700",
  "lost-found": "bg-yellow-100 text-yellow-700",

  // Discussions
  discussions: "bg-blue-100 text-blue-700",
  "interests-hobbies": "bg-indigo-100 text-indigo-700",
  "life-society": "bg-violet-100 text-violet-700",
  "support-advice": "bg-purple-100 text-purple-700",
}

interface CategoryWithSubcategories extends Category {
  subcategories: Category[]
}

interface CategoryGridHierarchicalProps {
  initialCategories?: CategoryWithSubcategories[]
}

export default function CategoryGridHierarchical({ initialCategories = [] }: CategoryGridHierarchicalProps) {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(!initialCategories.length)

  useEffect(() => {
    async function loadCategories() {
      if (initialCategories.length > 0) return

      const data = await getCategoriesHierarchicalClient()
      setCategories(data)
      setIsLoading(false)
    }

    loadCategories()
  }, [initialCategories])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <div className="overflow-hidden transition-all hover:shadow-md rounded-lg border bg-card text-card-foreground">
              <div className="p-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="rounded-full p-3 bg-muted animate-pulse">
                    <div className="h-6 w-6" />
                  </div>
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category: CategoryWithSubcategories) => {
        const IconComponent = categoryIcons[category.slug] || ShoppingBag
        const colorClass = categoryColors[category.slug] || "bg-gray-100 text-gray-700"

        return (
          <div key={category.id} className="space-y-4">
            <Link href={`/categories/${category.slug}`}>
              <div className="overflow-hidden transition-all hover:shadow-md rounded-lg border bg-card text-card-foreground">
                <div className="p-6">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className={`rounded-full p-3 ${colorClass}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                  </div>
                </div>
              </div>
            </Link>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categories/${category.slug}/${subcategory.slug}`}
                    className="text-sm p-2 rounded border hover:bg-muted transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

