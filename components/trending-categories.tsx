"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import type { Category } from "@/lib/supabase/schema"
import { categoryImages } from "@/lib/category-images"

// Set of background gradient colors for trending categories
const categoryColors = [
  "from-blue-500 to-indigo-500",
  "from-amber-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-yellow-500 to-amber-500",
]

export default function TrendingCategories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [trendingCategories, setTrendingCategories] = useState<Array<Category & { listingsCount: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleImageError = (categorySlug: string) => {
    setImageErrors(prev => ({ ...prev, [categorySlug]: true }))
  }

  useEffect(() => {
    async function fetchTrendingCategories() {
      setIsLoading(true)

      const { data: categories } = await supabase.from("categories").select("*").order("name")

      if (!categories) {
        setIsLoading(false)
        return
      }

      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from("listings")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("status", "active")

          return {
            ...category,
            listingsCount: count || 0,
          }
        }),
      )

      const trending = categoriesWithCounts.sort((a, b) => b.listingsCount - a.listingsCount).slice(0, 4)
      console.log("Trending category slugs:", trending.map(cat => cat.slug))
      setTrendingCategories(trending)
      setIsLoading(false)
    }

    fetchTrendingCategories()
  }, [supabase])

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Trending Categories</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">Loading trending categories...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="relative h-80 rounded-xl overflow-hidden bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black">
              <span className="inline-flex items-center gap-2">
                <ArrowRight className="w-8 h-8 text-primary" />
                Trending Categories
              </span>
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Discover the most popular categories that are trending right now on our platform.
            </p>
          </div>
          <Link href="/categories" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline">
            View all categories
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCategories.map((category, index) => {
            const categoryImage = categoryImages[category.slug]
            const Icon = categoryImage?.icon

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className="relative h-80 rounded-xl overflow-hidden group"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {imageErrors[category.slug] || !categoryImage ? (
                    <div className={`w-full h-full flex items-center justify-center ${categoryImage?.fallbackColor || 'bg-gradient-to-br from-gray-500 to-gray-600'}`}>
                      {Icon && <Icon className="w-16 h-16 text-white/80" />}
                    </div>
                  ) : (
                    <>
                      <Image
                        src={categoryImage.unsplash}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(category.slug)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90" />
                    </>
                  )}

                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    </div>
                    <p className="text-white/90">{category.listingsCount} active listings</p>

                    <motion.div
                      className="mt-4 flex items-center text-white"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        x: hoveredIndex === index ? 0 : -10,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="mr-2">Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

