import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import SignInForm from '@/components/auth/SignInForm'
import SignUpForm from '@/components/auth/SignUpForm'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Authentication', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Sign In', () => {
    it('should handle successful sign in', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null })
      ;(supabase.auth.signInWithPassword as jest.Mock) = mockSignIn

      render(<SignInForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle sign in error', async () => {
      const mockError = new Error('Invalid credentials')
      const mockSignIn = jest.fn().mockResolvedValue({ data: null, error: mockError })
      ;(supabase.auth.signInWithPassword as jest.Mock) = mockSignIn

      render(<SignInForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('Sign Up', () => {
    it('should handle successful sign up', async () => {
      const mockSignUp = jest.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null })
      ;(supabase.auth.signUp as jest.Mock) = mockSignUp

      render(<SignUpForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'new@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'new@example.com',
          password: 'password123',
        })
      })

      expect(mockRouter.push).toHaveBeenCalledWith('/verify-email')
    })

    it('should handle password mismatch', async () => {
      render(<SignUpForm />)

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'new@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'differentpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })
}) 