import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"
import ScrollToTop from "@/components/scroll-to-top"
import { constructMetadata } from "@/lib/metadata"
import { Analytics } from "@/components/analytics"
import { ChatbotWidget } from "@/components/chatbot-widget"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

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
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ChatbotWidget />
          <ScrollToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'