"use client"

import { useEffect, useState, useCallback } from "react"
import useWebSocket from "react-use-websocket"

export function useWebSocketChannels() {
  const [subscriptions, setSubscriptions] = useState<string[]>([])
  const [metrics, setMetrics] = useState<any>({})
  const [events, setEvents] = useState<any[]>([])
  const [traces, setTraces] = useState<any[]>([])

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    typeof window !== "undefined" ? `${window.location.origin.replace(/^http/, "ws")}/ws` : null,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      onOpen: () => {
        subscriptions.forEach((channel) => {
          sendMessage(
            JSON.stringify({
              type: "subscribe",
              channel,
            }),
          )
        })
      },
    },
  )

  const subscribe = useCallback(
    (channel: string) => {
      setSubscriptions((prev) => {
        if (prev.includes(channel)) return prev
        return [...prev, channel]
      })
      if (readyState === 1) {
        sendMessage(
          JSON.stringify({
            type: "subscribe",
            channel,
          }),
        )
      }
    },
    [sendMessage, readyState],
  )

  const unsubscribe = useCallback(
    (channel: string) => {
      setSubscriptions((prev) => prev.filter((c) => c !== channel))
      sendMessage(
        JSON.stringify({
          type: "unsubscribe",
          channel,
        }),
      )
    },
    [sendMessage],
  )

  useEffect(() => {
    if (!lastMessage) return

    try {
      const data = JSON.parse(lastMessage.data)

      switch (data.type) {
        case "metrics":
        case "telemetry":
          setMetrics((prev) => ({ ...prev, ...data.payload }))
          break
        case "workflow.event":
          setEvents((prev) => [data.payload, ...prev].slice(0, 200))
          break
        case "trace.span":
          setTraces((prev) => [data.payload, ...prev].slice(0, 100))
          break
        case "agent.health":
          // Handle agent health updates
          break
      }
    } catch (error) {
      console.error("[v0] Failed to parse WebSocket message:", error)
    }
  }, [lastMessage])

  return {
    subscribe,
    unsubscribe,
    subscriptions,
    metrics,
    events,
    traces,
    readyState,
  }
}
