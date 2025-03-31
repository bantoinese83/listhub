import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubscriptionSection } from '@/components/subscription/subscription-section'

describe('SubscriptionSection', () => {
  it('renders all subscription tiers', () => {
    render(<SubscriptionSection />)
    
    // Check if all tiers are rendered
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('displays correct pricing for each tier', () => {
    render(<SubscriptionSection />)
    
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$9.99')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('shows "Popular" badge on Basic tier', () => {
    render(<SubscriptionSection />)
    
    const basicTier = screen.getByText('Basic').closest('.card')
    expect(basicTier).toHaveClass('border-primary')
    expect(screen.getByText('Popular')).toBeInTheDocument()
  })

  it('renders all features for each tier', () => {
    render(<SubscriptionSection />)
    
    // Check Free tier features
    expect(screen.getByText('3 active listings')).toBeInTheDocument()
    expect(screen.getByText('5 images per listing')).toBeInTheDocument()
    
    // Check Basic tier features
    expect(screen.getByText('10 active listings')).toBeInTheDocument()
    expect(screen.getByText('ListHub Agent access')).toBeInTheDocument()
    
    // Check Pro tier features
    expect(screen.getByText('Unlimited listings')).toBeInTheDocument()
    expect(screen.getByText('API access')).toBeInTheDocument()
    
    // Check Enterprise tier features
    expect(screen.getByText('Custom domain support')).toBeInTheDocument()
    expect(screen.getByText('White-label options')).toBeInTheDocument()
  })

  it('has correct CTA buttons for each tier', () => {
    render(<SubscriptionSection />)
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Upgrade to Basic')).toBeInTheDocument()
    expect(screen.getByText('Pro Coming Soon')).toBeInTheDocument()
    expect(screen.getByText('Enterprise Coming Soon')).toBeInTheDocument()
  })

  it('links to correct URLs for active tiers', () => {
    render(<SubscriptionSection />)
    
    const freeButton = screen.getByText('Get Started').closest('a')
    const basicButton = screen.getByText('Upgrade to Basic').closest('a')
    
    expect(freeButton).toHaveAttribute('href', '/auth/signup')
    expect(basicButton).toHaveAttribute('href', '/dashboard/subscription')
  })

  it('disables Pro and Enterprise tier buttons', () => {
    render(<SubscriptionSection />)
    
    const proButton = screen.getByTestId('pro-coming-soon')
    const enterpriseButton = screen.getByTestId('enterprise-coming-soon')
    
    expect(proButton).toBeDisabled()
    expect(enterpriseButton).toBeDisabled()
  })

  it('renders with correct styling', () => {
    render(<SubscriptionSection />)
    
    // Check section styling
    const section = screen.getByRole('region')
    expect(section).toHaveClass('py-24', 'bg-gray-50', 'dark:bg-gray-900')
    
    // Check heading styling
    const heading = screen.getByText('Choose Your Plan')
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'tracking-tight')
  })
}) 