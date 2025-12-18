"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Square } from "lucide-react"
import { cn } from "@/lib/utils"

export const EndNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card p-4 shadow-lg transition-all",
        selected ? "border-red-500 shadow-red-500/20" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-red-500" />

      <div className="flex items-center gap-2">
        <Square className="h-5 w-5 text-red-500 fill-red-500" />
        <span className="font-medium text-foreground">End</span>
      </div>
    </div>
  )
})

EndNode.displayName = "EndNode"
