import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Marketplace",
  description: "Find answers to common questions about using our marketplace platform.",
}

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Account & Profile",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Sign Up' button in the top right corner of the page. You'll need to provide your email address and create a password. You can also sign up using your Google or Facebook account for faster registration.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "If you've forgotten your password, click on the 'Sign In' button, then select 'Forgot Password'. Enter the email address associated with your account, and we'll send you instructions to reset your password.",
        },
        {
          question: "Can I change my username or email address?",
          answer:
            "You can update your profile information, including your display name, from your account settings. However, to change the email address associated with your account, you'll need to contact our support team for security reasons.",
        },
        {
          question: "How do I delete my account?",
          answer:
            "To delete your account, go to your account settings and select 'Delete Account' at the bottom of the page. Please note that this action is permanent and will remove all your listings and messages.",
        },
      ],
    },
    {
      category: "Buying",
      questions: [
        {
          question: "How do I search for items?",
          answer:
            "You can search for items using the search bar at the top of the page. You can also browse by category or use filters to narrow down your search by location, price range, and other criteria.",
        },
        {
          question: "How do I contact a seller?",
          answer:
            "When viewing a listing, you'll see a 'Contact Seller' button. Click on it to send a message to the seller. You'll need to be signed in to contact sellers.",
        },
        {
          question: "Is there a way to save listings I'm interested in?",
          answer:
            "Yes, you can save listings to your favorites by clicking the heart icon on any listing. You can view all your saved listings in your dashboard under 'Favorites'.",
        },
        {
          question: "How do I report a suspicious listing?",
          answer:
            "If you come across a listing that seems suspicious or violates our policies, click the 'Report' button on the listing page. You'll be asked to provide details about why you're reporting the listing.",
        },
      ],
    },
    {
      category: "Selling",
      questions: [
        {
          question: "How do I create a listing?",
          answer:
            "To create a listing, click on the 'Post Ad' or 'New Listing' button in the navigation bar. You'll need to provide details about your item, including title, description, price, category, and photos.",
        },
        {
          question: "How many photos can I add to my listing?",
          answer:
            "You can add up to 10 photos to each listing. We recommend adding multiple clear photos from different angles to give buyers a good understanding of what you're selling.",
        },
        {
          question: "Is there a fee for posting listings?",
          answer:
            "Basic listings are free. However, we offer premium features like featured listings and promoted ads for a fee to help your items sell faster.",
        },
        {
          question: "How long will my listing stay active?",
          answer:
            "Standard listings remain active for 30 days. After that, you can choose to renew your listing if the item hasn't sold yet.",
        },
      ],
    },
    {
      category: "Transactions",
      questions: [
        {
          question: "How do payments work?",
          answer:
            "Our platform is primarily designed to connect buyers and sellers. Payments are typically handled directly between the buyer and seller when they meet in person. We recommend cash for in-person transactions for safety and simplicity.",
        },
        {
          question: "Does the platform offer any payment protection?",
          answer:
            "For in-person transactions, we recommend following our safety guidelines. For items that need to be shipped, we recommend using secure payment methods that offer buyer and seller protection.",
        },
        {
          question: "What should I do if a buyer or seller doesn't show up?",
          answer:
            "If someone doesn't show up for a scheduled meeting, you can report this behavior through our user reporting system. We take reliability seriously in our community.",
        },
      ],
    },
    {
      category: "Safety & Security",
      questions: [
        {
          question: "How can I stay safe when meeting someone in person?",
          answer:
            "Always meet in a public place during daylight hours, bring a friend if possible, and let someone know where you're going. For more detailed safety tips, visit our Safety Tips page.",
        },
        {
          question: "How does the platform protect my personal information?",
          answer:
            "We only share the information you choose to include in your listings. Your email address is not visible to other users, and communication happens through our messaging system. For more details, please review our Privacy Policy.",
        },
        {
          question: "What should I do if I suspect a scam?",
          answer:
            "If you suspect a scam, do not proceed with the transaction and report the user immediately. Visit our 'Avoid Scams & Fraud' page for information on recognizing common scams.",
        },
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
          <li className="text-foreground font-medium">FAQ</li>
        </ol>
      </nav>

      <div className="flex flex-col items-start gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">Find answers to common questions about using our marketplace</p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category) => (
          <div key={category.category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category.category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
        <p className="mb-4">If you couldn't find the answer you were looking for, please contact our support team.</p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Contact Support
        </Link>
      </div>
    </div>
  )
}

