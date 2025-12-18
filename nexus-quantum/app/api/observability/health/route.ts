import { NextResponse } from "next/server"
import { ObservabilityService } from "@/lib/services/observability.service"

let observability: ObservabilityService

function getObservability() {
  if (!observability) {
    observability = new ObservabilityService()
  }
  return observability
}

export async function GET() {
  try {
    const service = getObservability()
    const health = await service.checkSystemHealth()

    return NextResponse.json(health)
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return NextResponse.json(
      { error: "Failed to check system health", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
