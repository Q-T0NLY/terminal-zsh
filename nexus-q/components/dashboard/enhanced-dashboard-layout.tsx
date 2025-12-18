"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { EnhancedTopBar } from "./enhanced-top-bar"
import { GlobalMetricsRow } from "./global-metrics-row"
import { AgentHealthPanel } from "./agent-health-panel"
import { LiveArchitectCanvas } from "./live-architect-canvas"
import { TraceAndLogsPanel } from "./trace-and-logs-panel"
import { InspectorPanel } from "./inspector-panel"
import { LeftPalette } from "./left-palette"
import { useWebSocketChannels } from "@/lib/hooks/use-websocket-channels"
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts"

export function EnhancedDashboardLayout() {
  const [environment, setEnvironment] = useState("dev")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  const { metrics, events, traces, subscribe } = useWebSocketChannels()

  useEffect(() => {
    subscribe("telemetry")
    subscribe("workflow.events")
    subscribe("agent.health")
  }, [subscribe])

  useKeyboardShortcuts({
    onOpenGenerator: () => console.log("[v0] Open generator"),
    onOpenSearch: () => setShowSearch(true),
    onToggleDebug: () => setDebugMode((prev) => !prev),
    onEscape: () => setShowSearch(false),
  })

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <EnhancedTopBar environment={environment} onEnvironmentChange={setEnvironment} healthStatus="healthy" />

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r overflow-auto">
            <LeftPalette />
            <AgentHealthPanel />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        <Panel minSize={30}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={40}>
              <div className="p-4 h-full overflow-auto">
                <GlobalMetricsRow metrics={metrics} />
                <LiveArchitectCanvas onSelectNode={setSelectedNode} selectedNode={selectedNode} />
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 bg-border hover:bg-primary transition-colors" />

            <Panel defaultSize={30} minSize={20}>
              <TraceAndLogsPanel events={events} traces={traces} />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        <Panel defaultSize={25} minSize={20} maxSize={35}>
          <InspectorPanel nodeId={selectedNode} />
        </Panel>
      </PanelGroup>

      {debugMode && (
        <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg">
          <div className="text-xs font-mono">
            <div>Debug Mode: ON</div>
            <div>Selected: {selectedNode || "none"}</div>
            <div>Events: {events.length}</div>
          </div>
        </div>
      )}
    </div>
  )
}
