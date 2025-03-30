import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { constructMetadata } from "@/lib/metadata"
import { Analytics } from "@/components/analytics"
import { ChatbotWidget } from "@/components/chatbot-widget"
import PageTransition from "@/components/page-transition"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata = constructMetadata({
  title: "ListHub - Your Local Marketplace",
  description: "Buy and sell items in your local community. Find great deals on everything from furniture to electronics.",
  pathname: "/",
  image: "/og-image.png",
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/hero-listhub.mp4" as="video" type="video/mp4" media="(min-width: 768px)" />
        <link rel="preload" href="/hero-listhub-mobile.mp4" as="video" type="video/mp4" media="(max-width: 767px)" />
        <link rel="preload" href="/hero-poster.jpg" as="image" type="image/jpeg" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
          <ChatbotWidget />
          <ScrollToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'