import { NextResponse } from "next/server"
import { messageBusService } from "@/lib/services/enhanced-message-bus.service"

export async function GET() {
  try {
    const health = await messageBusService.getHealth()
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json({ error: "Failed to get message bus health" }, { status: 500 })
  }
}
