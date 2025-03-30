"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface AndroidProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc?: string
  imageSrc?: string
  children?: React.ReactNode
}

const Android = forwardRef<HTMLDivElement, AndroidProps>(
  ({ className, videoSrc, imageSrc, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("h-[712px] w-[350px] relative", className)} {...props}>
        <div className="absolute inset-0">
          <svg
            width="350"
            height="712"
            viewBox="0 0 350 712"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 h-full w-full"
          >
            <rect x="0.5" y="0.5" width="349" height="711" rx="42.5" fill="black" />
            <rect x="0.5" y="0.5" width="349" height="711" rx="42.5" stroke="#333333" />
            <rect x="8" y="8" width="334" height="696" rx="38" stroke="#666666" strokeWidth="2" />
            <rect x="12" y="12" width="326" height="688" rx="34" fill="black" />
            <rect x="12" y="12" width="326" height="688" rx="34" fill="url(#paint0_radial_1_2)" fillOpacity="0.4" />
            <rect x="12" y="12" width="326" height="688" rx="34" fill="url(#paint1_radial_1_2)" fillOpacity="0.4" />
            <rect x="12" y="12" width="326" height="688" rx="34" stroke="#1A1A1A" strokeWidth="2" />
            <circle cx="175" cy="40" r="8" fill="#1A1A1A" />
            <rect x="155" y="24" width="40" height="8" rx="4" fill="#1A1A1A" />
            <defs>
              <radialGradient
                id="paint0_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12 356) rotate(90) scale(344 163)"
              >
                <stop stopColor="#333333" />
                <stop offset="1" stopColor="#333333" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint1_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(338 356) rotate(-90) scale(344 163)"
              >
                <stop stopColor="#333333" />
                <stop offset="1" stopColor="#333333" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[12px] overflow-hidden rounded-[34px]">
          {videoSrc ? (
            <video className="h-full w-full object-cover" src={videoSrc} autoPlay playsInline muted loop />
          ) : imageSrc ? (
            <img src={imageSrc || "/placeholder.svg"} alt="Android screenshot" className="h-full w-full object-cover" />
          ) : (
            children
          )}
        </div>
      </div>
    )
  },
)

Android.displayName = "Android"

export default Android

