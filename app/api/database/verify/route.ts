import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const tableNames = [
      "profiles",
      "ai_models",
      "agents",
      "workflows",
      "chat_sessions",
      "code_artifacts",
      "knowledge_items",
      "agent_templates",
      "execution_logs",
      "system_settings",
    ]

    const tableInfo = []
    for (const table of tableNames) {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (!error) {
        tableInfo.push({ table_name: table, row_count: count || 0 })
      }
    }

    return NextResponse.json({
      success: true,
      tables: tableInfo,
      message:
        tableInfo.length > 0 ? `Found ${tableInfo.length} tables` : "No tables found. Please run the database setup.",
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
