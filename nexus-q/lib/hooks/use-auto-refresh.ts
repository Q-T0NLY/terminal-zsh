"use client"

import { useEffect, useState } from "react"

interface UseAutoRefreshOptions {
  interval?: number
  enabled?: boolean
  onRefresh?: () => void
}

export function useAutoRefresh({ interval = 5000, enabled = true, onRefresh }: UseAutoRefreshOptions = {}) {
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(interval)

  useEffect(() => {
    if (!enabled) return

    const refreshInterval = setInterval(() => {
      setLastRefresh(Date.now())
      onRefresh?.()
    }, interval)

    const countdownInterval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 100) return interval
        return prev - 100
      })
    }, 100)

    return () => {
      clearInterval(refreshInterval)
      clearInterval(countdownInterval)
    }
  }, [interval, enabled, onRefresh])

  return {
    lastRefresh,
    timeUntilRefresh,
    secondsUntilRefresh: Math.ceil(timeUntilRefresh / 1000),
  }
}
