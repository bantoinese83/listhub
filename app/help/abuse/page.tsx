import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Flag, AlertTriangle, ShieldAlert, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Report Abuse | Marketplace",
  description: "Report suspicious listings, users, or inappropriate content on our marketplace platform.",
}

export default function AbuseReportPage() {
  const reportableIssues = [
    {
      category: "Prohibited Items",
      description: "Items that violate our terms of service or local laws",
      examples: [
        "Illegal items or substances",
        "Weapons or explosives",
        "Counterfeit or stolen goods",
        "Prescription drugs or controlled substances",
        "Hazardous materials",
        "Animals (except for rehoming with no fee)",
        "Human remains or body parts",
        "Recalled items",
      ],
    },
    {
      category: "Fraudulent Activity",
      description: "Deceptive practices intended to scam users",
      examples: [
        "Fake listings with no intention to sell",
        "Bait and switch tactics",
        "Misrepresenting item condition or authenticity",
        "Pyramid schemes or multi-level marketing",
        "Advance fee scams",
        "Phishing attempts",
        "Impersonation of our platform or staff",
      ],
    },
    {
      category: "Inappropriate Content",
      description: "Content that violates our community standards",
      examples: [
        "Adult or sexually explicit material",
        "Graphic violence or gore",
        "Hate speech or discriminatory content",
        "Harassment or bullying",
        "Personal information shared without consent",
        "Content that exploits or endangers minors",
      ],
    },
    {
      category: "Policy Violations",
      description: "Actions that break our platform rules",
      examples: [
        "Multiple accounts for the same listing",
        "Keyword spamming in listings",
        "Circumventing our fee structure",
        "Commercial posting in non-commercial categories",
        "Posting the same item repeatedly",
        "Using our platform for non-marketplace activities",
      ],
    },
    {
      category: "User Misconduct",
      description: "Inappropriate behavior from users",
      examples: [
        "Harassment or threats",
        "Discriminatory behavior",
        "No-shows for arranged meetings",
        "Refusing to honor agreed-upon terms",
        "Using fake contact information",
        "Creating multiple accounts to evade restrictions",
      ],
    },
  ]

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/help" className="hover:text-foreground">
              Help Center
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-foreground font-medium">Report Abuse</li>
        </ol>
      </nav>

      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Report Abuse</h1>
        <p className="text-lg text-muted-foreground">
          Help us keep our marketplace safe by reporting suspicious or inappropriate content
        </p>
      </div>

      <Alert className="mb-8">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Your reports help keep our community safe</AlertTitle>
        <AlertDescription>
          We review all reports and take appropriate action based on our terms of service and community guidelines.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="how-to-report" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="how-to-report">How to Report</TabsTrigger>
          <TabsTrigger value="reportable-issues">What to Report</TabsTrigger>
        </TabsList>
        <TabsContent value="how-to-report" className="p-4 border rounded-md mt-2">
          <h2 className="text-xl font-semibold mb-4">How to Report Issues</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Reporting a Listing</h3>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Navigate to the listing you want to report</li>
                <li>Click the "Report" button (usually found near the listing title or in a dropdown menu)</li>
                <li>Select the reason for your report from the options provided</li>
                <li>Provide additional details about the issue</li>
                <li>Submit your report</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Reporting a User</h3>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Navigate to the user's profile</li>
                <li>Click the "Report User" button (usually found near their username or in a dropdown menu)</li>
                <li>Select the reason for your report from the options provided</li>
                <li>Provide additional details about the issue, including specific interactions or messages</li>
                <li>Submit your report</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Reporting a Message</h3>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Open the conversation containing the message</li>
                <li>Click the "Report" icon next to the specific message (usually represented by a flag icon)</li>
                <li>Select the reason for your report from the options provided</li>
                <li>Provide any additional context about why the message is problematic</li>
                <li>Submit your report</li>
              </ol>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reportable-issues" className="p-4 border rounded-md mt-2">
          <h2 className="text-xl font-semibold mb-4">What to Report</h2>

          <div className="space-y-4">
            {reportableIssues.map((issue) => (
              <div key={issue.category} className="space-y-2">
                <h3 className="text-lg font-medium">{issue.category}</h3>
                <p className="text-muted-foreground">{issue.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {issue.examples.map((example, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Flag className="h-4 w-4 mt-1 flex-shrink-0 text-destructive" />
                      <span className="text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-destructive" />
              Report a Listing or User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To report a specific listing or user, navigate to the listing or user profile and use the report button
              there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Browse Listings
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency Situations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you believe you're in immediate danger or have been the victim of a crime, please contact your local
              law enforcement immediately.
            </p>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>For emergencies, call 911 (US) or your local emergency number</AlertTitle>
              <AlertDescription>
                Our platform is not equipped to handle emergency situations. Please contact the appropriate authorities.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Our Review Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              When you submit a report, our team reviews it as quickly as possible. Here's what happens next:
            </p>
            <ol className="space-y-2 ml-6 list-decimal">
              <li>Our team reviews the report and any supporting evidence</li>
              <li>We may contact you for additional information if needed</li>
              <li>We investigate the reported content or behavior</li>
              <li>We take appropriate action based on our terms of service</li>
              <li>We may notify you when action has been taken (depending on the nature of the report)</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: Due to privacy concerns, we may not be able to share specific details about actions taken against
              other users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

