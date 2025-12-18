import type React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  variant?: "cyan-purple" | "purple-pink" | "cyan-green" | "rainbow"
  animated?: boolean
}

export function GradientText({ children, className, variant = "cyan-purple", animated = false }: GradientTextProps) {
  const gradientVariants = {
    "cyan-purple": "from-cyan-400 via-blue-500 to-purple-500",
    "purple-pink": "from-purple-400 via-pink-500 to-rose-500",
    "cyan-green": "from-cyan-400 via-teal-500 to-green-500",
    rainbow: "from-cyan-400 via-purple-500 to-pink-500",
  }

  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent font-semibold",
        gradientVariants[variant],
        animated && "animate-gradient-shift",
        className,
      )}
      style={animated ? { backgroundSize: "200% auto" } : undefined}
    >
      {children}
    </span>
  )
}
