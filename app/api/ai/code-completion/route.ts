import { streamText } from "ai"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, language, position } = await req.json()

    // Get AI completion suggestions
    const { textStream } = await streamText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert code completion AI. Given the following code context in ${language}, provide intelligent code completions.

Code context:
\`\`\`${language}
${code}
\`\`\`

Provide 3-5 relevant code completions as a JSON array with the following structure:
[
  {
    "label": "completion label",
    "insertText": "code to insert",
    "documentation": "brief description",
    "detail": "additional details"
  }
]

Only return valid JSON, no markdown or explanations.`,
    })

    let fullResponse = ""
    for await (const chunk of textStream) {
      fullResponse += chunk
    }

    // Parse JSON response
    const completions = JSON.parse(fullResponse)

    return Response.json({ completions })
  } catch (error) {
    console.error("[v0] Code completion error:", error)
    return Response.json({ error: "Failed to generate completions" }, { status: 500 })
  }
}
