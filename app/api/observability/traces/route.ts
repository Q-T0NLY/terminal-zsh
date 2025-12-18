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
    const summary = service.getTracesSummary()

    return NextResponse.json(summary)
  } catch (error) {
    console.error("[v0] Traces retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve traces", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
