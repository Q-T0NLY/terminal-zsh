// Advanced workflow automation with self-optimizing execution
import { type MessageBusService, MessageType } from "./message-bus.service"
import type { ExecutionEngineService } from "./execution-engine.service"
import { ObservabilityService } from "./observability.service"

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  version: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  triggers: WorkflowTrigger[]
  config: WorkflowConfig
  status: WorkflowStatus
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  agentId?: string
  capabilityId?: string
  config: Record<string, any>
  position: { x: number; y: number }
}

export enum NodeType {
  START = "START",
  END = "END",
  AGENT_TASK = "AGENT_TASK",
  CONDITION = "CONDITION",
  LOOP = "LOOP",
  PARALLEL = "PARALLEL",
  TRANSFORM = "TRANSFORM",
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: string
  label?: string
}

export interface WorkflowTrigger {
  type: TriggerType
  config: Record<string, any>
  enabled: boolean
}

export enum TriggerType {
  MANUAL = "MANUAL",
  SCHEDULE = "SCHEDULE",
  EVENT = "EVENT",
  WEBHOOK = "WEBHOOK",
}

export interface WorkflowConfig {
  timeout: number
  retryPolicy: RetryPolicy
  optimization: OptimizationConfig
}

export interface RetryPolicy {
  maxRetries: number
  backoffMultiplier: number
  initialDelay: number
}

export interface OptimizationConfig {
  enabled: boolean
  learningRate: number
  adaptiveRouting: boolean
}

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  ARCHIVED = "ARCHIVED",
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: ExecutionStatus
  startTime: Date
  endTime?: Date
  duration?: number
  currentNode?: string
  variables: Record<string, any>
  results: Record<string, any>
  errors: ExecutionError[]
}

export enum ExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface ExecutionError {
  nodeId: string
  message: string
  timestamp: Date
}

export class WorkflowAutomationService {
  private workflows: Map<string, WorkflowDefinition> = new Map()
  private executions: Map<string, WorkflowExecution> = new Map()
  private messageBus: MessageBusService
  private executionEngine: ExecutionEngineService
  private observability: ObservabilityService

  constructor(messageBus: MessageBusService, executionEngine: ExecutionEngineService) {
    this.messageBus = messageBus
    this.executionEngine = executionEngine
    this.observability = new ObservabilityService()
    this.initializeDefaultWorkflows()
  }

  private initializeDefaultWorkflows(): void {
    const defaultWorkflow: WorkflowDefinition = {
      id: "wf-example",
      name: "Example Workflow",
      description: "A sample workflow demonstrating agent orchestration",
      version: "1.0.0",
      nodes: [
        {
          id: "start",
          type: NodeType.START,
          label: "Start",
          config: {},
          position: { x: 100, y: 100 },
        },
        {
          id: "task1",
          type: NodeType.AGENT_TASK,
          label: "Process Data",
          agentId: "agent-1",
          capabilityId: "process-data",
          config: {},
          position: { x: 300, y: 100 },
        },
        {
          id: "end",
          type: NodeType.END,
          label: "End",
          config: {},
          position: { x: 500, y: 100 },
        },
      ],
      edges: [
        { id: "e1", source: "start", target: "task1" },
        { id: "e2", source: "task1", target: "end" },
      ],
      triggers: [{ type: TriggerType.MANUAL, config: {}, enabled: true }],
      config: {
        timeout: 300000,
        retryPolicy: {
          maxRetries: 3,
          backoffMultiplier: 2,
          initialDelay: 1000,
        },
        optimization: {
          enabled: true,
          learningRate: 0.1,
          adaptiveRouting: true,
        },
      },
      status: WorkflowStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.workflows.set(defaultWorkflow.id, defaultWorkflow)
    console.log("[v0] Initialized default workflows")
  }

  createWorkflow(workflow: Omit<WorkflowDefinition, "id" | "createdAt" | "updatedAt">): string {
    const workflowDef: WorkflowDefinition = {
      ...workflow,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.workflows.set(workflowDef.id, workflowDef)
    console.log(`[v0] Workflow created: ${workflowDef.name} (${workflowDef.id})`)

    return workflowDef.id
  }

  async executeWorkflow(workflowId: string, inputs: Record<string, any> = {}): Promise<string> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`)
    }

    if (workflow.status !== WorkflowStatus.ACTIVE) {
      throw new Error(`Workflow is not active: ${workflow.status}`)
    }

    const executionId = crypto.randomUUID()
    const traceId = this.observability.startTrace(`workflow:${workflow.name}`, { workflowId, executionId })

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: ExecutionStatus.RUNNING,
      startTime: new Date(),
      variables: inputs,
      results: {},
      errors: [],
    }

    this.executions.set(executionId, execution)

    console.log(`[v0] Starting workflow execution: ${executionId}`)

    // Publish workflow start message
    await this.messageBus.publish({
      id: crypto.randomUUID(),
      type: MessageType.WORKFLOW_START,
      payload: { workflowId, executionId, inputs },
      metadata: {
        workflowId,
        correlationId: traceId,
        priority: 5,
        retryCount: 0,
      },
      timestamp: new Date(),
    })

    // Execute workflow asynchronously
    this.executeWorkflowNodes(workflow, execution, traceId).catch((error) => {
      console.error(`[v0] Workflow execution failed:`, error)
      execution.status = ExecutionStatus.FAILED
      execution.errors.push({
        nodeId: execution.currentNode || "unknown",
        message: error.message,
        timestamp: new Date(),
      })
    })

    return executionId
  }

  private async executeWorkflowNodes(
    workflow: WorkflowDefinition,
    execution: WorkflowExecution,
    traceId: string,
  ): Promise<void> {
    // Find start node
    const startNode = workflow.nodes.find((n) => n.type === NodeType.START)
    if (!startNode) {
      throw new Error("Workflow has no start node")
    }

    let currentNode = startNode
    const visited = new Set<string>()

    while (currentNode && currentNode.type !== NodeType.END) {
      if (visited.has(currentNode.id)) {
        throw new Error(`Cycle detected at node: ${currentNode.id}`)
      }
      visited.add(currentNode.id)

      execution.currentNode = currentNode.id
      this.executions.set(execution.id, execution)

      const spanId = this.observability.startSpan(traceId, `node:${currentNode.label}`, {
        nodeId: currentNode.id,
        nodeType: currentNode.type,
      })

      try {
        // Execute node based on type
        if (currentNode.type === NodeType.AGENT_TASK) {
          const result = await this.executeAgentTask(currentNode, execution)
          execution.results[currentNode.id] = result
        } else if (currentNode.type === NodeType.TRANSFORM) {
          const result = await this.executeTransform(currentNode, execution)
          execution.results[currentNode.id] = result
        }

        this.observability.endSpan(spanId)
      } catch (error) {
        this.observability.endSpan(spanId, "ERROR" as any)
        throw error
      }

      // Find next node
      const nextEdge = workflow.edges.find((e) => e.source === currentNode.id)
      if (!nextEdge) break

      const nextNode = workflow.nodes.find((n) => n.id === nextEdge.target)
      if (!nextNode) break

      currentNode = nextNode
    }

    // Complete execution
    execution.status = ExecutionStatus.COMPLETED
    execution.endTime = new Date()
    execution.duration = execution.endTime.getTime() - execution.startTime.getTime()
    this.executions.set(execution.id, execution)

    console.log(`[v0] Workflow execution completed: ${execution.id} (${execution.duration}ms)`)

    // Publish completion message
    await this.messageBus.publish({
      id: crypto.randomUUID(),
      type: MessageType.WORKFLOW_COMPLETE,
      payload: { executionId: execution.id, results: execution.results },
      metadata: {
        workflowId: workflow.id,
        correlationId: traceId,
        priority: 5,
        retryCount: 0,
      },
      timestamp: new Date(),
    })
  }

  private async executeAgentTask(node: WorkflowNode, execution: WorkflowExecution): Promise<any> {
    if (!node.agentId || !node.capabilityId) {
      throw new Error(`Agent task node missing agentId or capabilityId: ${node.id}`)
    }

    const taskId = await this.executionEngine.submitTask({
      agentId: node.agentId,
      capabilityId: node.capabilityId,
      inputs: { ...node.config, ...execution.variables },
      priority: 5,
    })

    // Wait for task completion (simplified - in production use proper async handling)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const task = await this.executionEngine.getTaskStatus(taskId)
    return task?.result
  }

  private async executeTransform(node: WorkflowNode, execution: WorkflowExecution): Promise<any> {
    // Execute transformation logic
    const transformFn = node.config.transform
    if (typeof transformFn === "function") {
      return transformFn(execution.variables)
    }
    return execution.variables
  }

  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId)
  }

  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values())
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId)
  }

  getWorkflowExecutions(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values()).filter((e) => e.workflowId === workflowId)
  }

  updateWorkflowStatus(workflowId: string, status: WorkflowStatus): boolean {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) return false

    workflow.status = status
    workflow.updatedAt = new Date()
    this.workflows.set(workflowId, workflow)

    console.log(`[v0] Workflow ${workflowId} status updated to ${status}`)
    return true
  }

  getStats(): {
    totalWorkflows: number
    activeWorkflows: number
    totalExecutions: number
    runningExecutions: number
    completedExecutions: number
    failedExecutions: number
  } {
    const workflows = Array.from(this.workflows.values())
    const executions = Array.from(this.executions.values())

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.status === WorkflowStatus.ACTIVE).length,
      totalExecutions: executions.length,
      runningExecutions: executions.filter((e) => e.status === ExecutionStatus.RUNNING).length,
      completedExecutions: executions.filter((e) => e.status === ExecutionStatus.COMPLETED).length,
      failedExecutions: executions.filter((e) => e.status === ExecutionStatus.FAILED).length,
    }
  }
}
