import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { SITE_NAME } from "@/lib/constants"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get dynamic params
    const title = searchParams.get("title") || SITE_NAME
    const description =
      searchParams.get("description") || "Find and post classified ads for items, services, jobs, and more"
    const imageUrl = searchParams.get("image") || ""
    const type = searchParams.get("type") || "website"

    // Load the Inter font
    const interRegular = await fetch(new URL("../../../../public/fonts/Inter-Regular.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer(),
    )

    const interBold = await fetch(new URL("../../../../public/fonts/Inter-Bold.ttf", import.meta.url)).then((res) =>
      res.arrayBuffer(),
    )

    // Generate the image
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 50px",
            margin: "40px",
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            maxWidth: "90%",
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              fontSize: "50px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#1e293b",
              marginBottom: "10px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "25px",
              textAlign: "center",
              color: "#64748b",
              marginBottom: "20px",
              maxWidth: "700px",
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
              color: "#0f172a",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginRight: "8px",
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                padding: "4px 12px",
                backgroundColor: "#f1f5f9",
                borderRadius: "20px",
                fontSize: "18px",
                color: "#64748b",
              }}
            >
              {type}
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: interBold,
            weight: 700,
            style: "normal",
          },
        ],
      },
    )
  } catch (e) {
    console.error(`Error generating OG image: ${e}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}

