"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useCache } from "@/lib/hooks/use-swr-cache"
import { supabaseFetcher } from "@/lib/api/fetcher"
import { createBrowserClient } from "@/lib/supabase/client"
import { showErrorToast } from "@/lib/utils/error-handler"
import { toast } from "sonner"
import type { Workflow } from "@/types/database"
import type { Node, Edge } from "reactflow"

const WorkflowCanvas = dynamic(
  () => import("@/components/workflow/workflow-canvas").then((mod) => ({ default: mod.WorkflowCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[600px] border rounded-lg bg-card">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow builder...</p>
        </div>
      </div>
    ),
  },
)

export default function WorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const supabase = createBrowserClient()

  const { data: workflows, mutate } = useCache<Workflow[]>("workflows", () =>
    supabaseFetcher<Workflow>("workflows", {
      order: { column: "updated_at", ascending: false },
    }),
  )

  const handleSaveWorkflow = async (nodes: Node[], edges: Edge[]) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const workflowData = {
        user_id: user.id,
        name: selectedWorkflow?.name || `Workflow ${new Date().toLocaleTimeString()}`,
        description: selectedWorkflow?.description || "",
        nodes: nodes,
        edges: edges,
        config: {},
        is_active: true,
      }

      if (selectedWorkflow) {
        // Update existing workflow
        const { error } = await supabase
          .from("workflows")
          .update(workflowData)
          .eq("id", selectedWorkflow.id)
          .eq("user_id", user.id)

        if (error) throw error
      } else {
        // Create new workflow
        const { data, error } = await supabase.from("workflows").insert(workflowData).select().single()

        if (error) throw error
        if (data) setSelectedWorkflow(data)
      }

      toast.success("Workflow saved successfully")
      mutate()
    } catch (error) {
      showErrorToast(error, "Failed to save workflow")
    }
  }

  const handleNewWorkflow = () => {
    setSelectedWorkflow(null)
  }

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        <SectionHeader
          title="Workflow Builder"
          description="Create and manage AI workflows visually"
          gradient
          action={
            <Button onClick={handleNewWorkflow} className="gap-2">
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          }
        />

        <div className="h-[calc(100vh-12rem)]">
          <WorkflowCanvas
            initialNodes={selectedWorkflow?.nodes || []}
            initialEdges={selectedWorkflow?.edges || []}
            onSave={handleSaveWorkflow}
          />
        </div>
      </div>
    </PageContainer>
  )
}
