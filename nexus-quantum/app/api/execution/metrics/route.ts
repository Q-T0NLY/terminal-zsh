import { NextResponse } from "next/server"
import { executionEngineService } from "@/lib/services/enhanced-execution-engine.service"

export async function GET() {
  try {
    const metrics = executionEngineService.getMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get execution metrics" }, { status: 500 })
  }
}
