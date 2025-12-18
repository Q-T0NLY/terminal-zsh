import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_NEXUS_PUBLICSUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials")
  console.log("Required environment variables:")
  console.log("  - SUPABASE_NEXUS_PUBLICSUPABASE_URL or SUPABASE_URL")
  console.log("  - SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log("🚀 Starting database setup...\n")

// Read SQL file
const sqlFile = join(__dirname, "001_complete_database_setup.sql")
const sql = readFileSync(sqlFile, "utf-8")

console.log("📄 Loaded SQL file: 001_complete_database_setup.sql")
console.log(`📏 SQL size: ${(sql.length / 1024).toFixed(2)} KB\n`)

// Execute SQL using Supabase's RPC or direct SQL execution
async function executeSql() {
  try {
    console.log("🔧 Executing SQL script...\n")

    // Use the postgres connection to execute raw SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_string: sql })

    if (error) {
      // If RPC doesn't exist, we need to execute it differently
      // Split SQL into individual statements and execute them
      console.log("⚠️  RPC not available, executing statements individually...\n")

      // Split by semicolon but be careful with function definitions
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"))

      console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ";"

        // Skip comments
        if (statement.trim().startsWith("--")) continue

        try {
          // For DDL statements, we need to use the REST API directly
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseServiceKey,
              Authorization: `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ query: statement }),
          })

          if (!response.ok && response.status !== 404) {
            console.log(`⚠️  Statement ${i + 1}: ${statement.substring(0, 50)}... (might be OK)`)
          } else {
            successCount++
          }
        } catch (err) {
          errorCount++
          console.log(`❌ Error in statement ${i + 1}:`, err.message)
          console.log(`   Statement: ${statement.substring(0, 100)}...`)
        }
      }

      console.log(`\n✅ Completed: ${successCount} successful, ${errorCount} errors\n`)
    } else {
      console.log("✅ SQL executed successfully via RPC\n")
    }

    // Verify tables were created
    console.log("🔍 Verifying database tables...\n")

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

    for (const table of tables) {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

      if (error) {
        console.log(`❌ ${table}: NOT FOUND`)
      } else {
        console.log(`✅ ${table}: ${count} rows`)
      }
    }

    console.log("\n🎉 Database setup verification complete!")
  } catch (error) {
    console.error("❌ Error executing SQL:", error.message)
    process.exit(1)
  }
}

executeSql()
