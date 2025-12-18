"use client"

import { Suspense, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface LoadingBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export function LoadingBoundary({ children, fallback, className }: LoadingBoundaryProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center min-h-[200px] ${className || ""}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
}

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return <Loader2 className={`animate-spin text-primary ${sizeClasses[size]} ${className || ""}`} />
}
