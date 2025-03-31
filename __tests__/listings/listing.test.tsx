import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import ListingForm from '@/components/listings/ListingForm'
import ListingCard from '@/components/listings/ListingCard'
import ListingDetails from '@/components/listings/ListingDetails'

describe('Listings', () => {
  describe('ListingForm', () => {
    it('should create a new listing', async () => {
      const mockCreate = jest.fn().mockResolvedValue({ data: mockListing, error: null })
      ;(supabase.from as jest.Mock) = jest.fn().mockReturnValue({
        insert: mockCreate,
      })

      render(<ListingForm />)

      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'New Listing' },
      })
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test Description' },
      })
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '100' },
      })
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'vehicle' },
      })
      fireEvent.click(screen.getByRole('button', { name: /create listing/i }))

      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          title: 'New Listing',
          description: 'Test Description',
          price: 100,
          category: 'vehicle',
        })
      })
    })

    it('should validate required fields', async () => {
      render(<ListingForm />)

      fireEvent.click(screen.getByRole('button', { name: /create listing/i }))

      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
      expect(screen.getByText(/price is required/i)).toBeInTheDocument()
      expect(screen.getByText(/category is required/i)).toBeInTheDocument()
    })
  })

  describe('ListingCard', () => {
    it('should display listing information correctly', () => {
      render(<ListingCard listing={mockListing} />)

      expect(screen.getByText(mockListing.title)).toBeInTheDocument()
      expect(screen.getByText(mockListing.description)).toBeInTheDocument()
      expect(screen.getByText(`$${mockListing.price}`)).toBeInTheDocument()
      expect(screen.getByText(mockListing.category)).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const onSelect = jest.fn()
      render(<ListingCard listing={mockListing} onSelect={onSelect} />)

      fireEvent.click(screen.getByRole('article'))

      expect(onSelect).toHaveBeenCalledWith(mockListing)
    })
  })

  describe('ListingDetails', () => {
    it('should display full listing details', () => {
      render(<ListingDetails listing={mockListing} />)

      expect(screen.getByText(mockListing.title)).toBeInTheDocument()
      expect(screen.getByText(mockListing.description)).toBeInTheDocument()
      expect(screen.getByText(`$${mockListing.price}`)).toBeInTheDocument()
      expect(screen.getByText(mockListing.category)).toBeInTheDocument()
      expect(screen.getByText(/created/i)).toBeInTheDocument()
      expect(screen.getByText(/updated/i)).toBeInTheDocument()
    })

    it('should handle contact form submission', async () => {
      const onSubmit = jest.fn()
      render(<ListingDetails listing={mockListing} onSubmit={onSubmit} />)

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'I am interested in this listing' },
      })
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'I am interested in this listing',
        })
      })
    })
  })
}) 