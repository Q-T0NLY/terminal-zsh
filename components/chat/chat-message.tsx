"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CodeBlock } from "@/components/ui/code-block"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
  className?: string
}

export function ChatMessage({ role, content, timestamp, className }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3 pb-4", isUser && "flex-row-reverse", className)}>
      <Avatar className="h-8 w-8">
        {isUser ? (
          <>
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500">
              <Bot className="h-4 w-4 text-white" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn("flex max-w-[80%] flex-col", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isUser ? "bg-primary text-primary-foreground" : "glass-card border border-border",
          )}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        {timestamp && <span className="mt-1 text-xs text-muted-foreground">{timestamp}</span>}
      </div>
    </div>
  )
}
