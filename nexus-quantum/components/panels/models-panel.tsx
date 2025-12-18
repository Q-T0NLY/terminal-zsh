"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Brain, Zap, DollarSign, Shield, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Model {
  id: string
  name: string
  provider: string
  type: string
  category: string
  status: "active" | "inactive" | "testing"
  capabilities: string[]
  performance: {
    latency: number
    throughput: number
    accuracy: number
  }
  cost: {
    perToken: string
  }
  safety: {
    score: number
    bias: number
    toxicity: number
    factuality: number
  }
  benchmarks: {
    accuracy: number
  }
}

export function ModelsPanel() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [filter, setFilter] = useState("all")

  const models: Model[] = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      type: "LLM",
      category: "llm",
      status: "active",
      capabilities: ["Text Generation", "Code", "Analysis", "Reasoning"],
      performance: {
        latency: 450,
        throughput: 120,
        accuracy: 94,
      },
      cost: {
        perToken: "$0.005",
      },
      safety: {
        score: 92,
        bias: 88,
        toxicity: 95,
        factuality: 91,
      },
      benchmarks: {
        accuracy: 94,
      },
    },
    {
      id: "claude-3.5",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      type: "LLM",
      category: "llm",
      status: "active",
      capabilities: ["Text Generation", "Analysis", "Code", "Long Context"],
      performance: {
        latency: 380,
        throughput: 150,
        accuracy: 96,
      },
      cost: {
        perToken: "$0.003",
      },
      safety: {
        score: 95,
        bias: 92,
        toxicity: 97,
        factuality: 94,
      },
      benchmarks: {
        accuracy: 96,
      },
    },
    {
      id: "llama-3",
      name: "Llama 3 70B",
      provider: "Meta",
      type: "LLM",
      category: "llm",
      status: "testing",
      capabilities: ["Text Generation", "Code", "Multilingual"],
      performance: {
        latency: 520,
        throughput: 90,
        accuracy: 89,
      },
      cost: {
        perToken: "$0.001",
      },
      safety: {
        score: 85,
        bias: 82,
        toxicity: 88,
        factuality: 86,
      },
      benchmarks: {
        accuracy: 89,
      },
    },
  ]

  const categories = [
    { id: "all", name: "All Models" },
    { id: "llm", name: "Large Language Models" },
    { id: "ml", name: "Machine Learning" },
    { id: "quantum", name: "Quantum Circuits" },
    { id: "vision", name: "Computer Vision" },
    { id: "audio", name: "Audio Processing" },
  ]

  const filteredModels = models.filter((model) => filter === "all" || model.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">🧠 Models & Model Cards</h2>
          <p className="text-muted-foreground">Manage AI models, view capabilities, and monitor performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Refresh Models</Button>
          <Button>Register New Model</Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={filter === category.id ? "default" : "outline"}
            onClick={() => setFilter(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={setSelectedModel}
            isSelected={selectedModel?.id === model.id}
          />
        ))}
      </div>

      {selectedModel && <ModelDetailsDialog model={selectedModel} onClose={() => setSelectedModel(null)} />}
    </div>
  )
}

function ModelCard({
  model,
  onSelect,
  isSelected,
}: {
  model: Model
  onSelect: (model: Model) => void
  isSelected: boolean
}) {
  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    testing: "bg-yellow-500",
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect(model)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{model.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{model.provider}</p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${statusColors[model.status]}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {model.capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
          {model.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{model.capabilities.length - 3}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{model.performance.latency}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{model.cost.perToken}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>{model.safety.score}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="font-medium">{model.benchmarks.accuracy}%</span>
          </div>
          <Progress value={model.benchmarks.accuracy} />
        </div>
      </CardContent>
    </Card>
  )
}

function ModelDetailsDialog({
  model,
  onClose,
}: {
  model: Model
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{model.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {model.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{model.performance.latency}ms</div>
                    <div className="text-sm text-muted-foreground">Latency</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{model.performance.throughput}</div>
                    <div className="text-sm text-muted-foreground">Throughput (tokens/s)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{model.performance.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{model.cost.perToken}</div>
                    <div className="text-sm text-muted-foreground">Cost per Token</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <h4 className="font-semibold">Safety Classification</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Bias Score</span>
                  <span className="text-sm font-medium">{model.safety.bias}%</span>
                </div>
                <Progress value={model.safety.bias} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Toxicity Score</span>
                  <span className="text-sm font-medium">{model.safety.toxicity}%</span>
                </div>
                <Progress value={model.safety.toxicity} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Factuality Score</span>
                  <span className="text-sm font-medium">{model.safety.factuality}%</span>
                </div>
                <Progress value={model.safety.factuality} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks">
            <p className="text-muted-foreground">Detailed benchmarks coming soon...</p>
          </TabsContent>

          <TabsContent value="usage">
            <p className="text-muted-foreground">Usage statistics coming soon...</p>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          <Button>Deploy Model</Button>
          <Button variant="outline">Test Model</Button>
          <Button variant="outline">Configure</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
