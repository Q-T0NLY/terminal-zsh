"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Metric {
  label: string
  value: string | number
  trend?: "up" | "down" | "stable"
  trendValue?: string
  color?: "success" | "warning" | "error" | "default"
  onClick?: () => void
}

interface GlobalMetricsRowProps {
  metrics?: {
    activeWorkflows?: number
    successRate?: number
    avgLatencyMs?: number
    estimatedCostPerHour?: number
  }
}

export function GlobalMetricsRow({ metrics = {} }: GlobalMetricsRowProps) {
  const metricsData: Metric[] = [
    {
      label: "Active Workflows",
      value: metrics.activeWorkflows || 0,
      trend: "up",
      trendValue: "+12%",
    },
    {
      label: "Success Rate (24h)",
      value: `${((metrics.successRate || 0.95) * 100).toFixed(1)}%`,
      trend: "stable",
      color: (metrics.successRate || 0.95) > 0.95 ? "success" : "warning",
    },
    {
      label: "Avg Latency",
      value: `${(metrics.avgLatencyMs || 120).toFixed(0)}ms`,
      trend: "down",
      trendValue: "-8%",
      color: "success",
    },
    {
      label: "Cost/Hour",
      value: `$${(metrics.estimatedCostPerHour || 2.45).toFixed(2)}`,
      trend: "up",
      trendValue: "+5%",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricsData.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 cursor-pointer hover:border-primary transition-colors" onClick={metric.onClick}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                <div
                  className={`text-2xl font-bold ${
                    metric.color === "success"
                      ? "text-green-500"
                      : metric.color === "warning"
                        ? "text-yellow-500"
                        : metric.color === "error"
                          ? "text-red-500"
                          : ""
                  }`}
                >
                  {metric.value}
                </div>
              </div>
              {metric.trend && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    metric.trend === "up"
                      ? "text-green-500"
                      : metric.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {metric.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {metric.trend === "down" && <TrendingDown className="h-3 w-3" />}
                  {metric.trend === "stable" && <Minus className="h-3 w-3" />}
                  {metric.trendValue}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
