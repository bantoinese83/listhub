import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SubscriptionSection() {
  return (
    <section role="region" className="w-full py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the perfect plan for your needs. Start with our free tier and upgrade as you grow.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Free Tier */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Free
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <div className="text-sm text-muted-foreground">Perfect for getting started</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>3 active listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>5 images per listing</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Basic search and filtering</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Standard placement</span>
                </li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <a href="/auth/signup">Get Started</a>
              </Button>
            </CardContent>
          </Card>

          {/* Basic Tier */}
          <Card className="card border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Basic
                <Badge>Popular</Badge>
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
              </div>
              <div className="text-sm text-muted-foreground">Best for growing businesses</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>10 active listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>ListHub Agent access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <a href="/dashboard/subscription">Upgrade to Basic</a>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pro
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-sm text-muted-foreground ml-2">/month</span>
              </div>
              <div className="text-sm text-muted-foreground">For power users</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>API access</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>24/7 support</span>
                </li>
              </ul>
              <Button disabled className="mt-6 w-full" data-testid="pro-coming-soon">
                Pro Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Enterprise
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99.99</span>
                <span className="text-sm text-muted-foreground ml-2">/month</span>
              </div>
              <div className="text-sm text-muted-foreground">For large organizations</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Custom domain support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>White-label options</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button disabled className="mt-6 w-full" data-testid="enterprise-coming-soon">
                Enterprise Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 