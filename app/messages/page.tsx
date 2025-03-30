import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMessages } from '@/lib/supabase/api'
import { constructMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { MessageList } from '@/components/messages/message-list'

export const metadata: Metadata = constructMetadata({
  title: 'Messages',
  description: 'View and manage your messages on ListHub',
  pathname: '/messages',
})

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin?redirect=/messages')
  }

  const messages = await getMessages(session.user.id)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      {messages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You don't have any messages yet.</p>
        </div>
      ) : (
        <MessageList initialMessages={messages} userId={session.user.id} />
      )}
    </div>
  )
}

