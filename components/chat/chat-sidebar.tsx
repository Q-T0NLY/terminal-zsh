"use client"

import { useState } from "react"
import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GradientText } from "@/components/ui/gradient-text"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/utils/formatters"
import type { ChatSession } from "@/types/database"

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSessionId?: string
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  className?: string
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  className,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className={cn("flex h-full flex-col border-r border-border bg-card", className)}>
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="mb-4 text-lg font-semibold">
          <GradientText variant="cyan-purple">Chat Sessions</GradientText>
        </h2>
        <Button onClick={onNewSession} className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => onSessionSelect(session.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
                  currentSessionId === session.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground",
                )}
              >
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{session.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatRelativeTime(new Date(session.updated_at))}
                  </p>
                </div>
              </button>
              {hoveredId === session.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
