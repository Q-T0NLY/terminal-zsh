import { createBrowserClient } from "@/lib/supabase/client"
import { AppError, retryWithBackoff } from "@/lib/utils/error-handler"

export interface FetchOptions extends RequestInit {
  retry?: boolean
  retryCount?: number
  timeout?: number
}

/**
 * Enhanced fetch wrapper with retry logic, timeout, and error handling
 */
export async function fetcher<T>(url: string, options?: FetchOptions): Promise<T> {
  const { retry = true, retryCount = 3, timeout = 30000, ...fetchOptions } = options || {}

  const fetchWithTimeout = async (): Promise<T> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new AppError(
          error.message || `HTTP ${response.status}: ${response.statusText}`,
          error.code,
          response.status,
          error,
        )
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new AppError("Request timeout", "TIMEOUT", 408)
      }
      throw error
    }
  }

  if (retry) {
    return retryWithBackoff(fetchWithTimeout, retryCount)
  }

  return fetchWithTimeout()
}

/**
 * Supabase fetcher with caching
 */
export async function supabaseFetcher<T>(
  table: string,
  options?: {
    select?: string
    filter?: Record<string, any>
    order?: { column: string; ascending?: boolean }
    limit?: number
  },
): Promise<T[]> {
  const supabase = createBrowserClient()

  let query = supabase.from(table).select(options?.select || "*")

  if (options?.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }

  if (options?.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
    })
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    throw new AppError(error.message, error.code, 500, error)
  }

  return data as T[]
}
