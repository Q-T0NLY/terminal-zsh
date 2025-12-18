export interface SimulationConfig {
  agentId: string
  scenario: string
  duration: number
  parameters: Record<string, any>
}

export interface SimulationResult {
  id: string
  agentId: string
  scenario: string
  status: "running" | "completed" | "failed"
  progress: number
  metrics: {
    timestamp: Date
    value: number
    label: string
  }[]
  startedAt: Date
  completedAt?: Date
  summary?: {
    totalRequests: number
    successRate: number
    avgLatency: number
    errors: number
  }
}

export class SimulationService {
  private simulations: Map<string, SimulationResult> = new Map()

  async startSimulation(config: SimulationConfig): Promise<SimulationResult> {
    const simulation: SimulationResult = {
      id: `sim_${Date.now()}`,
      agentId: config.agentId,
      scenario: config.scenario,
      status: "running",
      progress: 0,
      metrics: [],
      startedAt: new Date(),
    }

    this.simulations.set(simulation.id, simulation)

    // Run simulation
    setTimeout(() => this.runSimulation(simulation.id, config.duration), 100)

    return simulation
  }

  private async runSimulation(simId: string, duration: number): Promise<void> {
    const simulation = this.simulations.get(simId)
    if (!simulation) return

    const steps = 20
    for (let i = 0; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, (duration * 1000) / steps))

      simulation.metrics.push({
        timestamp: new Date(),
        value: 50 + Math.random() * 50,
        label: `Step ${i}`,
      })

      simulation.progress = (i / steps) * 100
    }

    simulation.status = "completed"
    simulation.completedAt = new Date()
    simulation.summary = {
      totalRequests: 1000 + Math.floor(Math.random() * 500),
      successRate: 95 + Math.random() * 5,
      avgLatency: 100 + Math.random() * 50,
      errors: Math.floor(Math.random() * 10),
    }
  }

  getSimulation(simId: string): SimulationResult | undefined {
    return this.simulations.get(simId)
  }

  getAllSimulations(): SimulationResult[] {
    return Array.from(this.simulations.values())
  }
}

export const simulationService = new SimulationService()
