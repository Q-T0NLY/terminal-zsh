// Application constants
export const APP_NAME = "AI Orchestrator Platform"
export const APP_DESCRIPTION = "Generative AI Orchestration Platform"

// API endpoints
export const API_ENDPOINTS = {
  AGENTS: "/api/agents",
  WORKFLOWS: "/api/workflows",
  CHAT: "/api/chat",
  MODELS: "/api/models",
  CODE: "/api/code",
  KNOWLEDGE: "/api/knowledge",
  EXECUTION: "/api/execution",
} as const

// Agent types
export const AGENT_TYPES = {
  CODE: "code",
  DATA: "data",
  CONTENT: "content",
  RESEARCH: "research",
  ORCHESTRATOR: "orchestrator",
  CUSTOM: "custom",
} as const

// Workflow node types
export const WORKFLOW_NODE_TYPES = {
  START: "start",
  END: "end",
  AGENT: "agent",
  CONDITION: "condition",
  TRANSFORM: "transform",
  HTTP: "http",
  DATABASE: "database",
  CODE: "code",
} as const

// Model providers
export const MODEL_PROVIDERS = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  GOOGLE: "google",
  META: "meta",
  XAI: "xai",
  DEEPSEEK: "deepseek",
} as const

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "text/plain", "application/json", "text/markdown"],
  ALLOWED_CODE_TYPES: ["text/javascript", "text/typescript", "text/python", "text/plain"],
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: "user-profile",
  AGENTS: "agents",
  WORKFLOWS: "workflows",
  CHAT_SESSIONS: "chat-sessions",
  AI_MODELS: "ai-models",
  AGENT_TEMPLATES: "agent-templates",
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  SIDEBAR_STATE: "sidebar-state",
  RECENT_CHATS: "recent-chats",
  EDITOR_SETTINGS: "editor-settings",
} as const

// Validation limits
export const VALIDATION = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_SYSTEM_PROMPT_LENGTH: 10000,
  MAX_CODE_LENGTH: 100000,
} as const
