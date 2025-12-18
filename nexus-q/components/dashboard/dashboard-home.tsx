"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshIndicator } from "@/components/ui/refresh-indicator"
import { Activity, Bot, Zap, TrendingUp, AlertCircle, CheckCircle2, Shield, BarChart3, Clock } from "lucide-react"
import {
  AreaChart,
  Area,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts"

const agentSparklineData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  value: Math.floor(Math.random() * 5) + 10,
}))

const latencyData = [
  { metric: "P50", value: 45, color: "#4B6CB7" },
  { metric: "P95", value: 98, color: "#FF6B6B" },
  { metric: "P99", value: 156, color: "#FFC107" },
]

const tokenThroughputData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  tokens: Math.floor(Math.random() * 5000) + 15000,
}))

const aiConfidenceData = [
  { subject: "Accuracy", value: 92 },
  { subject: "Reliability", value: 88 },
  { subject: "Performance", value: 95 },
  { subject: "Security", value: 90 },
  { subject: "Scalability", value: 85 },
]

const loadForecastData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 1}h`,
  current: Math.floor(Math.random() * 30) + 50,
  forecast: Math.floor(Math.random() * 30) + 60,
}))

const recentActivities = [
  {
    icon: CheckCircle2,
    color: "text-green-500",
    title: "Agent deployed successfully",
    time: "2 minutes ago",
    type: "success",
  },
  {
    icon: Activity,
    color: "text-blue-500",
    title: "Workflow execution completed",
    time: "5 minutes ago",
    type: "info",
  },
  {
    icon: AlertCircle,
    color: "text-yellow-500",
    title: "High memory usage detected",
    time: "10 minutes ago",
    type: "warning",
  },
  { icon: Bot, color: "text-purple-500", title: "New agent registered", time: "15 minutes ago", type: "info" },
  {
    icon: Zap,
    color: "text-green-500",
    title: "Performance optimization applied",
    time: "20 minutes ago",
    type: "success",
  },
]

export function DashboardHome() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    console.log("[v0] Dashboard refreshed at", new Date().toLocaleTimeString())
  }

  return (
    <div className="p-6 space-y-6 bg-[#F5F7FA]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">Dashboard Home</h1>
          <p className="text-sm text-muted-foreground">Real-time system overview and KPIs</p>
        </div>
        <RefreshIndicator interval={5000} onRefresh={handleRefresh} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Widget 1: Active Agents Counter - Digital LED + Sparkline */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#4B6CB7]" />
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4B6CB7] mb-2">12</div>
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={agentSparklineData}>
                <Area type="monotone" dataKey="value" stroke="#4B6CB7" fill="#4B6CB7" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-[#28a745] inline mr-1" />
              +2 from last hour
            </p>
          </CardContent>
        </Card>

        {/* Widget 2: Workflows Running Gauge - Gauge + Trend Line */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#4B6CB7]" />
              Workflows Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F5F7FA" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4B6CB7"
                    strokeWidth="8"
                    strokeDasharray={`${(85 / 100) * 251.2} 251.2`}
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="50" textAnchor="middle" dy="7" className="text-2xl font-bold fill-[#4B6CB7]">
                    85%
                  </text>
                </svg>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">8 of 12 workflows active</p>
          </CardContent>
        </Card>

        {/* Widget 3: Avg Latency Monitor - Bar Chart + Percentile */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4B6CB7]" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4B6CB7] mb-2">98ms</div>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={latencyData}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {latencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 4: Token Throughput - Area Chart + Rate Indicator */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#4B6CB7]" />
              Token Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4B6CB7] mb-2">18.5K/s</div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={tokenThroughputData.slice(-10)}>
                <Area type="monotone" dataKey="tokens" stroke="#4B6CB7" fill="#4B6CB7" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 text-[#28a745] inline mr-1" />
              +12% increase
            </p>
          </CardContent>
        </Card>

        {/* Widget 5: Success Rate % - Donut Chart + Trend Arrow */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#4B6CB7]" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Success", value: 99.2 },
                      { name: "Failed", value: 0.8 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                  >
                    <Cell fill="#28a745" />
                    <Cell fill="#dc3545" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#28a745]">99.2%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-[#28a745] inline mr-1" />
                +0.3% improvement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Widget 6: AIE Confidence Score - Radar Chart */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#4B6CB7]" />
              AI Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <RadarChart data={aiConfidenceData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="#4B6CB7" fill="#4B6CB7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 7: Predictive Load Index - Heat Map + Forecast Line */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#4B6CB7]" />
              Predictive Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={loadForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
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
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Widget 8: Security Posture Dial - Status Dial + Alert Indicators */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-3 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#333333] flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#4B6CB7]" />
              Security Posture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-2">
              <Badge variant="default" className="bg-[#28a745] text-white">
                Secure
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Firewall</span>
                <CheckCircle2 className="h-4 w-4 text-[#28a745]" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Encryption</span>
                <CheckCircle2 className="h-4 w-4 text-[#28a745]" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Auth</span>
                <CheckCircle2 className="h-4 w-4 text-[#28a745]" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Compliance</span>
                <AlertCircle className="h-4 w-4 text-[#FFC107]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget 9: Recent Activity Feed - Timeline + Event Stream */}
        <Card className="col-span-12 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Recent Activity Feed</CardTitle>
            <CardDescription>Latest system events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => {
                const Icon = activity.icon
                return (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="mt-1">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-[#333333]">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
