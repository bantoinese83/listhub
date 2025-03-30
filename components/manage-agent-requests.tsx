import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { validateListingEligibility } from "@/lib/agent-validation"
import { createBrowserClient } from "@supabase/ssr"

interface ManageAgentRequestsProps {
  listingId: string
  userId: string
}

interface AgentRequest {
  id: string
  agent_id: string
  listing_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  agent: {
    user_id: string
    status: string
  }
  user: {
    full_name: string
    email: string
  }
}

export function ManageAgentRequests({ listingId, userId }: ManageAgentRequestsProps) {
  const [requests, setRequests] = useState<AgentRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_requests')
        .select(`
          *,
          agent:agents(
            user_id,
            status
          ),
          user:profiles(
            full_name,
            email
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching agent requests:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load agent requests"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [listingId])

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    setIsLoading(true)
    try {
      // First validate listing eligibility
      const validation = await validateListingEligibility(listingId, userId)
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Cannot Process Request",
          description: validation.error
        })
        return
      }

      // Update request status
      const { error: requestError } = await supabase
        .from('agent_requests')
        .update({ status: action === 'approve' ? 'approved' : 'rejected' })
        .eq('id', requestId)

      if (requestError) throw requestError

      // If approved, create agent listing relationship
      if (action === 'approve') {
        const request = requests.find(r => r.id === requestId)
        if (request) {
          const { error: agentError } = await supabase
            .from('agent_listings')
            .insert([
              {
                agent_id: request.agent_id,
                listing_id: listingId,
                status: 'active',
                created_at: new Date().toISOString()
              }
            ])

          if (agentError) throw agentError
        }
      }

      toast({
        title: "Success",
        description: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      })
      fetchRequests()
    } catch (error) {
      console.error('Error processing request:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} request`
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading agent requests...</div>
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Requests</CardTitle>
          <CardDescription>
            No pending agent requests for this listing
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Requests</CardTitle>
        <CardDescription>
          Review and manage agent requests for your listing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h4 className="font-medium">{request.user.full_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {request.user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {request.status}
                </p>
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'reject')}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleRequestAction(request.id, 'approve')}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 