"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Map,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  Settings,
  Play,
  Pause,
  GitBranch,
  Network,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

const processFlowData = [
  { id: "node-1", name: "Input Queue", status: "active", throughput: 1250, latency: 12 },
  { id: "node-2", name: "Preprocessor", status: "active", throughput: 1200, latency: 45 },
  { id: "node-3", name: "Agent Pool", status: "active", throughput: 1180, latency: 89 },
  { id: "node-4", name: "Postprocessor", status: "active", throughput: 1150, latency: 32 },
  { id: "node-5", name: "Output Queue", status: "active", throughput: 1150, latency: 8 },
]

const queueData = [
  { time: "00:00", depth: 45 },
  { time: "04:00", depth: 52 },
  { time: "08:00", depth: 78 },
  { time: "12:00", depth: 95 },
  { time: "16:00", depth: 68 },
  { time: "20:00", depth: 42 },
]

const latencyHeatmapData = [
  { node: "Input", region: "US-East", latency: 12, x: 1, y: 1 },
  { node: "Input", region: "US-West", latency: 18, x: 2, y: 1 },
  { node: "Input", region: "EU", latency: 45, x: 3, y: 1 },
  { node: "Process", region: "US-East", latency: 89, x: 1, y: 2 },
  { node: "Process", region: "US-West", latency: 92, x: 2, y: 2 },
  { node: "Process", region: "EU", latency: 105, x: 3, y: 2 },
  { node: "Output", region: "US-East", latency: 8, x: 1, y: 3 },
  { node: "Output", region: "US-West", latency: 11, x: 2, y: 3 },
  { node: "Output", region: "EU", latency: 32, x: 3, y: 3 },
]

export function RuntimeMap({ widgets, onWidgetsChange }: any) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Map className="h-8 w-8 text-primary" />
            Orchestrator Runtime Map
          </h2>
          <p className="text-muted-foreground mt-1">Real-time process visualization and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start All
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Nodes</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All operational
                </p>
              </div>
              <Network className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queue Depth</p>
                <p className="text-3xl font-bold">68</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3" />
                  Normal load
                </p>
              </div>
              <GitBranch className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-3xl font-bold">47ms</p>
                <p className="text-xs text-purple-500 flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3" />
                  Optimal
                </p>
              </div>
              <Clock className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Throughput</p>
                <p className="text-3xl font-bold">1.2K/s</p>
                <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3" />
                  +15% from avg
                </p>
              </div>
              <Activity className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="flow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flow">Process Flow</TabsTrigger>
          <TabsTrigger value="nodes">Node Network</TabsTrigger>
          <TabsTrigger value="queues">Queue Management</TabsTrigger>
          <TabsTrigger value="latency">Latency Heatmap</TabsTrigger>
        </TabsList>

        {/* Process Flow Tab */}
        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Flow Visualizer</CardTitle>
              <CardDescription>Sankey diagram + flow map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processFlowData.map((node, idx) => (
                  <div
                    key={node.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedNode === node.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <h4 className="font-semibold text-lg">{node.name}</h4>
                        <Badge variant="default">{node.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Throughput</p>
                        <p className="font-semibold">{node.throughput}/s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Latency</p>
                        <p className="font-semibold">{node.latency}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold text-green-500">Healthy</p>
                      </div>
                    </div>

                    {idx < processFlowData.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <div className="h-8 w-0.5 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Node Network Tab */}
        <TabsContent value="nodes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Node Network</CardTitle>
                <CardDescription>Graph network + D3 force layout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {processFlowData.map((node) => (
                    <Card key={node.id} className="border-2 hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="font-medium text-sm">{node.name}</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Throughput:</span>
                            <span className="font-medium">{node.throughput}/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Latency:</span>
                            <span className="font-medium">{node.latency}ms</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Node Status Dashboard</CardTitle>
                <CardDescription>Color-coded graph + status panels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processFlowData.map((node) => (
                    <div key={node.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{node.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{node.throughput}/s</span>
                        <Badge variant="outline">{node.latency}ms</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Queue Management Tab */}
        <TabsContent value="queues" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Queue Depth Monitor</CardTitle>
                <CardDescription>Heat map matrix + color gradients</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={queueData}>
                    <defs>
                      <linearGradient id="queueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="depth" stroke="#3b82f6" fillOpacity={1} fill="url(#queueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-scaling Overview</CardTitle>
                <CardDescription>Line chart + threshold lines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Current Capacity</span>
                    <span className="text-sm font-bold">24 nodes</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Scale Threshold</span>
                    <span className="text-sm font-bold text-yellow-500">80%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Auto-scale Status</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={queueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="depth" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Latency Heatmap Tab */}
        <TabsContent value="latency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Latency Heatmap</CardTitle>
              <CardDescription>Geographic/grid heatmap visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {["US-East", "US-West", "EU"].map((region) => (
                  <div key={region} className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">{region}</p>
                    <p className="text-2xl font-bold">
                      {Math.floor(Math.random() * 50 + 30)}
                      <span className="text-sm text-muted-foreground">ms</span>
                    </p>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" dataKey="x" name="Region" className="text-xs" />
                  <YAxis type="number" dataKey="y" name="Node" className="text-xs" />
                  <ZAxis type="number" dataKey="latency" range={[100, 1000]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Latency" data={latencyHeatmapData} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {processFlowData.slice(0, 3).map((node) => (
                  <Card key={node.id}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{node.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Latency:</span>
                          <span className="font-medium">{node.latency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">P95:</span>
                          <span className="font-medium">{node.latency + 15}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">P99:</span>
                          <span className="font-medium">{node.latency + 30}ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
