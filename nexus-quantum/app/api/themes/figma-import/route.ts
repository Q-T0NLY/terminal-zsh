import { NextResponse } from "next/server"
import { FigmaIntegration } from "@/lib/services/figma-integration.service"

export async function POST(request: Request) {
  try {
    const { fileId, accessToken } = await request.json()

    const figma = new FigmaIntegration(accessToken)
    const themeData = await figma.importThemeFromFile(fileId)

    return NextResponse.json(themeData)
  } catch (error) {
    console.error("[v0] Figma import error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Figma import failed" }, { status: 500 })
  }
}
