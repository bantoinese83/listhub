"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    // After first mount, set to false
    setIsFirstMount(false)
  }, [])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Skip animation on first mount to prevent initial page load animation
  const shouldAnimate = !isFirstMount

  return (
    <motion.div
      key={pathname}
      initial={shouldAnimate ? "hidden" : false}
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  )
}

