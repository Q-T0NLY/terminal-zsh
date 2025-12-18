"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { PageContainer } from "@/components/layout/page-container"
import { createBrowserClient } from "@/lib/supabase/client"
import { useCache } from "@/lib/hooks/use-swr-cache"
import { supabaseFetcher } from "@/lib/api/fetcher"
import type { ChatSession } from "@/types/database"

export default function ChatPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>()
  const supabase = createBrowserClient()

  const { data: sessions, mutate } = useCache<ChatSession[]>("chat-sessions", () =>
    supabaseFetcher<ChatSession>("chat_sessions", {
      order: { column: "updated_at", ascending: false },
      limit: 50,
    }),
  )

  const handleNewSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: newSession, error } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        title: `New Chat ${new Date().toLocaleTimeString()}`,
        messages: [],
        context: {},
        is_active: true,
      })
      .select()
      .single()

    if (!error && newSession) {
      setCurrentSessionId(newSession.id)
      mutate()
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("chat_sessions").delete().eq("id", sessionId).eq("user_id", user.id)

    if (currentSessionId === sessionId) {
      setCurrentSessionId(undefined)
    }

    mutate()
  }

  // Create initial session if none exist
  useEffect(() => {
    if (sessions && sessions.length === 0) {
      handleNewSession()
    } else if (sessions && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id)
    }
  }, [sessions])

  return (
    <PageContainer maxWidth="full" className="h-[calc(100vh-4rem)] p-0">
      <div className="flex h-full gap-0">
        <ChatSidebar
          sessions={sessions || []}
          currentSessionId={currentSessionId}
          onSessionSelect={setCurrentSessionId}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          className="w-64 flex-shrink-0"
        />
        <div className="flex-1 p-4">
          <ChatInterface sessionId={currentSessionId} className="h-full" />
        </div>
      </div>
    </PageContainer>
  )
}
