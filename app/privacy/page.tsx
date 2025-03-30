import { Metadata } from "next"
import { constructMetadata } from "@/lib/metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for ListHub",
  pathname: "/privacy",
})

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              At ListHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information (avatar, bio)</li>
              <li>Listing information (title, description, images)</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our service</li>
              <li>Process your transactions</li>
              <li>Send you important updates</li>
              <li>Improve our service</li>
              <li>Communicate with you</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Other users (only information you choose to share)</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@listhub.com" className="text-primary hover:underline">
                privacy@listhub.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 