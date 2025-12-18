import { NextResponse } from "next/server"
import { AIThemeGenerator } from "@/lib/services/ai-theme-generator.service"

export async function POST(request: Request) {
  try {
    const options = await request.json()

    const generator = new AIThemeGenerator()
    const themes = await generator.generateTheme(options)

    return NextResponse.json(themes)
  } catch (error) {
    console.error("[v0] Theme generation error:", error)
    return NextResponse.json({ error: "Theme generation failed" }, { status: 500 })
  }
}
