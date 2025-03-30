import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Scale, FileText, ShieldCheck, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Legal Information | Marketplace",
  description: "Terms of service, privacy policy, and other legal information for our marketplace platform.",
}

export default function LegalPage() {
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
          <li className="text-foreground font-medium">Legal Information</li>
        </ol>
      </nav>

      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Legal Information</h1>
        <p className="text-lg text-muted-foreground">Terms of service, privacy policy, and other legal information</p>
      </div>

      <Tabs defaultValue="terms" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="p-6 border rounded-md mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Terms of Service</h2>
          </div>

          <p className="text-muted-foreground">Last updated: March 15, 2023</p>

          <div className="space-y-4 prose max-w-none">
            <h3 className="text-xl font-semibold">1. Introduction</h3>
            <p>
              Welcome to our marketplace platform. These Terms of Service ("Terms") govern your access to and use of our
              website, services, and applications (collectively, the "Services"). By accessing or using our Services,
              you agree to be bound by these Terms.
            </p>

            <h3 className="text-xl font-semibold">2. Using Our Services</h3>
            <p>
              You must follow any policies made available to you within the Services. You may use our Services only as
              permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms
              or policies or if we are investigating suspected misconduct.
            </p>

            <h3 className="text-xl font-semibold">3. Your Account</h3>
            <p>
              You may need an account to use some of our Services. You are responsible for safeguarding your account, so
              use a strong password and limit its use to this account. We cannot and will not be liable for any loss or
              damage arising from your failure to comply with the above.
            </p>

            <h3 className="text-xl font-semibold">4. User Content</h3>
            <p>
              Our Services allow you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the
              Service, including its legality, reliability, and appropriateness.
            </p>

            <h3 className="text-xl font-semibold">5. Prohibited Items and Activities</h3>
            <p>
              You may not use our Services to buy, sell, or trade illegal items or services. This includes but is not
              limited to controlled substances, stolen goods, counterfeit items, weapons, and hazardous materials.
              Additionally, you may not use our Services for fraudulent activities, harassment, or any other illegal
              purposes.
            </p>

            <h3 className="text-xl font-semibold">6. Termination</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the
              Services will immediately cease.
            </p>

            <h3 className="text-xl font-semibold">7. Limitation of Liability</h3>
            <p>
              In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
              from your access to or use of or inability to access or use the Services.
            </p>

            <h3 className="text-xl font-semibold">8. Changes to Terms</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h3 className="text-xl font-semibold">9. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us at legal@marketplace.com.</p>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="p-6 border rounded-md mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
          </div>

          <p className="text-muted-foreground">Last updated: March 15, 2023</p>

          <div className="space-y-4 prose max-w-none">
            <h3 className="text-xl font-semibold">1. Information We Collect</h3>
            <p>
              We collect information to provide better services to all our users. This includes information you provide
              to us, such as your name, email address, telephone number, and payment information when you create an
              account or make a transaction.
            </p>

            <h3 className="text-xl font-semibold">2. How We Use Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our Services, to develop new ones, and
              to protect our users. We also use this information to offer you tailored content and to measure the
              effectiveness of our Services.
            </p>

            <h3 className="text-xl font-semibold">3. Information Sharing</h3>
            <p>
              We do not share personal information with companies, organizations, or individuals outside of our company
              except in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>With your consent</li>
              <li>For legal reasons</li>
              <li>With our service providers</li>
              <li>For external processing</li>
            </ul>

            <h3 className="text-xl font-semibold">4. Information Security</h3>
            <p>
              We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or
              destruction of information we hold. In particular, we encrypt many of our services using SSL, review our
              information collection, storage, and processing practices, and restrict access to personal information to
              our employees, contractors, and agents who need to know that information.
            </p>

            <h3 className="text-xl font-semibold">5. Your Choices</h3>
            <p>
              You have the right to access, correct, or delete your personal information. You can also object to
              processing of your personal information, ask us to restrict processing of your personal information, or
              request portability of your personal information.
            </p>

            <h3 className="text-xl font-semibold">6. Children's Privacy</h3>
            <p>
              Our Services are not directed to children under the age of 13, and we do not knowingly collect personal
              information from children under 13. If we learn that we have collected personal information of a child
              under 13, we will take steps to delete such information from our files as soon as possible.
            </p>

            <h3 className="text-xl font-semibold">7. Changes to This Policy</h3>
            <p>
              We may change this privacy policy from time to time. We will post any privacy policy changes on this page
              and, if the changes are significant, we will provide a more prominent notice.
            </p>

            <h3 className="text-xl font-semibold">8. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@marketplace.com.</p>
          </div>
        </TabsContent>

        <TabsContent value="cookies" className="p-6 border rounded-md mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Cookie Policy</h2>
          </div>

          <p className="text-muted-foreground">Last updated: March 15, 2023</p>

          <div className="space-y-4 prose max-w-none">
            <h3 className="text-xl font-semibold">1. What Are Cookies</h3>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored
              in your web browser and allows the Service or a third-party to recognize you and make your next visit
              easier and the Service more useful to you.
            </p>

            <h3 className="text-xl font-semibold">2. How We Use Cookies</h3>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To enable certain functions of the Service</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>To enable advertisements delivery, including behavioral advertising</li>
            </ul>

            <h3 className="text-xl font-semibold">3. Types of Cookies We Use</h3>
            <p>
              We use both session cookies, which expire when you close your browser, and persistent cookies, which stay
              on your browser until deleted, to provide you with a more personalized experience on our Service.
            </p>

            <h3 className="text-xl font-semibold">4. Your Choices Regarding Cookies</h3>
            <p>
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the
              help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them,
              you might not be able to use all of the features we offer, you may not be able to store your preferences,
              and some of our pages might not display properly.
            </p>

            <h3 className="text-xl font-semibold">5. Where Can You Find More Information About Cookies</h3>
            <p>You can learn more about cookies at the following third-party websites:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                AllAboutCookies:{" "}
                <a href="http://www.allaboutcookies.org/" className="text-primary hover:underline">
                  http://www.allaboutcookies.org/
                </a>
              </li>
              <li>
                Network Advertising Initiative:{" "}
                <a href="http://www.networkadvertising.org/" className="text-primary hover:underline">
                  http://www.networkadvertising.org/
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold">6. Changes to This Cookie Policy</h3>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
              Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
            </p>

            <h3 className="text-xl font-semibold">7. Contact Us</h3>
            <p>If you have any questions about our Cookie Policy, please contact us at privacy@marketplace.com.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <div className="p-6 border rounded-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Disclaimer
          </h2>
          <p className="mb-4">
            Our marketplace platform is a venue for users to buy and sell items. We are not involved in the actual
            transaction between buyers and sellers. As a result, we have no control over the quality, safety, legality
            or availability of the items advertised, the truth or accuracy of the listings, the ability of sellers to
            sell items or the ability of buyers to pay for items.
          </p>
          <p>
            We cannot ensure that a buyer or seller will actually complete a transaction or that they will do so in
            accordance with the terms of the listing. For these reasons, we assume no liability for the actions of users
            on our platform.
          </p>
        </div>

        <div className="p-6 border rounded-md">
          <h2 className="text-xl font-semibold mb-4">Additional Legal Resources</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/help/legal/copyright" className="text-primary hover:underline flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Copyright Policy
              </Link>
            </li>
            <li>
              <Link href="/help/legal/dmca" className="text-primary hover:underline flex items-center gap-2">
                <FileText className="h-4 w-4" />
                DMCA Takedown Policy
              </Link>
            </li>
            <li>
              <Link href="/help/legal/accessibility" className="text-primary hover:underline flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Accessibility Statement
              </Link>
            </li>
            <li>
              <Link
                href="/help/legal/community-guidelines"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Community Guidelines
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Need Legal Assistance?</h2>
        <p className="mb-4">
          If you have specific legal questions about our platform or your use of our services, please contact our legal
          team.
        </p>
        <Link
          href="/contact?department=legal"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Contact Legal Department
        </Link>
      </div>
    </div>
  )
}

