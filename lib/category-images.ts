import {
  Calendar,
  Music,
  Camera,
  Plane,
  type LucideIcon
} from "lucide-react"

interface CategoryImage {
  unsplash: string
  icon: LucideIcon
  fallbackColor: string
}

export const categoryImages: Record<string, CategoryImage> = {
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