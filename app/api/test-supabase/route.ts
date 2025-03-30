import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Test multiple tables
    const [categoriesResult, listingsResult, locationsResult] = await Promise.all([
      supabase.from("categories").select("*", { count: "exact" }),
      supabase.from("listings").select("*", { count: "exact" }),
      supabase.from("locations").select("*", { count: "exact" })
    ])

    // Check for errors
    const errors = [
      categoriesResult.error,
      listingsResult.error,
      locationsResult.error
    ].filter(Boolean)

    if (errors.length > 0) {
      console.error("Supabase query errors:", errors)
      return NextResponse.json({ 
        error: "Database query errors", 
        details: errors.map(e => e?.message) 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        categories: {
          count: categoriesResult.count,
          hasData: categoriesResult.data && categoriesResult.data.length > 0
        },
        listings: {
          count: listingsResult.count,
          hasData: listingsResult.data && listingsResult.data.length > 0
        },
        locations: {
          count: locationsResult.count,
          hasData: locationsResult.data && locationsResult.data.length > 0
        }
      }
    })
  } catch (error) {
    console.error("Supabase client error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 