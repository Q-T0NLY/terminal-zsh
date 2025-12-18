import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { text: summary } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Summarize the following web content in 2-3 concise paragraphs:\n\n${content.substring(0, 4000)}`,
    })

    const { text: insightsText } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Extract 3-5 key insights from this web content. Format as a bullet list:\n\n${content.substring(0, 4000)}`,
    })

    const insights = insightsText
      .split("\n")
      .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter((line) => line.length > 0)

    return NextResponse.json({
      summary,
      insights,
      analyzedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json({ error: "Failed to summarize content" }, { status: 500 })
  }
}
