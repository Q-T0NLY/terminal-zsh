"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DASHBOARD_TABS_CONFIG, type WidgetConfig } from "@/lib/config/dashboard-tabs-config"

interface ConfigBasedTabRendererProps {
  tabId: string
  className?: string
}

function WidgetRenderer({ widget }: { widget: WidgetConfig }) {
  const chartType = widget.chart_type

  const renderWidget = () => {
    switch (chartType) {
      // Existing chart types
      case "status_grid":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded border border-green-500/30 flex items-center justify-center text-xs font-mono"
                >
                  Status {i}
                </div>
              ))}
            </div>
          </div>
        )
      case "multi_line":
        return (
          <div className="h-48 bg-gradient-to-b from-blue-500/10 to-transparent rounded border border-blue-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📈</div>
              Multi-line Chart
            </div>
          </div>
        )
      case "plugin_catalog":
        return (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="font-mono text-xs text-muted-foreground mb-2">Plugin {i}</div>
                <div className="h-20 bg-muted rounded flex items-center justify-center text-xs">Connector</div>
              </div>
            ))}
          </div>
        )
      case "indicators":
        return (
          <div className="grid grid-cols-2 gap-3">
            {["CPU", "Memory", "Disk", "Network"].map((label) => (
              <div
                key={label}
                className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded border border-purple-500/20"
              >
                <div className="text-xs text-muted-foreground mb-2">{label}</div>
                <div className="text-2xl font-bold text-primary">85%</div>
              </div>
            ))}
          </div>
        )
      case "chat_actions":
        return (
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-sm">
              💬 Billing Assistant Ready
            </div>
            <div className="p-3 bg-green-500/10 rounded border border-green-500/20 text-sm">
              ✓ Last sync: 2 minutes ago
            </div>
          </div>
        )

      // New chart types for licensing, reports, backup, notifications, security, scheduler, workflow, messaging, tokenization
      case "donut_timeline":
        return (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-violet-500/30 border-t-violet-500 mx-auto mb-3 animate-spin" />
              <div className="text-sm text-muted-foreground">License Status</div>
            </div>
          </div>
        )
      case "drag_drop_canvas":
        return (
          <div className="h-64 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded border-2 border-dashed border-slate-600/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-sm text-muted-foreground">Drag & Drop Report Builder</div>
            </div>
          </div>
        )
      case "text_generator":
        return (
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-sm leading-relaxed">
              AI-generated insights about your data patterns and trends...
            </div>
          </div>
        )
      case "calendar_status":
        return (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded text-xs flex items-center justify-center ${
                  Math.random() > 0.5
                    ? "bg-green-500/30 border border-green-500/50"
                    : "bg-slate-500/20 border border-slate-500/30"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )
      case "step_flow":
        return (
          <div className="flex items-center justify-between px-4 py-6">
            {["Start", "Validate", "Execute", "Verify", "Complete"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-violet-500/30 border border-violet-500/50 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                {i < 4 && <div className="w-8 h-0.5 bg-violet-500/30 mx-2" />}
              </div>
            ))}
          </div>
        )
      case "heatmap_matrix":
        return (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: 8 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="flex-1 h-6 rounded"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8})`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      case "urgency_bars":
        return (
          <div className="space-y-2">
            {["Critical", "High", "Medium", "Low"].map((level, i) => (
              <div key={level} className="flex items-center gap-2">
                <div className="text-xs font-mono w-12">{level}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className={`h-full ${
                      i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(4 - i) * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "line_map":
        return (
          <div className="h-40 bg-gradient-to-b from-blue-500/10 to-transparent rounded border border-blue-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">🗺️</div>
              Message Flow Visualization
            </div>
          </div>
        )
      case "grid_permissions":
        return (
          <div className="space-y-2">
            {["Admin", "Operator", "Analyst"].map((role) => (
              <div key={role} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded">
                <div className="text-xs font-mono w-16">{role}</div>
                <div className="flex gap-2">
                  {["Read", "Write", "Delete"].map((perm) => (
                    <div
                      key={perm}
                      className="w-6 h-6 rounded border border-slate-500/50 flex items-center justify-center text-xs"
                    >
                      {Math.random() > 0.3 ? "✓" : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case "risk_matrix":
        return (
          <div className="grid grid-cols-3 gap-2">
            {["Low", "Medium", "High"].map((risk) => (
              <div
                key={risk}
                className={`p-4 rounded text-center text-sm font-mono ${
                  risk === "Low"
                    ? "bg-green-500/20 border border-green-500/50"
                    : risk === "Medium"
                      ? "bg-yellow-500/20 border border-yellow-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                {risk}
                <div className="text-2xl font-bold mt-2">{Math.floor(Math.random() * 10)}</div>
              </div>
            ))}
          </div>
        )
      case "timeline_stream":
        return (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <div className="flex-1 p-2 bg-slate-700/30 rounded text-xs">
                  <div className="font-mono text-muted-foreground">Event {i + 1}</div>
                  <div className="text-xs text-muted-foreground/70">2 minutes ago</div>
                </div>
              </div>
            ))}
          </div>
        )
      case "calendar_view":
        return (
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-mono text-muted-foreground mb-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded text-xs flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${
                  Math.random() > 0.6
                    ? "bg-blue-500/30 border border-blue-500/50"
                    : "bg-slate-500/20 border border-slate-500/30"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )
      case "cron_builder":
        return (
          <div className="space-y-3 p-3 bg-slate-700/30 rounded">
            <div className="text-xs font-mono text-muted-foreground">Cron Expression</div>
            <div className="font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-600/50">
              0 0 * * * (Daily at midnight)
            </div>
          </div>
        )
      case "gantt_exec":
        return (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-xs font-mono w-20">Job {i + 1}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${30 + i * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "policy_matrix":
        return (
          <div className="grid grid-cols-3 gap-2">
            {["Max Retries", "Backoff", "Timeout"].map((policy) => (
              <div key={policy} className="p-3 bg-slate-700/30 rounded text-center">
                <div className="text-xs text-muted-foreground mb-1">{policy}</div>
                <div className="text-lg font-bold text-primary">{Math.floor(Math.random() * 10) + 1}</div>
              </div>
            ))}
          </div>
        )
      case "interactive_d3":
        return (
          <div className="h-64 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded border border-slate-600/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-sm text-muted-foreground">Interactive D3 Visualization</div>
            </div>
          </div>
        )
      case "node_palette":
        return (
          <div className="grid grid-cols-2 gap-2">
            {["Trigger", "Action", "Condition", "Loop"].map((node) => (
              <div
                key={node}
                className="p-3 bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded border border-violet-500/30 cursor-move hover:border-violet-500/50 transition-colors text-center text-xs font-mono"
              >
                {node}
              </div>
            ))}
          </div>
        )
      case "logic_tree":
        return (
          <div className="space-y-2 p-3 bg-slate-700/30 rounded">
            <div className="text-xs font-mono text-muted-foreground">IF condition THEN action</div>
            <div className="text-sm text-muted-foreground">Build complex logic flows</div>
          </div>
        )
      case "mock_runner":
        return (
          <div className="space-y-2">
            <div className="p-2 bg-green-500/10 rounded border border-green-500/20 text-xs">✓ Test passed: 2.3ms</div>
            <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-xs">→ Running test 2...</div>
          </div>
        )
      case "comparison_chart":
        return (
          <div className="space-y-2">
            {["Option A", "Option B", "Option C"].map((opt) => (
              <div key={opt} className="flex items-center gap-2">
                <div className="text-xs font-mono w-16">{opt}</div>
                <div className="flex-1 h-4 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "real_time_bars":
        return (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-xs font-mono w-12">Q{i + 1}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "throughput_line":
        return (
          <div className="h-40 bg-gradient-to-b from-green-500/10 to-transparent rounded border border-green-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📊</div>
              Throughput Analytics
            </div>
          </div>
        )
      case "latency_heatmap":
        return (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: 12 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="flex-1 h-4 rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.8})`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      case "dlq_alerts":
        return (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-2 bg-red-500/10 rounded border border-red-500/20 text-xs">
                ⚠️ Dead letter message {i + 1}
              </div>
            ))}
          </div>
        )
      case "timeline_replay":
        return (
          <div className="space-y-3 p-3 bg-slate-700/30 rounded">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-500/30 rounded text-xs hover:bg-blue-500/50">▶ Replay</button>
              <div className="flex-1 h-2 bg-slate-600/50 rounded overflow-hidden">
                <div className="h-full w-1/3 bg-blue-500" />
              </div>
            </div>
          </div>
        )
      case "encryption_grid":
        return (
          <div className="grid grid-cols-2 gap-2">
            {["Encrypted", "Unencrypted"].map((status) => (
              <div
                key={status}
                className={`p-3 rounded text-center text-xs font-mono ${
                  status === "Encrypted"
                    ? "bg-green-500/20 border border-green-500/50"
                    : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                {status}
              </div>
            ))}
          </div>
        )
      case "projection_charts":
        return (
          <div className="h-32 bg-gradient-to-b from-orange-500/10 to-transparent rounded border border-orange-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📈</div>
              Cost Projections
            </div>
          </div>
        )
      case "progress_rings":
        return (
          <div className="grid grid-cols-2 gap-4">
            {["Quota 1", "Quota 2"].map((quota) => (
              <div key={quota} className="flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-slate-600"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${Math.random() * 220} 220`}
                      className="text-violet-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {Math.floor(Math.random() * 100)}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{quota}</div>
              </div>
            ))}
          </div>
        )
      case "digital_counter":
        return (
          <div className="p-6 bg-slate-900/50 rounded border border-slate-600/50 text-center">
            <div className="text-xs text-muted-foreground mb-2">Credit Balance</div>
            <div className="text-4xl font-mono font-bold text-green-500">$1,234.56</div>
          </div>
        )
      case "live_scroll":
        return (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-xs p-1 bg-slate-700/30 rounded font-mono">
                Token consumption: {Math.floor(Math.random() * 1000)} tokens
              </div>
            ))}
          </div>
        )
      case "live_price_graphs":
        return (
          <div className="h-40 bg-gradient-to-b from-green-500/10 to-transparent rounded border border-green-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">💹</div>
              Live Price Data
            </div>
          </div>
        )
      case "density_plot":
        return (
          <div className="h-32 bg-gradient-to-b from-purple-500/10 to-transparent rounded border border-purple-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📊</div>
              Outlier Analysis
            </div>
          </div>
        )
      case "knowledge_graph":
        return (
          <div className="h-48 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded border border-slate-600/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-sm text-muted-foreground">Knowledge Graph Visualization</div>
            </div>
          </div>
        )
      case "donut_chart":
        return (
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-8 border-violet-500/30 border-t-violet-500 mx-auto mb-3" />
              <div className="text-sm text-muted-foreground">Agent Distribution</div>
            </div>
          </div>
        )
      case "gantt_chart":
        return (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-xs font-mono w-20">Activity {i + 1}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${40 + i * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "radial_progress":
        return (
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-600"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="220 352"
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">92%</div>
                  <div className="text-xs text-muted-foreground">Health</div>
                </div>
              </div>
            </div>
          </div>
        )
      case "mini_bars_sparklines":
        return (
          <div className="space-y-2">
            {["Latency", "Throughput", "Errors"].map((metric) => (
              <div key={metric} className="flex items-center gap-2">
                <div className="text-xs font-mono w-16">{metric}</div>
                <div className="flex-1 flex gap-0.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-4 bg-blue-500/30 rounded-sm"
                      style={{ height: `${Math.random() * 16 + 4}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case "matrix_version_list":
        return (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-700/30 rounded text-xs">
                <div className="font-mono">Agent v{i + 1}.0.0</div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-blue-500/30 rounded hover:bg-blue-500/50">Clone</button>
                  <button className="px-2 py-1 bg-green-500/30 rounded hover:bg-green-500/50">Sync</button>
                </div>
              </div>
            ))}
          </div>
        )
      case "time_series_alert":
        return (
          <div className="h-40 bg-gradient-to-b from-red-500/10 to-transparent rounded border border-red-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">⚠️</div>
              Queue Backlog Alert
            </div>
          </div>
        )
      case "digital_gauges":
        return (
          <div className="grid grid-cols-2 gap-3">
            {["CPU", "GPU"].map((gauge) => (
              <div key={gauge} className="p-3 bg-slate-700/30 rounded text-center">
                <div className="text-xs text-muted-foreground mb-2">{gauge}</div>
                <div className="text-3xl font-bold text-primary">{Math.floor(Math.random() * 100)}%</div>
              </div>
            ))}
          </div>
        )
      case "pipeline_graph":
        return (
          <div className="space-y-3 p-3 bg-slate-700/30 rounded">
            {["Build", "Test", "Deploy", "Monitor"].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/30 border border-green-500/50 flex items-center justify-center text-xs">
                  ✓
                </div>
                <div className="text-xs font-mono">{stage}</div>
              </div>
            ))}
          </div>
        )
      case "led_avatar_grid":
        return (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-500/50 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <div className="text-xs text-muted-foreground">Agent {i + 1}</div>
              </div>
            ))}
          </div>
        )
      case "stacked_bar":
        return (
          <div className="space-y-2">
            {["Agent A", "Agent B", "Agent C"].map((agent) => (
              <div key={agent} className="flex items-center gap-2">
                <div className="text-xs font-mono w-16">{agent}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden flex">
                  <div className="flex-1 bg-blue-500/60" />
                  <div className="flex-1 bg-purple-500/60" />
                  <div className="flex-1 bg-pink-500/60" />
                </div>
              </div>
            ))}
          </div>
        )
      case "network_graph":
        return (
          <div className="h-48 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded border border-slate-600/50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-sm text-muted-foreground">Load Balancer Network</div>
            </div>
          </div>
        )
      case "status_toggle_cards":
        return (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-3 bg-slate-700/30 rounded border border-slate-600/50 flex items-center justify-between"
              >
                <div className="text-xs font-mono">Agent {i + 1}</div>
                <button className="px-2 py-1 bg-green-500/30 rounded text-xs hover:bg-green-500/50">
                  {i % 2 === 0 ? "Stop" : "Start"}
                </button>
              </div>
            ))}
          </div>
        )
      case "composite_score":
        return (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-violet-500 mb-2">87.5</div>
              <div className="text-sm text-muted-foreground">Performance Score</div>
            </div>
          </div>
        )
      case "box_hist":
        return (
          <div className="h-40 bg-gradient-to-b from-blue-500/10 to-transparent rounded border border-blue-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📊</div>
              Latency Distribution
            </div>
          </div>
        )
      case "ai_cards":
        return (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-3 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded border border-violet-500/20"
              >
                <div className="text-xs font-mono text-muted-foreground mb-1">Insight {i + 1}</div>
                <div className="text-sm text-muted-foreground">AI-generated insight about system performance...</div>
              </div>
            ))}
          </div>
        )
      case "digital_led_sparkline":
        return (
          <div className="flex items-center gap-3">
            <div className="text-3xl font-mono font-bold text-green-500">42</div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-green-500/50 rounded-sm"
                  style={{ height: `${Math.random() * 16 + 4}px` }}
                />
              ))}
            </div>
          </div>
        )
      case "bar_percentile":
        return (
          <div className="space-y-2">
            {["p50", "p75", "p95", "p99"].map((percentile) => (
              <div key={percentile} className="flex items-center gap-2">
                <div className="text-xs font-mono w-12">{percentile}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "donut_trend":
        return (
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-8 border-green-500/30 border-t-green-500 mx-auto mb-3 animate-spin" />
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        )
      case "radar_chart":
        return (
          <div className="h-40 bg-gradient-to-b from-purple-500/10 to-transparent rounded border border-purple-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">🎯</div>
              Confidence Radar
            </div>
          </div>
        )
      case "heatmap_forecast":
        return (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: 12 }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="flex-1 h-4 rounded"
                    style={{
                      backgroundColor: `rgba(168, 85, 247, ${Math.random() * 0.8})`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      case "status_dial":
        return (
          <div className="flex items-center justify-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-600"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="180 220"
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">92%</div>
            </div>
          </div>
        )
      case "gradient_bar":
        return (
          <div className="space-y-3">
            {["Model A", "Model B", "Model C"].map((model) => (
              <div key={model} className="flex items-center gap-2">
                <div className="text-xs font-mono w-16">{model}</div>
                <div className="flex-1 h-6 bg-slate-700/50 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )
      case "scatter_forecast":
        return (
          <div className="h-40 bg-gradient-to-b from-red-500/10 to-transparent rounded border border-red-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">⚠️</div>
              Incident Forecast
            </div>
          </div>
        )
      case "area_rate":
        return (
          <div className="h-40 bg-gradient-to-b from-cyan-500/10 to-transparent rounded border border-cyan-500/20 flex items-center justify-center">
            <div className="text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">📈</div>
              Token Throughput Rate
            </div>
          </div>
        )
      case "gauge_trend":
        return (
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-600"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray="180 251"
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">72%</div>
            </div>
          </div>
        )
      case "card_grid":
        return (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg border border-slate-600/50 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-mono text-muted-foreground mb-2">Extension {i + 1}</div>
                <div className="h-16 bg-slate-900/50 rounded flex items-center justify-center text-xs">
                  {i % 2 === 0 ? "🔌" : "⚙️"}
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="h-32 bg-muted rounded border border-border flex items-center justify-center text-sm text-muted-foreground">
            {chartType} Widget
          </div>
        )
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{widget.name}</CardTitle>
          <CardDescription className="text-xs">
            {widget.data_binding.source} • Refresh: {widget.settings.refresh_interval}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderWidget()}</CardContent>
      </Card>
    </motion.div>
  )
}

export function ConfigBasedTabRenderer({ tabId, className = "" }: ConfigBasedTabRendererProps) {
  const tabConfig = useMemo(() => {
    return Object.values(DASHBOARD_TABS_CONFIG).find((tab) => tab.tab_id === tabId)
  }, [tabId])

  if (!tabConfig) {
    return (
      <div className={`p-6 text-center text-muted-foreground ${className}`}>Tab configuration not found: {tabId}</div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{tabConfig.tab_name}</h2>
        <p className="text-sm text-muted-foreground mt-1">{tabConfig.purpose}</p>
      </div>

      <div className="grid gap-4 auto-rows-max">
        {tabConfig.widgets.map((widget) => (
          <div
            key={widget.widget_id}
            style={{
              gridColumn: `span ${Math.min(widget.layout.w, 12)}`,
              gridRow: `span ${widget.layout.h}`,
            }}
          >
            <WidgetRenderer widget={widget} />
          </div>
        ))}
      </div>
    </div>
  )
}
