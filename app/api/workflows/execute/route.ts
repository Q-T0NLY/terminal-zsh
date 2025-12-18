import { type NextRequest, NextResponse } from "next/server"
import { WorkflowAutomationService } from "@/lib/services/workflow-automation.service"
import { MessageBusService } from "@/lib/services/message-bus.service"
import { ExecutionEngineService } from "@/lib/services/execution-engine.service"

let workflowService: WorkflowAutomationService

function getWorkflowService() {
  if (!workflowService) {
    const messageBus = new MessageBusService()
    const executionEngine = new ExecutionEngineService(messageBus, 4)
    workflowService = new WorkflowAutomationService(messageBus, executionEngine)
  }
  return workflowService
}

export async function POST(request: NextRequest) {
  try {
    const { workflowId, inputs } = await request.json()

    const service = getWorkflowService()
    const executionId = await service.executeWorkflow(workflowId, inputs)

    return NextResponse.json({
      executionId,
      message: "Workflow execution started",
    })
  } catch (error) {
    console.error("[v0] Workflow execution error:", error)
    return NextResponse.json(
      { error: "Failed to execute workflow", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
