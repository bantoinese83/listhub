import type { Metadata } from "next"
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_KEYWORDS } from "./constants"

type MetadataProps = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: "website" | "article" | "product"
  pathname?: string
  noIndex?: boolean
}

export function constructMetadata({
  title,
  description = SITE_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image,
  type = "website",
  pathname = "",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const fullTitle = title ? title + " | " + SITE_NAME : SITE_NAME
  const url = `${SITE_URL}${pathname}`
  const ogImageUrl = image
    ? `${SITE_URL}/api/og?title=${encodeURIComponent(title || SITE_NAME)}&description=${encodeURIComponent(description)}&image=${encodeURIComponent(image)}&type=${type}`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}&description=${encodeURIComponent(description)}&type=${type}`

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  }
}

