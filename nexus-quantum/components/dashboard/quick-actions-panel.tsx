"use client"
import { Button } from "@/components/ui/button"
import { Plus, Play, RefreshCw } from "lucide-react"

export function QuickActionsPanel() {
  return (
    <div className="p-4 border-t border-border">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h4>
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Play className="h-4 w-4 mr-2" />
          Start Workflow
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>
    </div>
  )
}
