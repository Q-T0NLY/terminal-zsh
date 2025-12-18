"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentRegistry } from "./agent-registry"
import { WorkflowEngine } from "./workflow-engine"
import { SystemMetrics } from "./system-metrics"
import { ExtensionsManager } from "./extensions-manager"
import { ModelGateway } from "./model-gateway"
import { DashboardHeader } from "./dashboard-header"

export function OrchestratorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight">Nexus Quantum</h1>
              <p className="text-pretty text-muted-foreground mt-2">
                Autonomous Agent Generation & Orchestration Platform
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="extensions">Extensions</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <SystemMetrics />
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <AgentRegistry />
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <WorkflowEngine />
            </TabsContent>

            <TabsContent value="extensions" className="space-y-6">
              <ExtensionsManager />
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <ModelGateway />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
