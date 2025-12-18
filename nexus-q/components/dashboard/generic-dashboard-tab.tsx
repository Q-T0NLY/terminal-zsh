"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface GenericDashboardTabProps {
  title: string
  description: string
  icon: LucideIcon
}

const generateSampleData = () =>
  Array.from({ length: 12 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 100) + 50,
  }))

export function GenericDashboardTab({ title, description, icon: Icon }: GenericDashboardTabProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [data] = useState(generateSampleData())

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6 bg-[#F5F7FA]">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-[#4B6CB7]" />
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Chart Widget */}
        <Card className="col-span-12 lg:col-span-8 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Overview</CardTitle>
            <CardDescription>Real-time metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4B6CB7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats Widget */}
        <Card className="col-span-12 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Key Metrics</CardTitle>
            <CardDescription>Current statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-[#4B6CB7]">1,234</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-[#28a745]">892</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-[#FFC107]">234</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-[#dc3545]">108</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">Uptime</span>
                <span className="text-sm font-medium text-[#28a745]">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">Response Time</span>
                <span className="text-sm font-medium text-[#4B6CB7]">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">Throughput</span>
                <span className="text-sm font-medium text-[#4B6CB7]">1.2K/s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[#333333]">CPU Usage</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4B6CB7]" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[#333333]">Memory</span>
                  <span className="text-muted-foreground">62%</span>
                </div>
                <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#28a745]" style={{ width: "62%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[#333333]">Storage</span>
                  <span className="text-muted-foreground">38%</span>
                </div>
                <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFC107]" style={{ width: "38%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#333333]">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">System Health</span>
                <span className="text-xs px-2 py-1 bg-[#28a745]/10 text-[#28a745] rounded">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">Last Updated</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#333333]">Next Refresh</span>
                <span className="text-xs text-muted-foreground">5s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
