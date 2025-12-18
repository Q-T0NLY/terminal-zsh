import { toast } from "sonner"

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown, context?: string): AppError {
  console.error(`[v0] Error in ${context || "unknown context"}:`, error)

  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message)
  }

  if (typeof error === "string") {
    return new AppError(error)
  }

  return new AppError("An unexpected error occurred")
}

export function logError(error: unknown, context?: string) {
  const appError = handleError(error, context)
  console.error(`[v0] ${context || "Error"}:`, appError)

  // In production, this could send to an error tracking service
  if (typeof window !== "undefined" && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(appError)
  }
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const appError = handleError(error)
  toast.error(appError.message || fallbackMessage || "Something went wrong")
}

export async function withErrorHandling<T>(fn: () => Promise<T>, context?: string): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    const appError = handleError(error, context)
    showErrorToast(appError)
    return null
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i)
        console.log(`[v0] Retry ${i + 1}/${maxRetries} after ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}
