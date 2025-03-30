"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"
import { SITE_NAME, SITE_DESCRIPTION, CONTACT_EMAIL } from "@/lib/constants"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.footer
      className="w-full border-t bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container grid grid-cols-1 gap-8 py-8 md:grid-cols-4">
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold">{SITE_NAME}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
          <div className="mt-4 flex space-x-4">
            <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold">Marketplace</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/categories/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                All Items
              </Link>
            </li>
            <li>
              <Link href="/categories/vehicles" className="text-muted-foreground hover:text-foreground transition-colors">
                Vehicles
              </Link>
            </li>
            <li>
              <Link href="/categories/electronics" className="text-muted-foreground hover:text-foreground transition-colors">
                Electronics
              </Link>
            </li>
            <li>
              <Link href="/categories/home-garden" className="text-muted-foreground hover:text-foreground transition-colors">
                Home & Garden
              </Link>
            </li>
            <li>
              <Link href="/categories/clothing-health-beauty" className="text-muted-foreground hover:text-foreground transition-colors">
                Clothing & Beauty
              </Link>
            </li>
            <li>
              <Link href="/categories/hobbies-recreation" className="text-muted-foreground hover:text-foreground transition-colors">
                Hobbies & Recreation
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold">Services & Community</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/categories/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/categories/community" className="text-muted-foreground hover:text-foreground transition-colors">
                Community
              </Link>
            </li>
            <li>
              <Link href="/categories/jobs-gigs" className="text-muted-foreground hover:text-foreground transition-colors">
                Jobs & Gigs
              </Link>
            </li>
            <li>
              <Link href="/categories/housing" className="text-muted-foreground hover:text-foreground transition-colors">
                Housing
              </Link>
            </li>
            <li>
              <Link href="/categories/discussions" className="text-muted-foreground hover:text-foreground transition-colors">
                Discussions
              </Link>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold">Support</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/help/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="/help/feedback" className="text-muted-foreground hover:text-foreground transition-colors">
                Send Feedback
              </Link>
            </li>
            <li>
              <Link href="/help/abuse" className="text-muted-foreground hover:text-foreground transition-colors">
                Report Abuse
              </Link>
            </li>
            <li>
              <Link href="/help/legal" className="text-muted-foreground hover:text-foreground transition-colors">
                Legal Information
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

