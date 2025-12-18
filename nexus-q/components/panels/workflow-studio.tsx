"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Save, Download, Upload, Square, GitBranch, Clock, Zap, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

const ReactFlow = dynamic(() => import("reactflow").then((mod) => mod.default), { ssr: false })
const Background = dynamic(() => import("reactflow").then((mod) => mod.Background), { ssr: false })
const Controls = dynamic(() => import("reactflow").then((mod) => mod.Controls), { ssr: false })

const nodeTemplates = [
  { id: "trigger", label: "Trigger", icon: "⚡", category: "Input" },
  { id: "http-request", label: "HTTP Request", icon: "🌐", category: "Action" },
  { id: "data-transform", label: "Transform Data", icon: "🔄", category: "Action" },
  { id: "condition", label: "Condition", icon: "🔀", category: "Logic" },
  { id: "loop", label: "Loop", icon: "🔁", category: "Logic" },
  { id: "ai-agent", label: "AI Agent", icon: "🤖", category: "AI" },
  { id: "database", label: "Database Query", icon: "💾", category: "Data" },
  { id: "notification", label: "Send Notification", icon: "📧", category: "Output" },
  { id: "output", label: "Output", icon: "📤", category: "Output" },
]

const workflowVersions = [
  { version: "v1.2.3", date: "2024-01-15", author: "John Doe", status: "active" },
  { version: "v1.2.2", date: "2024-01-10", author: "Jane Smith", status: "archived" },
  { version: "v1.2.1", date: "2024-01-05", author: "John Doe", status: "archived" },
]

const executionHistory = [
  { id: 1, timestamp: "2024-01-15 10:23:45", duration: "2.3s", status: "success", nodes: 8 },
  { id: 2, timestamp: "2024-01-15 10:18:32", duration: "1.8s", status: "success", nodes: 8 },
  { id: 3, timestamp: "2024-01-15 10:12:15", duration: "3.1s", status: "failed", nodes: 8 },
  { id: 4, timestamp: "2024-01-15 10:05:22", duration: "2.0s", status: "success", nodes: 8 },
]

export function WorkflowStudio({ widgets, onWidgetsChange }: any) {
  const [nodes, setNodes] = useState([
    { id: "1", type: "input", data: { label: "Trigger: API Call" }, position: { x: 250, y: 5 } },
    { id: "2", data: { label: "Transform Data" }, position: { x: 250, y: 100 } },
    { id: "3", data: { label: "AI Processing" }, position: { x: 250, y: 200 } },
    { id: "4", type: "output", data: { label: "Send Response" }, position: { x: 250, y: 300 } },
  ])
  const [edges, setEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([])

  const runWorkflow = () => {
    setIsRunning(true)
    setExecutionLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "info",
        message: "Workflow execution started",
      },
    ])

    // Simulate workflow execution
    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "info",
          message: "Node 1: Trigger received API call",
        },
      ])
    }, 500)

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "info",
          message: "Node 2: Data transformation completed",
        },
      ])
    }, 1500)

    setTimeout(() => {
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "info",
          message: "Node 3: AI processing completed",
        },
      ])
    }, 2500)

    setTimeout(() => {
      setIsRunning(false)
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "success",
          message: "Workflow execution completed successfully",
        },
      ])
    }, 3000)
  }

  const stopWorkflow = () => {
    setIsRunning(false)
    setExecutionLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "warning",
        message: "Workflow execution stopped by user",
      },
    ])
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Workflow Studio
          </h2>
          <p className="text-muted-foreground mt-1">Visual workflow builder with AI-powered automation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={isRunning ? stopWorkflow : runWorkflow} size="sm">
            {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Stop" : "Run"}
          </Button>
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          <TabsTrigger value="templates">Node Templates</TabsTrigger>
          <TabsTrigger value="versions">Version Control</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>

        {/* Workflow Builder Tab */}
        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Toolbox */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Building Blocks</CardTitle>
                <CardDescription className="text-xs">Drag nodes to canvas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Input", "Action", "Logic", "AI", "Data", "Output"].map((category) => (
                  <div key={category}>
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">{category}</p>
                    <div className="space-y-2">
                      {nodeTemplates
                        .filter((node) => node.category === category)
                        .map((node) => (
                          <DraggableNode key={node.id} type={node.id} label={node.label} icon={node.icon} />
                        ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t mt-4">
                  <p className="text-xs font-semibold mb-2">AI Suggestions</p>
                  <Button size="sm" variant="outline" className="w-full mb-2 bg-transparent">
                    <Zap className="h-3 w-3 mr-2" />
                    Suggest Workflow
                  </Button>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    <Settings className="h-3 w-3 mr-2" />
                    Optimize Current
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Workflow Canvas</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">4 nodes</Badge>
                    <Badge variant="outline">3 connections</Badge>
                    {isRunning && (
                      <Badge variant="default" className="animate-pulse">
                        Running
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] border-t">
                  {typeof window !== "undefined" && (
                    <ReactFlow nodes={nodes} edges={edges} fitView>
                      <Background />
                      <Controls />
                    </ReactFlow>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Execution Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Execution Logs</CardTitle>
              <CardDescription>Live workflow execution monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {executionLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm flex items-center gap-3 ${
                      log.level === "success"
                        ? "bg-green-500/10 text-green-500"
                        : log.level === "warning"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : log.level === "error"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted"
                    }`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">{log.timestamp}</span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                ))}
                {executionLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No execution logs yet. Run a workflow to see logs.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Node Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Node Template Library</CardTitle>
              <CardDescription>Pre-built node configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodeTemplates.map((template) => (
                  <Card key={template.id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm">{template.label}</h4>
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
                        <Plus className="h-3 w-3 mr-2" />
                        Add to Canvas
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Version Control</CardTitle>
              <CardDescription>Git-style branching + rollback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflowVersions.map((version) => (
                  <div key={version.version} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <GitBranch className="h-5 w-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{version.version}</span>
                          <Badge variant={version.status === "active" ? "default" : "secondary"}>
                            {version.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {version.date} by {version.author}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {version.status !== "active" && (
                        <Button size="sm" variant="outline">
                          Restore
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>Past workflow runs + performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {executionHistory.map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{execution.timestamp}</span>
                          <Badge variant={execution.status === "success" ? "default" : "destructive"}>
                            {execution.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Duration: {execution.duration} • Nodes: {execution.nodes}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Logs
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const DraggableNode = ({ type, label, icon }: { type: string; label: string; icon: string }) => (
  <motion.div
    className="p-3 rounded-md bg-background border-2 border-border hover:border-primary cursor-move text-sm font-medium flex items-center gap-2"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    draggable
  >
    <span>{icon}</span>
    <span className="flex-1">{label}</span>
  </motion.div>
)
