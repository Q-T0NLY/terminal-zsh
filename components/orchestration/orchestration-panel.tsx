"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlowCard } from "@/components/ui/glow-card"
import { LoadingDots } from "@/components/ui/loading-dots"
import { Sparkles, Zap, GitBranch, Layers } from "lucide-react"
import type { Agent } from "@/types/database"

interface OrchestrationPanelProps {
  agents: Agent[]
}

export function OrchestrationPanel({ agents }: OrchestrationPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [strategy, setStrategy] = useState<"voting" | "weighted" | "cascade" | "parallel">("parallel")
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const strategies = [
    { id: "parallel", name: "Parallel", icon: Layers, description: "Run agents in parallel and synthesize" },
    { id: "voting", name: "Voting", icon: GitBranch, description: "Majority voting from all agents" },
    { id: "cascade", name: "Cascade", icon: Zap, description: "Chain agents sequentially" },
    { id: "weighted", name: "Weighted", icon: Sparkles, description: "Weighted combination" },
  ]

  const handleOrchestrate = async () => {
    if (!prompt || selectedAgents.length === 0) return

    setLoading(true)
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          strategy,
          agentIds: selectedAgents,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Orchestration failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strategy Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Orchestration Strategy</Label>
          <div className="grid grid-cols-2 gap-3">
            {strategies.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id as any)}
                  className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 transition-all ${
                    strategy === s.id
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-border bg-card hover:border-cyan-500/50"
                  }`}
                >
                  <Icon className="h-5 w-5 text-cyan-500" />
                  <div className="text-left">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Agent Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Select Agents ({selectedAgents.length})</Label>
          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                  selectedAgents.includes(agent.id)
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-border bg-card hover:border-cyan-500/50"
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${agent.status === "active" ? "bg-green-500" : "bg-gray-500"}`} />
                <div className="flex-1">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">{agent.model}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for the ensemble to process..."
          className="min-h-[120px] resize-none"
        />
      </div>

      {/* Execute Button */}
      <Button
        onClick={handleOrchestrate}
        disabled={loading || !prompt || selectedAgents.length === 0}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        size="lg"
      >
        {loading ? (
          <>
            <LoadingDots />
            <span className="ml-2">Orchestrating...</span>
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Execute Ensemble
          </>
        )}
      </Button>

      {/* Results */}
      {result && (
        <GlowCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Orchestration Result</h3>
            <div className="text-sm text-muted-foreground">
              {result.totalLatency}ms • {result.strategy}
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm leading-relaxed">{result.finalResponse}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Individual Responses</Label>
            <div className="grid gap-2">
              {result.responses.map((r: any, idx: number) => (
                <Card key={idx} className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium">{r.agent.name}</span>
                    <span className="text-xs text-muted-foreground">{r.latency}ms</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.response}</p>
                </Card>
              ))}
            </div>
          </div>
        </GlowCard>
      )}
    </div>
  )
}
