import type React from "react"

interface PageHeaderProps {
  heading: string
  subheading?: string
  children?: React.ReactNode
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-2 pb-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{heading}</h1>
      {subheading && <p className="text-lg text-muted-foreground">{subheading}</p>}
      {children}
    </div>
  )
}

