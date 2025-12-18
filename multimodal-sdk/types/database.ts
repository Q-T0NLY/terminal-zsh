// Database table types based on Supabase schema
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin" | "agent"
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AIModel {
  id: string
  name: string
  provider: string
  model_id: string
  capabilities: string[]
  context_window: number | null
  pricing: Record<string, any>
  is_active: boolean
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string
  name: string
  description: string | null
  type: string
  model_id: string | null
  capabilities: string[]
  system_prompt: string | null
  config: Record<string, any>
  is_active: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  user_id: string
  name: string
  description: string | null
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  config: Record<string, any>
  is_active: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: string
  data?: Record<string, any>
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  messages: ChatMessage[]
  context: Record<string, any>
  agent_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  metadata?: Record<string, any>
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  type: "image" | "file" | "code" | "audio"
  url: string
  name: string
  size?: number
  metadata?: Record<string, any>
}

export interface CodeArtifact {
  id: string
  user_id: string
  name: string
  language: string
  code: string
  description: string | null
  tags: string[]
  version: number
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface KnowledgeItem {
  id: string
  user_id: string
  title: string
  content: string
  type: "document" | "snippet" | "reference" | "note"
  tags: string[]
  embedding: number[] | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AgentTemplate {
  id: string
  name: string
  description: string | null
  type: string
  capabilities: string[]
  system_prompt: string
  default_config: Record<string, any>
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ExecutionLog {
  id: string
  user_id: string
  agent_id: string | null
  workflow_id: string | null
  action: string
  input: Record<string, any> | null
  output: Record<string, any> | null
  status: "pending" | "running" | "completed" | "failed"
  error: string | null
  duration_ms: number | null
  created_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: any
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

// Database operation types
export type DatabaseTable =
  | "profiles"
  | "ai_models"
  | "agents"
  | "workflows"
  | "chat_sessions"
  | "code_artifacts"
  | "knowledge_items"
  | "agent_templates"
  | "execution_logs"
  | "system_settings"

export type DatabaseInsert<T extends DatabaseTable> = T extends "profiles"
  ? Omit<Profile, "id" | "created_at" | "updated_at">
  : T extends "agents"
    ? Omit<Agent, "id" | "created_at" | "updated_at">
    : T extends "workflows"
      ? Omit<Workflow, "id" | "created_at" | "updated_at">
      : T extends "chat_sessions"
        ? Omit<ChatSession, "id" | "created_at" | "updated_at">
        : T extends "code_artifacts"
          ? Omit<CodeArtifact, "id" | "created_at" | "updated_at">
          : never

export type DatabaseUpdate<T extends DatabaseTable> = Partial<DatabaseInsert<T>>
