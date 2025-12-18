import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GlowCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "purple" | "pink" | "green"
  hoverable?: boolean
}

export function GlowCard({
  title,
  description,
  children,
  className,
  glowColor = "cyan",
  hoverable = true,
}: GlowCardProps) {
  const glowColorClasses = {
    cyan: "hover:shadow-cyan-500/20 border-cyan-500/20",
    purple: "hover:shadow-purple-500/20 border-purple-500/20",
    pink: "hover:shadow-pink-500/20 border-pink-500/20",
    green: "hover:shadow-green-500/20 border-green-500/20",
  }

  const shadowClasses = {
    cyan: "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    purple: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    pink: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    green: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
  }

  return (
    <Card
      className={cn(
        "glass-card transition-all duration-300",
        hoverable && "hover-lift cursor-pointer",
        hoverable && shadowClasses[glowColor],
        glowColorClasses[glowColor],
        className,
      )}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-foreground">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
