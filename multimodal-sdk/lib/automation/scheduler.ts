export interface ScheduledTask {
  id: string
  name: string
  schedule: string // cron expression
  action: () => Promise<void>
  enabled: boolean
}

class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  register(task: ScheduledTask) {
    this.tasks.set(task.id, task)
    if (task.enabled) {
      this.start(task.id)
    }
  }

  unregister(taskId: string) {
    this.stop(taskId)
    this.tasks.delete(taskId)
  }

  start(taskId: string) {
    const task = this.tasks.get(taskId)
    if (!task || !task.enabled) return

    // Parse cron and set up interval
    // For simplicity, using setInterval
    // In production, use a proper cron library like node-cron
    const interval = setInterval(async () => {
      try {
        await task.action()
      } catch (error) {
        console.error(`[v0] Task ${task.name} failed:`, error)
      }
    }, 60000) // Run every minute for demo

    this.intervals.set(taskId, interval)
  }

  stop(taskId: string) {
    const interval = this.intervals.get(taskId)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(taskId)
    }
  }

  stopAll() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
  }
}

export const taskScheduler = new TaskScheduler()
