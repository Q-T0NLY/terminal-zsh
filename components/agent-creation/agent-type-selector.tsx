"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Cpu, Zap } from "lucide-react"

interface AgentTypeSelectorProps {
  selectedType: string
  onSelect: (type: string) => void
}

export function AgentTypeSelector({ selectedType, onSelect }: AgentTypeSelectorProps) {
  const agentTypes = [
    {
      id: "base",
      name: "Base Agent",
      icon: <Cpu className="h-6 w-6" />,
      color: "text-gray-500",
      description: "General-purpose agent for standard tasks",
      capabilities: ["Task Execution", "Basic Learning", "Standard Performance"],
    },
    {
      id: "creative",
      name: "Creative AI Agent",
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-purple-500",
      description: "Advanced creative capabilities with emotional intelligence",
      capabilities: ["Emotional Storytelling", "Creative Brainstorming", "Style Transfer", "Multimodal Generation"],
    },
    {
      id: "ml-optimization",
      name: "ML Optimization Agent",
      icon: <Brain className="h-6 w-6" />,
      color: "text-blue-500",
      description: "Specialized in ML optimization and feature engineering",
      capabilities: ["Feature Engineering", "Model Diagnostics", "Data Synthesis", "AutoML Pipeline"],
    },
    {
      id: "quantum",
      name: "Quantum Agent",
      icon: <Zap className="h-6 w-6" />,
      color: "text-cyan-500",
      description: "Quantum computing capabilities with circuit optimization",
      capabilities: ["Circuit Execution", "Hybrid Optimization", "State Tomography", "Quantum ML"],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {agentTypes.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer transition-all ${
            selectedType === type.id ? "border-primary shadow-lg" : "hover:border-primary/50"
          }`}
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={type.color}>{type.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{type.name}</h3>
                  {selectedType === type.id && <Badge>Selected</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                <div className="flex flex-wrap gap-1">
                  {type.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
