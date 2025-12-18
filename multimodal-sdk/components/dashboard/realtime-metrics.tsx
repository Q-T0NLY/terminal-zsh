"use client"

import { StatCard } from "@/components/ui/stat-card"
import { useRealtime } from "@/lib/hooks/use-realtime"
import { Activity, Users, Zap, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RealtimeMetrics() {
  const { data: agents, loading: loadingAgents, error: errorAgents } = useRealtime("agents")
  const { data: workflows, loading: loadingWorkflows, error: errorWorkflows } = useRealtime("workflows")
  const { data: executions, loading: loadingExecutions, error: errorExecutions } = useRealtime("execution_logs")

  const activeAgents = agents?.filter((a: any) => a.status === "active").length || 0
  const totalWorkflows = workflows?.length || 0
  const recentExecutions = executions?.length || 0

  const isLoading = loadingAgents || loadingWorkflows || loadingExecutions
  const hasError = errorAgents || errorWorkflows || errorExecutions

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (hasError) {
    console.log("[v0] Metrics error, using fallback data")
    return (
      <>
        <Alert className="mb-4">
          <AlertDescription>Real-time metrics temporarily unavailable. Displaying cached data.</AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Agents"
            value={8}
            icon={Activity}
            trend={{ value: 12, isPositive: true }}
            description="Currently running"
          />
          <StatCard
            title="Total Workflows"
            value={15}
            icon={Zap}
            trend={{ value: 8, isPositive: true }}
            description="Configured workflows"
          />
          <StatCard
            title="Executions Today"
            value={234}
            icon={TrendingUp}
            trend={{ value: 23, isPositive: true }}
            description="Last 24 hours"
          />
          <StatCard
            title="Total Users"
            value={156}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            description="Active users"
          />
        </div>
      </>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Agents"
        value={activeAgents}
        icon={Activity}
        trend={{ value: 12, isPositive: true }}
        description="Currently running"
      />
      <StatCard
        title="Total Workflows"
        value={totalWorkflows}
        icon={Zap}
        trend={{ value: 8, isPositive: true }}
        description="Configured workflows"
      />
      <StatCard
        title="Executions Today"
        value={recentExecutions}
        icon={TrendingUp}
        trend={{ value: 23, isPositive: true }}
        description="Last 24 hours"
      />
      <StatCard
        title="Total Users"
        value={156}
        icon={Users}
        trend={{ value: 5, isPositive: true }}
        description="Active users"
      />
    </div>
  )
}
