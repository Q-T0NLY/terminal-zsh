"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Cpu, Database, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface Metric {
  label: string
  value: string
  change: string
  icon: React.ReactNode
  progress?: number
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: "Active Agents",
      value: "12",
      change: "+3 from last hour",
      icon: <Activity className="h-5 w-5" />,
      progress: 60,
    },
    {
      label: "CPU Usage",
      value: "45%",
      change: "Normal load",
      icon: <Cpu className="h-5 w-5" />,
      progress: 45,
    },
    {
      label: "Memory Usage",
      value: "8.2 GB",
      change: "68% of 12 GB",
      icon: <Database className="h-5 w-5" />,
      progress: 68,
    },
    {
      label: "Tasks/min",
      value: "847",
      change: "+12% from average",
      icon: <Zap className="h-5 w-5" />,
      progress: 85,
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          progress: Math.min(100, Math.max(0, (metric.progress || 0) + (Math.random() - 0.5) * 10)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <div className="text-muted-foreground">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
            {metric.progress !== undefined && <Progress value={metric.progress} className="mt-3" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
