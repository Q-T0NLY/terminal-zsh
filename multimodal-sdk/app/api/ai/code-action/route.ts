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

    const { code, action, language, fullContext } = await req.json()

    const prompts: Record<string, string> = {
      explain: `Explain what this ${language} code does in clear, simple terms:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      optimize: `Optimize this ${language} code for better performance and readability:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn only the optimized code, no explanations.`,
      refactor: `Refactor this ${language} code following best practices and clean code principles:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn only the refactored code, no explanations.`,
      document: `Add comprehensive documentation comments to this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn the code with documentation added, no other explanations.`,
      test: `Generate unit tests for this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn only the test code, no explanations.`,
    }

    const prompt = prompts[action] || prompts.explain

    const { textStream } = await streamText({
      model: "openai/gpt-4o",
      prompt,
    })

    let result = ""
    for await (const chunk of textStream) {
      result += chunk
    }

    // Clean up code blocks if present
    result = result
      .replace(/```[\w]*\n/g, "")
      .replace(/```/g, "")
      .trim()

    return Response.json({ result })
  } catch (error) {
    console.error("[v0] Code action error:", error)
    return Response.json({ error: "Failed to process code action" }, { status: 500 })
  }
}
