// Worker pool-based execution engine for agent tasks
import { type MessageBusService, MessageType, type Message } from "./message-bus.service"

export interface Task {
  id: string
  agentId: string
  capabilityId: string
  inputs: Record<string, any>
  priority: number
  status: TaskStatus
  result?: any
  error?: string
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

export enum TaskStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface Worker {
  id: string
  status: WorkerStatus
  currentTask?: string
  tasksCompleted: number
  lastActive: Date
}

export enum WorkerStatus {
  IDLE = "IDLE",
  BUSY = "BUSY",
  ERROR = "ERROR",
}

export class ExecutionEngineService {
  private messageBus: MessageBusService
  private workers: Map<string, Worker> = new Map()
  private tasks: Map<string, Task> = new Map()
  private taskQueue: Task[] = []
  private workerPoolSize: number

  constructor(messageBus: MessageBusService, workerPoolSize = 4) {
    this.messageBus = messageBus
    this.workerPoolSize = workerPoolSize
    this.initializeWorkerPool()
    this.subscribeToMessages()
  }

  private initializeWorkerPool(): void {
    for (let i = 0; i < this.workerPoolSize; i++) {
      const worker: Worker = {
        id: `worker-${i}`,
        status: WorkerStatus.IDLE,
        tasksCompleted: 0,
        lastActive: new Date(),
      }
      this.workers.set(worker.id, worker)
    }

    console.log(`[v0] Initialized worker pool with ${this.workerPoolSize} workers`)
  }

  private subscribeToMessages(): void {
    // Subscribe to task execution messages
    this.messageBus.subscribe(MessageType.TASK_EXECUTE, async (message: Message) => {
      await this.handleTaskExecutionRequest(message)
    })

    console.log("[v0] Execution engine subscribed to message bus")
  }

  async submitTask(task: Omit<Task, "id" | "status" | "createdAt">): Promise<string> {
    const fullTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: TaskStatus.PENDING,
      createdAt: new Date(),
    }

    this.tasks.set(fullTask.id, fullTask)
    this.taskQueue.push(fullTask)

    console.log(`[v0] Task submitted: ${fullTask.id}`)

    // Publish task execution message
    await this.messageBus.publish({
      id: crypto.randomUUID(),
      type: MessageType.TASK_EXECUTE,
      payload: fullTask,
      metadata: {
        taskId: fullTask.id,
        agentId: fullTask.agentId,
        correlationId: crypto.randomUUID(),
        priority: fullTask.priority,
        retryCount: 0,
      },
      timestamp: new Date(),
    })

    // Try to assign to available worker
    await this.assignTasksToWorkers()

    return fullTask.id
  }

  private async handleTaskExecutionRequest(message: Message): Promise<void> {
    const task = message.payload as Task

    // Update task in registry
    const existingTask = this.tasks.get(task.id)
    if (existingTask) {
      this.tasks.set(task.id, { ...existingTask, ...task })
    }

    // Assign to worker if available
    await this.assignTasksToWorkers()
  }

  private async assignTasksToWorkers(): Promise<void> {
    // Sort tasks by priority
    this.taskQueue.sort((a, b) => b.priority - a.priority)

    for (const task of this.taskQueue) {
      if (task.status !== TaskStatus.PENDING) continue

      // Find idle worker
      const idleWorker = Array.from(this.workers.values()).find((w) => w.status === WorkerStatus.IDLE)

      if (idleWorker) {
        await this.executeTask(task, idleWorker)
        // Remove from queue
        this.taskQueue = this.taskQueue.filter((t) => t.id !== task.id)
      }
    }
  }

  private async executeTask(task: Task, worker: Worker): Promise<void> {
    // Update worker status
    worker.status = WorkerStatus.BUSY
    worker.currentTask = task.id
    worker.lastActive = new Date()

    // Update task status
    task.status = TaskStatus.RUNNING
    task.startedAt = new Date()
    this.tasks.set(task.id, task)

    console.log(`[v0] Worker ${worker.id} executing task ${task.id}`)

    try {
      // Simulate task execution
      const result = await this.performTaskExecution(task)

      // Update task with result
      task.status = TaskStatus.COMPLETED
      task.result = result
      task.completedAt = new Date()
      this.tasks.set(task.id, task)

      // Publish result message
      await this.messageBus.publish({
        id: crypto.randomUUID(),
        type: MessageType.TASK_RESULT,
        payload: {
          taskId: task.id,
          result,
          status: TaskStatus.COMPLETED,
        },
        metadata: {
          taskId: task.id,
          agentId: task.agentId,
          correlationId: crypto.randomUUID(),
          priority: 5,
          retryCount: 0,
        },
        timestamp: new Date(),
      })

      console.log(`[v0] Task ${task.id} completed successfully`)
    } catch (error) {
      // Update task with error
      task.status = TaskStatus.FAILED
      task.error = error instanceof Error ? error.message : "Unknown error"
      task.completedAt = new Date()
      this.tasks.set(task.id, task)

      console.error(`[v0] Task ${task.id} failed:`, error)
    } finally {
      // Update worker status
      worker.status = WorkerStatus.IDLE
      worker.currentTask = undefined
      worker.tasksCompleted++
      worker.lastActive = new Date()

      // Try to assign more tasks
      await this.assignTasksToWorkers()
    }
  }

  private async performTaskExecution(task: Task): Promise<any> {
    // Simulate task execution with delay
    const executionTime = Math.random() * 2000 + 1000 // 1-3 seconds

    await new Promise((resolve) => setTimeout(resolve, executionTime))

    // Return mock result based on capability
    return {
      capabilityId: task.capabilityId,
      executionTime,
      output: `Result from ${task.capabilityId} execution`,
      metadata: {
        agentId: task.agentId,
        timestamp: new Date(),
      },
    }
  }

  async getTaskStatus(taskId: string): Promise<Task | undefined> {
    return this.tasks.get(taskId)
  }

  async getWorkerStats(): Promise<{
    totalWorkers: number
    idleWorkers: number
    busyWorkers: number
    totalTasksCompleted: number
    queueLength: number
  }> {
    const workers = Array.from(this.workers.values())

    return {
      totalWorkers: workers.length,
      idleWorkers: workers.filter((w) => w.status === WorkerStatus.IDLE).length,
      busyWorkers: workers.filter((w) => w.status === WorkerStatus.BUSY).length,
      totalTasksCompleted: workers.reduce((sum, w) => sum + w.tasksCompleted, 0),
      queueLength: this.taskQueue.length,
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values())
  }
}
