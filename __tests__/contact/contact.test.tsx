import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import ContactForm from '@/components/contact/ContactForm'
import ContactList from '@/components/contact/ContactList'
import ContactDetails from '@/components/contact/ContactDetails'

describe('Contact Management', () => {
  describe('ContactForm', () => {
    it('should handle form submission', async () => {
      const onSubmit = jest.fn()
      render(<ContactForm listing={mockListing} onSubmit={onSubmit} />)

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/phone/i), {
        target: { value: '+1234567890' },
      })
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'I am interested in this listing' },
      })
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          message: 'I am interested in this listing',
          listingId: mockListing.id,
        })
      })
    })

    it('should validate required fields', async () => {
      render(<ContactForm listing={mockListing} onSubmit={jest.fn()} />)

      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })

    it('should validate email format', async () => {
      render(<ContactForm listing={mockListing} onSubmit={jest.fn()} />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' },
      })
      fireEvent.click(screen.getByRole('button', { name: /send message/i }))

      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    })
  })

  describe('ContactList', () => {
    const mockContacts = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I am interested in this listing',
        listingId: mockListing.id,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        message: 'Is this still available?',
        listingId: mockListing.id,
        createdAt: new Date().toISOString(),
      },
    ]

    it('should display contacts', () => {
      render(<ContactList contacts={mockContacts} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should handle contact selection', async () => {
      const onSelect = jest.fn()
      render(<ContactList contacts={mockContacts} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('John Doe'))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(mockContacts[0])
      })
    })

    it('should handle contact deletion', async () => {
      const onDelete = jest.fn()
      render(<ContactList contacts={mockContacts} onDelete={onDelete} />)

      fireEvent.click(screen.getByRole('button', { name: /delete contact 1/i }))

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith(mockContacts[0].id)
      })
    })
  })

  describe('ContactDetails', () => {
    const mockContact = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      message: 'I am interested in this listing',
      listingId: mockListing.id,
      createdAt: new Date().toISOString(),
    }

    it('should display contact details', () => {
      render(<ContactDetails contact={mockContact} />)

      expect(screen.getByText(mockContact.name)).toBeInTheDocument()
      expect(screen.getByText(mockContact.email)).toBeInTheDocument()
      expect(screen.getByText(mockContact.phone)).toBeInTheDocument()
      expect(screen.getByText(mockContact.message)).toBeInTheDocument()
    })

    it('should handle reply submission', async () => {
      const onReply = jest.fn()
      render(<ContactDetails contact={mockContact} onReply={onReply} />)

      fireEvent.change(screen.getByLabelText(/reply/i), {
        target: { value: 'Thank you for your interest' },
      })
      fireEvent.click(screen.getByRole('button', { name: /send reply/i }))

      await waitFor(() => {
        expect(onReply).toHaveBeenCalledWith({
          contactId: mockContact.id,
          message: 'Thank you for your interest',
        })
      })
    })

    it('should handle contact status update', async () => {
      const onStatusUpdate = jest.fn()
      render(<ContactDetails contact={mockContact} onStatusUpdate={onStatusUpdate} />)

      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'replied' },
      })

      await waitFor(() => {
        expect(onStatusUpdate).toHaveBeenCalledWith({
          contactId: mockContact.id,
          status: 'replied',
        })
      })
    })
  })
}) 