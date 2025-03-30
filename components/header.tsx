"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User as UserIcon, Plus, LogIn, Heart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileMenu from "@/components/mobile-menu"
import { motion } from "framer-motion"
import { SITE_NAME } from "@/lib/constants"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  
  useEffect(() => {
    if (!supabase) return

    const getUser = async () => {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  // Update the mainNav array to include the Map link
  const mainNav = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Map", href: "/map" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ]

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <motion.span
              className="text-xl font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span>LIST</span>
              <span className="text-muted-foreground">HUB</span>
            </motion.span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {mainNav.map((item, i) => (
              <motion.div
                key={item.href}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || "User avatar"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/listings/new">New Listing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/analytics">Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleSignOut}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/signin">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <MobileMenu isAuthenticated={!!user} user={user} />
        </div>
      </div>
      {isSearchOpen && (
        <div className="container py-4">
          <Input
            type="search"
            placeholder="Search listings..."
            className="w-full"
          />
        </div>
      )}
    </motion.header>
  )
}


