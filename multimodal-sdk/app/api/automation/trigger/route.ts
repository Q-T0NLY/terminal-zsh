import { createServerClient } from "@/lib/supabase/server"
import { eventBus } from "@/lib/automation/event-bus"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { event, data } = await req.json()

    // Emit event to automation engine
    await eventBus.emit(event, {
      ...data,
      userId: user.id,
      timestamp: new Date().toISOString(),
    })

    // Log event
    await supabase.from("automation_logs").insert({
      user_id: user.id,
      event_type: event,
      event_data: data,
      status: "triggered",
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Automation trigger error:", error)
    return Response.json({ error: "Failed to trigger automation" }, { status: 500 })
  }
}
