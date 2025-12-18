"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, Brain, Sparkles, Activity, Zap } from "lucide-react"

interface SpecializedAgent {
  id: string
  name: string
  type: "quantum" | "ml" | "generative"
  state: string
  capabilities: number
  health?: {
    status: string
    metrics: Record<string, any>
  }
}

export function SpecializedAgentPanel() {
  const [agents, setAgents] = useState<SpecializedAgent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<SpecializedAgent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents/specialized")
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("[v0] Failed to fetch specialized agents:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "quantum":
        return <Cpu className="h-5 w-5" />
      case "ml":
        return <Brain className="h-5 w-5" />
      case "generative":
        return <Sparkles className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getAgentColor = (type: string) => {
    switch (type) {
      case "quantum":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "ml":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "generative":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Specialized Agents
        </CardTitle>
        <CardDescription>Quantum, ML, and Generative agents with advanced capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="quantum">Quantum</TabsTrigger>
            <TabsTrigger value="ml">ML</TabsTrigger>
            <TabsTrigger value="generative">Generative</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading specialized agents...</div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No specialized agents deployed</div>
            ) : (
              <div className="grid gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getAgentColor(agent.type)}`}>
                            {getAgentIcon(agent.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">{agent.capabilities} capabilities</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {agent.state}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {["quantum", "ml", "generative"].map((type) => (
            <TabsContent key={type} value={type} className="space-y-4 mt-4">
              {agents.filter((a) => a.type === type).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No {type} agents deployed</div>
              ) : (
                <div className="grid gap-4">
                  {agents
                    .filter((a) => a.type === type)
                    .map((agent) => (
                      <Card key={agent.id} className="border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${getAgentColor(agent.type)}`}>
                                {getAgentIcon(agent.type)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{agent.name}</h4>
                                <p className="text-sm text-muted-foreground">{agent.capabilities} capabilities</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {agent.state}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
