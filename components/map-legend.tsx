"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, MapPin, Tag, DollarSign, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface MapLegendProps {
  totalListings: number
  priceRange: {
    min: number
    max: number
  }
  dateRange: {
    start: string
    end: string
  }
  categories: {
    name: string
    count: number
  }[]
}

export default function MapLegend({ totalListings, priceRange, dateRange, categories }: MapLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 z-10 w-64"
    >
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Map Legend</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{totalListings}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  ${priceRange.min} - ${priceRange.max}
                </span>
              </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Categories */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Categories</h4>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{category.name}</span>
                          </div>
                          <span className="font-medium">{category.count}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Date Range</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {dateRange.start} - {dateRange.end}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 