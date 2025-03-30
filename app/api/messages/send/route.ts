import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendMessage } from '@/lib/supabase/api'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { recipientId, listingId, content } = await request.json()

    if (!recipientId || !listingId || !content) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const success = await sendMessage(session.user.id, recipientId, listingId, content)

    if (!success) {
      return new NextResponse('Failed to send message', { status: 500 })
    }

    return new NextResponse('Message sent successfully', { status: 200 })
  } catch (error) {
    console.error('Error sending message:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 