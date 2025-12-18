"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export const StartNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "rounded-full border-2 bg-card p-4 shadow-lg transition-all",
        selected ? "border-green-500 shadow-green-500/20" : "border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <Circle className="h-5 w-5 text-green-500 fill-green-500" />
        <span className="font-medium text-foreground">Start</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  )
})

StartNode.displayName = "StartNode"
