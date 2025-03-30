import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./schema"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not set")
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
  }

  if (!supabaseAnonKey) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error("Invalid Supabase URL format:", supabaseUrl)
    throw new Error("Invalid Supabase URL format")
  }

  try {
    const client = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Server components can't set cookies
          // This will be handled by the middleware
        },
        remove(name: string, options: any) {
          // Server components can't remove cookies
          // This will be handled by the middleware
        },
      },
    })
    return client
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw error
  }
}

