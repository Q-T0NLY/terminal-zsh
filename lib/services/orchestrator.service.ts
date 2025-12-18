export interface AgentSpec {
  id: string
  name: string
  type: AgentType
  capabilities: AgentCapability[]
  config: Record<string, any>
}

export interface WorkflowDefinition {
  id: string
  name: string
  steps: WorkflowStep[]
  triggers: WorkflowTrigger[]
}

export interface WorkflowStep {
  id: string
  agentId: string
  capabilityId: string
  inputs: Record<string, any>
  dependencies: string[]
}

export enum AgentStatus {
  REGISTERED = "REGISTERED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
}

export enum WorkflowStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum HealthStatus {
  HEALTHY = "HEALTHY",
  UNHEALTHY = "UNHEALTHY",
  UNKNOWN = "UNKNOWN",
}

export type AgentType = "quantum" | "ml" | "generative" | "hybrid"

export interface AgentCapability {
  id: string
  name: string
  description: string
  inputs: CapabilityParameter[]
  outputs: CapabilityParameter[]
}

export interface CapabilityParameter {
  name: string
  type: string
  required: boolean
  description: string
}

export interface WorkflowTrigger {
  type: "schedule" | "event" | "manual"
  config: Record<string, any>
}

export class OrchestratorService {
  private agents: Map<string, AgentSpec> = new Map()
  private workflows: Map<string, WorkflowDefinition> = new Map()

  async deployAgent(spec: AgentSpec): Promise<{ id: string; status: AgentStatus }> {
    // Validate agent specification
    this.validateAgentSpec(spec)

    // Register agent
    this.agents.set(spec.id, spec)

    console.log(`[v0] Agent ${spec.id} deployed successfully`)

    return {
      id: spec.id,
      status: AgentStatus.ACTIVE,
    }
  }

  async createWorkflow(definition: WorkflowDefinition): Promise<{ id: string; status: WorkflowStatus }> {
    // Validate workflow definition
    this.validateWorkflowDefinition(definition)

    // Register workflow
    this.workflows.set(definition.id, definition)

    console.log(`[v0] Workflow ${definition.id} created successfully`)

    return {
      id: definition.id,
      status: WorkflowStatus.PENDING,
    }
  }

  private validateAgentSpec(spec: AgentSpec): void {
    if (!spec.id || !spec.name || !spec.type) {
      throw new Error("Invalid agent specification: missing required fields")
    }
  }

  private validateWorkflowDefinition(definition: WorkflowDefinition): void {
    if (!definition.id || !definition.name || !definition.steps) {
      throw new Error("Invalid workflow definition: missing required fields")
    }

    // Check for cyclic dependencies
    if (this.hasCyclicDependencies(definition.steps)) {
      throw new Error("Workflow contains cyclic dependencies")
    }
  }

  private hasCyclicDependencies(steps: WorkflowStep[]): boolean {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (stepId: string): boolean => {
      visited.add(stepId)
      recursionStack.add(stepId)

      const step = steps.find((s) => s.id === stepId)
      if (step) {
        for (const dep of step.dependencies) {
          if (!visited.has(dep)) {
            if (hasCycle(dep)) return true
          } else if (recursionStack.has(dep)) {
            return true
          }
        }
      }

      recursionStack.delete(stepId)
      return false
    }

    for (const step of steps) {
      if (!visited.has(step.id)) {
        if (hasCycle(step.id)) return true
      }
    }

    return false
  }
}
