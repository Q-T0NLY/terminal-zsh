"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"

// Components
import { EnhancedTopBar } from "./enhanced-top-bar"
import { TabManager } from "./tab-manager"
import { ThemeGallery } from "../theme/theme-gallery"
import { AdvancedGridSystem } from "../widgets/advanced-grid-system"
import { InspectorPanel } from "./inspector-panel"
import { QuickActionsPanel } from "./quick-actions-panel"
import { SystemStatusWidget } from "./system-status-widget"
import { ConfigBasedTabRenderer } from "./config-based-tab-renderer"

// Panel Components
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

// Hooks
import { useTabManager } from "@/lib/hooks/use-tab-manager"
import { useWidgetManager } from "@/lib/hooks/use-widget-manager"
import { useTheme } from "@/lib/contexts/theme-context"

const CORE_TABS = [
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
  {
    id: "integration_hub",
    name: "🔌 Integration Hub",
    icon: "🔌",
    component: () => <ConfigBasedTabRenderer tabId="integration_hub" />,
  },
  {
    id: "admin_center",
    name: "👑 Admin Center",
    icon: "👑",
    component: () => <ConfigBasedTabRenderer tabId="admin_center" />,
  },
]

export function UltimateDashboard() {
  const [activeTab, setActiveTab] = useState("control")
  const [showThemeGallery, setShowThemeGallery] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedWidget, setSelectedWidget] = useState(null)

  const { theme, dashboardTheme, setDashboardTheme } = useTheme()
  const { tabs, addTab, removeTab, reorderTabs, updateTab, initializeTabs } = useTabManager()
  const { widgets, addWidget, removeWidget, updateWidget } = useWidgetManager()

  useEffect(() => {
    initializeTabs(CORE_TABS)
  }, [initializeTabs])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  const ActivePanel = tabs.find((tab) => tab.id === activeTab)?.component || AgentControlBoard

  return (
    <motion.div className="ultimate-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Global Top Bar */}
      <EnhancedTopBar onThemeGalleryOpen={() => setShowThemeGallery(true)} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setDragActive(true)}
        onDragEnd={(event) => {
          setDragActive(false)
          const { active, over } = event

          if (active.id !== over?.id) {
            const oldIndex = tabs.findIndex((t) => t.id === active.id)
            const newIndex = tabs.findIndex((t) => t.id === over?.id)
            if (oldIndex !== -1 && newIndex !== -1) {
              reorderTabs(oldIndex, newIndex)
            }
          }
        }}
      >
        <PanelGroup direction="horizontal" className="main-content">
          {/* Left Navigation & Tab Manager */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="sidebar-panel">
            <div className="sidebar-container">
              <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
                <TabManager
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onTabAdd={addTab}
                  onTabRemove={removeTab}
                  onTabEdit={updateTab}
                />
              </SortableContext>

              <QuickActionsPanel />
              <SystemStatusWidget />
            </div>
          </Panel>

          <PanelResizeHandle className="resize-handle">
            <div className="resize-indicator" />
          </PanelResizeHandle>

          {/* Main Content Area */}
          <Panel minSize={50} className="main-panel">
            <AdvancedGridSystem
              tabId={activeTab}
              widgets={widgets.filter((w) => w.tabId === activeTab)}
              onWidgetsChange={(newWidgets) => {
                newWidgets.forEach((w) => updateWidget(w.id, w))
              }}
              onWidgetAdd={addWidget}
              onWidgetRemove={removeWidget}
              onWidgetSelect={setSelectedWidget}
            >
              <ActivePanel
                widgets={widgets.filter((w) => w.tabId === activeTab)}
                onWidgetsChange={(newWidgets) => {
                  newWidgets.forEach((w) => updateWidget(w.id, w))
                }}
              />
            </AdvancedGridSystem>
          </Panel>

          <PanelResizeHandle className="resize-handle">
            <div className="resize-indicator" />
          </PanelResizeHandle>

          {/* Right Inspector Panel */}
          <Panel defaultSize={20} minSize={15} maxSize={30} className="inspector-panel">
            <InspectorPanel
              selectedWidget={selectedWidget}
              onWidgetConfigure={(widget) => updateWidget(widget.id, widget)}
            />
          </Panel>
        </PanelGroup>

        <DragOverlay>
          {dragActive && (
            <motion.div
              className="tab-drag-overlay"
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Dragging...
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Theme Gallery Modal */}
      <AnimatePresence>
        {showThemeGallery && (
          <ThemeGallery
            currentTheme={dashboardTheme}
            onThemeSelect={setDashboardTheme}
            onClose={() => setShowThemeGallery(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
