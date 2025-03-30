"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import FancyButton from "@/components/ui/fancy-button"
import SearchBar from "@/components/search-bar"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

export default function VideoHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Poster Image */}
        <Image
          src="/hero-poster.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        
        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/hero-poster.jpg"
          preload="metadata"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source
            src="/hero-listhub.mp4"
            type="video/mp4"
            media="(min-width: 768px)"
          />
          <source
            src="/hero-listhub-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative container h-full flex flex-col justify-center items-center text-center text-white z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Modern Marketplace for Everything Local
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Buy, sell, and connect in your community with our safe and easy-to-use platform.
          </p>

          {/* Update the buttons section in the hero component */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Link href="/listings/new" className="w-full md:w-auto">
              <FancyButton label="Post a Listing" className="w-full" />
            </Link>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Link href="/browse">Browse Listings</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Link href="/map">
                <MapPin className="mr-2 h-4 w-4" />
                Find Nearby
              </Link>
            </Button>
          </div>

          <div className="max-w-md mx-auto w-full">
            <SearchBar className="bg-white/10 backdrop-blur-md rounded-lg p-4" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

