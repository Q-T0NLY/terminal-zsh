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

export async function GET(request: NextRequest) {
  try {
    const { messageBus, executionEngine } = getServices()

    const [workerStats, queueStats] = await Promise.all([executionEngine.getWorkerStats(), messageBus.getQueueStats()])

    return NextResponse.json({
      workers: workerStats,
      messageQueue: queueStats,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("[v0] Stats retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve stats", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
