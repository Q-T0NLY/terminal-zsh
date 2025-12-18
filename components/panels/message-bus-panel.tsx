"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Activity, AlertCircle, CheckCircle2, Clock, RefreshCw, Settings, Filter } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const throughputData = [
  { time: "00:00", messages: 1200, rate: 20 },
  { time: "04:00", messages: 1450, rate: 24 },
  { time: "08:00", messages: 1800, rate: 30 },
  { time: "12:00", messages: 2100, rate: 35 },
  { time: "16:00", messages: 1900, rate: 32 },
  { time: "20:00", messages: 1600, rate: 27 },
]

const latencyData = [
  { time: "00:00", p50: 12, p95: 45, p99: 89 },
  { time: "04:00", p50: 10, p95: 42, p99: 85 },
  { time: "08:00", p50: 15, p95: 48, p99: 92 },
  { time: "12:00", p50: 18, p95: 52, p99: 98 },
  { time: "16:00", p50: 14, p95: 46, p99: 88 },
  { time: "20:00", p50: 11, p95: 43, p99: 86 },
]

const queueData = [
  { queue: "high-priority", depth: 45, consumers: 8, lag: 120 },
  { queue: "normal", depth: 234, consumers: 12, lag: 450 },
  { queue: "low-priority", depth: 89, consumers: 4, lag: 890 },
  { queue: "dead-letter", depth: 3, consumers: 2, lag: 0 },
]

export function MessageBusPanel({ widgets, onWidgetsChange }: any) {
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Message Bus & Event Streams
          </h2>
          <p className="text-muted-foreground mt-1">Message queue and event monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queue Depth</p>
                <p className="text-3xl font-bold">371</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3" />
                  Normal load
                </p>
              </div>
              <MessageSquare className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Throughput</p>
                <p className="text-3xl font-bold">35/s</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Optimal
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
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-3xl font-bold">14ms</p>
                <p className="text-xs text-purple-500 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  P95: 46ms
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
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-3xl font-bold">0.02%</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Below threshold
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="queues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queues">Queue Monitoring</TabsTrigger>
          <TabsTrigger value="throughput">Throughput Analytics</TabsTrigger>
          <TabsTrigger value="latency">Latency Dashboard</TabsTrigger>
          <TabsTrigger value="consumers">Consumer Groups</TabsTrigger>
        </TabsList>

        {/* Queue Monitoring Tab */}
        <TabsContent value="queues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Queue Depth</CardTitle>
              <CardDescription>Real-time bar chart + alert indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueData.map((queue) => (
                  <div
                    key={queue.queue}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedQueue === queue.queue
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedQueue(queue.queue)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <h4 className="font-semibold capitalize">{queue.queue.replace("-", " ")}</h4>
                        <Badge variant={queue.depth > 200 ? "destructive" : "default"}>
                          {queue.depth > 200 ? "High Load" : "Normal"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{queue.depth}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Consumers</p>
                        <p className="font-semibold">{queue.consumers} active</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Consumer Lag</p>
                        <p className="font-semibold">{queue.lag}ms</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold text-green-500">Healthy</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dead Letter Queue Manager</CardTitle>
              <CardDescription>Alert list + count metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 1, message: "Failed to process order #12345", timestamp: "2 min ago", retries: 3 },
                  { id: 2, message: "Invalid payload format", timestamp: "5 min ago", retries: 3 },
                  { id: 3, message: "Timeout connecting to service", timestamp: "8 min ago", retries: 3 },
                ].map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">{error.message}</p>
                        <p className="text-xs text-muted-foreground">{error.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{error.retries} retries</Badge>
                      <Button size="sm" variant="outline">
                        Retry
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Throughput Analytics Tab */}
        <TabsContent value="throughput" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Throughput Analytics</CardTitle>
                <CardDescription>Line chart + rate calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="messages" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Partitioning Overview</CardTitle>
                <CardDescription>Partition map + balance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { partition: 0, messages: 1250, leader: "broker-1", replicas: 3 },
                    { partition: 1, messages: 1180, leader: "broker-2", replicas: 3 },
                    { partition: 2, messages: 1320, leader: "broker-3", replicas: 3 },
                    { partition: 3, messages: 1090, leader: "broker-1", replicas: 3 },
                  ].map((partition) => (
                    <div key={partition.partition} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Partition {partition.partition}</span>
                        <Badge variant="outline">{partition.messages} msgs</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Leader:</span>
                          <span className="ml-2 font-medium">{partition.leader}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Replicas:</span>
                          <span className="ml-2 font-medium">{partition.replicas}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Latency Dashboard Tab */}
        <TabsContent value="latency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Latency Dashboard</CardTitle>
              <CardDescription>Heat map + percentile bands</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="p50" stroke="#10b981" fillOpacity={1} fill="url(#p50Gradient)" />
                  <Area type="monotone" dataKey="p95" stroke="#f59e0b" fillOpacity={1} fill="url(#p95Gradient)" />
                  <Area type="monotone" dataKey="p99" stroke="#ef4444" fillOpacity={0.3} fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">P50 Latency</p>
                  <p className="text-2xl font-bold text-green-500">14ms</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">P95 Latency</p>
                  <p className="text-2xl font-bold text-orange-500">46ms</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">P99 Latency</p>
                  <p className="text-2xl font-bold text-red-500">88ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumer Groups Tab */}
        <TabsContent value="consumers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumer Group Performance</CardTitle>
              <CardDescription>Grouped bar chart + comparison views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={queueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="queue" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="depth" fill="#8b5cf6" />
                  <Bar dataKey="consumers" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { name: "order-processor", members: 8, lag: 120, status: "healthy" },
                  { name: "notification-sender", members: 12, lag: 450, status: "healthy" },
                  { name: "analytics-collector", members: 4, lag: 890, status: "warning" },
                  { name: "backup-archiver", members: 2, lag: 2100, status: "warning" },
                ].map((group) => (
                  <Card key={group.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{group.name}</h4>
                        <Badge variant={group.status === "warning" ? "destructive" : "default"}>{group.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Members:</span>
                          <span className="font-medium">{group.members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Consumer Lag:</span>
                          <span className="font-medium">{group.lag}ms</span>
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
