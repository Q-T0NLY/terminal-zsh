"use client"

import { cn } from "@/lib/utils"

interface GridPatternProps {
  className?: string
  opacity?: number
}

export function GridPattern({ className, opacity = 0.1 }: GridPatternProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `linear-gradient(rgba(6, 182, 212, ${opacity}) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(6, 182, 212, ${opacity}) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />
  )
}
