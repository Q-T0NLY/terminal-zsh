"use client"

import { Zap, Settings, Trash2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowCard } from "@/components/ui/glow-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/utils/formatters"
import type { Agent } from "@/types/database"

interface AgentCardProps {
  agent: Agent & { ai_models?: { name: string; provider: string } }
  onEdit?: () => void
  onDelete?: () => void
  onTest?: () => void
}

export function AgentCard({ agent, onEdit, onDelete, onTest }: AgentCardProps) {
  return (
    <GlowCard glowColor="cyan" hoverable={false}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-cyan-500/20 p-2">
              <Zap className="h-5 w-5 text-cyan-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              {agent.description && <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>}
            </div>
          </div>
          <StatusBadge status={agent.is_active ? "active" : "inactive"} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{agent.type}</Badge>
          {agent.ai_models && (
            <Badge variant="secondary">
              {agent.ai_models.provider}/{agent.ai_models.name}
            </Badge>
          )}
          <Badge variant="outline">v{agent.version}</Badge>
        </div>

        {agent.system_prompt && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="line-clamp-2 text-xs font-mono text-muted-foreground">{agent.system_prompt}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeTime(new Date(agent.updated_at))}
          </span>
          <div className="flex gap-1">
            {onTest && (
              <Button variant="ghost" size="icon" onClick={onTest} className="h-8 w-8">
                <Play className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  )
}
