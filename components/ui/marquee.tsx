import * as React from "react"
import { cn } from "@/lib/utils"

const Marquee = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    reverse?: boolean
    pauseOnHover?: boolean
  }
>(({ className, reverse, pauseOnHover, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group flex overflow-hidden [--duration:30s] [--gap:1rem]",
        className
      )}
      {...props}
      data-marquee
      style={{
        "--gap": "1rem",
        "--duration": "30s",
        "--play": "play",
        "--direction": reverse ? "reverse" : "normal",
        "--pause-on-hover": pauseOnHover ? "pause" : "play",
      } as React.CSSProperties}
    >
      <div className="flex min-w-full shrink-0 items-center justify-around gap-[--gap]">
        {children}
      </div>
      <div className="flex min-w-full shrink-0 items-center justify-around gap-[--gap]">
        {children}
      </div>
    </div>
  )
})
Marquee.displayName = "Marquee"

export { Marquee } 