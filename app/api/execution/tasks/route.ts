import { type NextRequest, NextResponse } from "next/server"
import { MessageBusService } from "@/lib/services/message-bus.service"
import { ExecutionEngineService } from "@/lib/services/execution-engine.service"

// Singleton instances
let messageBus: MessageBusService
let executionEngine: ExecutionEngineService

function getServices() {
  if (!messageBus) {
    messageBus = new MessageBusService()
  }
  if (!executionEngine) {
    executionEngine = new ExecutionEngineService(messageBus, 4)
  }
  return { messageBus, executionEngine }
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, capabilityId, inputs, priority = 5 } = await request.json()

    const { executionEngine } = getServices()

    const taskId = await executionEngine.submitTask({
      agentId,
      capabilityId,
      inputs,
      priority,
    })

    return NextResponse.json({
      taskId,
      status: "submitted",
      message: "Task submitted for execution",
    })
  } catch (error) {
    console.error("[v0] Task submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit task", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    const { executionEngine } = getServices()

    if (taskId) {
      // Get specific task status
      const task = await executionEngine.getTaskStatus(taskId)

      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }

      return NextResponse.json(task)
    } else {
      // Get all tasks
      const tasks = await executionEngine.getAllTasks()
      return NextResponse.json({ tasks })
    }
  } catch (error) {
    console.error("[v0] Task retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve tasks", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
