import { type NextRequest, NextResponse } from "next/server"
import { ModelGatewayService } from "@/lib/services/model-gateway.service"

let modelGateway: ModelGatewayService

function getModelGateway() {
  if (!modelGateway) {
    modelGateway = new ModelGatewayService()
  }
  return modelGateway
}

export async function GET(request: NextRequest) {
  try {
    const gateway = getModelGateway()
    const stats = await gateway.getProviderStats()

    return NextResponse.json({ providers: stats })
  } catch (error) {
    console.error("[v0] Provider stats error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve provider stats", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
