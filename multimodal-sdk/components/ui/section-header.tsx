import type React from "react"
import { cn } from "@/lib/utils"
import { GradientText } from "./gradient-text"

interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  gradient?: boolean
}

export function SectionHeader({ title, description, action, className, gradient = false }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          {gradient ? <GradientText variant="rainbow">{title}</GradientText> : title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
