import { createServerClient } from "@/lib/supabase/server"
import { generateEmbedding } from "@/lib/ai/embeddings"

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    let query = supabase
      .from("knowledge_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) throw error

    return Response.json({ knowledge: data })
  } catch (error) {
    console.error("[v0] Get knowledge error:", error)
    return Response.json({ error: "Failed to get knowledge" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Generate embedding for content
    const embedding = await generateEmbedding(body.content)

    const { data, error } = await supabase
      .from("knowledge_items")
      .insert({
        ...body,
        user_id: user.id,
        embedding,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ knowledge: data })
  } catch (error) {
    console.error("[v0] Create knowledge error:", error)
    return Response.json({ error: "Failed to create knowledge" }, { status: 500 })
  }
}
