"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Activity,
  Zap,
  Brain,
  Sparkles,
  Heart,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react"
import { WidgetGrid } from "../dashboard/widget-grid"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const performanceData = [
  { time: "00:00", tokens: 1200, latency: 95, accuracy: 94 },
  { time: "04:00", tokens: 1450, latency: 88, accuracy: 96 },
  { time: "08:00", tokens: 1800, latency: 92, accuracy: 95 },
  { time: "12:00", tokens: 2100, latency: 85, accuracy: 97 },
  { time: "16:00", tokens: 1900, latency: 90, accuracy: 96 },
  { time: "20:00", tokens: 1600, latency: 93, accuracy: 95 },
]

const healthData = [
  { metric: "CPU", value: 65, fullMark: 100 },
  { metric: "Memory", value: 72, fullMark: 100 },
  { metric: "Network", value: 88, fullMark: 100 },
  { metric: "Latency", value: 92, fullMark: 100 },
  { metric: "Accuracy", value: 96, fullMark: 100 },
]

export function AgentControlBoard({ widgets, onWidgetsChange }: any) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Agent Control Board
          </h2>
          <p className="text-muted-foreground mt-1">Monitor and manage all AI agents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +2 from last hour
                </p>
              </div>
              <Activity className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold">247</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  18 in queue
                </p>
              </div>
              <Zap className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">98.5%</p>
                <p className="text-xs text-purple-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Above target
                </p>
              </div>
              <Brain className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-3xl font-bold">89ms</p>
                <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                  <BarChart3 className="h-3 w-3" />
                  -8ms improvement
                </p>
              </div>
              <Sparkles className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Agent Status</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="health">Health Dashboard</TabsTrigger>
          <TabsTrigger value="types">Agent Types</TabsTrigger>
        </TabsList>

        {/* Agent Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const isActive = i % 3 !== 2
              const agentTypes = ["Core", "Specialized", "ML", "Generative", "Quantum"]
              const agentType = agentTypes[i % agentTypes.length]

              return (
                <Card
                  key={i}
                  className={`cursor-pointer transition-all hover:shadow-lg ${selectedAgent === `agent-${i}` ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedAgent(`agent-${i}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                        />
                        <span className="font-semibold">Agent {i + 1}</span>
                      </div>
                      <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Idle"}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{agentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Load:</span>
                        <span className="font-medium">{Math.floor(Math.random() * 40 + 30)}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Usage Over Time</CardTitle>
                <CardDescription>Tokens processed per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="tokens" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTokens)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latency & Accuracy Trends</CardTitle>
                <CardDescription>Performance metrics comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Health Dashboard Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Radar</CardTitle>
                <CardDescription>Overall system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={healthData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Health" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Detailed health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthData.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-muted-foreground">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          metric.value >= 90
                            ? "bg-green-500"
                            : metric.value >= 70
                              ? "bg-blue-500"
                              : metric.value >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agent Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Creative AI Agent</h3>
                    <Badge variant="outline" className="mt-1">
                      Generative
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emotional Storytelling:</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creativity Score:</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Innovation Index:</span>
                    <span className="font-medium">87</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  Manage Agent
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">ML Optimization Agent</h3>
                    <Badge variant="outline" className="mt-1">
                      Machine Learning
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Feature Engineering:</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Accuracy:</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimization Gain:</span>
                    <span className="font-medium">+12.5%</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  Manage Agent
                </Button>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Cpu className="h-8 w-8 text-cyan-500" />
                  <div>
                    <h3 className="font-semibold text-lg">Quantum Agent</h3>
                    <Badge variant="outline" className="mt-1">
                      Quantum Computing
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circuit Efficiency:</span>
                    <span className="font-medium">78.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantum Gates:</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error Rate:</span>
                    <span className="font-medium text-green-500">0.02%</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">
                  Manage Agent
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Custom Widgets */}
      {widgets && widgets.length > 0 && (
        <WidgetGrid tabId="control" widgets={widgets} onWidgetsChange={onWidgetsChange} />
      )}
    </div>
  )
}
