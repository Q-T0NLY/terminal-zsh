"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const AgentNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card shadow-lg transition-all",
        selected ? "border-cyan-500 shadow-cyan-500/20" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-cyan-500" />

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded bg-cyan-500/20 p-1.5">
            <Zap className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">{data.label || "Agent Node"}</div>
            <div className="text-xs text-muted-foreground">AI Agent</div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
        {data.description && <div className="text-xs text-muted-foreground">{data.description}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-500" />
    </div>
  )
})

AgentNode.displayName = "AgentNode"
