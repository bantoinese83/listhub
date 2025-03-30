import { Metadata } from "next"
import { constructMetadata } from "@/lib/metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service",
  description: "Terms of Service for ListHub",
  pathname: "/terms",
})

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using ListHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              ListHub is a platform that allows users to create, manage, and view listings. The service includes features for user profiles, messaging, and listing management.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. User Accounts</h2>
            <p className="text-muted-foreground">
              To use ListHub, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. User Content</h2>
            <p className="text-muted-foreground">
              Users retain ownership of their content. By posting content on ListHub, you grant us a license to use, modify, and display the content in connection with the service.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">5. Prohibited Activities</h2>
            <p className="text-muted-foreground">Users may not:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Post false or misleading information</li>
              <li>Harass or abuse other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to access unauthorized areas of the service</li>
              <li>Use the service for any illegal purposes</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">6. Privacy Policy</h2>
            <p className="text-muted-foreground">
              Your use of ListHub is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">7. Modifications to Service</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or discontinue the service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              ListHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">9. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ListHub operates.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@listhub.com" className="text-primary hover:underline">
                support@listhub.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 