import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockSubscription } from '../utils/test-utils'
import SubscriptionForm from '@/components/subscription/SubscriptionForm'
import SubscriptionCard from '@/components/subscription/SubscriptionCard'
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus'

describe('Subscriptions', () => {
  describe('SubscriptionForm', () => {
    it('should handle subscription creation', async () => {
      const mockCreateSubscription = jest.fn().mockResolvedValue({ data: mockSubscription, error: null })
      ;(supabase.from as jest.Mock) = jest.fn().mockReturnValue({
        insert: mockCreateSubscription,
      })

      render(<SubscriptionForm />)

      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4242424242424242' },
      })
      fireEvent.change(screen.getByLabelText(/expiry/i), {
        target: { value: '12/25' },
      })
      fireEvent.change(screen.getByLabelText(/cvc/i), {
        target: { value: '123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

      await waitFor(() => {
        expect(mockCreateSubscription).toHaveBeenCalledWith({
          tier: 'basic',
          status: 'active',
        })
      })
    })

    it('should validate payment information', async () => {
      render(<SubscriptionForm />)

      fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))

      expect(screen.getByText(/card number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/expiry is required/i)).toBeInTheDocument()
      expect(screen.getByText(/cvc is required/i)).toBeInTheDocument()
    })
  })

  describe('SubscriptionCard', () => {
    it('should display subscription information correctly', () => {
      render(<SubscriptionCard subscription={mockSubscription} />)

      expect(screen.getByText(mockSubscription.tier)).toBeInTheDocument()
      expect(screen.getByText(mockSubscription.status)).toBeInTheDocument()
      expect(screen.getByText(/renews/i)).toBeInTheDocument()
    })

    it('should handle upgrade/downgrade actions', async () => {
      const onUpgrade = jest.fn()
      render(<SubscriptionCard subscription={mockSubscription} onUpgrade={onUpgrade} />)

      fireEvent.click(screen.getByRole('button', { name: /upgrade/i }))

      await waitFor(() => {
        expect(onUpgrade).toHaveBeenCalledWith('pro')
      })
    })
  })

  describe('SubscriptionStatus', () => {
    it('should display current subscription status', () => {
      render(<SubscriptionStatus subscription={mockSubscription} />)

      expect(screen.getByText(/current plan/i)).toBeInTheDocument()
      expect(screen.getByText(mockSubscription.tier)).toBeInTheDocument()
      expect(screen.getByText(/status/i)).toBeInTheDocument()
      expect(screen.getByText(mockSubscription.status)).toBeInTheDocument()
    })

    it('should handle subscription cancellation', async () => {
      const onCancel = jest.fn()
      render(<SubscriptionStatus subscription={mockSubscription} onCancel={onCancel} />)

      fireEvent.click(screen.getByRole('button', { name: /cancel subscription/i }))

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalledWith(mockSubscription.id)
      })
    })
  })
}) 