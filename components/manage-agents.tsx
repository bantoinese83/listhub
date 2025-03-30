"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AgentRequest {
  id: string
  agent: {
    id: string
    full_name: string
    avatar_url: string
    email: string
  }
  commission_rate: number
  terms: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at: string
}

interface ManageAgentsProps {
  listingId: string
  ownerId: string
}

export function ManageAgents({ listingId, ownerId }: ManageAgentsProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<AgentRequest[]>([])
  const { toast } = useToast()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (open) {
      fetchRequests()
    }
  }, [open])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('listing_agents')
        .select(`
          id,
          commission_rate,
          terms,
          status,
          created_at,
          agent:profiles!listing_agents_agent_id_fkey(
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to match the AgentRequest interface
      const transformedData: AgentRequest[] = data.map((item: any) => ({
        id: item.id,
        commission_rate: item.commission_rate,
        terms: item.terms,
        status: item.status,
        created_at: item.created_at,
        agent: {
          id: item.agent.id,
          full_name: item.agent.full_name,
          avatar_url: item.agent.avatar_url,
          email: item.agent.email
        }
      }))

      setRequests(transformedData)
    } catch (error) {
      console.error('Error fetching agent requests:', error)
      toast({
        title: "Error",
        description: "Failed to load agent requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('listing_agents')
        .update({ status: newStatus })
        .eq('id', requestId)

      if (error) throw error

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ))

      toast({
        title: `Request ${newStatus}`,
        description: `Agent request has been ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating agent status:', error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }
    return variants[status as keyof typeof variants] || ""
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full gap-2"
      >
        <Users className="h-4 w-4" />
        Manage Agents
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Listing Agents</DialogTitle>
            <DialogDescription>
              Review and manage agent requests for your listing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-center text-muted-foreground">No agent requests yet</div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border"
                  >
                    <Avatar>
                      <AvatarImage src={request.agent.avatar_url} />
                      <AvatarFallback>
                        {request.agent.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{request.agent.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.agent.email}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Commission: {request.commission_rate}%</p>
                        <p className="text-sm text-muted-foreground">{request.terms}</p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 