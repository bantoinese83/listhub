import React from 'react'
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// Export testing library functions
export { screen, fireEvent, waitFor }

// Override render method
export { render }

// Mock data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  subscription: {
    tier: 'free',
    status: 'active',
  },
}

export const mockListing = {
  id: '1',
  title: 'Test Listing',
  description: 'Test Description',
  price: 100,
  category: 'vehicle',
  userId: '1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockSubscription = {
  id: '1',
  userId: '1',
  tier: 'basic',
  status: 'active',
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
} 