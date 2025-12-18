"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

export const ConditionNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card shadow-lg transition-all",
        selected ? "border-purple-500 shadow-purple-500/20" : "border-border",
      )}
      style={{ transform: "rotate(45deg)" }}
    >
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />

      <div className="p-4" style={{ transform: "rotate(-45deg)" }}>
        <div className="flex items-center gap-2">
          <div className="rounded bg-purple-500/20 p-1.5">
            <GitBranch className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{data.label || "Condition"}</div>
            <div className="text-xs text-muted-foreground">Branch logic</div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" id="true" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" id="false" />
    </div>
  )
})

ConditionNode.displayName = "ConditionNode"
