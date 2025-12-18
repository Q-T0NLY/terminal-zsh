import { createClient } from "@supabase/supabase-js"
import { supabaseConfig } from "@/lib/config/supabase"

// Admin client with service role key that bypasses RLS
// Only use this for admin operations like seeding, migrations, etc.
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
  }

  return createClient(supabaseConfig.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
