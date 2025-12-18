"use client"

import { useState } from "react"

const tabs = [
  { id: "executive", name: "Executive Intelligence Dashboard", icon: "🏠" },
  { id: "agent-lifecycle", name: "Agent Lifecycle Management", icon: "👥" },
  { id: "resource-cost", name: "Resource & Cost Intelligence", icon: "💰" },
  { id: "runtime", name: "Runtime Orchestrator", icon: "🔄" },
  { id: "messaging", name: "Event & Messaging Streams", icon: "💬" },
  { id: "scheduler", name: "Automation Scheduler", icon: "📅" },
  { id: "workflow", name: "Workflow Designer", icon: "⚡" },
  { id: "integrations", name: "Integrations Hub", icon: "🔌" },
  { id: "notifications", name: "Alerts & Notifications Hub", icon: "🔔" },
  { id: "analytics", name: "Analytics & Insights", icon: "📊" },
  { id: "security", name: "Security & Audit Center", icon: "🛡️" },
  { id: "diagnostics", name: "Diagnostics & Health Monitor", icon: "📈" },
  { id: "optimization", name: "Optimization & AI Learning Lab", icon: "🚀" },
  { id: "reports", name: "Reports & Exports", icon: "📄" },
  { id: "backup", name: "Backup & Recovery", icon: "💾" },
  { id: "config", name: "System Configurations", icon: "⚙️" },
  { id: "admin", name: "Admin & Governance", icon: "👤" },
  { id: "marketplace", name: "Extensions Marketplace & Builder", icon: "📦" },
  { id: "testing", name: "Testing & Debugging Suite", icon: "🐛" },
  { id: "deployment", name: "Deployment & Lifecycle Management", icon: "🚀" },
  { id: "development", name: "Development Hub", icon: "💻" },
  { id: "governance", name: "Governance & Security Console", icon: "🔒" },
  { id: "licensing", name: "Licensing & Subscription Center", icon: "🔑" },
  { id: "theme", name: "Theme & UI Designer", icon: "🎨" },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("executive")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-[#0E0F13]">
      <aside
        className={`bg-[#1A1B23] border-r border-[#2A2B33] transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-72"}`}
      >
        <div className="p-4 border-b border-[#2A2B33] flex items-center justify-between">
          {!sidebarCollapsed && <h2 className="font-bold text-[#6E63FF] text-lg">Nexus Quantum</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-[#2A2B33] rounded text-[#E6EEF6]"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100vh-73px)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded mb-1 transition-colors ${
                activeTab === tab.id ? "bg-[#6E63FF] text-white" : "text-[#E6EEF6] hover:bg-[#2A2B33]"
              }`}
              title={sidebarCollapsed ? tab.name : undefined}
            >
              <span className="text-lg flex-shrink-0">{tab.icon}</span>
              {!sidebarCollapsed && <span className="text-sm">{tab.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "executive" && <ExecutiveIntelligenceDashboard />}
          {activeTab === "agent-lifecycle" && <AgentLifecycleManagement />}
          {activeTab === "resource-cost" && <ResourceCostIntelligence />}
          {activeTab === "runtime" && <RuntimeOrchestrator />}
          {activeTab === "messaging" && <EventMessagingStreams />}
          {activeTab === "scheduler" && <AutomationScheduler />}
          {activeTab === "workflow" && <WorkflowDesigner />}
          {activeTab === "integrations" && <IntegrationsHub />}
          {activeTab === "notifications" && <AlertsNotificationsHub />}
          {activeTab === "analytics" && <AnalyticsInsights />}
          {activeTab === "security" && <SecurityAuditCenter />}
          {activeTab === "diagnostics" && <DiagnosticsHealthMonitor />}
          {activeTab === "optimization" && <OptimizationAILearningLab />}
          {activeTab === "reports" && <ReportsExports />}
          {activeTab === "backup" && <BackupRecovery />}
          {activeTab === "config" && <SystemConfigurations />}
          {activeTab === "admin" && <AdminGovernance />}
          {activeTab === "marketplace" && <ExtensionsMarketplace />}
          {activeTab === "testing" && <TestingDebuggingSuite />}
          {activeTab === "deployment" && <DeploymentLifecycleManagement />}
          {activeTab === "development" && <DevelopmentHub />}
          {activeTab === "governance" && <GovernanceSecurityConsole />}
          {activeTab === "licensing" && <LicensingSubscriptionCenter />}
          {activeTab === "theme" && <ThemeUIDesigner />}
        </div>
      </main>
    </div>
  )
}

function ExecutiveIntelligenceDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Executive Intelligence Dashboard</h1>
      <p className="text-[#9CA3AF] mb-8">Global KPIs, operational pulse, AI confidence and security posture</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Active Agents Counter */}
        <div className="col-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-2">Active Agents</h3>
          <p className="text-4xl font-bold text-[#6E63FF] mb-2">12</p>
          <div className="h-8 flex items-end gap-0.5">
            {[4, 6, 5, 7, 8, 9, 10, 11, 12, 12].map((val, i) => (
              <div key={i} className="flex-1 bg-[#6E63FF]/30 rounded-t" style={{ height: `${(val / 12) * 100}%` }} />
            ))}
          </div>
        </div>

        {/* Workflows Running */}
        <div className="col-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-2">Workflows Running</h3>
          <p className="text-4xl font-bold text-[#38BDF8] mb-2">8</p>
          <p className="text-sm text-[#34C759]">↑ 15% vs yesterday</p>
        </div>

        {/* Success Rate */}
        <div className="col-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-2">Success Rate</h3>
          <p className="text-4xl font-bold text-[#34C759] mb-2">99.2%</p>
          <p className="text-sm text-[#9CA3AF]">Last 24 hours</p>
        </div>

        {/* Avg Latency */}
        <div className="col-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-2">Avg Latency</h3>
          <p className="text-4xl font-bold text-[#E6EEF6] mb-2">245ms</p>
          <p className="text-sm text-[#9CA3AF]">P95: 380ms</p>
        </div>

        {/* Token Throughput */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Token Throughput</h3>
          <div className="h-32 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80, 75, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-[#6E63FF] to-[#38BDF8] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
          <p className="text-sm text-[#9CA3AF] mt-2">1.2K tokens/sec</p>
        </div>

        {/* AI Confidence Score */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">AI Confidence Score</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-[#6E63FF]">94.7%</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">Precision</p>
              <p className="text-2xl font-bold text-[#38BDF8]">92.3%</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">Recall</p>
              <p className="text-2xl font-bold text-[#34C759]">91.8%</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">F1 Score</p>
              <p className="text-2xl font-bold text-[#E6EEF6]">92.0%</p>
            </div>
          </div>
        </div>

        {/* Security Posture */}
        <div className="col-span-4 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Security Posture</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2B33" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#34C759"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="25.12"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#34C759]">90%</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Threats Blocked</span>
              <span className="text-[#E6EEF6]">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Vulnerabilities</span>
              <span className="text-[#FF3B30]">2</span>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="col-span-8 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Live Activity Feed</h3>
          <div className="space-y-3">
            {[
              { time: "2m ago", event: "Agent-Alpha completed task", status: "success" },
              { time: "5m ago", event: "Workflow deployed to production", status: "success" },
              { time: "8m ago", event: "Security scan completed", status: "warning" },
              { time: "12m ago", event: "Agent-Beta training started", status: "info" },
              { time: "15m ago", event: "API rate limit reached", status: "error" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === "success"
                      ? "bg-[#34C759]"
                      : item.status === "warning"
                        ? "bg-[#F59E0B]"
                        : item.status === "error"
                          ? "bg-[#FF3B30]"
                          : "bg-[#38BDF8]"
                  }`}
                />
                <span className="text-[#9CA3AF]">{item.time}</span>
                <span className="text-[#E6EEF6]">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AgentLifecycleManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Agent Lifecycle Management</h1>
      <p className="text-[#9CA3AF] mb-8">
        End-to-end agent operations, creation, training, deployment and optimization
      </p>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 row-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Create Agent Wizard</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              {["Basic", "Config", "Deploy"].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-[#6E63FF] text-white" : "bg-[#2A2B33] text-[#9CA3AF]"}`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm text-[#E6EEF6]">{step}</span>
                  {i < 2 && <div className="w-8 h-0.5 bg-[#2A2B33]" />}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-[#9CA3AF] mb-1 block">Agent Name</label>
                <input
                  type="text"
                  className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6]"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label className="text-sm text-[#9CA3AF] mb-1 block">Template</label>
                <select className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6]">
                  <option>Basic</option>
                  <option>NLP</option>
                  <option>Vision</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#9CA3AF] mb-1 block">Description</label>
                <textarea
                  className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] h-24"
                  placeholder="Describe agent purpose..."
                />
              </div>
            </div>
            <button className="w-full bg-[#6E63FF] text-white py-2 rounded hover:bg-[#5952CC] transition-colors">
              Create Agent
            </button>
          </div>
        </div>

        <div className="col-span-6 row-span-3 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Model Trainer</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Training Loss</p>
              <p className="text-2xl font-bold text-[#6E63FF]">0.0234</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-[#34C759]">94.7%</p>
            </div>
          </div>
          <div className="h-32 flex items-end gap-1 mb-4">
            {[0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.12, 0.1, 0.08, 0.05].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-[#6E63FF] rounded-t" style={{ height: `${val * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Epoch</span>
              <span className="text-[#E6EEF6]">12/50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Batch Size</span>
              <span className="text-[#E6EEF6]">32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">Learning Rate</span>
              <span className="text-[#E6EEF6]">0.001</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Training Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2B33]">
                  <th className="text-left py-2 text-[#9CA3AF]">Agent</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Status</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Progress</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Priority</th>
                  <th className="text-left py-2 text-[#9CA3AF]">ETA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Agent-Alpha", status: "Training", progress: 75, priority: "High", eta: "2h" },
                  { name: "Agent-Beta", status: "Queued", progress: 0, priority: "Medium", eta: "4h" },
                  { name: "Agent-Gamma", status: "Training", progress: 45, priority: "High", eta: "3h" },
                  { name: "Agent-Delta", status: "Queued", progress: 0, priority: "Low", eta: "6h" },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-[#2A2B33]/50">
                    <td className="py-3 text-[#E6EEF6]">{item.name}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${item.status === "Training" ? "bg-[#6E63FF]/20 text-[#6E63FF]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#2A2B33] rounded-full h-2">
                          <div className="bg-[#6E63FF] h-2 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-[#9CA3AF] text-xs">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${item.priority === "High" ? "bg-[#FF3B30]/20 text-[#FF3B30]" : item.priority === "Medium" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 text-[#9CA3AF]">{item.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceCostIntelligence() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Resource & Cost Intelligence</h1>
      <p className="text-[#9CA3AF] mb-8">Financial tracking, resource consumption, chargeback and ROI analysis</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Token Economics Dashboard */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Token Economics Dashboard</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Total Consumed</p>
              <p className="text-2xl font-bold text-[#6E63FF]">2.4M</p>
              <p className="text-xs text-[#34C759]">↑ 12% vs last week</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Cost per Token</p>
              <p className="text-2xl font-bold text-[#E6EEF6]">$0.0023</p>
            </div>
          </div>
          <div className="h-32 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-[#6E63FF] to-[#38BDF8] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF]">Monthly Spend</span>
              <span className="text-2xl font-bold text-[#E6EEF6]">$5,420</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF]">Budget Remaining</span>
              <span className="text-lg font-semibold text-[#34C759]">$4,580</span>
            </div>
            <div className="bg-[#2A2B33] rounded-full h-3">
              <div className="bg-[#6E63FF] h-3 rounded-full" style={{ width: "54%" }} />
            </div>
            <p className="text-xs text-[#9CA3AF]">54% of monthly budget used</p>
          </div>
        </div>

        {/* Cost Allocation by Agent */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Cost Allocation by Agent</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2B33]">
                  <th className="text-left py-2 text-[#9CA3AF]">Agent</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Tokens Used</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Cost</th>
                  <th className="text-left py-2 text-[#9CA3AF]">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Agent-Alpha", tokens: "850K", cost: "$1,955", percent: 36 },
                  { name: "Agent-Beta", tokens: "620K", cost: "$1,426", percent: 26 },
                  { name: "Agent-Gamma", tokens: "480K", cost: "$1,104", percent: 20 },
                  { name: "Agent-Delta", tokens: "450K", cost: "$1,035", percent: 18 },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-[#2A2B33]/50">
                    <td className="py-3 text-[#E6EEF6]">{item.name}</td>
                    <td className="py-3 text-[#9CA3AF]">{item.tokens}</td>
                    <td className="py-3 text-[#E6EEF6] font-semibold">{item.cost}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#2A2B33] rounded-full h-2 max-w-[100px]">
                          <div className="bg-[#6E63FF] h-2 rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                        <span className="text-[#9CA3AF] text-xs">{item.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function RuntimeOrchestrator() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Runtime Orchestrator</h1>
      <p className="text-[#9CA3AF] mb-8">Visualize process flows, dependencies and identify bottlenecks</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Process Flow Visualization */}
        <div className="col-span-8 row-span-2 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Process Flow Visualization</h3>
          <div className="flex items-center justify-center h-64 bg-[#0E0F13] rounded">
            <div className="flex items-center gap-8">
              {["Start", "Process", "Validate", "Deploy", "End"].map((node, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${i === 2 ? "bg-[#6E63FF] text-white" : "bg-[#2A2B33] text-[#9CA3AF]"}`}
                    >
                      {node}
                    </div>
                    {i === 2 && <span className="text-xs text-[#6E63FF] mt-2">Active</span>}
                  </div>
                  {i < 4 && <div className="w-8 h-0.5 bg-[#6E63FF]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Node Monitoring */}
        <div className="col-span-4 row-span-2 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Node Monitoring</h3>
          <div className="space-y-3">
            {[
              { name: "Node-1", status: "Running", cpu: 45, mem: 60 },
              { name: "Node-2", status: "Running", cpu: 78, mem: 82 },
              { name: "Node-3", status: "Idle", cpu: 12, mem: 25 },
            ].map((node, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#E6EEF6]">{node.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${node.status === "Running" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                  >
                    {node.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">CPU</span>
                    <span className="text-[#E6EEF6]">{node.cpu}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Memory</span>
                    <span className="text-[#E6EEF6]">{node.mem}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Queue & Latency Metrics */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Queue & Latency Metrics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Queue Depth</p>
              <p className="text-2xl font-bold text-[#6E63FF]">142</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Avg Latency</p>
              <p className="text-2xl font-bold text-[#E6EEF6]">245ms</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Throughput</p>
              <p className="text-2xl font-bold text-[#34C759]">1.2K/s</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Error Rate</p>
              <p className="text-2xl font-bold text-[#FF3B30]">0.3%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventMessagingStreams() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Event & Messaging Streams</h1>
      <p className="text-[#9CA3AF] mb-8">Monitor message queues, event throughput, latency and schema health</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Message Queue Depth */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Message Queue Depth</h3>
          <div className="h-48 flex items-end gap-2">
            {[
              { name: "Queue-A", depth: 85, status: "warning" },
              { name: "Queue-B", depth: 45, status: "normal" },
              { name: "Queue-C", depth: 92, status: "critical" },
              { name: "Queue-D", depth: 30, status: "normal" },
              { name: "Queue-E", depth: 75, status: "warning" },
            ].map((queue, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-40">
                  <div
                    className={`w-full rounded-t ${queue.status === "critical" ? "bg-[#FF3B30]" : queue.status === "warning" ? "bg-[#F59E0B]" : "bg-[#34C759]"}`}
                    style={{ height: `${queue.depth}%` }}
                  />
                </div>
                <span className="text-xs text-[#9CA3AF]">{queue.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Throughput Analytics */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Event Throughput Analytics</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Events/sec</p>
              <p className="text-2xl font-bold text-[#6E63FF]">2.4K</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Peak Rate</p>
              <p className="text-2xl font-bold text-[#38BDF8]">3.8K</p>
            </div>
          </div>
          <div className="h-24 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80, 75, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-[#6E63FF] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Message Latency Dashboard */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Message Latency Dashboard</h3>
          <div className="space-y-3">
            {[
              { percentile: "P50", value: "12ms", color: "#34C759" },
              { percentile: "P90", value: "45ms", color: "#F59E0B" },
              { percentile: "P99", value: "120ms", color: "#FF3B30" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[#9CA3AF]">{item.percentile}</span>
                <div className="flex-1 mx-4 bg-[#2A2B33] rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: "60%", backgroundColor: item.color }} />
                </div>
                <span className="text-sm font-semibold text-[#E6EEF6]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Rate Monitor */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Error Rate Monitor</h3>
          <div className="h-32 flex items-end gap-1">
            {[
              { validation: 5, timeout: 3, network: 2 },
              { validation: 4, timeout: 4, network: 1 },
              { validation: 6, timeout: 2, network: 3 },
              { validation: 3, timeout: 5, network: 2 },
              { validation: 7, timeout: 3, network: 1 },
            ].map((errors, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                <div className="bg-[#FF3B30]" style={{ height: `${errors.validation * 3}px` }} />
                <div className="bg-[#F59E0B]" style={{ height: `${errors.timeout * 3}px` }} />
                <div className="bg-[#6E63FF]" style={{ height: `${errors.network * 3}px` }} />
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FF3B30] rounded" />
              <span className="text-[#9CA3AF]">Validation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F59E0B] rounded" />
              <span className="text-[#9CA3AF]">Timeout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6E63FF] rounded" />
              <span className="text-[#9CA3AF]">Network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AutomationScheduler() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Automation Scheduler</h1>
      <p className="text-[#9CA3AF] mb-8">Job scheduling, cron management, execution tracking and alerts</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Job Calendar */}
        <div className="col-span-8 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Job Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <div key={i} className="text-center text-xs text-[#9CA3AF] py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded flex items-center justify-center text-xs ${
                  i % 7 === 0 || i % 7 === 6
                    ? "bg-[#0E0F13] text-[#9CA3AF]"
                    : i === 15
                      ? "bg-[#6E63FF] text-white"
                      : "bg-[#2A2B33] text-[#E6EEF6]"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Cron Expression Builder */}
        <div className="col-span-4 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Cron Expression Builder</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Minute</label>
              <input
                type="text"
                className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm"
                placeholder="*"
              />
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Hour</label>
              <input
                type="text"
                className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm"
                placeholder="*"
              />
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Day</label>
              <input
                type="text"
                className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm"
                placeholder="*"
              />
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Expression</p>
              <p className="text-sm font-mono text-[#6E63FF]">0 */6 * * *</p>
            </div>
          </div>
        </div>

        {/* Execution Timeline */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Execution Timeline</h3>
          <div className="space-y-2">
            {[
              { job: "Daily Backup", start: "00:00", duration: 45, status: "success" },
              { job: "Data Sync", start: "06:00", duration: 30, status: "success" },
              { job: "Report Generation", start: "12:00", duration: 60, status: "running" },
              { job: "Cleanup Task", start: "18:00", duration: 15, status: "pending" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-[#9CA3AF] w-24">{item.start}</span>
                <div className="flex-1 bg-[#2A2B33] rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full flex items-center px-3 ${
                      item.status === "success"
                        ? "bg-[#34C759]"
                        : item.status === "running"
                          ? "bg-[#6E63FF]"
                          : "bg-[#9CA3AF]"
                    }`}
                    style={{ width: `${(item.duration / 60) * 100}%` }}
                  >
                    <span className="text-xs text-white">{item.job}</span>
                  </div>
                </div>
                <span className="text-xs text-[#9CA3AF] w-16">{item.duration}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowDesigner() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Workflow Designer</h1>
      <p className="text-[#9CA3AF] mb-8">Design, test, automate and deploy workflows and reports</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Visual Canvas */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Visual Canvas</h3>
          <div className="bg-[#0E0F13] rounded h-96 flex items-center justify-center">
            <div className="flex items-center gap-8">
              {["Trigger", "Transform", "Validate", "Action", "Complete"].map((node, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-20 h-20 rounded-lg flex items-center justify-center ${
                        i === 1 ? "bg-[#6E63FF] text-white" : "bg-[#2A2B33] text-[#9CA3AF]"
                      }`}
                    >
                      <span className="text-xs">{node}</span>
                    </div>
                  </div>
                  {i < 4 && <div className="w-12 h-0.5 bg-[#6E63FF]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create & Automate Flow Wizard */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Create & Automate Flow Wizard</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Workflow Name</label>
              <input
                type="text"
                className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm"
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Template</label>
              <select className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm">
                <option>ETL</option>
                <option>Agent-Orch</option>
                <option>Notification</option>
              </select>
            </div>
            <button className="w-full bg-[#6E63FF] text-white py-2 rounded hover:bg-[#5952CC] transition-colors text-sm">
              Create Workflow
            </button>
          </div>
        </div>

        {/* Testing Console */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Testing Console</h3>
          <div className="space-y-2">
            {[
              { test: "Input Validation", status: "passed", time: "0.2s" },
              { test: "Transform Logic", status: "passed", time: "0.5s" },
              { test: "Output Format", status: "failed", time: "0.1s" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <span className="text-sm text-[#E6EEF6]">{item.test}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF]">{item.time}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${item.status === "passed" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#FF3B30]/20 text-[#FF3B30]"}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function IntegrationsHub() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Integrations Hub</h1>
      <p className="text-[#9CA3AF] mb-8">Third-party connections, auth, sync and API management</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Integration Health Dashboard */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Integration Health Dashboard</h3>
          <div className="space-y-3">
            {[
              { name: "Stripe", status: "healthy", uptime: "99.9%" },
              { name: "Grok AI", status: "healthy", uptime: "99.8%" },
              { name: "Supabase", status: "degraded", uptime: "98.5%" },
              { name: "Vercel", status: "healthy", uptime: "100%" },
            ].map((integration, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${integration.status === "healthy" ? "bg-[#34C759]" : "bg-[#F59E0B]"}`}
                  />
                  <span className="text-sm text-[#E6EEF6]">{integration.name}</span>
                </div>
                <span className="text-xs text-[#9CA3AF]">{integration.uptime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Performance Monitor */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">API Performance Monitor</h3>
          <div className="h-32 flex items-end gap-1 mb-4">
            {[45, 50, 48, 52, 55, 53, 58, 60, 57, 55, 52, 50].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-[#6E63FF] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Avg Latency</p>
              <p className="text-lg font-bold text-[#E6EEF6]">125ms</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Requests/min</p>
              <p className="text-lg font-bold text-[#6E63FF]">1.2K</p>
            </div>
          </div>
        </div>

        {/* Webhook Management Console */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Webhook Management Console</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2B33]">
                  <th className="text-left py-2 text-[#9CA3AF]">Endpoint</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Events</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Status</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Last Triggered</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { endpoint: "/webhooks/stripe", events: "payment.*", status: "active", last: "2m ago" },
                  { endpoint: "/webhooks/github", events: "push, pr", status: "active", last: "15m ago" },
                  { endpoint: "/webhooks/slack", events: "message", status: "inactive", last: "2h ago" },
                ].map((webhook, i) => (
                  <tr key={i} className="border-b border-[#2A2B33]/50">
                    <td className="py-3 text-[#E6EEF6] font-mono text-xs">{webhook.endpoint}</td>
                    <td className="py-3 text-[#9CA3AF]">{webhook.events}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${webhook.status === "active" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                      >
                        {webhook.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#9CA3AF]">{webhook.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AlertsNotificationsHub() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Alerts & Notifications Hub</h1>
      <p className="text-[#9CA3AF] mb-8">Centralized alerting, templates, channels and escalation</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Notification Dashboard */}
        <div className="col-span-8 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Notification Dashboard</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { channel: "Email", sent: 1240, delivered: 1235, failed: 5 },
              { channel: "SMS", sent: 450, delivered: 448, failed: 2 },
              { channel: "Push", sent: 3200, delivered: 3180, failed: 20 },
              { channel: "Webhook", sent: 890, delivered: 885, failed: 5 },
            ].map((channel, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <p className="text-xs text-[#9CA3AF] mb-2">{channel.channel}</p>
                <p className="text-2xl font-bold text-[#6E63FF] mb-1">{channel.sent}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-[#34C759]">{channel.delivered}</span>
                  <span className="text-[#FF3B30]">{channel.failed}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-32 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80, 75, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-[#6E63FF] to-[#38BDF8] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Template Library */}
        <div className="col-span-4 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Template Library</h3>
          <div className="space-y-2">
            {[
              { name: "Welcome Email", type: "email", version: "v2.1" },
              { name: "Alert Critical", type: "sms", version: "v1.5" },
              { name: "Daily Report", type: "email", version: "v3.0" },
              { name: "System Down", type: "push", version: "v1.2" },
            ].map((template, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded hover:bg-[#2A2B33] cursor-pointer transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-[#E6EEF6]">{template.name}</span>
                  <span className="text-xs text-[#9CA3AF]">{template.version}</span>
                </div>
                <span className="text-xs text-[#6E63FF]">{template.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Escalation Manager */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Alert Escalation Manager</h3>
          <div className="space-y-4">
            {[
              { level: "Level 1", role: "On-Call Engineer", time: "0-5 min" },
              { level: "Level 2", role: "Team Lead", time: "5-15 min" },
              { level: "Level 3", role: "Engineering Manager", time: "15-30 min" },
            ].map((escalation, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6E63FF] flex items-center justify-center text-white text-xs">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#E6EEF6]">{escalation.role}</p>
                  <p className="text-xs text-[#9CA3AF]">{escalation.time}</p>
                </div>
                {i < 2 && <div className="w-0.5 h-8 bg-[#6E63FF] absolute ml-4 mt-8" />}
              </div>
            ))}
          </div>
        </div>

        {/* Preference Center */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Preference Center</h3>
          <div className="space-y-3">
            {[
              { category: "System Alerts", email: true, sms: false, push: true },
              { category: "Performance", email: true, sms: false, push: false },
              { category: "Security", email: true, sms: true, push: true },
              { category: "Updates", email: false, sms: false, push: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <span className="text-sm text-[#E6EEF6]">{pref.category}</span>
                <div className="flex gap-2">
                  <div
                    className={`w-6 h-6 rounded ${pref.email ? "bg-[#6E63FF]" : "bg-[#2A2B33]"} flex items-center justify-center`}
                  >
                    <span className="text-xs text-white">@</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded ${pref.sms ? "bg-[#6E63FF]" : "bg-[#2A2B33]"} flex items-center justify-center`}
                  >
                    <span className="text-xs text-white">📱</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded ${pref.push ? "bg-[#6E63FF]" : "bg-[#2A2B33]"} flex items-center justify-center`}
                  >
                    <span className="text-xs text-white">🔔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsInsights() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Analytics & Insights</h1>
      <p className="text-[#9CA3AF] mb-8">
        Business intelligence, AI analytics, knowledge graphs and predictive insights
      </p>

      <div className="grid grid-cols-12 gap-4">
        {/* Performance Index */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Performance Index</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2B33" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6E63FF"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="37.68"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-[#6E63FF]">85</span>
                <span className="text-xs text-[#9CA3AF]">Score</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { metric: "Reliability", value: 92 },
              { metric: "Performance", value: 88 },
              { metric: "Security", value: 90 },
              { metric: "Cost Efficiency", value: 70 },
            ].map((item, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">{item.metric}</p>
                <p className="text-lg font-bold text-[#E6EEF6]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Graph Explorer */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Knowledge Graph Explorer</h3>
          <div className="bg-[#0E0F13] rounded h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-12 h-12 rounded-full bg-[#6E63FF] flex items-center justify-center text-white text-xs"
                  style={{
                    left: `${50 + 30 * Math.cos((i * 2 * Math.PI) / 5)}%`,
                    top: `${50 + 30 * Math.sin((i * 2 * Math.PI) / 5)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {i + 1}
                </div>
              ))}
              <div className="w-16 h-16 rounded-full bg-[#38BDF8] flex items-center justify-center text-white">
                Core
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Engine */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Prediction Engine</h3>
          <div className="h-48 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80, 75, 70, 72, 75, 78, 80, 82, 85, 87, 90, 92, 95].map(
              (val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className={`rounded-t ${i < 14 ? "bg-[#6E63FF]" : "bg-[#38BDF8] opacity-50"}`}
                    style={{ height: `${val}%` }}
                  />
                </div>
              ),
            )}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[#9CA3AF]">
            <span>Historical Data</span>
            <span>Forecast (30d)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityAuditCenter() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Security & Audit Center</h1>
      <p className="text-[#9CA3AF] mb-8">Compliance, threat detection, incident reporting and audit</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Access Roles Matrix */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Access Roles Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#2A2B33]">
                  <th className="text-left py-2 text-[#9CA3AF]">Role</th>
                  <th className="text-center py-2 text-[#9CA3AF]">Read</th>
                  <th className="text-center py-2 text-[#9CA3AF]">Write</th>
                  <th className="text-center py-2 text-[#9CA3AF]">Admin</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { role: "Admin", read: true, write: true, admin: true },
                  { role: "Developer", read: true, write: true, admin: false },
                  { role: "Viewer", read: true, write: false, admin: false },
                  { role: "Guest", read: false, write: false, admin: false },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-[#2A2B33]/50">
                    <td className="py-3 text-[#E6EEF6]">{item.role}</td>
                    <td className="py-3 text-center">
                      <div className={`w-4 h-4 rounded mx-auto ${item.read ? "bg-[#34C759]" : "bg-[#2A2B33]"}`} />
                    </td>
                    <td className="py-3 text-center">
                      <div className={`w-4 h-4 rounded mx-auto ${item.write ? "bg-[#34C759]" : "bg-[#2A2B33]"}`} />
                    </td>
                    <td className="py-3 text-center">
                      <div className={`w-4 h-4 rounded mx-auto ${item.admin ? "bg-[#34C759]" : "bg-[#2A2B33]"}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Detection */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Threat Detection</h3>
          <div className="space-y-3">
            {[
              { threat: "Brute Force Attack", severity: "high", blocked: 45, time: "2m ago" },
              { threat: "SQL Injection", severity: "critical", blocked: 12, time: "15m ago" },
              { threat: "DDoS Attempt", severity: "medium", blocked: 230, time: "1h ago" },
              { threat: "Malware Scan", severity: "low", blocked: 3, time: "3h ago" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{item.threat}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.severity === "critical"
                        ? "bg-[#FF3B30]/20 text-[#FF3B30]"
                        : item.severity === "high"
                          ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                          : item.severity === "medium"
                            ? "bg-[#38BDF8]/20 text-[#38BDF8]"
                            : "bg-[#9CA3AF]/20 text-[#9CA3AF]"
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Blocked: {item.blocked}</span>
                  <span className="text-[#9CA3AF]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Scan */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Vulnerability Scan</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { severity: "Critical", count: 2, color: "#FF3B30" },
              { severity: "High", count: 5, color: "#F59E0B" },
              { severity: "Medium", count: 12, color: "#38BDF8" },
              { severity: "Low", count: 28, color: "#9CA3AF" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">{item.severity}</p>
                <p className="text-3xl font-bold" style={{ color: item.color }}>
                  {item.count}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF]">Last scan: 2 hours ago</p>
        </div>
      </div>
    </div>
  )
}

function DiagnosticsHealthMonitor() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Diagnostics & Health Monitor</h1>
      <p className="text-[#9CA3AF] mb-8">Infrastructure monitoring, errors, availability and auto-heal</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Queue Backlog */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Queue Backlog</h3>
          <div className="h-32 flex items-end gap-1">
            {[60, 65, 70, 75, 80, 85, 90, 95, 92, 88, 85, 80, 75, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className={`rounded-t ${val > 85 ? "bg-[#FF3B30]" : val > 70 ? "bg-[#F59E0B]" : "bg-[#34C759]"}`}
                  style={{ height: `${val}%` }}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Current</p>
              <p className="text-lg font-bold text-[#E6EEF6]">142</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Peak</p>
              <p className="text-lg font-bold text-[#FF3B30]">230</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Avg</p>
              <p className="text-lg font-bold text-[#38BDF8]">85</p>
            </div>
          </div>
        </div>

        {/* Agent Errors */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Agent Errors</h3>
          <div className="space-y-3">
            {[
              { type: "Timeout", count: 45, percentage: 60 },
              { type: "Validation", count: 23, percentage: 30 },
              { type: "Network", count: 8, percentage: 10 },
            ].map((error, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#E6EEF6]">{error.type}</span>
                  <span className="text-[#9CA3AF]">{error.count}</span>
                </div>
                <div className="bg-[#2A2B33] rounded-full h-2">
                  <div className="bg-[#FF3B30] h-2 rounded-full" style={{ width: `${error.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Distribution */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Latency Distribution</h3>
          <div className="h-32 flex items-end justify-center gap-1">
            {[10, 20, 35, 50, 65, 80, 90, 95, 90, 80, 65, 50, 35, 20, 10].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-[#6E63FF] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">P50</p>
              <p className="text-lg font-bold text-[#34C759]">125ms</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">P90</p>
              <p className="text-lg font-bold text-[#F59E0B]">245ms</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">P99</p>
              <p className="text-lg font-bold text-[#FF3B30]">380ms</p>
            </div>
          </div>
        </div>

        {/* Auto-heal Events */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Auto-heal Events</h3>
          <div className="space-y-3">
            {[
              { event: "Agent restart", time: "5m ago", status: "success" },
              { event: "Memory cleanup", time: "12m ago", status: "success" },
              { event: "Connection reset", time: "25m ago", status: "success" },
              { event: "Cache clear", time: "1h ago", status: "success" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0E0F13] p-3 rounded">
                <div className="w-2 h-2 rounded-full bg-[#34C759]" />
                <span className="flex-1 text-sm text-[#E6EEF6]">{item.event}</span>
                <span className="text-xs text-[#9CA3AF]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Performance */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Network Performance</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { node: "Node-1", status: "healthy", latency: "12ms", traffic: "high" },
              { node: "Node-2", status: "healthy", latency: "15ms", traffic: "medium" },
              { node: "Node-3", status: "degraded", latency: "45ms", traffic: "high" },
              { node: "Node-4", status: "healthy", latency: "10ms", traffic: "low" },
              { node: "Node-5", status: "healthy", latency: "18ms", traffic: "medium" },
            ].map((node, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#E6EEF6]">{node.node}</span>
                  <div
                    className={`w-3 h-3 rounded-full ${node.status === "healthy" ? "bg-[#34C759]" : "bg-[#F59E0B]"}`}
                  />
                </div>
                <p className="text-xs text-[#9CA3AF] mb-1">Latency: {node.latency}</p>
                <p className="text-xs text-[#9CA3AF]">Traffic: {node.traffic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function OptimizationAILearningLab() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Optimization & AI Learning Lab</h1>
      <p className="text-[#9CA3AF] mb-8">AI model optimization, training, reward tuning and forecasting</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Model Heatmap */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Model Heatmap</h3>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 168 }).map((_, i) => {
              const intensity = Math.random()
              return (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor:
                      intensity > 0.7
                        ? "#6E63FF"
                        : intensity > 0.4
                          ? "#6E63FF80"
                          : intensity > 0.2
                            ? "#6E63FF40"
                            : "#2A2B33",
                  }}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[#9CA3AF]">
            <span>Low Usage</span>
            <span>High Usage</span>
          </div>
        </div>

        {/* Reward Model Tuner */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Reward Model Tuner</h3>
          <div className="space-y-4">
            {[
              { param: "Gamma", value: 0.99, min: 0, max: 1 },
              { param: "Learning Rate", value: 0.001, min: 0, max: 0.01 },
              { param: "Clip Range", value: 0.2, min: 0, max: 1 },
            ].map((param, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#E6EEF6]">{param.param}</span>
                  <span className="text-[#6E63FF]">{param.value}</span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step="0.001"
                  defaultValue={param.value}
                  className="w-full h-2 bg-[#2A2B33] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
            <button className="w-full bg-[#6E63FF] text-white py-2 rounded hover:bg-[#5952CC] transition-colors text-sm mt-4">
              Apply Changes
            </button>
          </div>
        </div>

        {/* Learning Curve */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Learning Curve</h3>
          <div className="h-48 flex items-end gap-1">
            {[20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 78, 80, 82, 84, 85, 86, 87, 88].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-[#6E63FF] to-[#38BDF8] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Current Accuracy</p>
              <p className="text-lg font-bold text-[#6E63FF]">88%</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Epochs</p>
              <p className="text-lg font-bold text-[#E6EEF6]">20/50</p>
            </div>
          </div>
        </div>

        {/* Optimization Gains */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Optimization Gains</h3>
          <div className="space-y-3">
            {[
              { metric: "Inference Speed", before: "245ms", after: "125ms", gain: "+96%" },
              { metric: "Memory Usage", before: "2.4GB", after: "1.2GB", gain: "+50%" },
              { metric: "Accuracy", before: "85%", after: "88%", gain: "+3.5%" },
              { metric: "Cost per Request", before: "$0.023", after: "$0.012", gain: "+48%" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{item.metric}</span>
                  <span className="text-xs px-2 py-1 rounded bg-[#34C759]/20 text-[#34C759]">{item.gain}</span>
                </div>
                <div className="flex justify-between text-xs text-[#9CA3AF]">
                  <span>Before: {item.before}</span>
                  <span>After: {item.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportsExports() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Reports & Exports</h1>
      <p className="text-[#9CA3AF] mb-8">Report generation, scheduling and data exports</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Report Builder Studio */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Report Builder Studio</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { component: "Chart", icon: "📊" },
              { component: "Table", icon: "📋" },
              { component: "Text", icon: "📝" },
              { component: "Image", icon: "🖼️" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0E0F13] p-4 rounded hover:bg-[#2A2B33] cursor-pointer transition-colors text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <span className="text-sm text-[#E6EEF6]">{item.component}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#0E0F13] rounded h-64 flex items-center justify-center border-2 border-dashed border-[#2A2B33]">
            <p className="text-[#9CA3AF]">Drag components here to build your report</p>
          </div>
        </div>

        {/* Scheduled Reports Manager */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Scheduled Reports Manager</h3>
          <div className="space-y-3">
            {[
              { name: "Daily Performance", schedule: "Daily at 9:00 AM", recipients: 5, status: "active" },
              { name: "Weekly Summary", schedule: "Monday at 8:00 AM", recipients: 12, status: "active" },
              { name: "Monthly Analytics", schedule: "1st of month", recipients: 8, status: "paused" },
            ].map((report, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-[#E6EEF6]">{report.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${report.status === "active" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-1">{report.schedule}</p>
                <p className="text-xs text-[#9CA3AF]">{report.recipients} recipients</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export Manager */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Export Manager</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Export Format</label>
              <select className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm">
                <option>PDF</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
                <option>JSON</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#9CA3AF] mb-1 block">Date Range</label>
              <select className="w-full bg-[#0E0F13] border border-[#2A2B33] rounded px-3 py-2 text-[#E6EEF6] text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom</option>
              </select>
            </div>
            <button className="w-full bg-[#6E63FF] text-white py-2 rounded hover:bg-[#5952CC] transition-colors text-sm">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BackupRecovery() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Backup & Recovery</h1>
      <p className="text-[#9CA3AF] mb-8">Data protection and disaster recovery</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Backup Status */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Backup Status</h3>
          <div className="space-y-3">
            {[
              { date: "2025-01-22", time: "00:00", size: "2.4 GB", status: "success" },
              { date: "2025-01-21", time: "00:00", size: "2.3 GB", status: "success" },
              { date: "2025-01-20", time: "00:00", size: "2.2 GB", status: "success" },
              { date: "2025-01-19", time: "00:00", size: "2.1 GB", status: "failed" },
            ].map((backup, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${backup.status === "success" ? "bg-[#34C759]" : "bg-[#FF3B30]"}`}
                  />
                  <div>
                    <p className="text-sm text-[#E6EEF6]">{backup.date}</p>
                    <p className="text-xs text-[#9CA3AF]">{backup.time}</p>
                  </div>
                </div>
                <span className="text-sm text-[#9CA3AF]">{backup.size}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-[#6E63FF] text-white py-2 rounded hover:bg-[#5952CC] transition-colors text-sm mt-4">
            Create Backup Now
          </button>
        </div>

        {/* Recovery Points */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Recovery Points</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">RTO</p>
              <p className="text-2xl font-bold text-[#6E63FF]">15m</p>
              <p className="text-xs text-[#9CA3AF]">Recovery Time Objective</p>
            </div>
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">RPO</p>
              <p className="text-2xl font-bold text-[#38BDF8]">1h</p>
              <p className="text-xs text-[#9CA3AF]">Recovery Point Objective</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { point: "Latest", time: "2m ago", type: "Automatic" },
              { point: "Hourly", time: "1h ago", type: "Automatic" },
              { point: "Daily", time: "12h ago", type: "Scheduled" },
            ].map((point, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <div>
                  <p className="text-sm text-[#E6EEF6]">{point.point}</p>
                  <p className="text-xs text-[#9CA3AF]">{point.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9CA3AF]">{point.time}</p>
                  <button className="text-xs text-[#6E63FF] hover:underline">Restore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SystemConfigurations() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">System Configurations</h1>
      <p className="text-[#9CA3AF] mb-8">Global configuration and governance</p>

      <div className="grid grid-cols-12 gap-4">
        {/* User Management Console */}
        <div className="col-span-8 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">User Management Console</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2B33]">
                  <th className="text-left py-2 text-[#9CA3AF]">User</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Role</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Status</th>
                  <th className="text-left py-2 text-[#9CA3AF]">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Doe", email: "john@example.com", role: "Admin", status: "active", last: "2m ago" },
                  {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "Developer",
                    status: "active",
                    last: "15m ago",
                  },
                  { name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "inactive", last: "2d ago" },
                ].map((user, i) => (
                  <tr key={i} className="border-b border-[#2A2B33]/50">
                    <td className="py-3">
                      <div>
                        <p className="text-[#E6EEF6]">{user.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-xs bg-[#6E63FF]/20 text-[#6E63FF]">{user.role}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${user.status === "active" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#9CA3AF]/20 text-[#9CA3AF]"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#9CA3AF]">{user.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notification Rules Engine */}
        <div className="col-span-4 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Notification Rules Engine</h3>
          <div className="space-y-3">
            {[
              { rule: "High CPU Alert", priority: "high", enabled: true },
              { rule: "Deployment Success", priority: "medium", enabled: true },
              { rule: "Daily Summary", priority: "low", enabled: false },
            ].map((rule, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{rule.rule}</span>
                  <div
                    className={`w-10 h-5 rounded-full ${rule.enabled ? "bg-[#6E63FF]" : "bg-[#2A2B33]"} relative cursor-pointer`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${rule.enabled ? "right-0.5" : "left-0.5"}`}
                    />
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    rule.priority === "high"
                      ? "bg-[#FF3B30]/20 text-[#FF3B30]"
                      : rule.priority === "medium"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                        : "bg-[#9CA3AF]/20 text-[#9CA3AF]"
                  }`}
                >
                  {rule.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminGovernance() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Admin & Governance</h1>
      <p className="text-[#9CA3AF] mb-8">Administration, licensing, compliance and audit</p>

      <div className="grid grid-cols-12 gap-4">
        {/* System Health Monitor */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">System Health Monitor</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { component: "API Gateway", status: "healthy", uptime: "99.9%" },
              { component: "Database", status: "healthy", uptime: "100%" },
              { component: "Cache", status: "degraded", uptime: "98.5%" },
              { component: "Queue", status: "healthy", uptime: "99.8%" },
            ].map((component, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${component.status === "healthy" ? "bg-[#34C759]" : "bg-[#F59E0B]"}`}
                  />
                  <span className="text-sm text-[#E6EEF6]">{component.component}</span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Uptime: {component.uptime}</p>
              </div>
            ))}
          </div>
        </div>

        {/* License & Billing Admin */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">License & Billing Admin</h3>
          <div className="space-y-3">
            <div className="bg-[#0E0F13] p-4 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-[#6E63FF]">Enterprise</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0E0F13] p-3 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">Users</p>
                <p className="text-lg font-bold text-[#E6EEF6]">45/100</p>
              </div>
              <div className="bg-[#0E0F13] p-3 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">Expires</p>
                <p className="text-lg font-bold text-[#E6EEF6]">90d</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExtensionsMarketplace() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Extensions Marketplace & Builder</h1>
      <p className="text-[#9CA3AF] mb-8">Discover, build, publish and monitor extensions</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Extensions Gallery */}
        <div className="col-span-8 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Extensions Gallery</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "AI Assistant", rating: 4.8, installs: "1.2K", category: "AI" },
              { name: "Data Sync", rating: 4.5, installs: "850", category: "Integration" },
              { name: "Custom Charts", rating: 4.9, installs: "2.1K", category: "Visualization" },
              { name: "Security Scanner", rating: 4.7, installs: "950", category: "Security" },
              { name: "Report Builder", rating: 4.6, installs: "1.5K", category: "Reporting" },
              { name: "Workflow Auto", rating: 4.8, installs: "1.8K", category: "Automation" },
            ].map((ext, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded hover:bg-[#2A2B33] cursor-pointer transition-colors">
                <div className="w-full h-24 bg-[#2A2B33] rounded mb-3 flex items-center justify-center text-3xl">
                  📦
                </div>
                <h4 className="text-sm font-semibold text-[#E6EEF6] mb-1">{ext.name}</h4>
                <p className="text-xs text-[#9CA3AF] mb-2">{ext.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#F59E0B]">⭐ {ext.rating}</span>
                  <span className="text-xs text-[#9CA3AF]">{ext.installs} installs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extension Telemetry */}
        <div className="col-span-4 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Extension Telemetry</h3>
          <div className="space-y-3">
            {[
              { name: "AI Assistant", usage: 85, users: 45 },
              { name: "Data Sync", usage: 60, users: 32 },
              { name: "Custom Charts", usage: 92, users: 58 },
            ].map((ext, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{ext.name}</span>
                  <span className="text-xs text-[#9CA3AF]">{ext.users} users</span>
                </div>
                <div className="bg-[#2A2B33] rounded-full h-2">
                  <div className="bg-[#6E63FF] h-2 rounded-full" style={{ width: `${ext.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extensions Builder Studio */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Extensions Builder Studio</h3>
          <div className="bg-[#0E0F13] rounded p-4 font-mono text-sm h-96 overflow-auto">
            <div className="text-[#9CA3AF]">// Extension Template</div>
            <div>
              <span className="text-[#F59E0B]">export</span> <span className="text-[#6E63FF]">default</span>{" "}
              <span className="text-[#34C759]">function</span> <span className="text-[#38BDF8]">MyExtension</span>(){" "}
              {"{"}
            </div>
            <div className="ml-4">
              <span className="text-[#F59E0B]">return</span> (
            </div>
            <div className="ml-8">
              {"<"}
              <span className="text-[#6E63FF]">div</span>
              {">"}
            </div>
            <div className="ml-12 text-[#9CA3AF]">// Your extension code here</div>
            <div className="ml-8">
              {"</"}
              <span className="text-[#6E63FF]">div</span>
              {">"}
            </div>
            <div className="ml-4">)</div>
            <div>{"}"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestingDebuggingSuite() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Testing & Debugging Suite</h1>
      <p className="text-[#9CA3AF] mb-8">Pre-deployment testing, profiling and AI debug assistance</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Test Case Runner */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Test Case Runner</h3>
          <div className="space-y-2">
            {[
              { test: "Unit Tests", passed: 145, failed: 2, confidence: 98 },
              { test: "Integration Tests", passed: 32, failed: 1, confidence: 96 },
              { test: "E2E Tests", passed: 18, failed: 0, confidence: 100 },
            ].map((suite, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{suite.test}</span>
                  <span className="text-xs text-[#6E63FF]">{suite.confidence}%</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-[#34C759]">✓ {suite.passed} passed</span>
                  {suite.failed > 0 && <span className="text-[#FF3B30]">✗ {suite.failed} failed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Profiler */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Performance Profiler</h3>
          <div className="h-32 flex items-end gap-1 mb-4">
            {[45, 50, 48, 52, 55, 53, 58, 60, 57, 55, 52, 50].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div className="bg-[#6E63FF] rounded-t" style={{ height: `${val}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Avg Exec Time</p>
              <p className="text-lg font-bold text-[#E6EEF6]">125ms</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Memory Usage</p>
              <p className="text-lg font-bold text-[#6E63FF]">2.4 MB</p>
            </div>
          </div>
        </div>

        {/* Real-time Log Stream */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Real-time Log Stream</h3>
          <div className="bg-[#0E0F13] rounded p-3 h-48 overflow-y-auto font-mono text-xs">
            {[
              { time: "14:32:15", level: "INFO", msg: "Server started on port 3000" },
              { time: "14:32:18", level: "DEBUG", msg: "Database connection established" },
              { time: "14:32:20", level: "INFO", msg: "API request: GET /api/users" },
              { time: "14:32:22", level: "WARN", msg: "Slow query detected: 2.5s" },
              { time: "14:32:25", level: "ERROR", msg: "Failed to connect to cache" },
              { time: "14:32:28", level: "INFO", msg: "Cache reconnected successfully" },
            ].map((log, i) => (
              <div key={i} className="mb-1">
                <span className="text-[#9CA3AF]">{log.time}</span>{" "}
                <span
                  className={
                    log.level === "ERROR"
                      ? "text-[#FF3B30]"
                      : log.level === "WARN"
                        ? "text-[#F59E0B]"
                        : log.level === "DEBUG"
                          ? "text-[#38BDF8]"
                          : "text-[#34C759]"
                  }
                >
                  [{log.level}]
                </span>{" "}
                <span className="text-[#E6EEF6]">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Debug Assistant */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">AI Debug Assistant</h3>
          <div className="space-y-3">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-2">Detected Issue</p>
              <p className="text-sm text-[#E6EEF6] mb-2">Memory leak in agent loop</p>
              <button className="text-xs text-[#6E63FF] hover:underline">View Suggestion</button>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-2">Optimization Opportunity</p>
              <p className="text-sm text-[#E6EEF6] mb-2">Cache frequently accessed data</p>
              <button className="text-xs text-[#6E63FF] hover:underline">Apply Fix</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeploymentLifecycleManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Deployment & Lifecycle Management</h1>
      <p className="text-[#9CA3AF] mb-8">CI/CD pipelines, releases, rollbacks and lifecycle policies</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Deployment Pipeline Visualizer */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Deployment Pipeline Visualizer</h3>
          <div className="flex items-center justify-center gap-8 py-8">
            {[
              { stage: "Build", status: "success" },
              { stage: "Test", status: "success" },
              { stage: "Stage", status: "running" },
              { stage: "Prod", status: "pending" },
            ].map((stage, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      stage.status === "success"
                        ? "bg-[#34C759]"
                        : stage.status === "running"
                          ? "bg-[#6E63FF] animate-pulse"
                          : "bg-[#2A2B33]"
                    } text-white`}
                  >
                    {stage.status === "success" ? "✓" : stage.status === "running" ? "⟳" : "○"}
                  </div>
                  <span className="text-sm text-[#E6EEF6] mt-2">{stage.stage}</span>
                </div>
                {i < 3 && <div className="w-12 h-0.5 bg-[#6E63FF]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Release Health Dashboard */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Release Health Dashboard</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { metric: "Success Rate", value: "99.2%", status: "good" },
              { metric: "Error Rate", value: "0.3%", status: "good" },
              { metric: "Rollback Rate", value: "2.1%", status: "warning" },
              { metric: "Deploy Time", value: "8m", status: "good" },
            ].map((metric, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">{metric.metric}</p>
                <p className={`text-2xl font-bold ${metric.status === "good" ? "text-[#34C759]" : "text-[#F59E0B]"}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flag Manager */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Feature Flag Manager</h3>
          <div className="space-y-3">
            {[
              { feature: "New Dashboard", enabled: true, rollout: 100 },
              { feature: "AI Assistant", enabled: true, rollout: 50 },
              { feature: "Dark Mode", enabled: false, rollout: 0 },
            ].map((flag, i) => (
              <div key={i} className="bg-[#0E0F13] p-3 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{flag.feature}</span>
                  <div
                    className={`w-10 h-5 rounded-full ${flag.enabled ? "bg-[#6E63FF]" : "bg-[#2A2B33]"} relative cursor-pointer`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${flag.enabled ? "right-0.5" : "left-0.5"}`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#2A2B33] rounded-full h-2">
                    <div className="bg-[#6E63FF] h-2 rounded-full" style={{ width: `${flag.rollout}%` }} />
                  </div>
                  <span className="text-xs text-[#9CA3AF]">{flag.rollout}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DevelopmentHub() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E6EEF6]">Development Hub</h2>

      {/* Code Editor */}
      <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
        <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Code Editor</h3>
        <div className="bg-[#0E0F13] rounded-lg p-4 font-mono text-sm">
          <pre className="text-[#E6EEF6]">
            <code>{`import { useState } from "react"

export default function HomePage() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}`}</code>
          </pre>
        </div>
      </div>

      {/* Embedded Terminal */}
      <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
        <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Embedded Terminal</h3>
        <div className="bg-[#0E0F13] rounded-lg p-4 font-mono text-sm text-[#34C759]">
          <div>$ npm run dev</div>
          <div className="text-[#9CA3AF]">Starting development server...</div>
          <div className="text-[#9CA3AF]">Ready on http://localhost:3000</div>
        </div>
      </div>
    </div>
  )
}

function GovernanceSecurityConsole() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Governance & Security Console</h1>
      <p className="text-[#9CA3AF] mb-8">Approvals, certificates, risk and audit</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Certificate Monitor */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Certificate Monitor</h3>
          <div className="space-y-3">
            {[
              { domain: "api.example.com", expires: "90d", status: "valid" },
              { domain: "app.example.com", expires: "45d", status: "valid" },
              { domain: "cdn.example.com", expires: "15d", status: "warning" },
            ].map((cert, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6] font-mono">{cert.domain}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${cert.status === "valid" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}
                  >
                    {cert.status}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Expires in {cert.expires}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Approval Workflow</h3>
          <div className="space-y-4">
            {[
              { request: "Deploy to Production", requester: "John Doe", status: "pending" },
              { request: "Access to Secrets", requester: "Jane Smith", status: "approved" },
              { request: "Database Migration", requester: "Bob Johnson", status: "rejected" },
            ].map((approval, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#E6EEF6]">{approval.request}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      approval.status === "approved"
                        ? "bg-[#34C759]/20 text-[#34C759]"
                        : approval.status === "rejected"
                          ? "bg-[#FF3B30]/20 text-[#FF3B30]"
                          : "bg-[#F59E0B]/20 text-[#F59E0B]"
                    }`}
                  >
                    {approval.status}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF]">Requested by {approval.requester}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Matrix */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Risk Matrix</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => {
              const row = Math.floor(i / 5)
              const col = i % 5
              const risk = row * 5 + col
              return (
                <div
                  key={i}
                  className="aspect-square rounded flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: risk > 20 ? "#FF3B30" : risk > 15 ? "#F59E0B" : risk > 10 ? "#38BDF8" : "#34C759",
                    opacity: 0.3 + (risk / 25) * 0.7,
                  }}
                >
                  {risk}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function LicensingSubscriptionCenter() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Licensing & Subscription Center</h1>
      <p className="text-[#9CA3AF] mb-8">License lifecycle, entitlements and billing</p>

      <div className="grid grid-cols-12 gap-4">
        {/* License Overview */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">License Overview</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2B33" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6E63FF"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-[#6E63FF]">75%</span>
                <span className="text-xs text-[#9CA3AF]">Used</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Total Licenses</p>
              <p className="text-lg font-bold text-[#E6EEF6]">100</p>
            </div>
            <div className="bg-[#0E0F13] p-3 rounded">
              <p className="text-xs text-[#9CA3AF] mb-1">Available</p>
              <p className="text-lg font-bold text-[#6E63FF]">25</p>
            </div>
          </div>
        </div>

        {/* Entitlement Matrix */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Entitlement Matrix</h3>
          <div className="space-y-3">
            {[
              { feature: "AI Agents", enabled: true, limit: "Unlimited" },
              { feature: "API Calls", enabled: true, limit: "1M/month" },
              { feature: "Storage", enabled: true, limit: "100 GB" },
              { feature: "Support", enabled: true, limit: "24/7" },
            ].map((entitlement, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${entitlement.enabled ? "bg-[#34C759]" : "bg-[#2A2B33]"}`} />
                  <span className="text-sm text-[#E6EEF6]">{entitlement.feature}</span>
                </div>
                <span className="text-xs text-[#9CA3AF]">{entitlement.limit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Summary */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Billing Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Current Period", amount: "$5,420" },
              { label: "Next Billing", amount: "Jan 30, 2025" },
              { label: "Annual Spend", amount: "$64,800" },
              { label: "Savings", amount: "$12,200" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded">
                <p className="text-xs text-[#9CA3AF] mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-[#E6EEF6]">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeUIDesigner() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Theme & UI Designer</h1>
      <p className="text-[#9CA3AF] mb-8">Branding, themes, accessibility and exports</p>

      <div className="grid grid-cols-12 gap-4">
        {/* Theme Presets */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Theme Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Dark Purple", colors: ["#6E63FF", "#38BDF8", "#0E0F13"] },
              { name: "Ocean Blue", colors: ["#0EA5E9", "#06B6D4", "#0C4A6E"] },
              { name: "Forest Green", colors: ["#10B981", "#34D399", "#064E3B"] },
              { name: "Sunset Orange", colors: ["#F59E0B", "#FB923C", "#78350F"] },
            ].map((theme, i) => (
              <div key={i} className="bg-[#0E0F13] p-4 rounded hover:bg-[#2A2B33] cursor-pointer transition-colors">
                <p className="text-sm text-[#E6EEF6] mb-3">{theme.name}</p>
                <div className="flex gap-2">
                  {theme.colors.map((color, j) => (
                    <div key={j} className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Checker */}
        <div className="col-span-6 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Accessibility Checker</h3>
          <div className="space-y-3">
            {[
              { check: "Color Contrast", status: "pass", ratio: "7.2:1" },
              { check: "Font Size", status: "pass", min: "14px" },
              { check: "Focus Indicators", status: "warning", coverage: "85%" },
              { check: "ARIA Labels", status: "pass", coverage: "100%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0E0F13] p-3 rounded">
                <span className="text-sm text-[#E6EEF6]">{item.check}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF]">{item.ratio || item.min || item.coverage}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${item.status === "pass" ? "bg-[#34C759]/20 text-[#34C759]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Export Manager */}
        <div className="col-span-12 bg-[#1A1B23] p-6 rounded-lg border border-[#2A2B33]">
          <h3 className="text-sm font-semibold text-[#9CA3AF] mb-4">Theme Export Manager</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { format: "CSS Variables", icon: "📄" },
              { format: "JSON", icon: "📋" },
              { format: "Figma Tokens", icon: "🎨" },
            ].map((format, i) => (
              <div
                key={i}
                className="bg-[#0E0F13] p-6 rounded hover:bg-[#2A2B33] cursor-pointer transition-colors text-center"
              >
                <div className="text-4xl mb-3">{format.icon}</div>
                <p className="text-sm text-[#E6EEF6] mb-3">{format.format}</p>
                <button className="text-xs text-[#6E63FF] hover:underline">Export</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
