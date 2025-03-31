import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { subscriptionFeatures } from "@/lib/types/subscription"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return res
  }

  // Get user's subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select()
    .eq("user_id", user.id)
    .single()

  const tier = subscription?.tier || "free"
  const features = subscriptionFeatures[tier as keyof typeof subscriptionFeatures]

  // Check if the request is for creating a new listing
  if (req.nextUrl.pathname === "/listings/new") {
    // Get user's active listings count
    const { count } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active")

    const listingLimit = features.limits.listings

    if (listingLimit !== -1 && (count || 0) >= listingLimit) {
      return NextResponse.redirect(new URL("/dashboard/subscription", req.url))
    }
  }

  // Check if the request is for uploading images
  if (req.nextUrl.pathname.includes("/api/upload")) {
    const imageLimit = features.limits.imagesPerListing
    if (imageLimit !== -1) {
      // Add image limit to request headers
      res.headers.set("X-Image-Limit", imageLimit.toString())
    }
  }

  // Check if the request is for API access
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const hasApiAccess = features.limits.apiAccess
    if (!hasApiAccess) {
      return new NextResponse("API access requires a paid subscription", {
        status: 403,
      })
    }
  }

  return res
}

export const config = {
  matcher: [
    "/listings/new",
    "/api/upload/:path*",
    "/api/:path*",
  ],
} 