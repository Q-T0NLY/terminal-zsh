import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"
import { createServerClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, agentId, sessionId }: { messages: UIMessage[]; agentId?: string; sessionId?: string } =
    await req.json()

  const supabase = await createServerClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Get agent configuration if specified
  let systemPrompt = "You are a helpful AI assistant."
  let modelId = "openai/gpt-5"

  if (agentId) {
    const { data: agent } = await supabase.from("agents").select("*, ai_models(*)").eq("id", agentId).single()

    if (agent && agent.ai_models) {
      systemPrompt = agent.system_prompt || systemPrompt
      modelId = `${agent.ai_models.provider}/${agent.ai_models.model_id}`
    }
  }

  const prompt = convertToModelMessages(messages)

  // Add system message
  const fullPrompt = [{ role: "system" as const, content: systemPrompt }, ...prompt]

  const result = streamText({
    model: modelId,
    messages: fullPrompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted, usage }) => {
      if (isAborted) {
        console.log("[v0] Chat aborted")
        return
      }

      // Save chat session
      if (sessionId) {
        await supabase
          .from("chat_sessions")
          .update({
            messages: messages,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId)
          .eq("user_id", user.id)
      }

      // Log execution
      await supabase.from("execution_logs").insert({
        user_id: user.id,
        agent_id: agentId || null,
        action: "chat_message",
        input: { messages: messages.slice(-1) },
        output: { usage },
        status: "completed",
      })
    },
    consumeSseStream: consumeStream,
  })
}
