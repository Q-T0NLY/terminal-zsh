"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Grid, Activity, Zap, Brain, Sparkles, Heart, Cpu } from "lucide-react"
import { WidgetGrid } from "../dashboard/widget-grid"

export function AgentControlBoard({ widgets, onWidgetsChange }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🛠️ Agent Control Board</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
          <Button variant="outline">
            <Grid className="h-4 w-4 mr-2" />
            Layout Options
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Agent Types Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Advanced Agent Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Creative AI Agent</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Emotional Storytelling: Active</div>
                  <div>Creativity Score: 92%</div>
                  <div>Innovation Index: 87</div>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Manage
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">ML Optimization Agent</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Feature Engineering: Active</div>
                  <div>Model Accuracy: 94.2%</div>
                  <div>Optimization Gain: 12.5%</div>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Manage
                </Button>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-5 w-5 text-cyan-500" />
                  <span className="font-medium">Quantum Agent</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Circuit Efficiency: 78.9%</div>
                  <div>Quantum Gates: 247</div>
                  <div>Error Rate: 0.02%</div>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Manage
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Status Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Agent {i + 1}</span>
                    <Badge variant={i % 3 === 0 ? "default" : "secondary"}>{i % 3 === 0 ? "Active" : "Idle"}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Tasks: {Math.floor(Math.random() * 50)}</div>
                    <div>Uptime: {Math.floor(Math.random() * 24)}h</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Widgets */}
      {widgets && widgets.length > 0 && (
        <WidgetGrid tabId="control" widgets={widgets} onWidgetsChange={onWidgetsChange} />
      )}
    </div>
  )
}
