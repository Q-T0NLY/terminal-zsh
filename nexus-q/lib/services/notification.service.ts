export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationChannel {
  id: string
  type: "email" | "slack" | "webhook" | "sms"
  enabled: boolean
  config: Record<string, any>
}

export class NotificationService {
  private notifications: Notification[] = []
  private channels: Map<string, NotificationChannel> = new Map()
  private listeners: Set<(notification: Notification) => void> = new Set()

  send(notification: Omit<Notification, "id" | "timestamp" | "read">): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)

    // Notify listeners
    this.listeners.forEach((listener) => listener(newNotification))

    return newNotification
  }

  getAll(): Notification[] {
    return this.notifications
  }

  getUnread(): Notification[] {
    return this.notifications.filter((n) => !n.read)
  }

  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      return true
    }
    return false
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true))
  }

  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel)
  }

  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values())
  }
}

export const notificationService = new NotificationService()
