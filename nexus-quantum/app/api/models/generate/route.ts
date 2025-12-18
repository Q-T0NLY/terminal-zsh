import { type NextRequest, NextResponse } from "next/server"
import { ModelGatewayService } from "@/lib/services/model-gateway.service"

let modelGateway: ModelGatewayService

function getModelGateway() {
  if (!modelGateway) {
    modelGateway = new ModelGatewayService()
  }
  return modelGateway
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { model, messages, temperature, maxTokens } = body

    const gateway = getModelGateway()

    const response = await gateway.generate({
      model,
      messages,
      temperature,
      maxTokens,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Model generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate response", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
