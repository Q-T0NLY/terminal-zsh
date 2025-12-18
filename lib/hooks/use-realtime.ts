"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtime<T = any>(table: string, filter?: { column: string; value: any }) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log("[v0] useRealtime: Starting for table:", table)
    let channel: RealtimeChannel | null = null
    let mounted = true

    async function setupRealtime() {
      try {
        const supabase = createBrowserClient()
        console.log("[v0] Supabase client created")

        // Initial fetch
        let query = supabase.from(table).select("*")

        if (filter) {
          query = query.eq(filter.column, filter.value)
        }

        console.log("[v0] Fetching initial data from:", table)
        const { data: initialData, error: fetchError } = await query

        if (fetchError) {
          console.error("[v0] Fetch error:", fetchError.message)
          if (mounted) {
            setError(fetchError as Error)
            setData([])
            setLoading(false)
          }
          return
        }

        console.log("[v0] Initial data fetched:", initialData?.length, "records")
        if (mounted) {
          setData(initialData || [])
          setLoading(false)
        }

        try {
          console.log("[v0] Setting up realtime subscription for:", table)
          channel = supabase
            .channel(`${table}_changes`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table,
                filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
              },
              (payload) => {
                if (!mounted) return
                console.log("[v0] Realtime event:", payload.eventType, "for table:", table)

                if (payload.eventType === "INSERT") {
                  setData((prev) => [...prev, payload.new as T])
                } else if (payload.eventType === "UPDATE") {
                  setData((prev) => prev.map((item: any) => (item.id === payload.new.id ? (payload.new as T) : item)))
                } else if (payload.eventType === "DELETE") {
                  setData((prev) => prev.filter((item: any) => item.id !== payload.old.id))
                }
              },
            )
            .subscribe((status) => {
              console.log("[v0] Subscription status for", table, ":", status)
            })
        } catch (subscribeError) {
          console.error("[v0] Subscription error:", subscribeError)
        }
      } catch (err) {
        console.error("[v0] Realtime setup error:", err)
        if (mounted) {
          setError(err as Error)
          setData([])
          setLoading(false)
        }
      }
    }

    setupRealtime()

    return () => {
      console.log("[v0] Cleaning up realtime for:", table)
      mounted = false
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [table, filter ? JSON.stringify(filter) : ""])

  return { data, loading, error }
}
