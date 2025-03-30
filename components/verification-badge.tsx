import type React from "react"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VerificationLevel } from "@/lib/verification/verification-service"

interface VerificationBadgeProps {
  level: VerificationLevel
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export default function VerificationBadge({ level, size = "md", showTooltip = true }: VerificationBadgeProps) {
  // Define badge properties based on verification level
  const badgeProps: Record<
    VerificationLevel,
    {
      label: string
      icon: React.ReactNode
      variant: "default" | "secondary" | "outline" | "destructive"
      tooltip: string
    }
  > = {
    [VerificationLevel.NONE]: {
      label: "Unverified",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      variant: "outline",
      tooltip: "This user has not completed any verification steps",
    },
    [VerificationLevel.EMAIL]: {
      label: "Email Verified",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      variant: "secondary",
      tooltip: "This user has verified their email address",
    },
    [VerificationLevel.PHONE]: {
      label: "Phone Verified",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      variant: "default",
      tooltip: "This user has verified their email and phone number",
    },
    [VerificationLevel.ID]: {
      label: "ID Verified",
      icon: <Shield className="h-3 w-3 mr-1" />,
      variant: "default",
      tooltip: "This user has verified their identity with government ID",
    },
    [VerificationLevel.TRUSTED]: {
      label: "Trusted User",
      icon: <Shield className="h-3 w-3 mr-1 fill-current" />,
      variant: "default",
      tooltip: "This is a trusted user with a verified identity and positive history",
    },
  }

  // Get badge properties for the current level
  const { label, icon, variant, tooltip } = badgeProps[level] || badgeProps[VerificationLevel.NONE]

  // Size classes
  const sizeClasses = {
    sm: "text-xs py-0 px-2",
    md: "text-xs py-0.5 px-2.5",
    lg: "text-sm py-1 px-3",
  }

  const badge = (
    <Badge
      variant={variant}
      className={`flex items-center ${sizeClasses[size]} ${level === VerificationLevel.TRUSTED ? "bg-green-600" : ""}`}
    >
      {icon}
      {label}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

