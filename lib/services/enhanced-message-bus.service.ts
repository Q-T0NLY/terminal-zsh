import { v4 as uuidv4 } from "uuid"

export interface MessageEnvelope {
  id: string
  type: MessageType
  topic: string
  payload: any
  metadata: MessageMetadata
  headers: Record<string, string>
  timestamp: Date
  traceId?: string
  spanId?: string
}

export enum MessageType {
  COMMAND = "command",
  EVENT = "event",
  QUERY = "query",
  RESPONSE = "response",
  HEARTBEAT = "heartbeat",
}

export interface MessageMetadata {
  priority: MessagePriority
  ttl?: number
  retryCount: number
  maxRetries: number
  source: string
  destination?: string
  correlationId?: string
  replyTo?: string
}

export enum MessagePriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export interface BusConfig {
  protocol: "redis" | "kafka" | "nats" | "hybrid"
  options: any
  fallback: boolean
  monitoring: boolean
}

export interface PublishOptions {
  type?: MessageType
  priority?: MessagePriority
  ttl?: number
  maxRetries?: number
  source?: string
  destination?: string
  correlationId?: string
  replyTo?: string
  traceId?: string
  spanId?: string
  headers?: Record<string, string>
}

export interface SubscribeOptions {
  durable?: boolean
  queueGroup?: string
  maxMessages?: number
  filter?: MessageFilter
}

export interface MessageFilter {
  type?: MessageType
  priority?: MessagePriority
  source?: string
  contentFilter?: ContentFilter
}

export interface ContentFilter {
  field: string
  operator: "equals" | "contains" | "greaterThan" | "lessThan"
  value: any
}

export interface BusMetrics {
  messagesSent: number
  messagesReceived: number
  errors: number
  averageLatency: number
  throughput: number
}

export interface BusHealth {
  status: "healthy" | "degraded" | "unhealthy"
  protocol: string
  timestamp: Date
  details: Record<string, string>
  error?: string
}

export class EnhancedMessageBusService {
  private messageQueue: Map<string, MessageEnvelope[]> = new Map()
  private subscribers: Map<string, SubscriberInfo[]> = new Map()
  private deadLetterQueue: Map<string, DeadLetterMessage[]> = new Map()

  private metrics: BusMetrics = {
    messagesSent: 0,
    messagesReceived: 0,
    errors: 0,
    averageLatency: 0,
    throughput: 0,
  }

  async publish(topic: string, payload: any, options: PublishOptions = {}): Promise<string> {
    const messageId = uuidv4()
    const timestamp = new Date()

    const envelope: MessageEnvelope = {
      id: messageId,
      type: options.type || MessageType.EVENT,
      topic,
      payload,
      metadata: {
        priority: options.priority || MessagePriority.NORMAL,
        ttl: options.ttl,
        retryCount: 0,
        maxRetries: options.maxRetries || 3,
        source: options.source || "nexus-orchestrator",
        destination: options.destination,
        correlationId: options.correlationId,
        replyTo: options.replyTo,
      },
      headers: {
        "content-type": "application/json",
        timestamp: timestamp.toISOString(),
        ...options.headers,
      },
      timestamp,
      traceId: options.traceId,
      spanId: options.spanId,
    }

    try {
      await this.sendMessage(envelope)
      this.metrics.messagesSent++

      console.log(`[v0] Message published to ${topic}`, {
        messageId,
        type: envelope.type,
        priority: envelope.metadata.priority,
      })

      return messageId
    } catch (error) {
      this.metrics.errors++
      console.error(`[v0] Failed to publish message to ${topic}`, error)

      await this.sendToDeadLetterQueue(envelope, error as Error)
      throw error
    }
  }

  async subscribe(
    topic: string,
    handler: (message: MessageEnvelope) => Promise<void>,
    options: SubscribeOptions = {},
  ): Promise<string> {
    const subscriptionId = uuidv4()

    const subscriberInfo: SubscriberInfo = {
      id: subscriptionId,
      handler,
      options,
      topic,
      createdAt: new Date(),
    }

    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, [])
    }
    this.subscribers.get(topic)!.push(subscriberInfo)

    console.log(`[v0] Subscribed to ${topic}`, { subscriptionId })
    return subscriptionId
  }

  private async sendMessage(envelope: MessageEnvelope): Promise<void> {
    // Store message in queue
    if (!this.messageQueue.has(envelope.topic)) {
      this.messageQueue.set(envelope.topic, [])
    }
    this.messageQueue.get(envelope.topic)!.push(envelope)

    // Notify subscribers
    const subscribers = this.subscribers.get(envelope.topic) || []
    for (const subscriber of subscribers) {
      try {
        await subscriber.handler(envelope)
        this.metrics.messagesReceived++
      } catch (error) {
        console.error(`[v0] Subscriber error for topic ${envelope.topic}`, error)
      }
    }
  }

  private async sendToDeadLetterQueue(envelope: MessageEnvelope, error: Error): Promise<void> {
    const deadLetterMessage: DeadLetterMessage = {
      originalMessage: envelope,
      error: error.message,
      timestamp: new Date(),
      retryCount: envelope.metadata.retryCount,
    }

    const dlqTopic = `dlq.${envelope.topic}`

    if (!this.deadLetterQueue.has(dlqTopic)) {
      this.deadLetterQueue.set(dlqTopic, [])
    }

    this.deadLetterQueue.get(dlqTopic)!.push(deadLetterMessage)
  }

  getMetrics(): BusMetrics {
    return { ...this.metrics }
  }

  async getHealth(): Promise<BusHealth> {
    return {
      status: "healthy",
      protocol: "in-memory",
      timestamp: new Date(),
      details: {
        topics: this.messageQueue.size.toString(),
        subscribers: this.subscribers.size.toString(),
        queuedMessages: Array.from(this.messageQueue.values())
          .reduce((sum, msgs) => sum + msgs.length, 0)
          .toString(),
      },
    }
  }
}

interface SubscriberInfo {
  id: string
  handler: (message: MessageEnvelope) => Promise<void>
  options: SubscribeOptions
  topic: string
  createdAt: Date
}

interface DeadLetterMessage {
  originalMessage: MessageEnvelope
  error: string
  timestamp: Date
  retryCount: number
}

// Singleton instance
export const messageBusService = new EnhancedMessageBusService()
