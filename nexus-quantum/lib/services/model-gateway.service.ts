// Unified gateway for multiple LLM providers with load balancing
export interface ModelRequest {
  model: string
  messages: Message[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ModelResponse {
  id: string
  model: string
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
  latency: number
}

export interface ModelProvider {
  id: string
  name: string
  models: string[]
  endpoint: string
  status: ProviderStatus
  priority: number
}

export enum ProviderStatus {
  AVAILABLE = "AVAILABLE",
  DEGRADED = "DEGRADED",
  UNAVAILABLE = "UNAVAILABLE",
}

export class ModelGatewayService {
  private providers: Map<string, ModelProvider> = new Map()
  private requestCount: Map<string, number> = new Map()
  private errorCount: Map<string, number> = new Map()

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders(): void {
    const providers: ModelProvider[] = [
      {
        id: "openai",
        name: "OpenAI",
        models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
        endpoint: "https://api.openai.com/v1",
        status: ProviderStatus.AVAILABLE,
        priority: 100,
      },
      {
        id: "anthropic",
        name: "Anthropic",
        models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
        endpoint: "https://api.anthropic.com/v1",
        status: ProviderStatus.AVAILABLE,
        priority: 95,
      },
      {
        id: "groq",
        name: "Groq",
        models: ["llama-3-70b", "mixtral-8x7b"],
        endpoint: "https://api.groq.com/v1",
        status: ProviderStatus.AVAILABLE,
        priority: 90,
      },
      {
        id: "xai",
        name: "xAI",
        models: ["grok-beta"],
        endpoint: "https://api.x.ai/v1",
        status: ProviderStatus.AVAILABLE,
        priority: 85,
      },
    ]

    for (const provider of providers) {
      this.providers.set(provider.id, provider)
      this.requestCount.set(provider.id, 0)
      this.errorCount.set(provider.id, 0)
    }

    console.log(`[v0] Initialized ${providers.length} model providers`)
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    const startTime = Date.now()

    // Select provider based on model and availability
    const provider = this.selectProvider(request.model)

    if (!provider) {
      throw new Error(`No available provider for model: ${request.model}`)
    }

    try {
      console.log(`[v0] Routing request to ${provider.name} for model ${request.model}`)

      // Increment request count
      this.requestCount.set(provider.id, (this.requestCount.get(provider.id) || 0) + 1)

      // Make request to provider
      const response = await this.makeProviderRequest(provider, request)

      const latency = Date.now() - startTime

      return {
        ...response,
        latency,
      }
    } catch (error) {
      // Increment error count
      this.errorCount.set(provider.id, (this.errorCount.get(provider.id) || 0) + 1)

      // Update provider status if too many errors
      const errorRate = this.errorCount.get(provider.id)! / this.requestCount.get(provider.id)!
      if (errorRate > 0.5) {
        provider.status = ProviderStatus.DEGRADED
      }

      console.error(`[v0] Provider ${provider.name} error:`, error)
      throw error
    }
  }

  private selectProvider(model: string): ModelProvider | undefined {
    // Find providers that support this model
    const compatibleProviders = Array.from(this.providers.values()).filter(
      (p) => p.models.includes(model) && p.status !== ProviderStatus.UNAVAILABLE,
    )

    if (compatibleProviders.length === 0) {
      return undefined
    }

    // Sort by priority and error rate
    compatibleProviders.sort((a, b) => {
      const aErrorRate = (this.errorCount.get(a.id) || 0) / Math.max(this.requestCount.get(a.id) || 1, 1)
      const bErrorRate = (this.errorCount.get(b.id) || 0) / Math.max(this.requestCount.get(b.id) || 1, 1)

      // Prefer lower error rate
      if (Math.abs(aErrorRate - bErrorRate) > 0.1) {
        return aErrorRate - bErrorRate
      }

      // Then by priority
      return b.priority - a.priority
    })

    return compatibleProviders[0]
  }

  private async makeProviderRequest(provider: ModelProvider, request: ModelRequest): Promise<ModelResponse> {
    // Mock implementation - in production, make actual API calls
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    const mockContent = this.generateMockResponse(request)
    const promptTokens = request.messages.reduce((sum, msg) => sum + msg.content.length / 4, 0)
    const completionTokens = mockContent.length / 4

    return {
      id: crypto.randomUUID(),
      model: request.model,
      content: mockContent,
      usage: {
        promptTokens: Math.floor(promptTokens),
        completionTokens: Math.floor(completionTokens),
        totalTokens: Math.floor(promptTokens + completionTokens),
      },
      finishReason: "stop",
      latency: 0, // Will be set by caller
    }
  }

  private generateMockResponse(request: ModelRequest): string {
    const lastMessage = request.messages[request.messages.length - 1]
    return `This is a mock response from ${request.model} to: "${lastMessage.content.substring(0, 50)}..."`
  }

  async getProviderStats(): Promise<
    Array<{
      provider: ModelProvider
      requests: number
      errors: number
      errorRate: number
    }>
  > {
    return Array.from(this.providers.values()).map((provider) => {
      const requests = this.requestCount.get(provider.id) || 0
      const errors = this.errorCount.get(provider.id) || 0
      const errorRate = requests > 0 ? errors / requests : 0

      return {
        provider,
        requests,
        errors,
        errorRate,
      }
    })
  }

  async healthCheck(): Promise<Record<string, ProviderStatus>> {
    const health: Record<string, ProviderStatus> = {}

    for (const [id, provider] of this.providers) {
      health[id] = provider.status
    }

    return health
  }
}
