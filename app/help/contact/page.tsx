import type { Metadata } from "next"
import { Mail, Phone, MessageCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Contact Support | ListHub Help Center",
  description: "Get in touch with our support team for assistance with your ListHub account or marketplace experience.",
  pathname: "/help/contact",
})

export default function ContactPage() {
  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact Support</h1>
        <p className="text-lg text-muted-foreground">
          Get in touch with our support team for assistance with your ListHub account or marketplace experience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>
              Send us an email and we'll get back to you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="mailto:support@listhub.com">support@listhub.com</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Support
            </CardTitle>
            <CardDescription>
              Call us for immediate assistance during business hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </CardTitle>
            <CardDescription>
              Chat with our support team in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Support Hours
            </CardTitle>
            <CardDescription>
              Our support team is available during these hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              <p>Saturday: 10:00 AM - 4:00 PM EST</p>
              <p>Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Before Contacting Support</h2>
        <p className="mb-4">To help us assist you better, please check:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Our FAQ section for common questions</li>
          <li>Your account settings and preferences</li>
          <li>Your email for any automated responses</li>
          <li>Your browser's cache and cookies</li>
          <li>Your internet connection</li>
        </ul>
      </div>
    </div>
  )
} 