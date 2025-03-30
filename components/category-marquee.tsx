import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Marquee } from "@/components/ui/marquee"
import type { Category } from "@/lib/supabase/schema"

interface CategoryMarqueeProps {
  categories: Category[]
}

export default function CategoryMarquee({ categories }: CategoryMarqueeProps) {
  const firstRow = categories.slice(0, Math.ceil(categories.length / 2))
  const secondRow = categories.slice(Math.ceil(categories.length / 2))

  const CategoryCard = ({ category }: { category: Category }) => {
    return (
      <Link href={`/categories/${category.slug}`}>
        <Card className="relative h-48 w-64 cursor-pointer overflow-hidden transition-all hover:shadow-md">
          <div className="absolute inset-0">
            <Image
              src={category.image_url || "/placeholder.svg?height=200&width=300"}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <CardContent className="relative flex h-full flex-col justify-end p-4">
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-sm text-white/80">{category.description}</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  )
} 