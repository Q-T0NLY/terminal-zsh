import { generateText, streamText } from "ai"
import type { Agent, ModelProvider } from "@/types/database"
import { logError } from "@/lib/utils/error-handler"

interface RouterOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  fallbackModels?: string[]
  timeout?: number
}

interface RoutedResponse {
  model: string
  provider: ModelProvider
  response: any
  latency: number
  tokenUsage?: {
    prompt: number
    completion: number
    total: number
  }
}

export class ModelRouter {
  private modelQueue: Map<string, number> = new Map()
  private failureCount: Map<string, number> = new Map()

  async routeCompletion(agent: Agent, prompt: string, options: RouterOptions = {}): Promise<RoutedResponse> {
    const startTime = Date.now()
    const models = this.selectModels(agent, options)

    for (const modelId of models) {
      try {
        const response = await this.executeModel(modelId, agent, prompt, options)
        this.recordSuccess(modelId)

        return {
          model: modelId,
          provider: this.getProvider(modelId),
          response: response.text,
          latency: Date.now() - startTime,
          tokenUsage: response.usage,
        }
      } catch (error) {
        this.recordFailure(modelId)
        logError(error as Error, { model: modelId, agent: agent.id })
        continue
      }
    }

    throw new Error("All models failed to respond")
  }

  async routeStream(agent: Agent, prompt: string, options: RouterOptions = {}) {
    const models = this.selectModels(agent, options)

    for (const modelId of models) {
      try {
        const result = await streamText({
          model: modelId,
          messages: [
            { role: "system", content: agent.system_prompt || "You are a helpful AI assistant." },
            { role: "user", content: prompt },
          ],
          temperature: options.temperature ?? agent.temperature,
          maxTokens: options.maxTokens ?? agent.max_tokens,
          topP: options.topP,
        })

        this.recordSuccess(modelId)
        return result
      } catch (error) {
        this.recordFailure(modelId)
        logError(error as Error, { model: modelId, agent: agent.id })
        continue
      }
    }

    throw new Error("All models failed to stream")
  }

  private async executeModel(modelId: string, agent: Agent, prompt: string, options: RouterOptions) {
    return await generateText({
      model: modelId,
      messages: [
        { role: "system", content: agent.system_prompt || "You are a helpful AI assistant." },
        { role: "user", content: prompt },
      ],
      temperature: options.temperature ?? agent.temperature,
      maxTokens: options.maxTokens ?? agent.max_tokens,
      topP: options.topP,
    })
  }

  private selectModels(agent: Agent, options: RouterOptions): string[] {
    const primaryModel = agent.model
    const fallbacks = options.fallbackModels || this.getDefaultFallbacks(primaryModel)

    // Sort by least recent usage and lowest failure rate
    const allModels = [primaryModel, ...fallbacks]
    return allModels.sort((a, b) => {
      const aScore = (this.modelQueue.get(a) || 0) + (this.failureCount.get(a) || 0) * 10
      const bScore = (this.modelQueue.get(b) || 0) + (this.failureCount.get(b) || 0) * 10
      return aScore - bScore
    })
  }

  private getDefaultFallbacks(primaryModel: string): string[] {
    const fallbackMap: Record<string, string[]> = {
      "openai/gpt-4o": ["openai/gpt-4o-mini", "anthropic/claude-sonnet-4"],
      "anthropic/claude-sonnet-4": ["anthropic/claude-haiku-4", "openai/gpt-4o"],
      "openai/gpt-4o-mini": ["openai/gpt-4o", "anthropic/claude-haiku-4"],
    }
    return fallbackMap[primaryModel] || ["openai/gpt-4o-mini"]
  }

  private getProvider(modelId: string): ModelProvider {
    if (modelId.includes("openai")) return "openai"
    if (modelId.includes("anthropic")) return "anthropic"
    if (modelId.includes("google")) return "google"
    if (modelId.includes("xai")) return "xai"
    return "openai"
  }

  private recordSuccess(modelId: string) {
    this.modelQueue.set(modelId, (this.modelQueue.get(modelId) || 0) + 1)
    this.failureCount.set(modelId, Math.max(0, (this.failureCount.get(modelId) || 0) - 1))
  }

  private recordFailure(modelId: string) {
    this.failureCount.set(modelId, (this.failureCount.get(modelId) || 0) + 1)
  }

  getModelStats() {
    return {
      queue: Object.fromEntries(this.modelQueue),
      failures: Object.fromEntries(this.failureCount),
    }
  }
}

export const modelRouter = new ModelRouter()
