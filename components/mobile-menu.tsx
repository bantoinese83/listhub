"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Plus, Heart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { createBrowserClient } from "@supabase/ssr"
import { User } from "@supabase/supabase-js"

interface MobileMenuProps {
  isAuthenticated: boolean
  user: User | null
}

export default function MobileMenu({ isAuthenticated, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
  }

  // Update the mainNav array to include the Map link
  const mainNav = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Map", href: "/map" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ]

  const authNav = isAuthenticated
    ? [
        { name: "New Listing", href: "/listings/new", icon: Plus },
        { name: "Favorites", href: "/favorites", icon: Heart },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Sign Out", href: "/auth/signout" },
      ]
    : [
        { name: "Sign In", href: "/auth/signin" },
        { name: "Sign Up", href: "/auth/signup" },
      ]

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, x: 20 },
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col p-0">
        <div className="flex items-center justify-between border-b p-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-bold">
            ListingHub
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <AnimatePresence>
            <nav className="flex flex-col gap-1 px-2">
              <div className="mb-2 px-3 text-sm font-medium text-muted-foreground">Navigation</div>
              {mainNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="mb-2 mt-4 px-3 text-sm font-medium text-muted-foreground">Account</div>
              {user ? (
                <>
                  <div className="px-4 py-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback>{user.user_metadata?.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.user_metadata?.full_name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <nav className="grid gap-1 p-4">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/listings/new"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      New Listing
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      Favorites
                    </Link>
                    <Link
                      href="/analytics"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      Analytics
                    </Link>
                  </nav>
                  <Separator />
                  <div className="p-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      Log out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-4 space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                </div>
              )}
            </nav>
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
}

