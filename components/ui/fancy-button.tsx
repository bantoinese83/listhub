import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  className?: string
  asChild?: boolean
  children?: React.ReactNode
}

export default function FancyButton({ label = "Fancy Button", className, asChild = false, children, ...props }: FancyButtonProps) {
  const Comp = asChild ? Slot : Button

  const content = (
    <>
      <div className="absolute inset-0 rounded-lg p-[2px] bg-linear-to-b from-[#654358] via-[#17092A] to-[#2F0D64]">
        <div className="absolute inset-0 bg-[#170928] rounded-lg opacity-90" />
      </div>

      <div className="absolute inset-[2px] bg-[#170928] rounded-lg opacity-95" />

      <div className="absolute inset-[2px] bg-linear-to-r from-[#170928] via-[#1d0d33] to-[#170928] rounded-lg opacity-90" />
      <div className="absolute inset-[2px] bg-linear-to-b from-[#654358]/40 via-[#1d0d33] to-[#2F0D64]/30 rounded-lg opacity-80" />
      <div className="absolute inset-[2px] bg-linear-to-br from-[#C787F6]/10 via-[#1d0d33] to-[#2A1736]/50 rounded-lg" />

      <div className="absolute inset-[2px] shadow-[inset_0_0_15px_rgba(199,135,246,0.15)] rounded-lg" />

      <div className="relative flex items-center justify-center gap-2 z-10">
        <span className="text-lg font-light text-white drop-shadow-[0_0_12px_rgba(199,135,246,0.4)] tracking-tighter">
          {label}
        </span>
      </div>

      <div className="absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-linear-to-r from-[#2A1736]/20 via-[#C787F6]/10 to-[#2A1736]/20 group-hover:opacity-100 rounded-lg" />
    </>
  )

  return (
    <Comp
      variant="ghost"
      className={cn(
        "group relative w-1/2 h-12 px-4 rounded-lg overflow-hidden transition-all duration-500",
        className
      )}
      {...props}
    >
      {asChild ? children : content}
    </Comp>
  )
} 