import { generateText } from "ai"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const { input } = await req.json()

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Get agent with model info
  const { data: agent, error } = await supabase
    .from("agents")
    .select("*, ai_models(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !agent) {
    return new Response("Agent not found", { status: 404 })
  }

  if (!agent.is_active) {
    return new Response("Agent is not active", { status: 400 })
  }

  try {
    const startTime = Date.now()

    const result = await generateText({
      model: `${agent.ai_models.provider}/${agent.ai_models.model_id}`,
      prompt: input,
      system: agent.system_prompt || undefined,
      temperature: agent.config?.temperature || 0.7,
      maxOutputTokens: agent.config?.max_tokens || 2000,
    })

    const duration = Date.now() - startTime

    // Log execution
    await supabase.from("execution_logs").insert({
      user_id: user.id,
      agent_id: agent.id,
      action: "agent_execution",
      input: { prompt: input },
      output: { text: result.text, usage: result.usage },
      status: "completed",
      duration_ms: duration,
    })

    return Response.json({
      output: result.text,
      usage: result.usage,
      executionTime: duration,
    })
  } catch (error: any) {
    // Log error
    await supabase.from("execution_logs").insert({
      user_id: user.id,
      agent_id: agent.id,
      action: "agent_execution",
      input: { prompt: input },
      status: "failed",
      error: error.message,
    })

    return Response.json(
      {
        error: error.message || "Failed to execute agent",
      },
      { status: 500 },
    )
  }
}
