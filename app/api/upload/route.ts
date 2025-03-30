import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { MAX_FILE_SIZE } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Verify user is authenticated
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the listing ID from the query params
    const searchParams = request.nextUrl.searchParams
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json({ error: "Missing listing ID" }, { status: 400 })
    }

    // Verify the user owns the listing
    const { data: listing } = await supabase.from("listings").select("user_id").eq("id", listingId).single()

    if (!listing || listing.user_id !== session.session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: `Files must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          },
          { status: 400 },
        )
      }
    }

    // Get existing images count
    const { count } = await supabase
      .from("listing_images")
      .select("*", { count: "exact", head: true })
      .eq("listing_id", listingId)

    const existingCount = count || 0

    // Upload images and save references
    const results = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const position = existingCount + i

      const fileExt = file.name.split(".").pop()
      const fileName = `${listingId}/${position}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `listings/${fileName}`

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
      }

      // Get public URL
      const { data: publicURL } = supabase.storage.from("listing-images").getPublicUrl(filePath)

      // Save image reference in database
      const { data: imageData, error: imageError } = await supabase
        .from("listing_images")
        .insert({
          listing_id: listingId,
          url: publicURL.publicUrl,
          position,
        })
        .select()
        .single()

      if (imageError) {
        return NextResponse.json({ error: imageError.message }, { status: 500 })
      }

      results.push({
        id: imageData.id,
        url: publicURL.publicUrl,
        position,
      })
    }

    return NextResponse.json({ success: true, images: results })
  } catch (error: any) {
    console.error("Error uploading images:", error)
    return NextResponse.json({ error: error.message || "Failed to upload images" }, { status: 500 })
  }
}

