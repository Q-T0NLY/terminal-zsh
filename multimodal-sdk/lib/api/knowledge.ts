import { createBrowserClient } from "@/lib/supabase/client"
import type { Knowledge, KnowledgeGraph } from "@/types/database"

const supabase = createBrowserClient()

export async function createKnowledge(data: Partial<Knowledge>) {
  const { data: knowledge, error } = await supabase.from("knowledge_items").insert(data).select().single()

  if (error) throw error
  return knowledge
}

export async function searchKnowledge(query: string, limit = 10) {
  // Get query embedding
  const response = await fetch("/api/knowledge/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  })

  if (!response.ok) throw new Error("Search failed")
  return response.json()
}

export async function getKnowledgeById(id: string) {
  const { data, error } = await supabase.from("knowledge_items").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function updateKnowledge(id: string, data: Partial<Knowledge>) {
  const { data: knowledge, error } = await supabase.from("knowledge_items").update(data).eq("id", id).select().single()

  if (error) throw error
  return knowledge
}

export async function deleteKnowledge(id: string) {
  const { error } = await supabase.from("knowledge_items").delete().eq("id", id)
  if (error) throw error
}

export async function getKnowledgeGraph(knowledgeId: string) {
  const { data, error } = await supabase.from("knowledge_graph").select("*").eq("knowledge_id", knowledgeId)

  if (error) throw error
  return data
}

export async function createKnowledgeGraph(data: Partial<KnowledgeGraph>) {
  const { data: graph, error } = await supabase.from("knowledge_graph").insert(data).select().single()

  if (error) throw error
  return graph
}
