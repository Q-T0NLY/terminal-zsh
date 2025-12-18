"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { useToast } from "@/hooks/use-toast"

export interface CacheConfig extends SWRConfiguration {
  showErrorToast?: boolean
  retryCount?: number
}

/**
 * Enhanced SWR hook with built-in error handling, retry logic, and toast notifications
 */
export function useCache<T>(key: string | null, fetcher: () => Promise<T>, config?: CacheConfig) {
  const { toast } = useToast()
  const { showErrorToast = true, retryCount = 3, ...swrConfig } = config || {}

  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: retryCount,
    errorRetryInterval: 1000,
    onError: (err) => {
      if (showErrorToast) {
        toast({
          title: "Error",
          description: err.message || "Something went wrong",
          variant: "destructive",
        })
      }
    },
    ...swrConfig,
  })

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    refresh: () => mutate(),
  }
}

/**
 * Hook for paginated data with caching
 */
export function usePaginatedCache<T>(
  key: string | null,
  fetcher: (page: number) => Promise<T[]>,
  config?: CacheConfig,
) {
  const [page, setPage] = useState(1)
  const cacheKey = key ? `${key}-page-${page}` : null

  const { data, error, isLoading, mutate } = useCache(cacheKey, () => fetcher(page), config)

  return {
    data,
    error,
    isLoading,
    page,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    setPage,
    refresh: () => mutate(),
  }
}

import { useState } from "react"
