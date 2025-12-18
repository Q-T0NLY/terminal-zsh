"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cpu, HardDrive, Network, Server, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

const systemMetrics = {
  cpu: { current: 45, avg: 52, peak: 89, status: "healthy" },
  memory: { current: 68, avg: 65, peak: 92, status: "warning" },
  disk: { current: 72, avg: 70, peak: 85, status: "healthy" },
  network: { current: 34, avg: 42, peak: 78, status: "healthy" },
}

const performanceData = [
  { time: "00:00", cpu: 35, memory: 55, disk: 60, network: 25 },
  { time: "04:00", cpu: 28, memory: 52, disk: 58, network: 18 },
  { time: "08:00", cpu: 52, memory: 68, disk: 65, network: 45 },
  { time: "12:00", cpu: 68, memory: 75, disk: 72, network: 62 },
  { time: "16:00", cpu: 72, memory: 82, disk: 78, network: 58 },
  { time: "20:00", cpu: 45, memory: 65, disk: 68, network: 35 },
]

const healthScore = [
  { metric: "CPU", score: 85 },
  { metric: "Memory", score: 72 },
  { metric: "Disk", score: 88 },
  { metric: "Network", score: 92 },
  { metric: "Services", score: 95 },
  { metric: "Security", score: 90 },
]

const services = [
  { name: "API Gateway", status: "running", uptime: "99.9%", requests: 125420 },
  { name: "Database", status: "running", uptime: "99.8%", requests: 89234 },
  { name: "Cache Server", status: "running", uptime: "100%", requests: 234567 },
  { name: "Message Queue", status: "warning", uptime: "98.5%", requests: 45678 },
  { name: "Worker Nodes", status: "running", uptime: "99.7%", requests: 67890 },
]

export function SystemHealthPanel() {
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Health Monitor</h2>
          <p className="text-muted-foreground">Real-time infrastructure and service monitoring</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          System Healthy
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="health-score">Health Score</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            {Object.entries(systemMetrics).map(([key, data]) => {
              const icons = {
                cpu: Cpu,
                memory: HardDrive,
                disk: Server,
                network: Network,
              }
              const Icon = icons[key as keyof typeof icons]

              return (
                <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <Badge variant={data.status === "healthy" ? "default" : "secondary"}>{data.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground capitalize">{key}</p>
                        <p className="text-3xl font-bold">{data.current}%</p>
                      </div>
                      <Progress value={data.current} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Avg: {data.avg}%</span>
                        <span>Peak: {data.peak}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Resource utilization over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area type="monotone" dataKey="disk" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="network"
                    stackId="4"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
                <CardDescription>Processor utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>RAM utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disk I/O</CardTitle>
                <CardDescription>Storage read/write operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Traffic</CardTitle>
                <CardDescription>Bandwidth utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Monitor all running services and their health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-3 w-3 rounded-full ${service.status === "running" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                      />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.requests.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">requests/day</p>
                      </div>
                      <Badge variant={service.status === "running" ? "default" : "secondary"}>{service.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-score" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health Score</CardTitle>
              <CardDescription>Comprehensive health assessment across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={healthScore}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Health Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {healthScore.map((item) => (
              <Card key={item.metric}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">{item.score}/100</div>
                  <Progress value={item.score} />
                  <p className="text-xs text-muted-foreground">
                    {item.score >= 90 ? "Excellent" : item.score >= 75 ? "Good" : "Needs Attention"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
