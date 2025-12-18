"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Brain, TrendingUp, Settings, Play, Sparkles } from "lucide-react"

interface OptimizationSuggestion {
  type: string
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  resourceChange: string
  costImpact: string
}

export function OptimizationPanel() {
  const [activeTab, setActiveTab] = useState("suggestions")
  const [autoTuneConfig, setAutoTuneConfig] = useState({
    autoApply: false,
    modelSize: "auto",
    agentRouting: "auto",
    resourceSizing: "auto",
    maxCostIncrease: 20,
    minPerformanceGain: 10,
  })

  const suggestions: OptimizationSuggestion[] = [
    {
      type: "Model Selection",
      title: "Switch to GPT-4o-mini for simple queries",
      description: "Analysis shows 60% of queries can use a smaller model without quality loss",
      confidence: 92,
      impact: "high",
      resourceChange: "-40% tokens",
      costImpact: "-$450/day",
    },
    {
      type: "Caching",
      title: "Enable semantic caching for common patterns",
      description: "Detected 35% query similarity - caching could reduce API calls significantly",
      confidence: 88,
      impact: "high",
      resourceChange: "-35% API calls",
      costImpact: "-$280/day",
    },
    {
      type: "Agent Routing",
      title: "Optimize agent selection logic",
      description: "Current routing has 15% overhead - improved logic could reduce latency",
      confidence: 75,
      impact: "medium",
      resourceChange: "-15% latency",
      costImpact: "+$50/day",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">🎯 Optimization & Auto-Tune</h2>
          <p className="text-muted-foreground">AI-powered optimization suggestions and automated tuning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Run Optimization
          </Button>
          <Button>Apply All</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="suggestions">
            <Brain className="h-4 w-4 mr-2" />
            AI Suggestions
          </TabsTrigger>
          <TabsTrigger value="auto-tune">
            <Settings className="h-4 w-4 mr-2" />
            Auto-Tune
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Meta-Learner Active</div>
              <div className="text-sm text-muted-foreground">
                Analyzing system patterns and generating optimization suggestions
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auto-tune" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Tune Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-apply">Auto-apply optimizations</Label>
                  <p className="text-sm text-muted-foreground">Automatically apply high-confidence suggestions</p>
                </div>
                <Switch
                  id="auto-apply"
                  checked={autoTuneConfig.autoApply}
                  onCheckedChange={(checked) => setAutoTuneConfig({ ...autoTuneConfig, autoApply: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Model Size Optimization</Label>
                <Select
                  value={autoTuneConfig.modelSize}
                  onValueChange={(value) => setAutoTuneConfig({ ...autoTuneConfig, modelSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Agent Routing</Label>
                <Select
                  value={autoTuneConfig.agentRouting}
                  onValueChange={(value) => setAutoTuneConfig({ ...autoTuneConfig, agentRouting: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resource Sizing</Label>
                <Select
                  value={autoTuneConfig.resourceSizing}
                  onValueChange={(value) => setAutoTuneConfig({ ...autoTuneConfig, resourceSizing: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Optimization Limits</h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Max Cost Increase</Label>
                    <span className="text-sm font-medium">{autoTuneConfig.maxCostIncrease}%</span>
                  </div>
                  <Slider
                    value={[autoTuneConfig.maxCostIncrease]}
                    onValueChange={([value]) => setAutoTuneConfig({ ...autoTuneConfig, maxCostIncrease: value })}
                    max={50}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Min Performance Gain</Label>
                    <span className="text-sm font-medium">{autoTuneConfig.minPerformanceGain}%</span>
                  </div>
                  <Slider
                    value={[autoTuneConfig.minPerformanceGain]}
                    onValueChange={([value]) => setAutoTuneConfig({ ...autoTuneConfig, minPerformanceGain: value })}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Performance metrics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: OptimizationSuggestion }) {
  const impactColors = {
    high: "text-green-500",
    medium: "text-yellow-500",
    low: "text-blue-500",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <div>
              <Badge variant="outline" className="mb-1">
                {suggestion.type}
              </Badge>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            </div>
          </div>
          <Badge variant="secondary">{suggestion.confidence}% confidence</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{suggestion.description}</p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Expected Impact</div>
            <div className={`font-semibold ${impactColors[suggestion.impact]}`}>{suggestion.impact.toUpperCase()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Resource Change</div>
            <div className="font-semibold">{suggestion.resourceChange}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cost Impact</div>
            <div className="font-semibold">{suggestion.costImpact}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm">Apply</Button>
          <Button size="sm" variant="outline">
            Simulate
          </Button>
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
