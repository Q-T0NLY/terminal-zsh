import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { supabaseConfig } from "@/lib/config/supabase"

let client: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  if (client) {
    return client
  }

  client = createSupabaseBrowserClient(supabaseConfig.url, supabaseConfig.anonKey)

  return client
}
