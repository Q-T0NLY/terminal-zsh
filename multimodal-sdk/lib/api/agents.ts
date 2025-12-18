import { createBrowserClient } from "@/lib/supabase/client"
import type { Agent, AgentTemplate } from "@/types/database"

export async function executeAgent(agentId: string, input: string): Promise<string> {
  const response = await fetch(`/api/agents/${agentId}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to execute agent")
  }

  const data = await response.json()
  return data.output
}

export async function getAgents(): Promise<Agent[]> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase
    .from("agents")
    .select("*, ai_models(*)")
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAgent(id: string): Promise<Agent | null> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("agents").select("*, ai_models(*)").eq("id", id).single()

  if (error) return null
  return data
}

export async function getAgentTemplates(): Promise<AgentTemplate[]> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("agent_templates").select("*").eq("is_public", true)

  if (error) throw error
  return data || []
}
