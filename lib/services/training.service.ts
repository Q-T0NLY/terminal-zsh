export interface TrainingConfig {
  modelId: string
  datasetId: string
  epochs: number
  batchSize: number
  learningRate: number
  validationSplit: number
}

export interface TrainingMetrics {
  epoch: number
  loss: number
  accuracy: number
  valLoss: number
  valAccuracy: number
  timestamp: Date
}

export interface TrainingJob {
  id: string
  modelId: string
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  progress: number
  metrics: TrainingMetrics[]
  config: TrainingConfig
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export class TrainingService {
  private jobs: Map<string, TrainingJob> = new Map()

  async startTraining(config: TrainingConfig): Promise<TrainingJob> {
    const job: TrainingJob = {
      id: `train_${Date.now()}`,
      modelId: config.modelId,
      status: "pending",
      progress: 0,
      metrics: [],
      config,
      startedAt: new Date(),
    }

    this.jobs.set(job.id, job)

    // Simulate training process
    setTimeout(() => this.runTraining(job.id), 100)

    return job
  }

  private async runTraining(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return

    job.status = "running"

    for (let epoch = 1; epoch <= job.config.epochs; epoch++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const metrics: TrainingMetrics = {
        epoch,
        loss: 2.5 - epoch * 0.1 + Math.random() * 0.2,
        accuracy: 0.5 + epoch * 0.05 + Math.random() * 0.05,
        valLoss: 2.6 - epoch * 0.09 + Math.random() * 0.25,
        valAccuracy: 0.48 + epoch * 0.048 + Math.random() * 0.06,
        timestamp: new Date(),
      }

      job.metrics.push(metrics)
      job.progress = (epoch / job.config.epochs) * 100
    }

    job.status = "completed"
    job.completedAt = new Date()
  }

  getJob(jobId: string): TrainingJob | undefined {
    return this.jobs.get(jobId)
  }

  getAllJobs(): TrainingJob[] {
    return Array.from(this.jobs.values())
  }

  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (job && job.status === "running") {
      job.status = "cancelled"
      job.completedAt = new Date()
      return true
    }
    return false
  }
}

export const trainingService = new TrainingService()
