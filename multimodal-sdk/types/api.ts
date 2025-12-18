// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: ApiError
  success: boolean
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface FilterOptions {
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
  filters?: Record<string, any>
}

// Agent execution types
export interface AgentExecutionRequest {
  agentId: string
  input: string | Record<string, any>
  context?: Record<string, any>
  options?: AgentExecutionOptions
}

export interface AgentExecutionOptions {
  temperature?: number
  maxTokens?: number
  stream?: boolean
  tools?: string[]
  metadata?: Record<string, any>
}

export interface AgentExecutionResponse {
  output: string | Record<string, any>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  metadata?: Record<string, any>
  executionTime?: number
}

// Workflow execution types
export interface WorkflowExecutionRequest {
  workflowId: string
  input: Record<string, any>
  context?: Record<string, any>
}

export interface WorkflowExecutionResponse {
  outputs: Record<string, any>
  executionLog: {
    nodeId: string
    status: "pending" | "running" | "completed" | "failed"
    output?: any
    error?: string
    duration?: number
  }[]
  totalDuration: number
}

// Chat types
export interface ChatRequest {
  message: string
  sessionId?: string
  agentId?: string
  attachments?: any[]
  context?: Record<string, any>
}

export interface ChatResponse {
  message: any
  sessionId: string
  suggestions?: string[]
}

export interface StreamChatResponse {
  delta: string
  messageId?: string
  done: boolean
}

// Declarations for undeclared variables
type Attachment = {}

type ChatMessage = {}
