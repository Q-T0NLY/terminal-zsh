"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { enhancedAgentRegistry } from "@/lib/services/enhanced-agent-registry.service"

export function AgentHealthPanel() {
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    const loadAgents = () => {
      const allAgents = enhancedAgentRegistry.getAllAgents()
      setAgents(allAgents)
    }

    loadAgents()
    const interval = setInterval(loadAgents, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Agent Health</h3>
        <Button variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-auto">
        {agents.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">No agents registered</div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="p-3 rounded-lg bg-card border hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm">{agent.id}</div>
                  <div className="text-xs text-muted-foreground">{agent.spec.type}</div>
                </div>
                <Badge variant={agent.health === "healthy" ? "default" : "destructive"}>{agent.health}</Badge>
              </div>
              <div className="flex gap-1 flex-wrap">
                {agent.spec.capabilities.map((cap: any) => (
                  <Badge key={cap.id} variant="outline" className="text-xs">
                    {cap.name}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>v{agent.spec.version}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
