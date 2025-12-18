import { v4 as uuidv4 } from "uuid"

export enum AgentStatus {
  REGISTERED = "registered",
  ACTIVE = "active",
  INACTIVE = "inactive",
  FAILED = "failed",
}

export enum AgentHealth {
  HEALTHY = "healthy",
  DEGRADED = "degraded",
  UNHEALTHY = "unhealthy",
}

export interface AgentSpec {
  id: string
  type: string
  version: string
  capabilities: Array<{
    id: string
    name: string
    description: string
  }>
}

export interface AgentEndpoint {
  url: string
  protocol: string
}

export interface RegisteredAgent {
  id: string
  spec: AgentSpec
  endpoint: AgentEndpoint
  status: AgentStatus
  health: AgentHealth
  capabilities: Map<string, any>
  performance: AgentPerformance
  metadata: {
    registeredAt: Date
    lastHeartbeat: Date
    version: string
    registrationId: string
  }
}

export interface AgentPerformance {
  successRate: number
  averageResponseTime: number
  totalRequests: number
  failedRequests: number
}

export interface DiscoveryCriteria {
  requiredCapabilities?: string[]
  filters?: Array<{ field: string; value: any }>
}

export interface DiscoveryOptions {
  page?: number
  pageSize?: number
}

export interface AgentDiscoveryResult {
  agents: RegisteredAgent[]
  total: number
  page: number
  pageSize: number
  discoveryTime: number
  metadata: {
    filtersApplied: number
    capabilitiesMatched: number
  }
}

export class EnhancedAgentRegistry {
  private agents: Map<string, RegisteredAgent> = new Map()
  private capabilitiesIndex: Map<string, string[]> = new Map()
  private performanceIndex: Map<string, AgentPerformance> = new Map()

  async registerAgent(agentSpec: AgentSpec, endpoint: AgentEndpoint): Promise<RegisteredAgent> {
    const registrationId = uuidv4()
    const timestamp = new Date()

    const registeredAgent: RegisteredAgent = {
      id: agentSpec.id,
      spec: agentSpec,
      endpoint,
      status: AgentStatus.REGISTERED,
      health: AgentHealth.HEALTHY,
      capabilities: this.indexCapabilities(agentSpec),
      performance: this.initializePerformanceMetrics(),
      metadata: {
        registeredAt: timestamp,
        lastHeartbeat: timestamp,
        version: agentSpec.version,
        registrationId,
      },
    }

    this.agents.set(agentSpec.id, registeredAgent)
    this.updateIndexes(registeredAgent)

    return registeredAgent
  }

  async discoverAgents(criteria: DiscoveryCriteria, options: DiscoveryOptions = {}): Promise<AgentDiscoveryResult> {
    const startTime = Date.now()

    let candidates = Array.from(this.agents.values())

    if (criteria.filters) {
      candidates = this.applyFilters(candidates, criteria.filters)
    }

    if (criteria.requiredCapabilities) {
      candidates = this.matchCapabilities(candidates, criteria.requiredCapabilities)
    }

    const paginated = this.applyPagination(candidates, options)
    const discoveryTime = Date.now() - startTime

    return {
      agents: paginated.agents,
      total: candidates.length,
      page: options.page || 1,
      pageSize: options.pageSize || 20,
      discoveryTime,
      metadata: {
        filtersApplied: criteria.filters?.length || 0,
        capabilitiesMatched: criteria.requiredCapabilities?.length || 0,
      },
    }
  }

  async getAgentHealth(agentId: string): Promise<AgentHealth> {
    const agent = this.agents.get(agentId)
    return agent?.health || AgentHealth.UNHEALTHY
  }

  async updateAgentHeartbeat(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.metadata.lastHeartbeat = new Date()
      agent.health = AgentHealth.HEALTHY
      agent.status = AgentStatus.ACTIVE
    }
  }

  private indexCapabilities(agentSpec: AgentSpec): Map<string, any> {
    const capabilities = new Map()
    agentSpec.capabilities.forEach((cap) => {
      capabilities.set(cap.id, cap)

      const agentIds = this.capabilitiesIndex.get(cap.id) || []
      agentIds.push(agentSpec.id)
      this.capabilitiesIndex.set(cap.id, agentIds)
    })
    return capabilities
  }

  private initializePerformanceMetrics(): AgentPerformance {
    return {
      successRate: 1.0,
      averageResponseTime: 0,
      totalRequests: 0,
      failedRequests: 0,
    }
  }

  private updateIndexes(agent: RegisteredAgent): void {
    this.performanceIndex.set(agent.id, agent.performance)
  }

  private applyFilters(agents: RegisteredAgent[], filters: Array<{ field: string; value: any }>): RegisteredAgent[] {
    return agents.filter((agent) => {
      return filters.every((filter) => {
        const value = (agent as any)[filter.field]
        return value === filter.value
      })
    })
  }

  private matchCapabilities(agents: RegisteredAgent[], requiredCapabilities: string[]): RegisteredAgent[] {
    return agents.filter((agent) => {
      return requiredCapabilities.every((capId) => agent.capabilities.has(capId))
    })
  }

  private applyPagination(agents: RegisteredAgent[], options: DiscoveryOptions): { agents: RegisteredAgent[] } {
    const page = options.page || 1
    const pageSize = options.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      agents: agents.slice(start, end),
    }
  }

  getAllAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values())
  }
}

export const enhancedAgentRegistry = new EnhancedAgentRegistry()
