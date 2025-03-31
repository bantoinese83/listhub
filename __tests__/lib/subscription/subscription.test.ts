import { createSubscription, updateSubscription, cancelSubscription } from '@/lib/subscription/subscription'
import { supabase } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  },
}))

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}))

describe('Subscription Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createSubscription', () => {
    it('creates a subscription successfully', async () => {
      const mockSession = {
        data: {
          session: {
            user: {
              id: 'test-user-id',
            },
          },
        },
      }

      const mockStripeResponse = {
        subscription: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
          current_period_start: 1234567890,
          current_period_end: 1234567890 + 30 * 24 * 60 * 60,
        },
      }

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue(mockSession)
      ;(supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      const result = await createSubscription('price_123')

      expect(result).toBeDefined()
      expect(result.subscriptionId).toBe('sub_123')
      expect(result.clientSecret).toBeDefined()
      expect(supabase.from).toHaveBeenCalledWith('subscriptions')
    })

    it('handles errors during subscription creation', async () => {
      const mockError = new Error('Failed to create subscription')
      ;(supabase.auth.getSession as jest.Mock).mockRejectedValue(mockError)

      await expect(createSubscription('price_123')).rejects.toThrow(mockError)
    })
  })

  describe('updateSubscription', () => {
    it('updates a subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'active',
        current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockResolvedValue({ error: null }),
      })

      const result = await updateSubscription('sub_123', 'price_456')

      expect(result).toBeDefined()
      expect(result.status).toBe('active')
      expect(supabase.from).toHaveBeenCalledWith('subscriptions')
    })

    it('handles errors during subscription update', async () => {
      const mockError = new Error('Failed to update subscription')
      ;(supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockRejectedValue(mockError),
      })

      await expect(updateSubscription('sub_123', 'price_456')).rejects.toThrow(mockError)
    })
  })

  describe('cancelSubscription', () => {
    it('cancels a subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'canceled',
        cancel_at_period_end: true,
      }

      ;(supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockResolvedValue({ error: null }),
      })

      const result = await cancelSubscription('sub_123')

      expect(result).toBeDefined()
      expect(result.status).toBe('canceled')
      expect(result.cancel_at_period_end).toBe(true)
      expect(supabase.from).toHaveBeenCalledWith('subscriptions')
    })

    it('handles errors during subscription cancellation', async () => {
      const mockError = new Error('Failed to cancel subscription')
      ;(supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockRejectedValue(mockError),
      })

      await expect(cancelSubscription('sub_123')).rejects.toThrow(mockError)
    })
  })

  describe('Subscription Limits', () => {
    it('enforces listing limits based on subscription tier', () => {
      const freeTierLimit = 3
      const basicTierLimit = 10

      expect(getSubscriptionLimit('free')).toBe(freeTierLimit)
      expect(getSubscriptionLimit('basic')).toBe(basicTierLimit)
      expect(getSubscriptionLimit('pro')).toBe(Infinity)
      expect(getSubscriptionLimit('enterprise')).toBe(Infinity)
    })

    it('enforces image limits based on subscription tier', () => {
      const freeTierLimit = 5
      const basicTierLimit = 10
      const proTierLimit = 20

      expect(getImageLimit('free')).toBe(freeTierLimit)
      expect(getImageLimit('basic')).toBe(basicTierLimit)
      expect(getImageLimit('pro')).toBe(proTierLimit)
      expect(getImageLimit('enterprise')).toBe(proTierLimit)
    })
  })
}) 