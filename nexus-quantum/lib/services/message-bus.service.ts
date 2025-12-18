// Redis-based message bus for agent communication
export interface Message {
  id: string
  type: MessageType
  payload: any
  metadata: MessageMetadata
  timestamp: Date
}

export enum MessageType {
  AGENT_REQUEST = "AGENT_REQUEST",
  AGENT_RESPONSE = "AGENT_RESPONSE",
  WORKFLOW_START = "WORKFLOW_START",
  WORKFLOW_COMPLETE = "WORKFLOW_COMPLETE",
  TASK_EXECUTE = "TASK_EXECUTE",
  TASK_RESULT = "TASK_RESULT",
  HEALTH_CHECK = "HEALTH_CHECK",
  ERROR = "ERROR",
}

export interface MessageMetadata {
  agentId?: string
  workflowId?: string
  taskId?: string
  correlationId: string
  priority: number
  retryCount: number
}

export type MessageHandler = (message: Message) => Promise<void>

export class MessageBusService {
  private handlers: Map<MessageType, MessageHandler[]> = new Map()
  private messageQueue: Message[] = []
  private isProcessing = false

  constructor() {
    this.initializeHandlers()
  }

  private initializeHandlers(): void {
    // Initialize default handlers for each message type
    for (const type of Object.values(MessageType)) {
      this.handlers.set(type as MessageType, [])
    }
  }

  async publish(message: Message): Promise<void> {
    console.log(`[v0] Publishing message: ${message.type} (${message.id})`)

    // Add to queue
    this.messageQueue.push(message)

    // Start processing if not already running
    if (!this.isProcessing) {
      await this.processQueue()
    }
  }

  subscribe(messageType: MessageType, handler: MessageHandler): void {
    const handlers = this.handlers.get(messageType) || []
    handlers.push(handler)
    this.handlers.set(messageType, handlers)

    console.log(`[v0] Subscribed handler to ${messageType}`)
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true

    while (this.messageQueue.length > 0) {
      // Sort by priority (higher priority first)
      this.messageQueue.sort((a, b) => b.metadata.priority - a.metadata.priority)

      const message = this.messageQueue.shift()
      if (message) {
        await this.deliverMessage(message)
      }
    }

    this.isProcessing = false
  }

  private async deliverMessage(message: Message): Promise<void> {
    const handlers = this.handlers.get(message.type) || []

    if (handlers.length === 0) {
      console.warn(`[v0] No handlers registered for message type: ${message.type}`)
      return
    }

    // Deliver to all registered handlers
    const deliveryPromises = handlers.map(async (handler) => {
      try {
        await handler(message)
      } catch (error) {
        console.error(`[v0] Handler error for ${message.type}:`, error)

        // Retry logic
        if (message.metadata.retryCount < 3) {
          message.metadata.retryCount++
          this.messageQueue.push(message)
        } else {
          // Publish error message
          await this.publishError(message, error)
        }
      }
    })

    await Promise.all(deliveryPromises)
  }

  private async publishError(originalMessage: Message, error: any): Promise<void> {
    const errorMessage: Message = {
      id: crypto.randomUUID(),
      type: MessageType.ERROR,
      payload: {
        originalMessage,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      metadata: {
        correlationId: originalMessage.metadata.correlationId,
        priority: 10,
        retryCount: 0,
      },
      timestamp: new Date(),
    }

    await this.publish(errorMessage)
  }

  async getQueueStats(): Promise<{
    queueLength: number
    isProcessing: boolean
    handlerCounts: Record<string, number>
  }> {
    const handlerCounts: Record<string, number> = {}

    for (const [type, handlers] of this.handlers.entries()) {
      handlerCounts[type] = handlers.length
    }

    return {
      queueLength: this.messageQueue.length,
      isProcessing: this.isProcessing,
      handlerCounts,
    }
  }
}
