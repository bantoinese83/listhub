'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { sendMessage } from '@/lib/supabase/api'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  listing_id: string
  content: string
  is_read: boolean
  created_at: string
  sender: {
    id: string
    full_name: string
    avatar_url: string
  }
  recipient: {
    id: string
    full_name: string
    avatar_url: string
  }
  listing: {
    id: string
    title: string
    price: number
    images: { url: string }[]
  }
}

interface MessageListProps {
  initialMessages: Message[]
  userId: string
}

export function MessageList({ initialMessages, userId }: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const { toast } = useToast()

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id
    const otherUser = message.sender_id === userId ? message.recipient : message.sender

    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        id: otherUserId,
        user: otherUser,
        lastMessage: message,
        unreadCount: message.sender_id !== userId && !message.is_read ? 1 : 0,
        listing: message.listing
      }
    } else {
      if (message.created_at > acc[otherUserId].lastMessage.created_at) {
        acc[otherUserId].lastMessage = message
      }
      if (message.sender_id !== userId && !message.is_read) {
        acc[otherUserId].unreadCount++
      }
    }

    return acc
  }, {} as Record<string, {
    id: string
    user: { id: string; full_name: string; avatar_url: string }
    lastMessage: Message
    unreadCount: number
    listing: { id: string; title: string; price: number; images: { url: string }[] }
  }>)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    const conversation = conversations[selectedConversation]
    if (!conversation) return

    const success = await sendMessage(
      userId,
      conversation.id,
      conversation.lastMessage.listing_id,
      newMessage
    )

    if (success) {
      setNewMessage('')
      // Refresh messages
      const response = await fetch('/api/messages')
      const data = await response.json()
      setMessages(data)
    } else {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      })
    }
  }

  const selectedConversationMessages = messages.filter(
    message =>
      (message.sender_id === selectedConversation && message.recipient_id === userId) ||
      (message.sender_id === userId && message.recipient_id === selectedConversation)
  )

  return (
    <div className="border rounded-lg grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="border-r">
        <ScrollArea className="h-full">
          {Object.values(conversations).map((conversation) => (
            <div key={conversation.id}>
              <button
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={conversation.user.avatar_url || '/placeholder.svg'}
                        alt={conversation.user.full_name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{conversation.user.full_name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(conversation.lastMessage.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    <p className={`text-sm truncate ${!conversation.lastMessage.is_read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage.content}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-6 w-6 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={conversation.listing.images[0]?.url || '/placeholder.svg'}
                          alt={conversation.listing.title}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{conversation.listing.title}</span>
                    </div>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="ml-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </button>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="col-span-2 flex flex-col h-full">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={conversations[selectedConversation].user.avatar_url || '/placeholder.svg'}
                    alt={conversations[selectedConversation].user.full_name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium">{conversations[selectedConversation].user.full_name}</h3>
                <p className="text-xs text-muted-foreground">
                  {conversations[selectedConversation].user.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Listing Info */}
            <div className="p-3 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={conversations[selectedConversation].listing.images[0]?.url || '/placeholder.svg'}
                    alt={conversations[selectedConversation].listing.title}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{conversations[selectedConversation].listing.title}</h4>
                  <p className="text-sm text-primary">${conversations[selectedConversation].listing.price}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${conversations[selectedConversation].listing.id}`}>
                    View Listing
                  </Link>
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversationMessages.map((message) => {
                  const isCurrentUser = message.sender_id === userId

                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {!isCurrentUser && (
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={conversations[selectedConversation].user.avatar_url || '/placeholder.svg'}
                              alt={conversations[selectedConversation].user.full_name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className={`rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>

                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />

                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="font-medium text-lg">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 