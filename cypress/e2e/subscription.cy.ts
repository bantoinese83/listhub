describe('Subscription Flow', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/')
    
    // Login as a test user
    cy.login('test@example.com', 'password123')
  })

  it('displays subscription tiers on homepage', () => {
    // Scroll to subscription section
    cy.get('section').contains('Choose Your Plan').scrollIntoView()
    
    // Verify all tiers are displayed
    cy.contains('Free').should('be.visible')
    cy.contains('Basic').should('be.visible')
    cy.contains('Pro').should('be.visible')
    cy.contains('Enterprise').should('be.visible')
    
    // Verify pricing
    cy.contains('$0').should('be.visible')
    cy.contains('$9.99').should('be.visible')
    cy.contains('Coming Soon').should('have.length', 2)
  })

  it('navigates to subscription page from homepage', () => {
    // Click the "Upgrade to Basic" button
    cy.contains('Upgrade to Basic').click()
    
    // Verify navigation to subscription page
    cy.url().should('include', '/dashboard/subscription')
  })

  it('upgrades to Basic tier', () => {
    // Navigate to subscription page
    cy.visit('/dashboard/subscription')
    
    // Select Basic tier
    cy.contains('Basic').click()
    
    // Fill in payment details
    cy.get('[data-testid="card-number"]').type('4242424242424242')
    cy.get('[data-testid="card-expiry"]').type('1230')
    cy.get('[data-testid="card-cvc"]').type('123')
    
    // Submit payment
    cy.get('button').contains('Subscribe').click()
    
    // Verify success message
    cy.contains('Subscription successful').should('be.visible')
    
    // Verify subscription status
    cy.contains('Active').should('be.visible')
    cy.contains('Basic').should('be.visible')
  })

  it('enforces subscription limits', () => {
    // Create maximum number of listings for free tier
    for (let i = 0; i < 3; i++) {
      cy.visit('/dashboard/listings/new')
      cy.createListing({
        title: `Test Listing ${i + 1}`,
        description: 'Test description',
        price: '100',
        category: 'vehicles',
      })
    }
    
    // Try to create one more listing
    cy.visit('/dashboard/listings/new')
    cy.contains('Upgrade your plan to create more listings').should('be.visible')
  })

  it('handles subscription cancellation', () => {
    // Navigate to subscription page
    cy.visit('/dashboard/subscription')
    
    // Click cancel subscription
    cy.contains('Cancel Subscription').click()
    
    // Confirm cancellation
    cy.contains('Yes, cancel subscription').click()
    
    // Verify cancellation message
    cy.contains('Subscription cancelled successfully').should('be.visible')
    
    // Verify subscription status
    cy.contains('Cancelled').should('be.visible')
  })

  it('displays correct features based on subscription tier', () => {
    // Check free tier features
    cy.contains('3 active listings').should('be.visible')
    cy.contains('5 images per listing').should('be.visible')
    
    // Upgrade to Basic tier
    cy.contains('Upgrade to Basic').click()
    cy.completeSubscription('basic')
    
    // Verify Basic tier features
    cy.contains('10 active listings').should('be.visible')
    cy.contains('10 images per listing').should('be.visible')
    cy.contains('ListHub Agent access').should('be.visible')
  })

  it('handles failed payments gracefully', () => {
    // Navigate to subscription page
    cy.visit('/dashboard/subscription')
    
    // Select Basic tier
    cy.contains('Basic').click()
    
    // Use a card that will fail
    cy.get('[data-testid="card-number"]').type('4000000000000002')
    cy.get('[data-testid="card-expiry"]').type('1230')
    cy.get('[data-testid="card-cvc"]').type('123')
    
    // Submit payment
    cy.get('button').contains('Subscribe').click()
    
    // Verify error message
    cy.contains('Payment failed').should('be.visible')
  })
}) 