"use client"

import { useEffect } from "react"
import Script from "next/script"

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Add schema.org structured data
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      ...data,
    })
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [data])

  return null
}

export function OrganizationSchema() {
  return (
    <StructuredData
      data={{
        "@type": "Organization",
        name: "ListHub",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://listhub.com",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        sameAs: [
          "https://facebook.com/listhub",
          "https://twitter.com/listhub",
          "https://instagram.com/listhub",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-555-555-5555",
          contactType: "customer service",
          areaServed: "Worldwide",
          availableLanguage: ["English"],
        },
      }}
    />
  )
}

export function WebSiteSchema() {
  return (
    <StructuredData
      data={{
        "@type": "WebSite",
        name: "ListHub",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://listhub.com",
        description: "Your local marketplace for buying and selling",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  )
}

export function BreadcrumbListSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <StructuredData
      data={{
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": item.url,
            name: item.name,
          },
        })),
      }}
    />
  )
}

export function ProductSchema({
  name,
  description,
  price,
  image,
  category,
  condition,
  seller,
}: {
  name: string
  description: string
  price: number
  image: string
  category: string
  condition: string
  seller: string
}) {
  return (
    <StructuredData
      data={{
        "@type": "Product",
        name,
        description,
        image,
        category,
        condition,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Person",
            name: seller,
          },
        },
      }}
    />
  )
} 