"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Save, GitBranch, Zap } from "lucide-react"

export default function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState({
    name: "New Workflow",
    description: "",
    nodes: [
      { id: "start", type: "START", label: "Start", position: { x: 100, y: 200 } },
      { id: "end", type: "END", label: "End", position: { x: 700, y: 200 } },
    ],
    edges: [],
  })

  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const addNode = (type: string) => {
    const newNode = {
      id: `node-${workflow.nodes.length}`,
      type,
      label: `${type} Node`,
      position: { x: 400, y: 200 + workflow.nodes.length * 50 },
    }
    setWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, newNode],
    })
  }

  const handleExecute = async () => {
    try {
      const response = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: "wf-example", inputs: {} }),
      })
      const data = await response.json()
      console.log("[v0] Workflow execution started:", data)
    } catch (error) {
      console.error("[v0] Failed to execute workflow:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-purple-400" />
                Workflow Builder
              </CardTitle>
              <CardDescription className="text-gray-400">Design and automate agent workflows</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExecute} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Execute
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workflow Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name" className="text-gray-200">
                Workflow Name
              </Label>
              <Input
                id="workflow-name"
                value={workflow.name}
                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                className="bg-gray-900/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-desc" className="text-gray-200">
                Description
              </Label>
              <Input
                id="workflow-desc"
                value={workflow.description}
                onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                placeholder="What does this workflow do?"
                className="bg-gray-900/50 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Node Palette */}
          <div className="space-y-3">
            <Label className="text-gray-200">Add Nodes</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => addNode("AGENT_TASK")}
                size="sm"
                variant="outline"
                className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              >
                <Plus className="h-3 w-3 mr-1" />
                Agent Task
              </Button>
              <Button
                onClick={() => addNode("CONDITION")}
                size="sm"
                variant="outline"
                className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
              >
                <Plus className="h-3 w-3 mr-1" />
                Condition
              </Button>
              <Button
                onClick={() => addNode("LOOP")}
                size="sm"
                variant="outline"
                className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
              >
                <Plus className="h-3 w-3 mr-1" />
                Loop
              </Button>
              <Button
                onClick={() => addNode("PARALLEL")}
                size="sm"
                variant="outline"
                className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
              >
                <Plus className="h-3 w-3 mr-1" />
                Parallel
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative bg-gray-900/50 rounded-lg border border-gray-700 h-96 overflow-auto">
            <div className="absolute inset-0 p-4">
              {workflow.nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`absolute p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedNode === node.id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                  }`}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                    minWidth: "120px",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {node.type === "START" && <Zap className="h-4 w-4 text-green-400" />}
                    {node.type === "END" && <Zap className="h-4 w-4 text-red-400" />}
                    {node.type === "AGENT_TASK" && <Zap className="h-4 w-4 text-blue-400" />}
                    <span className="text-sm font-medium text-white">{node.label}</span>
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                    {node.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Node Details */}
          {selectedNode && (
            <Card className="bg-gray-900/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-sm text-gray-200">Node Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Node ID:</span>
                    <span className="text-sm text-gray-300">{selectedNode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Type:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {workflow.nodes.find((n) => n.id === selectedNode)?.type}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
