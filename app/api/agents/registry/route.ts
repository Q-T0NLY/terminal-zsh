import { type NextRequest, NextResponse } from "next/server"
import { AgentRegistryService } from "@/lib/services/agent-registry.service"

const registryService = new AgentRegistryService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const capabilityId = searchParams.get("capability")

    if (capabilityId) {
      const agents = await registryService.discoverAgentsByCapability(capabilityId)
      return NextResponse.json({ agents })
    }

    const allAgents = registryService.getAllAgents()
    return NextResponse.json({ agents: allAgents })
  } catch (error) {
    console.error("[v0] Registry fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const spec = await request.json()
    await registryService.registerAgent(spec)

    return NextResponse.json({
      success: true,
      message: "Agent registered successfully",
    })
  } catch (error) {
    console.error("[v0] Agent registration error:", error)
    return NextResponse.json({ error: "Failed to register agent" }, { status: 500 })
  }
}
