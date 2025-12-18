"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Activity, Zap, Cpu, Network } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"

const agents = [
  { id: 1, name: "Core Agent 01", status: "active", health: 98, tokens: 15420 },
  { id: 2, name: "ML Agent 02", status: "active", health: 95, tokens: 12350 },
  { id: 3, name: "Gen Agent 03", status: "idle", health: 100, tokens: 8200 },
  { id: 4, name: "Core Agent 04", status: "active", health: 92, tokens: 18900 },
  { id: 5, name: "Spec Agent 05", status: "warning", health: 78, tokens: 9500 },
  { id: 6, name: "ML Agent 06", status: "active", health: 96, tokens: 14200 },
]

const performanceData = agents.map((agent) => ({
  name: agent.name.split(" ")[2],
  latency: Math.floor(Math.random() * 50) + 50,
  throughput: Math.floor(Math.random() * 500) + 500,
}))

const tokenUsageData = [
  { hour: "00:00", core: 4500, ml: 3200, gen: 2800, spec: 1500 },
  { hour: "04:00", core: 5200, ml: 3800, gen: 3100, spec: 1800 },
  { hour: "08:00", core: 6800, ml: 4500, gen: 3900, spec: 2200 },
  { hour: "12:00", core: 7500, ml: 5200, gen: 4200, spec: 2800 },
  { hour: "16:00", core: 6200, ml: 4800, gen: 3700, spec: 2400 },
  { hour: "20:00", core: 5500, ml: 4200, gen: 3300, spec: 2000 },
]

const activityTimeline = [
  { agent: "Core 01", start: 0, duration: 8, status: "completed" },
  { agent: "ML 02", start: 2, duration: 6, status: "active" },
  { agent: "Gen 03", start: 4, duration: 4, status: "active" },
  { agent: "Core 04", start: 1, duration: 7, status: "completed" },
  { agent: "Spec 05", start: 5, duration: 3, status: "warning" },
  { agent: "ML 06", start: 3, duration: 5, status: "active" },
]

const agentTypeDistribution = [
  { name: "Core Agents", value: 35, color: "#4B6CB7" },
  { name: "ML Agents", value: 25, color: "#28a745" },
  { name: "Generative", value: 20, color: "#FF6B6B" },
  { name: "Specialized", value: 20, color: "#FFC107" },
]

const capacityForecast = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 1}h`,
  current: Math.floor(Math.random() * 20) + 60,
  forecast: Math.floor(Math.random() * 20) + 70,
  capacity: 100,
}))

export function AgentControlBoard() {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#28a745]"
      case "idle":
        return "bg-[#6c757d]"
      case "warning":
        return "bg-[#FFC107]"
      default:
        return "bg-[#dc3545]"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-[#F5F7FA]">
      <div className="grid grid-cols-12 gap-4">
        {/* Widget 1: Agent Status Tiles - Status LED + Avatar Grid */}
        <Card className="col-span-12 lg:col-span-6 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#4B6CB7]" />
              Agent Status Tiles
            </CardTitle>
            <CardDescription>Real-time agent status monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#4B6CB7]/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-[#4B6CB7]" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#333333] truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">Health: {agent.health}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Widget 2: Agent Performance Metrics - Mini Bar Charts + Sparklines */}
        <Card className="col-span-12 lg:col-span-6 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#4B6CB7]" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Latency and throughput by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="latency" fill="#4B6CB7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="throughput" fill="#28a745" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 3: Token Usage per Agent - Stacked Bar Chart */}
        <Card className="col-span-12 lg:col-span-6 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#4B6CB7]" />
              Token Usage per Agent
            </CardTitle>
            <CardDescription>Token consumption by agent type over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tokenUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="core" stackId="a" fill="#4B6CB7" />
                <Bar dataKey="ml" stackId="a" fill="#28a745" />
                <Bar dataKey="gen" stackId="a" fill="#FF6B6B" />
                <Bar dataKey="spec" stackId="a" fill="#FFC107" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 4: Activity Timeline - Gantt Chart */}
        <Card className="col-span-12 lg:col-span-6 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#4B6CB7]" />
              Activity Timeline
            </CardTitle>
            <CardDescription>Agent execution timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityTimeline.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-muted-foreground">{item.agent}</div>
                  <div className="flex-1 h-8 bg-[#F5F7FA] rounded relative">
                    <div
                      className={`absolute h-full rounded ${
                        item.status === "completed"
                          ? "bg-[#28a745]"
                          : item.status === "warning"
                            ? "bg-[#FFC107]"
                            : "bg-[#4B6CB7]"
                      }`}
                      style={{
                        left: `${(item.start / 12) * 100}%`,
                        width: `${(item.duration / 12) * 100}%`,
                      }}
                    />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Widget 5: Health Score Dashboard - Radial Progress + Trend Indicators */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#4B6CB7]" />
              Health Score
            </CardTitle>
            <CardDescription>Overall agent health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.slice(0, 4).map((agent) => (
                <div key={agent.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#333333]">{agent.name}</span>
                    <span className="font-medium text-[#4B6CB7]">{agent.health}%</span>
                  </div>
                  <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${agent.health >= 90 ? "bg-[#28a745]" : agent.health >= 75 ? "bg-[#FFC107]" : "bg-[#dc3545]"}`}
                      style={{ width: `${agent.health}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Widget 6: Agent Type Distribution - Pie Chart + Donut Chart */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#4B6CB7]" />
              Agent Distribution
            </CardTitle>
            <CardDescription>By agent type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={agentTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {agentTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 7: Load Balancer View - Network Graph + Load Distribution */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Network className="h-5 w-5 text-[#4B6CB7]" />
              Load Balancer
            </CardTitle>
            <CardDescription>Load distribution across agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.slice(0, 4).map((agent) => {
                const load = Math.floor((agent.tokens / 20000) * 100)
                return (
                  <div key={agent.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#333333]">{agent.name}</span>
                      <span className="text-muted-foreground">{load}%</span>
                    </div>
                    <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4B6CB7]" style={{ width: `${load}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Widget 8: Capacity Forecast - Forecast Charts + Capacity Gauges */}
        <Card className="col-span-12 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333] flex items-center gap-2">
              <Cpu className="h-5 w-5 text-[#4B6CB7]" />
              Capacity Forecast
            </CardTitle>
            <CardDescription>Predicted capacity utilization over next 12 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={capacityForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="current" stroke="#4B6CB7" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line type="monotone" dataKey="capacity" stroke="#28a745" strokeWidth={1} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
