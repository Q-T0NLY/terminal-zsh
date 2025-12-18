import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_NEXUS_PUBLICSUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log("🔍 Checking database tables...\n")

const tables = [
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

async function verifyTables() {
  for (const table of tables) {
    const { data, count, error } = await supabase.from(table).select("*", { count: "exact" }).limit(5)

    if (error) {
      console.log(`❌ ${table}: ${error.message}`)
    } else {
      console.log(`✅ ${table}: ${count} rows`)
      if (data && data.length > 0) {
        console.log(`   Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`)
      }
    }
  }

  // Check AI models specifically
  console.log("\n🤖 AI Models seeded:")
  const { data: models } = await supabase.from("ai_models").select("name, provider, model_type, is_active")

  if (models) {
    models.forEach((model) => {
      console.log(`   ${model.is_active ? "✅" : "❌"} ${model.provider}/${model.name} (${model.model_type})`)
    })
  }

  console.log("\n🎉 Verification complete!")
}

verifyTables()
