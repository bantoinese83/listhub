import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './schema'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Only create the client if we're in the browser
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Client-side functions that don't need server features
export async function getCategoriesClient() {
  if (!supabase) return []
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoriesHierarchicalClient() {
  if (!supabase) return []
  
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    // Organize into parent-child hierarchy
    const topLevelCategories = data.filter((cat) => !cat.parent_id)
    const result = topLevelCategories.map((parent) => {
      const subcategories = data.filter((cat) => cat.parent_id === parent.id)
      return {
        ...parent,
        subcategories,
      }
    })

    return result
  } catch (error) {
    console.error("Error connecting to Supabase:", error)
    return []
  }
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

