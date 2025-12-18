"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GraphNode {
  id: string
  label: string
  type: string
}

interface GraphEdge {
  source: string
  target: string
  relationship: string
}

interface KnowledgeGraphViewerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function KnowledgeGraphViewer({ nodes, edges }: KnowledgeGraphViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Simple force-directed layout
    const nodePositions = new Map<string, { x: number; y: number }>()
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2
      const radius = Math.min(canvas.width, canvas.height) * 0.3
      nodePositions.set(node.id, {
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
      })
    })

    // Draw edges
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 1
    edges.forEach((edge) => {
      const source = nodePositions.get(edge.source)
      const target = nodePositions.get(edge.target)
      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      const pos = nodePositions.get(node.id)
      if (!pos) return

      ctx.fillStyle = node.type === "agent" ? "#3b82f6" : "#8b5cf6"
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label.slice(0, 10), pos.x, pos.y + 35)
    })
  }, [nodes, edges])

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
      <Card className="p-4">
        <canvas ref={canvasRef} className="w-full h-full" />
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Graph Details</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Nodes</div>
              <div className="flex flex-wrap gap-2">
                {nodes.map((node) => (
                  <Badge
                    key={node.id}
                    variant={selectedNode?.id === node.id ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    {node.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">Relationships</div>
              <div className="space-y-2">
                {edges.map((edge, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{nodes.find((n) => n.id === edge.source)?.label}</span>
                    <span className="text-muted-foreground mx-2">→</span>
                    <span className="font-medium">{nodes.find((n) => n.id === edge.target)?.label}</span>
                    <Badge variant="outline" className="ml-2">
                      {edge.relationship}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
