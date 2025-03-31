import '@testing-library/jest-dom'
import React from 'react'
import { mockSupabaseClient } from './__tests__/mocks/supabase'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: '2024-01-01',
    },
    status: 'authenticated',
  }),
  SessionProvider: function({ children }) { return children },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
  ThemeProvider: function({ children }) { return children },
}))

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: () => mockSupabaseClient,
})) 