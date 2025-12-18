import { createServerClient } from "@/lib/supabase/server"
import { generateEmbedding } from "@/lib/ai/embeddings"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, limit = 10 } = await req.json()

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query)

    // Search using vector similarity (Supabase pgvector)
    const { data, error } = await supabase.rpc("search_knowledge", {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: limit,
    })

    if (error) throw error

    return Response.json({ results: data })
  } catch (error) {
    console.error("[v0] Knowledge search error:", error)
    return Response.json({ error: "Failed to search knowledge" }, { status: 500 })
  }
}
