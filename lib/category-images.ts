import {
  Calendar,
  Music,
  Camera,
  Plane,
  Users,
  MessageSquare,
  Home,
  Briefcase,
  ShoppingBag,
  Wrench,
  type LucideIcon
} from "lucide-react"

interface CategoryImage {
  unsplash: string
  icon: LucideIcon
  fallbackColor: string
}

export const categoryImages: Record<string, CategoryImage> = {
  // Community
  "community": {
    unsplash: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    icon: Users,
    fallbackColor: "bg-gradient-to-br from-pink-500 to-rose-500"
  },
  // Discussions
  "discussions": {
    unsplash: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    icon: MessageSquare,
    fallbackColor: "bg-gradient-to-br from-purple-500 to-indigo-500"
  },
  // Housing
  "housing": {
    unsplash: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    icon: Home,
    fallbackColor: "bg-gradient-to-br from-green-500 to-emerald-500"
  },
  // Jobs & Gigs
  "jobs-and-gigs": {
    unsplash: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    icon: Briefcase,
    fallbackColor: "bg-gradient-to-br from-blue-500 to-cyan-500"
  },
  // Marketplace
  "marketplace": {
    unsplash: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
    icon: ShoppingBag,
    fallbackColor: "bg-gradient-to-br from-orange-500 to-amber-500"
  },
  // Services
  "services": {
    unsplash: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80",
    icon: Wrench,
    fallbackColor: "bg-gradient-to-br from-violet-500 to-purple-500"
  },
  // Trending Categories
  "activities-events": {
    unsplash: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    icon: Calendar,
    fallbackColor: "bg-gradient-to-br from-blue-500 to-indigo-500"
  },
  "artists-musicians": {
    unsplash: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=80",
    icon: Music,
    fallbackColor: "bg-gradient-to-br from-amber-500 to-orange-500"
  },
  "audio-visual": {
    unsplash: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=800&auto=format&fit=crop&q=80",
    icon: Camera,
    fallbackColor: "bg-gradient-to-br from-red-500 to-pink-500"
  },
  "aviation": {
    unsplash: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80",
    icon: Plane,
    fallbackColor: "bg-gradient-to-br from-green-500 to-emerald-500"
  }
} 