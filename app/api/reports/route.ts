import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createReport } from '@/lib/supabase/api'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { type, targetId, reason, description } = await request.json()

    if (!type || !targetId || !reason || !description) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    if (!['listing', 'user'].includes(type)) {
      return new NextResponse('Invalid report type', { status: 400 })
    }

    const success = await createReport(session.user.id, targetId, type === 'listing' ? targetId : '', reason)

    if (!success) {
      return new NextResponse('Failed to create report', { status: 500 })
    }

    return new NextResponse('Report created successfully', { status: 200 })
  } catch (error) {
    console.error('Error creating report:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 