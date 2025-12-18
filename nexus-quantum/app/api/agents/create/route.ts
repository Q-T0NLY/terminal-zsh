import { type NextRequest, NextResponse } from "next/server"
import { AgentEngineAdapter } from "@/lib/services/agent-engine-adapter.service"

export async function POST(request: NextRequest) {
  try {
    const { prompt, agentType, optimizationLevel } = await request.json()

    const adapter = new AgentEngineAdapter()
    const result = await adapter.createAgentFromChat(prompt, agentType, optimizationLevel)

    return NextResponse.json({
      optimizedPrompt: result.optimizedPrompt,
      confidence: result.confidence,
      agentSpec: {
        type: result.agentSpec.type,
        capabilities: result.agentSpec.capabilities.map((c) => c.name),
        optimization: optimizationLevel,
      },
      deployment: result.deployment,
      estimatedPerformance: result.estimatedPerformance,
    })
  } catch (error) {
    console.error("[v0] Agent creation error:", error)
    return NextResponse.json(
      { error: "Failed to create agent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
