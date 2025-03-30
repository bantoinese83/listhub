import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createReview } from '@/lib/supabase/api'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { listingId, reviewedId, rating, content } = await request.json()

    if (!listingId || !reviewedId || !rating) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return new NextResponse('Invalid rating', { status: 400 })
    }

    const success = await createReview(session.user.id, reviewedId, listingId, rating, content)

    if (!success) {
      return new NextResponse('Failed to create review', { status: 500 })
    }

    return new NextResponse('Review created successfully', { status: 200 })
  } catch (error) {
    console.error('Error creating review:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 