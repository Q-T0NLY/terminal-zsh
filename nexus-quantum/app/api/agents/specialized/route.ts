import { type NextRequest, NextResponse } from "next/server"
import {
  EnhancedQuantumAgent,
  EnhancedMLAgent,
  EnhancedGenerativeAgent,
  type QuantumAgentConfig,
  type MLAgentConfig,
  type GenerativeAgentConfig,
} from "@/lib/agents/enhanced-specialized-agents"

const specializedAgents = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, config } = body

    let agent
    switch (type) {
      case "quantum":
        agent = new EnhancedQuantumAgent(config as QuantumAgentConfig)
        break
      case "ml":
        agent = new EnhancedMLAgent(config as MLAgentConfig)
        break
      case "generative":
        agent = new EnhancedGenerativeAgent(config as GenerativeAgentConfig)
        break
      default:
        return NextResponse.json({ error: `Unknown agent type: ${type}` }, { status: 400 })
    }

    await agent.initialize()
    specializedAgents.set(agent.id, agent)

    return NextResponse.json({
      success: true,
      agentId: agent.id,
      type,
      capabilities: Array.from(agent["capabilities"].keys()),
      status: agent["state"],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get("agentId")

  if (agentId) {
    const agent = specializedAgents.get(agentId)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      state: agent["state"],
      health: await agent.getHealth(),
      capabilities: Array.from(agent["capabilities"].keys()),
      metrics: agent["metricsCollector"]?.getMetrics() || {},
    })
  }

  // List all specialized agents
  const agents = Array.from(specializedAgents.values()).map((agent) => ({
    id: agent.id,
    name: agent.name,
    type: agent.type,
    state: agent["state"],
    capabilities: Array.from(agent["capabilities"].keys()).length,
  }))

  return NextResponse.json({ agents })
}
