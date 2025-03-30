import Link from "next/link"
import { Button } from "@/components/ui/button"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  pathname: "/404",
  noIndex: true,
})

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/browse">Browse Listings</Link>
        </Button>
      </div>
    </div>
  )
}

