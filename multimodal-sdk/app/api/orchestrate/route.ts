import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { ensembleOrchestrator } from "@/lib/ai/ensemble-orchestrator"
import { logError } from "@/lib/utils/error-handler"
import type { Agent } from "@/types/database"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { prompt, strategy, agentIds, weights } = body

    if (!prompt || !strategy || !agentIds) {
      return NextResponse.json({ error: "Missing required fields: prompt, strategy, agentIds" }, { status: 400 })
    }

    // Fetch agents
    const { data: agents, error: agentsError } = await supabase
      .from("agents")
      .select("*")
      .in("id", agentIds)
      .eq("user_id", user.id)

    if (agentsError || !agents) {
      throw new Error("Failed to fetch agents")
    }

    // Execute ensemble orchestration
    const result = await ensembleOrchestrator.execute(prompt, {
      type: strategy,
      agents: agents as Agent[],
      weights,
    })

    // Log the orchestration
    await supabase.from("orchestration_logs").insert({
      user_id: user.id,
      strategy,
      agent_ids: agentIds,
      prompt,
      result: result.finalResponse,
      latency_ms: result.totalLatency,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(result)
  } catch (error) {
    logError(error as Error, { context: "orchestrate" })
    return NextResponse.json({ error: "Failed to orchestrate agents" }, { status: 500 })
  }
}
