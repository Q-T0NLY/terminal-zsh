"use client"

import { useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingChatDock } from "./floating-chat-dock"
import { CommandPalette } from "./command-palette"
import { NotificationCenter } from "./notification-center"
import { InspectorPanel } from "./inspector-panel"
import { EnhancedTopBar } from "./enhanced-top-bar"
import { QuickActionsPanel } from "./quick-actions-panel"
import { SystemStatusWidget } from "./system-status-widget"
import { AgentControlBoard } from "../panels/agent-control-board"
import { TokenizationPanel } from "../panels/tokenization-panel"
import { RuntimeMap } from "../panels/runtime-map"
import { PluginCenter } from "../panels/plugin-center"
import { AdvancedEditor } from "../panels/advanced-editor"
import { WorkflowStudio } from "../panels/workflow-studio"
import { AnalyticsPanel } from "../panels/analytics-panel"
import { SecurityPanel } from "../panels/security-panel"
import { GenerativeMetrics } from "../panels/generative-metrics"
import { DeploymentPanel } from "../panels/deployment-panel"
import { ModelsPanel } from "../panels/models-panel"
import { OptimizationPanel } from "../panels/optimization-panel"
import { IncidentsPanel } from "../panels/incidents-panel"
import { CustomDashboard } from "../panels/custom-dashboard"
import { useTheme } from "@/lib/contexts/theme-context"

const DASHBOARD_TABS = [
  { id: "control", name: "Agent Control", icon: "🛠️", component: AgentControlBoard },
  { id: "tokens", name: "Tokenization", icon: "💰", component: TokenizationPanel },
  { id: "runtime", name: "Runtime Map", icon: "🗺️", component: RuntimeMap },
  { id: "plugins", name: "Plugins", icon: "🔌", component: PluginCenter },
  { id: "editor", name: "Advanced Editor", icon: "💻", component: AdvancedEditor },
  { id: "workflow", name: "Workflow Studio", icon: "⚡", component: WorkflowStudio },
  { id: "analytics", name: "Analytics", icon: "📊", component: AnalyticsPanel },
  { id: "security", name: "Security & Audit", icon: "🔒", component: SecurityPanel },
  { id: "metrics", name: "Generative Metrics", icon: "📈", component: GenerativeMetrics },
  { id: "deployment", name: "Deployment", icon: "🚀", component: DeploymentPanel },
  { id: "models", name: "Models", icon: "🧠", component: ModelsPanel },
  { id: "optimization", name: "Optimization", icon: "🎯", component: OptimizationPanel },
  { id: "incidents", name: "Incidents", icon: "🚨", component: IncidentsPanel },
  { id: "custom", name: "Custom Dashboard", icon: "🎨", component: CustomDashboard },
]

export function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("control")
  const [widgets, setWidgets] = useState<any[]>([])
  const [selectedWidget, setSelectedWidget] = useState<any>(null)
  const { theme } = useTheme()

  const ActiveTabComponent = DASHBOARD_TABS.find((t) => t.id === activeTab)?.component

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>
      <EnhancedTopBar />

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-auto">
            <div className="flex overflow-x-auto px-4">
              {DASHBOARD_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative rounded-none border-b-2 border-transparent px-4 py-3 font-semibold text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
        </Tabs>
      </div>

      <PanelGroup direction="horizontal" className="h-[calc(100vh-128px)]">
        {/* Left Quick Actions & Status */}
        <Panel defaultSize={20} minSize={15} maxSize={25}>
          <div className="h-full border-r border-border bg-background/50 backdrop-blur-sm overflow-auto">
            <QuickActionsPanel />
            <SystemStatusWidget />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* Main Content Area */}
        <Panel minSize={40}>
          <div className="h-full overflow-auto p-6">
            {ActiveTabComponent && (
              <ActiveTabComponent widgets={widgets.filter((w) => w.tabId === activeTab)} onWidgetsChange={setWidgets} />
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* Right Inspector Panel */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <InspectorPanel
            selectedWidget={selectedWidget}
            onWidgetConfigure={(widget) => {
              const updated = widgets.map((w) => (w.id === widget.id ? widget : w))
              setWidgets(updated)
            }}
          />
        </Panel>
      </PanelGroup>

      {/* Floating UI Elements */}
      <FloatingChatDock />
      <CommandPalette />
      <NotificationCenter />
    </div>
  )
}
