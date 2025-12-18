type EventHandler = (data: any) => void | Promise<void>

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)

    return () => this.off(event, handler)
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  async emit(event: string, data: any) {
    const handlers = this.handlers.get(event)
    if (!handlers) return

    const promises = Array.from(handlers).map((handler) => Promise.resolve(handler(data)))

    await Promise.allSettled(promises)
  }

  clear(event?: string) {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }
}

export const eventBus = new EventBus()
