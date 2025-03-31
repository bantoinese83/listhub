import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockSubscription } from '../utils/test-utils'
import PaymentForm from '@/components/payment/PaymentForm'
import SubscriptionPlans from '@/components/payment/SubscriptionPlans'
import PaymentHistory from '@/components/payment/PaymentHistory'

describe('Payment and Subscription', () => {
  describe('PaymentForm', () => {
    it('should handle payment submission', async () => {
      const onSubmit = jest.fn()
      render(<PaymentForm onSubmit={onSubmit} />)

      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4242424242424242' },
      })
      fireEvent.change(screen.getByLabelText(/expiry/i), {
        target: { value: '12/25' },
      })
      fireEvent.change(screen.getByLabelText(/cvc/i), {
        target: { value: '123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /pay/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          cardNumber: '4242424242424242',
          expiry: '12/25',
          cvc: '123',
        })
      })
    })

    it('should validate payment information', async () => {
      render(<PaymentForm onSubmit={jest.fn()} />)

      fireEvent.click(screen.getByRole('button', { name: /pay/i }))

      expect(screen.getByText(/card number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/expiry is required/i)).toBeInTheDocument()
      expect(screen.getByText(/cvc is required/i)).toBeInTheDocument()
    })

    it('should handle payment errors', async () => {
      const onSubmit = jest.fn().mockRejectedValue(new Error('Payment failed'))
      render(<PaymentForm onSubmit={onSubmit} />)

      fireEvent.change(screen.getByLabelText(/card number/i), {
        target: { value: '4242424242424242' },
      })
      fireEvent.change(screen.getByLabelText(/expiry/i), {
        target: { value: '12/25' },
      })
      fireEvent.change(screen.getByLabelText(/cvc/i), {
        target: { value: '123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /pay/i }))

      await waitFor(() => {
        expect(screen.getByText(/payment failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('SubscriptionPlans', () => {
    const mockPlans = [
      {
        id: 'basic',
        name: 'Basic',
        price: 9.99,
        features: ['Feature 1', 'Feature 2'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
    ]

    it('should display subscription plans', () => {
      render(<SubscriptionPlans plans={mockPlans} />)

      expect(screen.getByText('Basic')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()
      expect(screen.getByText('$9.99')).toBeInTheDocument()
      expect(screen.getByText('$19.99')).toBeInTheDocument()
    })

    it('should handle plan selection', async () => {
      const onSelect = jest.fn()
      render(<SubscriptionPlans plans={mockPlans} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('Pro'))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(mockPlans[1])
      })
    })

    it('should handle plan comparison', async () => {
      const onCompare = jest.fn()
      render(<SubscriptionPlans plans={mockPlans} onCompare={onCompare} />)

      fireEvent.click(screen.getByRole('button', { name: /compare plans/i }))

      await waitFor(() => {
        expect(onCompare).toHaveBeenCalledWith(mockPlans)
      })
    })
  })

  describe('PaymentHistory', () => {
    const mockPayments = [
      {
        id: '1',
        amount: 9.99,
        date: '2024-01-01',
        status: 'success',
        description: 'Basic Plan',
      },
      {
        id: '2',
        amount: 19.99,
        date: '2024-02-01',
        status: 'success',
        description: 'Pro Plan',
      },
    ]

    it('should display payment history', () => {
      render(<PaymentHistory payments={mockPayments} />)

      expect(screen.getByText('$9.99')).toBeInTheDocument()
      expect(screen.getByText('$19.99')).toBeInTheDocument()
      expect(screen.getByText('Basic Plan')).toBeInTheDocument()
      expect(screen.getByText('Pro Plan')).toBeInTheDocument()
    })

    it('should handle payment filtering', async () => {
      const onFilter = jest.fn()
      render(<PaymentHistory payments={mockPayments} onFilter={onFilter} />)

      fireEvent.change(screen.getByLabelText(/filter/i), {
        target: { value: 'success' },
      })

      await waitFor(() => {
        expect(onFilter).toHaveBeenCalledWith('success')
      })
    })

    it('should handle payment export', async () => {
      const onExport = jest.fn()
      render(<PaymentHistory payments={mockPayments} onExport={onExport} />)

      fireEvent.click(screen.getByRole('button', { name: /export payments/i }))

      await waitFor(() => {
        expect(onExport).toHaveBeenCalledWith(mockPayments)
      })
    })
  })
}) 