"use client"

import { Play, Save, Plus, Zap, GitBranch, Code, Circle, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface WorkflowToolbarProps {
  onAddNode: (type: string) => void
  onSave: () => void
  selectedNodeType: string | null
  onSelectNodeType: (type: string | null) => void
}

export function WorkflowToolbar({ onAddNode, onSave, selectedNodeType, onSelectNodeType }: WorkflowToolbarProps) {
  const nodeTypes = [
    { type: "start", label: "Start", icon: Circle, color: "text-green-500" },
    { type: "end", label: "End", icon: Square, color: "text-red-500" },
    { type: "agent", label: "Agent", icon: Zap, color: "text-cyan-500" },
    { type: "condition", label: "Condition", icon: GitBranch, color: "text-purple-500" },
    { type: "transform", label: "Transform", icon: Code, color: "text-pink-500" },
  ]

  return (
    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-border bg-card/95 p-2 shadow-lg backdrop-blur-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {nodeTypes.map((nodeType) => (
            <DropdownMenuItem key={nodeType.type} onClick={() => onAddNode(nodeType.type)}>
              <nodeType.icon className={`mr-2 h-4 w-4 ${nodeType.color}`} />
              {nodeType.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Play className="h-4 w-4" />
        Run
      </Button>

      <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onSave}>
        <Save className="h-4 w-4" />
        Save
      </Button>
    </div>
  )
}
