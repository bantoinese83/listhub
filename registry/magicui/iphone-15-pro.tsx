"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface Iphone15ProProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc?: string
  imageSrc?: string
  children?: React.ReactNode
}

const Iphone15Pro = forwardRef<HTMLDivElement, Iphone15ProProps>(
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
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              fill="black"
            />
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              fill="url(#paint0_radial_1_2)"
            />
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              fill="url(#paint1_radial_1_2)"
            />
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              fill="url(#paint2_radial_1_2)"
              fillOpacity="0.6"
            />
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              fill="url(#paint3_radial_1_2)"
              fillOpacity="0.6"
            />
            <path
              d="M42.857 0.5H307.143C330.917 0.5 350 19.584 350 43.357V668.643C350 692.416 330.917 711.5 307.143 711.5H42.857C19.084 711.5 0 692.416 0 668.643V43.357C0 19.584 19.084 0.5 42.857 0.5Z"
              stroke="#1E2022"
            />
            <path
              d="M11 119.5C11 113.149 16.1487 108 22.5 108H29C35.3513 108 40.5 113.149 40.5 119.5V119.5C40.5 125.851 35.3513 131 29 131H22.5C16.1487 131 11 125.851 11 119.5V119.5Z"
              fill="#1E2022"
            />
            <path
              d="M11 153C11 146.649 16.1487 141.5 22.5 141.5H29C35.3513 141.5 40.5 146.649 40.5 153V153C40.5 159.351 35.3513 164.5 29 164.5H22.5C16.1487 164.5 11 159.351 11 153V153Z"
              fill="#1E2022"
            />
            <path
              d="M11 186.5C11 180.149 16.1487 175 22.5 175H29C35.3513 175 40.5 180.149 40.5 186.5V186.5C40.5 192.851 35.3513 198 29 198H22.5C16.1487 198 11 192.851 11 186.5V186.5Z"
              fill="#1E2022"
            />
            <path
              d="M309.5 119.5C309.5 113.149 314.649 108 321 108H327.5C333.851 108 339 113.149 339 119.5V119.5C339 125.851 333.851 131 327.5 131H321C314.649 131 309.5 125.851 309.5 119.5V119.5Z"
              fill="#1E2022"
            />
            <path
              d="M132 24.5C132 22.2909 133.791 20.5 136 20.5H214C216.209 20.5 218 22.2909 218 24.5V24.5C218 26.7091 216.209 28.5 214 28.5H136C133.791 28.5 132 26.7091 132 24.5V24.5Z"
              fill="#1E2022"
            />
            <path
              d="M157 24.5C157 21.7386 159.239 19.5 162 19.5H188C190.761 19.5 193 21.7386 193 24.5V24.5C193 27.2614 190.761 29.5 188 29.5H162C159.239 29.5 157 27.2614 157 24.5V24.5Z"
              fill="#030303"
            />
            <path
              d="M157 24.5C157 21.7386 159.239 19.5 162 19.5H188C190.761 19.5 193 21.7386 193 24.5V24.5C193 27.2614 190.761 29.5 188 29.5H162C159.239 29.5 157 27.2614 157 24.5V24.5Z"
              fill="url(#paint4_radial_1_2)"
              fillOpacity="0.25"
            />
            <path
              d="M157 24.5C157 21.7386 159.239 19.5 162 19.5H188C190.761 19.5 193 21.7386 193 24.5V24.5C193 27.2614 190.761 29.5 188 29.5H162C159.239 29.5 157 27.2614 157 24.5V24.5Z"
              fill="url(#paint5_radial_1_2)"
              fillOpacity="0.25"
            />
            <path
              d="M157 24.5C157 21.7386 159.239 19.5 162 19.5H188C190.761 19.5 193 21.7386 193 24.5V24.5C193 27.2614 190.761 29.5 188 29.5H162C159.239 29.5 157 27.2614 157 24.5V24.5Z"
              stroke="#1E2022"
            />
            <path
              d="M16 56.5C16 47.9396 22.9396 41 31.5 41H318.5C327.06 41 334 47.9396 334 56.5V655.5C334 664.06 327.06 671 318.5 671H31.5C22.9396 671 16 664.06 16 655.5V56.5Z"
              fill="black"
            />
            <defs>
              <radialGradient
                id="paint0_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(175 356) rotate(90) scale(355.5 175)"
              >
                <stop stopColor="#2C2C2C" />
                <stop offset="1" stopColor="#121212" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint1_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(175 356) rotate(90) scale(355.5 175)"
              >
                <stop stopColor="#2C2C2C" />
                <stop offset="1" stopColor="#121212" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(350 356) rotate(180) scale(350 1068.5)"
              >
                <stop stopColor="#565656" />
                <stop offset="1" stopColor="#1E1E1E" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint3_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(1.90735e-06 356) rotate(1.14307e-05) scale(350 1068.5)"
              >
                <stop stopColor="#565656" />
                <stop offset="1" stopColor="#1E1E1E" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint4_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(193 24.5) rotate(180) scale(36 55.0714)"
              >
                <stop stopColor="#565656" />
                <stop offset="1" stopColor="#1E1E1E" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id="paint5_radial_1_2"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(157 24.5) rotate(-4.76364e-06) scale(36 55.0714)"
              >
                <stop stopColor="#565656" />
                <stop offset="1" stopColor="#1E1E1E" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[16px] top-[41px] bottom-[41px] overflow-hidden rounded-[32px]">
          {videoSrc ? (
            <video className="h-full w-full object-cover" src={videoSrc} autoPlay playsInline muted loop />
          ) : imageSrc ? (
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="iPhone 15 Pro screenshot"
              className="h-full w-full object-cover"
            />
          ) : (
            children
          )}
        </div>
      </div>
    )
  },
)

Iphone15Pro.displayName = "Iphone15Pro"

export default Iphone15Pro

