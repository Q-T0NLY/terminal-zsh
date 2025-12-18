"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Play, Pause, CheckCircle2, AlertCircle, RefreshCw, Settings, Plus } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

const jobData = [
  { id: 1, name: "Daily Backup", schedule: "0 2 * * *", nextRun: "2h 15m", status: "active", lastResult: "success" },
  {
    id: 2,
    name: "Report Generation",
    schedule: "0 8 * * 1",
    nextRun: "1d 6h",
    status: "active",
    lastResult: "success",
  },
  { id: 3, name: "Data Sync", schedule: "*/15 * * * *", nextRun: "8m", status: "active", lastResult: "success" },
  { id: 4, name: "Cache Cleanup", schedule: "0 */6 * * *", nextRun: "3h 42m", status: "paused", lastResult: "failed" },
  { id: 5, name: "Email Digest", schedule: "0 9 * * *", nextRun: "7h 30m", status: "active", lastResult: "success" },
]

const executionData = [
  { time: "00:00", success: 45, failed: 2 },
  { time: "04:00", success: 52, failed: 1 },
  { time: "08:00", success: 78, failed: 3 },
  { time: "12:00", success: 95, failed: 2 },
  { time: "16:00", success: 88, failed: 1 },
  { time: "20:00", success: 67, failed: 0 },
]

const statusDistribution = [
  { name: "Success", value: 425, color: "#10b981" },
  { name: "Failed", value: 9, color: "#ef4444" },
  { name: "Running", value: 3, color: "#3b82f6" },
  { name: "Pending", value: 12, color: "#f59e0b" },
]

export function SchedulerPanel({ widgets, onWidgetsChange }: any) {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Scheduler & Cron Management
          </h2>
          <p className="text-muted-foreground mt-1">Job scheduling and automation</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Job
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
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  All running
                </p>
              </div>
              <Calendar className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">97.9%</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Last 24h
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Execution</p>
                <p className="text-3xl font-bold">8m</p>
                <p className="text-xs text-purple-500 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Data Sync
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
                <p className="text-sm text-muted-foreground">Failed Jobs</p>
                <p className="text-3xl font-bold">1</p>
                <p className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  Needs attention
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Job Calendar</TabsTrigger>
          <TabsTrigger value="cron">Cron Builder</TabsTrigger>
          <TabsTrigger value="execution">Execution Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Job Analytics</TabsTrigger>
        </TabsList>

        {/* Job Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Jobs</CardTitle>
              <CardDescription>Calendar view + status icons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobData.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedJob === job.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedJob(job.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {job.status === "active" ? (
                          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-gray-400" />
                        )}
                        <h4 className="font-semibold">{job.name}</h4>
                        <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                        <Badge variant={job.lastResult === "success" ? "default" : "destructive"}>
                          {job.lastResult}
                        </Badge>
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
                        <p className="text-muted-foreground">Schedule</p>
                        <p className="font-mono text-xs">{job.schedule}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Run</p>
                        <p className="font-semibold">{job.nextRun}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Result</p>
                        <p
                          className={`font-semibold ${job.lastResult === "success" ? "text-green-500" : "text-red-500"}`}
                        >
                          {job.lastResult}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cron Builder Tab */}
        <TabsContent value="cron" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cron Expression Builder</CardTitle>
              <CardDescription>Visual builder + syntax highlighter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg font-mono text-center text-2xl">0 2 * * *</div>

                <div className="grid grid-cols-5 gap-4">
                  {[
                    { label: "Minute", value: "0", range: "0-59" },
                    { label: "Hour", value: "2", range: "0-23" },
                    { label: "Day", value: "*", range: "1-31" },
                    { label: "Month", value: "*", range: "1-12" },
                    { label: "Weekday", value: "*", range: "0-6" },
                  ].map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-sm font-medium">{field.label}</label>
                      <input
                        type="text"
                        value={field.value}
                        className="w-full px-3 py-2 border rounded-md text-center font-mono"
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground text-center">{field.range}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm font-medium mb-2">Human Readable:</p>
                  <p className="text-blue-600 dark:text-blue-400">At 02:00 AM, every day</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Apply Expression</Button>
                  <Button variant="outline">Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Timeline Tab */}
        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
              <CardDescription>Gantt chart + dependency lines</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={executionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="success" fill="#10b981" stackId="a" />
                  <Bar dataKey="failed" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Recent Executions</h4>
                {[
                  { job: "Daily Backup", time: "2:00 AM", duration: "12m 34s", status: "success" },
                  { job: "Data Sync", time: "1:45 AM", duration: "2m 18s", status: "success" },
                  { job: "Cache Cleanup", time: "12:00 AM", duration: "5m 42s", status: "failed" },
                ].map((execution, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {execution.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{execution.job}</p>
                        <p className="text-xs text-muted-foreground">{execution.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{execution.duration}</p>
                      <Badge variant={execution.status === "success" ? "default" : "destructive"}>
                        {execution.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success/Failure Rate</CardTitle>
                <CardDescription>Donut chart + trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Performance Metrics</CardTitle>
                <CardDescription>Time series + benchmark comparisons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Daily Backup", avgDuration: "12m 34s", successRate: 100 },
                  { name: "Report Generation", avgDuration: "8m 15s", successRate: 98 },
                  { name: "Data Sync", avgDuration: "2m 18s", successRate: 99 },
                  { name: "Cache Cleanup", avgDuration: "5m 42s", successRate: 85 },
                ].map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.name}</span>
                      <span className="text-muted-foreground">{metric.avgDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.successRate >= 95 ? "bg-green-500" : "bg-yellow-500"}`}
                          style={{ width: `${metric.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-12 text-right">{metric.successRate}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
