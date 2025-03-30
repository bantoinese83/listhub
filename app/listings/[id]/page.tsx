import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MapPin, User, Calendar, Eye, Flag, Heart, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getListingById } from "@/lib/supabase/api"
import ImageCarousel from "@/components/image-carousel"
import ContactSellerForm from "@/components/contact-seller-form"
import MapView from "@/components/map-view"
import RelatedListings from "@/components/related-listings"
import SellerProfile from "@/components/seller-profile"
import SafetyTips from "@/components/safety-tips"
import ShareListing from "@/components/share-listing"
import ListingActions from "@/components/listing-actions"
import { constructMetadata } from "@/lib/metadata"
import { SITE_URL } from "@/lib/constants"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserVerificationStatus } from "@/lib/verification/verification-service"
import { getListingVerificationStatus } from "@/lib/verification/listing-verification"
import VerificationBadge from "@/components/verification-badge"
import ReportListingDialog from "@/components/report-listing-dialog"

interface ListingPageProps {
  params: {
    id: string
  }
}

// Generate metadata for the listing page
export async function generateMetadata({ params }: ListingPageProps) {
  const listing = await getListingById(params.id)

  if (!listing) {
    return constructMetadata({
      title: "Listing Not Found",
      description: "The listing you're looking for doesn't exist or has been removed.",
      noIndex: true,
    })
  }

  return constructMetadata({
    title: listing.title,
    description: listing.description.substring(0, 160),
    image: listing.images[0]?.url,
    type: "product",
    pathname: `/listings/${listing.id}`,
  })
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingById(params.id)

  if (!listing) {
    notFound()
  }

  // Get user verification status
  const userVerification = await getUserVerificationStatus(listing.user_id)

  // Get listing verification status
  const listingVerification = await getListingVerificationStatus(listing.id)

  // Get current user session
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()
  const currentUserId = data.session?.user.id

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/listings/${listing.id}`,
      seller: {
        "@type": "Person",
        name: listing.user.full_name,
      },
    },
    brand: {
      "@type": "Brand",
      name: "ListingHub",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container py-10">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-muted-foreground mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/categories/${listing.category.slug}`} className="hover:text-foreground">
                {listing.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{listing.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Title and badges */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{listing.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{listing.category.name}</Badge>
                  {listing.is_featured && <Badge variant="default">Featured</Badge>}
                  <span className="text-sm text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ListingActions listingId={listing.id} />
                <ShareListing title={listing.title} />
                {currentUserId && currentUserId !== listing.user_id && (
                  <ReportListingDialog listingId={listing.id} userId={currentUserId} listingTitle={listing.title} />
                )}
              </div>
            </div>

            {/* Image carousel */}
            <div className="rounded-lg overflow-hidden border">
              <ImageCarousel images={listing.images} />
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tabs for details */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {listing.location.name}, {listing.location.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{listing.user.full_name}</span>
                    <VerificationBadge level={userVerification.verificationLevel} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Posted {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span>{listing.views} views</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="h-64 rounded-lg overflow-hidden border">
                  <MapView
                    latitude={listing.location.latitude}
                    longitude={listing.location.longitude}
                    name={listing.location.name}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Seller profile */}
            <div className="p-6 border rounded-lg">
              <SellerProfile user={listing.user} verificationLevel={userVerification.verificationLevel} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Price and contact */}
            <div className="rounded-lg border p-6 space-y-4 sticky top-20">
              <div className="text-3xl font-bold">
                {listing.price ? `$${listing.price.toFixed(2)}` : "Price not specified"}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Contact Information</h3>
                <p className="text-muted-foreground">{listing.contact_info}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="lg" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Save to Favorites
                </Button>
                {currentUserId && currentUserId !== listing.user_id && (
                  <ReportListingDialog
                    listingId={listing.id}
                    userId={currentUserId}
                    listingTitle={listing.title}
                    trigger={
                      <Button variant="outline" size="lg" className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        Report Listing
                      </Button>
                    }
                  />
                )}
              </div>

              <Separator />

              <ContactSellerForm listingId={listing.id} sellerId={listing.user_id} />
            </div>

            {/* Safety tips */}
            <SafetyTips />
          </div>
        </div>

        {/* Related listings */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold">Similar Listings</h2>
          <RelatedListings categoryId={listing.category_id} currentListingId={listing.id} />
        </div>
      </div>
    </>
  )
}

