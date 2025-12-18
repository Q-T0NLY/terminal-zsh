"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Cpu, Clock, CheckCircle2, Loader2 } from "lucide-react"

interface ExecutionStats {
  workers: {
    totalWorkers: number
    idleWorkers: number
    busyWorkers: number
    totalTasksCompleted: number
    queueLength: number
  }
  messageQueue: {
    queueLength: number
    isProcessing: boolean
    handlerCounts: Record<string, number>
  }
}

export default function ExecutionMonitor() {
  const [stats, setStats] = useState<ExecutionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 2000) // Update every 2 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/execution/stats")
      const data = await response.json()
      setStats(data)
      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Failed to fetch execution stats:", error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center p-8 text-gray-400">
        <p>Failed to load execution stats</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Workers</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.workers.totalWorkers}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.workers.idleWorkers} idle, {stats.workers.busyWorkers} busy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Tasks Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.workers.totalTasksCompleted}</div>
            <p className="text-xs text-gray-400 mt-1">Total executions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Task Queue</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.workers.queueLength}</div>
            <p className="text-xs text-gray-400 mt-1">Pending tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Message Queue</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.messageQueue.queueLength}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.messageQueue.isProcessing ? (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Processing
                </Badge>
              ) : (
                <Badge variant="default" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                  Idle
                </Badge>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200">Message Handlers</CardTitle>
          <CardDescription className="text-gray-400">Registered handlers by message type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.messageQueue.handlerCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <span className="text-sm text-gray-300">{type}</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
