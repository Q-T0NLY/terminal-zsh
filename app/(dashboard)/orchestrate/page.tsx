import { createServerClient } from "@/lib/supabase/server"
import { OrchestrationPanel } from "@/components/orchestration/orchestration-panel"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { redirect } from "next/navigation"

export default async function OrchestratePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <PageContainer>
      <SectionHeader
        title="Ensemble Orchestration"
        description="Coordinate multiple AI agents to solve complex tasks with advanced ensemble strategies"
        icon="sparkles"
      />

      <OrchestrationPanel agents={agents || []} />
    </PageContainer>
  )
}
