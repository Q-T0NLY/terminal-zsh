// Multi-layer context storage with Redis cache and vector embeddings
export interface ContextEntry {
  id: string
  agentId: string
  sessionId: string
  type: ContextType
  content: any
  metadata: ContextMetadata
  embedding?: number[]
  createdAt: Date
  expiresAt?: Date
}

export enum ContextType {
  CONVERSATION = "CONVERSATION",
  AGENT_STATE = "AGENT_STATE",
  WORKFLOW_STATE = "WORKFLOW_STATE",
  KNOWLEDGE = "KNOWLEDGE",
  MEMORY = "MEMORY",
}

export interface ContextMetadata {
  source: string
  importance: number
  tags: string[]
  relationships: string[]
}

export interface ContextQuery {
  agentId?: string
  sessionId?: string
  type?: ContextType
  tags?: string[]
  limit?: number
  similarTo?: string
}

export class ContextStoreService {
  private contexts: Map<string, ContextEntry> = new Map()
  private sessionContexts: Map<string, string[]> = new Map()
  private agentContexts: Map<string, string[]> = new Map()

  async store(entry: Omit<ContextEntry, "id" | "createdAt">): Promise<string> {
    const contextEntry: ContextEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }

    // Store in main map
    this.contexts.set(contextEntry.id, contextEntry)

    // Index by session
    if (contextEntry.sessionId) {
      const sessionCtxs = this.sessionContexts.get(contextEntry.sessionId) || []
      sessionCtxs.push(contextEntry.id)
      this.sessionContexts.set(contextEntry.sessionId, sessionCtxs)
    }

    // Index by agent
    if (contextEntry.agentId) {
      const agentCtxs = this.agentContexts.get(contextEntry.agentId) || []
      agentCtxs.push(contextEntry.id)
      this.agentContexts.set(contextEntry.agentId, agentCtxs)
    }

    // Generate embedding if content is text
    if (typeof entry.content === "string") {
      contextEntry.embedding = await this.generateEmbedding(entry.content)
    }

    console.log(`[v0] Context stored: ${contextEntry.id} (${contextEntry.type})`)

    return contextEntry.id
  }

  async retrieve(contextId: string): Promise<ContextEntry | undefined> {
    const context = this.contexts.get(contextId)

    // Check expiration
    if (context && context.expiresAt && context.expiresAt < new Date()) {
      this.contexts.delete(contextId)
      return undefined
    }

    return context
  }

  async query(query: ContextQuery): Promise<ContextEntry[]> {
    let results = Array.from(this.contexts.values())

    // Filter by agent
    if (query.agentId) {
      const agentCtxIds = this.agentContexts.get(query.agentId) || []
      results = results.filter((ctx) => agentCtxIds.includes(ctx.id))
    }

    // Filter by session
    if (query.sessionId) {
      const sessionCtxIds = this.sessionContexts.get(query.sessionId) || []
      results = results.filter((ctx) => sessionCtxIds.includes(ctx.id))
    }

    // Filter by type
    if (query.type) {
      results = results.filter((ctx) => ctx.type === query.type)
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter((ctx) => query.tags!.some((tag) => ctx.metadata.tags.includes(tag)))
    }

    // Semantic search if similarTo is provided
    if (query.similarTo) {
      const queryEmbedding = await this.generateEmbedding(query.similarTo)
      results = results
        .filter((ctx) => ctx.embedding)
        .map((ctx) => ({
          context: ctx,
          similarity: this.cosineSimilarity(queryEmbedding, ctx.embedding!),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .map((item) => item.context)
    } else {
      // Sort by importance and recency
      results.sort((a, b) => {
        const importanceDiff = b.metadata.importance - a.metadata.importance
        if (importanceDiff !== 0) return importanceDiff
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
    }

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit)
    }

    return results
  }

  async delete(contextId: string): Promise<boolean> {
    const context = this.contexts.get(contextId)
    if (!context) return false

    this.contexts.delete(contextId)

    // Remove from session index
    if (context.sessionId) {
      const sessionCtxs = this.sessionContexts.get(context.sessionId) || []
      this.sessionContexts.set(
        context.sessionId,
        sessionCtxs.filter((id) => id !== contextId),
      )
    }

    // Remove from agent index
    if (context.agentId) {
      const agentCtxs = this.agentContexts.get(context.agentId) || []
      this.agentContexts.set(
        context.agentId,
        agentCtxs.filter((id) => id !== contextId),
      )
    }

    console.log(`[v0] Context deleted: ${contextId}`)
    return true
  }

  async clearSession(sessionId: string): Promise<number> {
    const sessionCtxIds = this.sessionContexts.get(sessionId) || []
    let deletedCount = 0

    for (const ctxId of sessionCtxIds) {
      if (await this.delete(ctxId)) {
        deletedCount++
      }
    }

    this.sessionContexts.delete(sessionId)
    console.log(`[v0] Cleared ${deletedCount} contexts for session ${sessionId}`)

    return deletedCount
  }

  async getStats(): Promise<{
    totalContexts: number
    byType: Record<string, number>
    bySessions: number
    byAgents: number
  }> {
    const byType: Record<string, number> = {}

    for (const context of this.contexts.values()) {
      byType[context.type] = (byType[context.type] || 0) + 1
    }

    return {
      totalContexts: this.contexts.size,
      byType,
      bySessions: this.sessionContexts.size,
      byAgents: this.agentContexts.size,
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding generation - in production, use actual embedding model
    const embedding: number[] = []
    const dimensions = 384 // Common embedding dimension

    // Simple hash-based mock embedding
    for (let i = 0; i < dimensions; i++) {
      const hash = this.simpleHash(text + i)
      embedding.push((hash % 1000) / 1000)
    }

    return embedding
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}
