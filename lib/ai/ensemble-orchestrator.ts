import type { Agent } from "@/types/database"
import { modelRouter } from "./model-router"

interface EnsembleStrategy {
  type: "voting" | "weighted" | "cascade" | "parallel"
  agents: Agent[]
  weights?: number[]
}

interface EnsembleResult {
  responses: Array<{
    agent: Agent
    response: string
    confidence: number
    latency: number
  }>
  finalResponse: string
  strategy: string
  totalLatency: number
}

export class EnsembleOrchestrator {
  async execute(prompt: string, strategy: EnsembleStrategy): Promise<EnsembleResult> {
    const startTime = Date.now()

    switch (strategy.type) {
      case "voting":
        return await this.votingStrategy(prompt, strategy.agents)
      case "weighted":
        return await this.weightedStrategy(prompt, strategy.agents, strategy.weights!)
      case "cascade":
        return await this.cascadeStrategy(prompt, strategy.agents)
      case "parallel":
        return await this.parallelStrategy(prompt, strategy.agents)
      default:
        throw new Error(`Unknown ensemble strategy: ${strategy.type}`)
    }
  }

  private async votingStrategy(prompt: string, agents: Agent[]): Promise<EnsembleResult> {
    const startTime = Date.now()
    const responses = await Promise.all(
      agents.map(async (agent) => {
        const result = await modelRouter.routeCompletion(agent, prompt)
        return {
          agent,
          response: result.response,
          confidence: 1 / agents.length,
          latency: result.latency,
        }
      }),
    )

    // Simple majority voting - in production, use more sophisticated scoring
    const responseMap = new Map<string, number>()
    responses.forEach((r) => {
      responseMap.set(r.response, (responseMap.get(r.response) || 0) + 1)
    })

    const finalResponse = Array.from(responseMap.entries()).sort((a, b) => b[1] - a[1])[0][0]

    return {
      responses,
      finalResponse,
      strategy: "voting",
      totalLatency: Date.now() - startTime,
    }
  }

  private async weightedStrategy(prompt: string, agents: Agent[], weights: number[]): Promise<EnsembleResult> {
    const startTime = Date.now()
    const responses = await Promise.all(
      agents.map(async (agent, idx) => {
        const result = await modelRouter.routeCompletion(agent, prompt)
        return {
          agent,
          response: result.response,
          confidence: weights[idx],
          latency: result.latency,
        }
      }),
    )

    // Use the highest weighted response
    const maxWeight = Math.max(...responses.map((r) => r.confidence))
    const finalResponse = responses.find((r) => r.confidence === maxWeight)!.response

    return {
      responses,
      finalResponse,
      strategy: "weighted",
      totalLatency: Date.now() - startTime,
    }
  }

  private async cascadeStrategy(prompt: string, agents: Agent[]): Promise<EnsembleResult> {
    const startTime = Date.now()
    const responses = []
    let currentPrompt = prompt

    for (const agent of agents) {
      const result = await modelRouter.routeCompletion(agent, currentPrompt)
      responses.push({
        agent,
        response: result.response,
        confidence: 1,
        latency: result.latency,
      })
      // Each agent builds on the previous response
      currentPrompt = `${currentPrompt}\n\nPrevious response: ${result.response}\n\nPlease refine or expand on this.`
    }

    return {
      responses,
      finalResponse: responses[responses.length - 1].response,
      strategy: "cascade",
      totalLatency: Date.now() - startTime,
    }
  }

  private async parallelStrategy(prompt: string, agents: Agent[]): Promise<EnsembleResult> {
    const startTime = Date.now()
    const responses = await Promise.all(
      agents.map(async (agent) => {
        const result = await modelRouter.routeCompletion(agent, prompt)
        return {
          agent,
          response: result.response,
          confidence: 1,
          latency: result.latency,
        }
      }),
    )

    // Synthesize all responses into one
    const synthesisPrompt = `Synthesize these responses into one coherent answer:\n\n${responses
      .map((r, i) => `Response ${i + 1}:\n${r.response}`)
      .join("\n\n")}`

    const synthesisAgent = agents[0] // Use first agent for synthesis
    const finalResult = await modelRouter.routeCompletion(synthesisAgent, synthesisPrompt)

    return {
      responses,
      finalResponse: finalResult.response,
      strategy: "parallel",
      totalLatency: Date.now() - startTime,
    }
  }
}

export const ensembleOrchestrator = new EnsembleOrchestrator()
