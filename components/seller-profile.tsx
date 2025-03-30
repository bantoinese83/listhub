"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { User, Star, MessageSquare, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VerificationLevel } from "@/lib/verification/verification-service"
import VerificationBadge from "./verification-badge"

interface SellerProfileProps {
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    created_at: string
  }
  verificationLevel?: VerificationLevel
}

export default function SellerProfile({ user, verificationLevel = VerificationLevel.NONE }: SellerProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  // Calculate member since date
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  // Mock data for seller stats
  const sellerStats = {
    rating: 4.8,
    responseRate: 98,
    responseTime: "Within 2 hours",
    isVerified: verificationLevel !== VerificationLevel.NONE,
    totalListings: 24,
    totalReviews: 42,
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
          {user.avatar_url ? (
            <Image src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          {sellerStats.isVerified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Verified Seller</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{user.full_name}</h3>
            <VerificationBadge level={verificationLevel} size="sm" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm">{sellerStats.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">{sellerStats.totalReviews} reviews</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">{sellerStats.totalListings} listings</span>
          </div>
        </div>

        <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={() => setIsFollowing(!isFollowing)}>
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Member since {memberSince}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Responds {sellerStats.responseTime}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/users/${user.id}`}>View Profile</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/users/${user.id}/listings`}>See All Listings</Link>
        </Button>
      </div>
    </div>
  )
}

