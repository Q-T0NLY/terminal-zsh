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
    const summary = service.getMetricsSummary()

    return NextResponse.json(summary)
  } catch (error) {
    console.error("[v0] Metrics retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve metrics", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
