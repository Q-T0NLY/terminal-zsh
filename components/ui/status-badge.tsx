import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "running" | "completed" | "failed"
  className?: string
  showDot?: boolean
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: "Active",
      variant: "default" as const,
      dotColor: "bg-green-500",
    },
    inactive: {
      label: "Inactive",
      variant: "secondary" as const,
      dotColor: "bg-gray-500",
    },
    pending: {
      label: "Pending",
      variant: "outline" as const,
      dotColor: "bg-yellow-500",
    },
    running: {
      label: "Running",
      variant: "default" as const,
      dotColor: "bg-blue-500 animate-pulse",
    },
    completed: {
      label: "Completed",
      variant: "default" as const,
      dotColor: "bg-green-500",
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      dotColor: "bg-red-500",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />}
      {config.label}
    </Badge>
  )
}
