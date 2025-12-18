import { type NextRequest, NextResponse } from "next/server"
import { OrchestratorService } from "@/lib/services/orchestrator.service"

const orchestratorService = new OrchestratorService()

export async function POST(request: NextRequest) {
  try {
    const definition = await request.json()
    const result = await orchestratorService.createWorkflow(definition)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Workflow creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create workflow" },
      { status: 500 },
    )
  }
}
