import { type NextRequest, NextResponse } from "next/server"
import { ContextStoreService, type ContextType } from "@/lib/services/context-store.service"

let contextStore: ContextStoreService

function getContextStore() {
  if (!contextStore) {
    contextStore = new ContextStoreService()
  }
  return contextStore
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, sessionId, type, content, metadata } = body

    const store = getContextStore()

    const contextId = await store.store({
      agentId,
      sessionId,
      type: type as ContextType,
      content,
      metadata: metadata || {
        source: "api",
        importance: 5,
        tags: [],
        relationships: [],
      },
    })

    return NextResponse.json({
      contextId,
      message: "Context stored successfully",
    })
  } catch (error) {
    console.error("[v0] Context storage error:", error)
    return NextResponse.json(
      { error: "Failed to store context", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contextId = searchParams.get("id")
    const agentId = searchParams.get("agentId")
    const sessionId = searchParams.get("sessionId")
    const type = searchParams.get("type")
    const limit = searchParams.get("limit")

    const store = getContextStore()

    if (contextId) {
      const context = await store.retrieve(contextId)
      if (!context) {
        return NextResponse.json({ error: "Context not found" }, { status: 404 })
      }
      return NextResponse.json(context)
    }

    const contexts = await store.query({
      agentId: agentId || undefined,
      sessionId: sessionId || undefined,
      type: type as ContextType | undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
    })

    return NextResponse.json({ contexts })
  } catch (error) {
    console.error("[v0] Context retrieval error:", error)
    return NextResponse.json(
      { error: "Failed to retrieve context", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contextId = searchParams.get("id")
    const sessionId = searchParams.get("sessionId")

    const store = getContextStore()

    if (sessionId) {
      const deletedCount = await store.clearSession(sessionId)
      return NextResponse.json({
        message: `Cleared ${deletedCount} contexts for session`,
        deletedCount,
      })
    }

    if (contextId) {
      const deleted = await store.delete(contextId)
      if (!deleted) {
        return NextResponse.json({ error: "Context not found" }, { status: 404 })
      }
      return NextResponse.json({ message: "Context deleted successfully" })
    }

    return NextResponse.json({ error: "Missing contextId or sessionId" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Context deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete context", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
