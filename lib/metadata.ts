import { Metadata } from "next"

interface ConstructMetadataProps {
  title: string
  description: string
  pathname: string
  image?: string
  noIndex?: boolean
  alternates?: {
    canonical?: string
    languages?: Record<string, string>
  }
}

export function constructMetadata({
  title,
  description,
  pathname,
  image = "/og-image.png",
  noIndex = false,
  alternates,
}: ConstructMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://listhub.com"
  const fullUrl = `${siteUrl}${pathname}`
  const canonicalUrl = alternates?.canonical || fullUrl

  return {
    title: {
      default: title,
      template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "ListHub"}`,
    },
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates?.languages || {
        "en-US": fullUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "ListHub",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@listhub",
      site: "@listhub",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
    category: "marketplace",
    keywords: [
      "marketplace",
      "classifieds",
      "buy and sell",
      "local listings",
      "community marketplace",
      "online marketplace",
    ],
    authors: [{ name: "ListHub Team" }],
    creator: "ListHub",
    publisher: "ListHub",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
      other: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          url: "/favicon-32x32.png",
        },
      ],
    },
    manifest: "/site.webmanifest",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  }
}

