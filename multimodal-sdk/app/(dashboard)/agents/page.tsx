"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Zap } from "lucide-react" // Import Zap icon
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/agents/agent-card"
import { AgentForm } from "@/components/agents/agent-form"
import { EmptyState } from "@/components/ui/empty-state"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCache } from "@/lib/hooks/use-swr-cache"
import { supabaseFetcher } from "@/lib/api/fetcher"
import { createBrowserClient } from "@/lib/supabase/client"
import { showErrorToast } from "@/lib/utils/error-handler"
import { toast } from "sonner"
import type { Agent, AIModel, AgentTemplate } from "@/types/database"

export default function AgentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const supabase = createBrowserClient()

  const { data: agents, mutate: mutateAgents } = useCache<Agent[]>("agents", () =>
    supabaseFetcher<Agent>("agents", {
      order: { column: "updated_at", ascending: false },
    }),
  )

  const { data: models } = useCache<AIModel[]>("ai-models", () => supabaseFetcher<AIModel>("ai_models"))

  const { data: templates } = useCache<AgentTemplate[]>("agent-templates", () =>
    supabaseFetcher<AgentTemplate>("agent_templates", {
      filter: { is_public: true },
    }),
  )

  const handleCreateAgent = async (data: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const agentData = {
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        type: data.type,
        model_id: data.model_id,
        system_prompt: data.system_prompt,
        config: {
          temperature: data.temperature,
          max_tokens: data.max_tokens,
        },
        capabilities: [],
        is_active: data.is_active,
      }

      if (selectedAgent) {
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", selectedAgent.id)
          .eq("user_id", user.id)

        if (error) throw error
        toast.success("Agent updated successfully")
      } else {
        const { error } = await supabase.from("agents").insert(agentData)

        if (error) throw error
        toast.success("Agent created successfully")
      }

      setIsFormOpen(false)
      setSelectedAgent(null)
      mutateAgents()
    } catch (error) {
      showErrorToast(error, "Failed to save agent")
    }
  }

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsFormOpen(true)
  }

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("agents").delete().eq("id", agentId).eq("user_id", user.id)

      if (error) throw error

      toast.success("Agent deleted successfully")
      mutateAgents()
    } catch (error) {
      showErrorToast(error, "Failed to delete agent")
    }
  }

  const handleNewAgent = () => {
    setSelectedAgent(null)
    setIsFormOpen(true)
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <SectionHeader
          title="AI Agents"
          description="Create and manage AI agents with custom capabilities"
          gradient
          action={
            <Button onClick={handleNewAgent} className="gap-2">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          }
        />

        {!agents || agents.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No agents yet"
            description="Create your first AI agent to get started"
            action={{
              label: "Create Agent",
              onClick: handleNewAgent,
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={() => handleEditAgent(agent)}
                onDelete={() => handleDeleteAgent(agent.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAgent ? "Edit Agent" : "Create New Agent"}</DialogTitle>
          </DialogHeader>
          <AgentForm
            agent={selectedAgent || undefined}
            models={models || []}
            templates={templates || []}
            onSubmit={handleCreateAgent}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedAgent(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
