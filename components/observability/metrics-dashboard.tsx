"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MetricsDashboardProps {
  refreshInterval?: number
}

export default function MetricsDashboard({ refreshInterval = 5000 }: MetricsDashboardProps) {
  const [health, setHealth] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [traces, setTraces] = useState<any>(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const fetchData = async () => {
    try {
      const [healthRes, metricsRes, tracesRes] = await Promise.all([
        fetch("/api/observability/health"),
        fetch("/api/observability/metrics"),
        fetch("/api/observability/traces"),
      ])

      const [healthData, metricsData, tracesData] = await Promise.all([
        healthRes.json(),
        metricsRes.json(),
        tracesRes.json(),
      ])

      setHealth(healthData)
      setMetrics(metricsData)
      setTraces(tracesData)
    } catch (error) {
      console.error("[v0] Failed to fetch observability data:", error)
    }
  }

  if (!health || !metrics || !traces) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading metrics...</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400"
      case "degraded":
        return "text-yellow-400"
      case "unhealthy":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case "unhealthy":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <Activity className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                {getStatusIcon(health.status)}
                System Health
              </CardTitle>
              <CardDescription className="text-gray-400">Overall system status and component health</CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`${
                health.status === "healthy"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : health.status === "degraded"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {health.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {health.components.map((component: any) => (
              <div key={component.name} className="p-4 bg-gray-900/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{component.name}</span>
                  {getStatusIcon(component.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Latency</span>
                    <span className="text-gray-300">{component.latency?.toFixed(2)}ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Error Rate</span>
                    <span className="text-gray-300">{(component.errorRate * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Metrics</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.totalMetrics.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Collected data points</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Active Traces</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{traces.totalTraces}</div>
            <p className="text-xs text-gray-400 mt-1">{traces.activeSpans} active spans</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{traces.avgDuration.toFixed(0)}ms</div>
            <p className="text-xs text-gray-400 mt-1">Trace execution time</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Error Rate</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{(traces.errorRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-gray-400 mt-1">Failed operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Metrics Over Time</CardTitle>
          <CardDescription className="text-gray-400">Recent metric values</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.recentMetrics.slice(-50)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
