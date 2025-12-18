"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Code } from "lucide-react"
import { cn } from "@/lib/utils"

export const TransformNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card shadow-lg transition-all",
        selected ? "border-pink-500 shadow-pink-500/20" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-pink-500" />

      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="rounded bg-pink-500/20 p-1.5">
            <Code className="h-4 w-4 text-pink-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{data.label || "Transform"}</div>
            <div className="text-xs text-muted-foreground">Data transformation</div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-pink-500" />
    </div>
  )
})

TransformNode.displayName = "TransformNode"
