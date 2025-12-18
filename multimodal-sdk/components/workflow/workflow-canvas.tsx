"use client"

import { useCallback, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { WorkflowToolbar } from "./workflow-toolbar"
import { AgentNode } from "./nodes/agent-node"
import { StartNode } from "./nodes/start-node"
import { EndNode } from "./nodes/end-node"
import { ConditionNode } from "./nodes/condition-node"
import { TransformNode } from "./nodes/transform-node"
import { cn } from "@/lib/utils"

const nodeTypes = {
  agent: AgentNode,
  start: StartNode,
  end: EndNode,
  condition: ConditionNode,
  transform: TransformNode,
}

interface WorkflowCanvasProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
  className?: string
}

export function WorkflowCanvas({ initialNodes = [], initialEdges = [], onSave, className }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null)

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges],
  )

  const onAddNode = useCallback(
    (type: string) => {
      const id = `${type}-${Date.now()}`
      const newNode: Node = {
        id,
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `${type} node` },
      }
      setNodes((nds) => [...nds, newNode])
      setSelectedNodeType(null)
    },
    [setNodes],
  )

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    },
    [setNodes, setEdges],
  )

  const handleSave = useCallback(() => {
    onSave?.(nodes, edges)
  }, [nodes, edges, onSave])

  return (
    <div className={cn("relative h-full w-full rounded-lg border border-border", className)}>
      <WorkflowToolbar
        onAddNode={onAddNode}
        onSave={handleSave}
        selectedNodeType={selectedNodeType}
        onSelectNodeType={setSelectedNodeType}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="oklch(0.439 0 0)" />
        <Controls className="rounded-lg border border-border bg-card" />
        <MiniMap
          className="rounded-lg border border-border bg-card"
          nodeColor={(node) => {
            switch (node.type) {
              case "start":
                return "rgb(34, 197, 94)"
              case "end":
                return "rgb(239, 68, 68)"
              case "agent":
                return "rgb(6, 182, 212)"
              case "condition":
                return "rgb(168, 85, 247)"
              case "transform":
                return "rgb(236, 72, 153)"
              default:
                return "rgb(163, 163, 163)"
            }
          }}
        />
      </ReactFlow>
    </div>
  )
}
