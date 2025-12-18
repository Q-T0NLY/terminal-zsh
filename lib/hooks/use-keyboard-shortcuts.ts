"use client"

import { useEffect } from "react"

interface ShortcutHandlers {
  onOpenGenerator?: () => void
  onOpenSearch?: () => void
  onToggleDebug?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const isCtrl = event.ctrlKey || event.metaKey

      switch (event.key) {
        case "g":
          if (isCtrl && handlers.onOpenGenerator) {
            event.preventDefault()
            handlers.onOpenGenerator()
          }
          break
        case "/":
          if (!isCtrl && handlers.onOpenSearch) {
            event.preventDefault()
            handlers.onOpenSearch()
          }
          break
        case "d":
          if (isCtrl && handlers.onToggleDebug) {
            event.preventDefault()
            handlers.onToggleDebug()
          }
          break
        case "Escape":
          if (handlers.onEscape) {
            handlers.onEscape()
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handlers])
}
