import { type AgentSpec, AgentStatus, type AgentCapability, HealthStatus } from "./orchestrator.service"

export interface RegisteredAgent {
  id: string
  spec: AgentSpec
  status: AgentStatus
  lastSeen: Date
  endpoints: string[]
  capabilities: AgentCapability[]
}

export interface HealthCheckResult {
  status: HealthStatus
  details: Record<string, any>
  timestamp: Date
}

export class AgentRegistryService {
  private agents: Map<string, RegisteredAgent> = new Map()
  private capabilitiesIndex: Map<string, string[]> = new Map()

  async registerAgent(spec: AgentSpec): Promise<void> {
    const registeredAgent: RegisteredAgent = {
      id: spec.id,
      spec,
      status: AgentStatus.REGISTERED,
      lastSeen: new Date(),
      endpoints: [],
      capabilities: spec.capabilities,
    }

    this.agents.set(spec.id, registeredAgent)

    // Update capabilities index
    for (const capability of spec.capabilities) {
      if (!this.capabilitiesIndex.has(capability.id)) {
        this.capabilitiesIndex.set(capability.id, [])
      }
      this.capabilitiesIndex.get(capability.id)!.push(spec.id)
    }

    console.log(`[v0] Agent ${spec.id} registered in registry`)
  }

  async discoverAgentsByCapability(capabilityId: string): Promise<RegisteredAgent[]> {
    const agentIds = this.capabilitiesIndex.get(capabilityId) || []
    const agents: RegisteredAgent[] = []

    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId)
      if (agent && agent.status === AgentStatus.ACTIVE) {
        agents.push(agent)
      }
    }

    return this.rankAgents(agents, capabilityId)
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const results: HealthCheckResult = {
      status: HealthStatus.HEALTHY,
      details: {},
      timestamp: new Date(),
    }

    for (const [agentId, agent] of this.agents) {
      try {
        const health = await this.checkAgentHealth(agent)
        results.details[agentId] = health

        if (health.status !== HealthStatus.HEALTHY) {
          results.status = HealthStatus.UNHEALTHY
        }
      } catch (error) {
        results.details[agentId] = {
          status: HealthStatus.UNHEALTHY,
          error: error instanceof Error ? error.message : "Unknown error",
        }
        results.status = HealthStatus.UNHEALTHY
      }
    }

    return results
  }

  private async checkAgentHealth(agent: RegisteredAgent): Promise<{ status: HealthStatus }> {
    // Simulate health check
    const timeSinceLastSeen = Date.now() - agent.lastSeen.getTime()
    const isHealthy = timeSinceLastSeen < 60000 // 1 minute threshold

    return {
      status: isHealthy ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
    }
  }

  private rankAgents(agents: RegisteredAgent[], capabilityId: string): RegisteredAgent[] {
    // Sort by last seen (most recent first)
    return agents.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
  }

  getAgent(agentId: string): RegisteredAgent | undefined {
    return this.agents.get(agentId)
  }

  getAllAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values())
  }
}
