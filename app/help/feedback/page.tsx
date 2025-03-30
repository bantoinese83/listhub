import type { Metadata } from "next"
import { MessageCircle, Star, Bug, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { constructMetadata } from "@/lib/metadata"

export const metadata = constructMetadata({
  title: "Send Feedback | ListHub Help Center",
  description: "Share your suggestions, report bugs, and help us improve ListHub for everyone.",
  pathname: "/help/feedback",
})

export default function FeedbackPage() {
  return (
    <div className="container max-w-5xl py-8 md:py-12">
      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Send Feedback</h1>
        <p className="text-lg text-muted-foreground">
          Help us improve ListHub by sharing your thoughts, suggestions, and reporting issues.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              General Feedback
            </CardTitle>
            <CardDescription>
              Share your overall experience with ListHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="mailto:feedback@listhub.com">Send General Feedback</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Report a Bug
            </CardTitle>
            <CardDescription>
              Help us identify and fix technical issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="mailto:bugs@listhub.com">Report a Bug</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Feature Request
            </CardTitle>
            <CardDescription>
              Suggest new features or improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="mailto:features@listhub.com">Request a Feature</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              User Experience
            </CardTitle>
            <CardDescription>
              Share your thoughts on our user interface and experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="mailto:ux@listhub.com">Share UX Feedback</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Feedback Guidelines</h2>
        <p className="mb-4">To help us process your feedback effectively, please include:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>A clear description of your feedback or issue</li>
          <li>Steps to reproduce (for bug reports)</li>
          <li>Your device and browser information</li>
          <li>Any relevant screenshots or attachments</li>
          <li>Your contact information (optional)</li>
        </ul>
      </div>
    </div>
  )
} 