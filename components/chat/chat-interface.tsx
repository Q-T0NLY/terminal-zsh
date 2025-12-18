"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Paperclip, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GlowCard } from "@/components/ui/glow-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { GradientText } from "@/components/ui/gradient-text"

interface ChatInterfaceProps {
  agentId?: string
  sessionId?: string
  className?: string
}

export function ChatInterface({ agentId, sessionId, className }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { agentId, sessionId },
    }),
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "in_progress") return

    sendMessage({ text: input })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <GlowCard className={cn("flex h-full flex-col", className)} glowColor="cyan">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">
              <GradientText variant="cyan-purple">AI Assistant</GradientText>
            </h2>
            <p className="text-xs text-muted-foreground">Powered by AI Orchestrator</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Start a conversation</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Ask me anything! I'm here to help with your tasks.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "glass-card border border-border",
                  )}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div key={index} className="whitespace-pre-wrap break-words text-sm">
                          {part.text}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-muted text-foreground">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {status === "in_progress" && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white">AI</AvatarFallback>
              </Avatar>
              <div className="glass-card max-w-[80%] rounded-2xl border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] flex-1 resize-none"
            disabled={status === "in_progress"}
          />
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0"
            disabled={!input.trim() || status === "in_progress"}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </GlowCard>
  )
}
