"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Users, ShoppingBag, MessageSquare, Globe } from "lucide-react"

interface StatCounterProps {
  listings: number
  users: number
  locations: number
  messages: number
}

export default function StatsCounter({ listings, users, locations, messages }: StatCounterProps) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  const stats = [
    {
      icon: Users,
      value: users,
      label: "Active Users",
      suffix: "+",
      color: "text-blue-500",
    },
    {
      icon: ShoppingBag,
      value: listings,
      label: "Listings Posted",
      suffix: "+",
      color: "text-green-500",
    },
    {
      icon: MessageSquare,
      value: messages,
      label: "Messages Sent",
      suffix: "+",
      color: "text-purple-500",
    },
    {
      icon: Globe,
      value: locations,
      label: "Cities Covered",
      suffix: "+",
      color: "text-orange-500",
    },
  ]

  return (
    <section id="stats-section" className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const count = useMotionValue(0)
            const formatted = useMotionTemplate`${count}${stat.suffix}`

            useEffect(() => {
              if (isInView) {
                count.set(stat.value)
              }
            }, [isInView, stat.value])

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`p-4 rounded-full ${stat.color.replace("text", "bg")}/10 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <motion.div
                  className="text-3xl md:text-4xl font-bold"
                >
                  <motion.span>
                    {formatted}
                  </motion.span>
                </motion.div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

