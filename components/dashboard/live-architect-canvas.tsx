"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface LiveArchitectCanvasProps {
  onSelectNode: (nodeId: string | null) => void
  selectedNode: string | null
}

const sampleNodes = [
  { id: "analyzer", title: "Context Analyzer", x: 60, y: 60, status: "idle" },
  { id: "gen", title: "Generative Agent", x: 360, y: 60, status: "running" },
  { id: "evaluator", title: "Safety Check", x: 660, y: 60, status: "idle" },
]

export function LiveArchitectCanvas({ onSelectNode, selectedNode }: LiveArchitectCanvasProps) {
  return (
    <Card className="relative p-6 min-h-[400px] bg-card">
      <div className="text-sm font-semibold mb-4">Workflow Canvas</div>
      {sampleNodes.map((node) => (
        <motion.div
          key={node.id}
          whileHover={{ scale: 1.02 }}
          className={`absolute rounded-xl p-4 bg-card border cursor-pointer ${
            selectedNode === node.id ? "border-primary" : "border-border"
          }`}
          style={{ left: node.x, top: node.y, width: 220 }}
          onClick={() => onSelectNode(node.id)}
        >
          <div className="flex justify-between">
            <div className="font-semibold text-sm">{node.title}</div>
            <div className={`text-xs ${node.status === "running" ? "text-green-500" : "text-muted-foreground"}`}>
              {node.status}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">Model: gpt-4o • Mem: vector-db</div>
        </motion.div>
      ))}
    </Card>
  )
}
