"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Save, Download, Upload, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const ReactFlow = dynamic(() => import("reactflow").then((mod) => mod.default), { ssr: false })

const Background = dynamic(() => import("reactflow").then((mod) => mod.Background), { ssr: false })

const Controls = dynamic(() => import("reactflow").then((mod) => mod.Controls), { ssr: false })

export function WorkflowStudio({ widgets, onWidgetsChange }: any) {
  const [nodes, setNodes] = useState([
    { id: "1", type: "input", data: { label: "Start" }, position: { x: 250, y: 5 } },
    { id: "2", data: { label: "Process" }, position: { x: 250, y: 100 } },
    { id: "3", type: "output", data: { label: "End" }, position: { x: 250, y: 200 } },
  ])
  const [edges, setEdges] = useState([
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([])

  const runWorkflow = () => {
    setIsRunning(true)
    setExecutionLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "info",
        message: "Workflow execution started",
      },
    ])
    setTimeout(() => {
      setIsRunning(false)
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level: "success",
          message: "Workflow execution completed",
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
        message: "Workflow execution stopped",
      },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">⚡ Workflow Studio</h2>
          <p className="text-sm text-muted-foreground">Visual workflow builder with AI-powered automation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={isRunning ? stopWorkflow : runWorkflow} size="sm">
            {isRunning ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? "Stop" : "Run"}
          </Button>
          <Button size="sm" variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Toolbox */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Building Blocks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DraggableNode type="trigger" label="Trigger" />
            <DraggableNode type="action" label="Action" />
            <DraggableNode type="condition" label="Condition" />
            <DraggableNode type="loop" label="Loop" />
            <DraggableNode type="output" label="Output" />

            <div className="pt-4 border-t mt-4">
              <p className="text-xs font-semibold mb-2">AI Suggestions</p>
              <Button size="sm" variant="outline" className="w-full mb-2 bg-transparent">
                Suggest Workflow
              </Button>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                Optimize Current
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="col-span-3">
          <CardContent className="p-0">
            <div className="h-[500px]">
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

      <Card>
        <CardHeader>
          <CardTitle>Real-time Execution Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {executionLogs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  log.level === "success"
                    ? "bg-green-500/10 text-green-500"
                    : log.level === "warning"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : log.level === "error"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-muted"
                }`}
              >
                <span className="font-mono text-xs mr-2">{log.timestamp}</span>
                <span>{log.message}</span>
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
    </div>
  )
}

const DraggableNode = ({ type, label }: { type: string; label: string }) => (
  <motion.div
    className="p-3 rounded-md bg-muted cursor-move text-sm font-medium text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    draggable
  >
    {label}
  </motion.div>
)
