"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, AlertCircle, CheckCircle2, Info, XCircle, Clock, Plus, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Agent Deployment Successful",
    message: "Creative AI Agent v2.1 deployed to production",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "High Memory Usage",
    message: "ML Optimization Agent using 85% memory",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "error",
    title: "Workflow Execution Failed",
    message: "Data processing workflow encountered an error",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "System Update Available",
    message: "Nexus Quantum v3.2.0 is ready to install",
    time: "3 hours ago",
    read: true,
  },
]

const alertRules = [
  { id: 1, name: "High CPU Usage", condition: "cpu > 80%", enabled: true, triggered: 12 },
  { id: 2, name: "Memory Threshold", condition: "memory > 90%", enabled: true, triggered: 5 },
  { id: 3, name: "Error Rate Spike", condition: "errors > 100/min", enabled: true, triggered: 8 },
  { id: 4, name: "Slow Response Time", condition: "latency > 2s", enabled: false, triggered: 0 },
]

const notificationTrends = [
  { date: "Mon", success: 45, warning: 12, error: 3, info: 8 },
  { date: "Tue", success: 52, warning: 8, error: 5, info: 10 },
  { date: "Wed", success: 48, warning: 15, error: 2, info: 12 },
  { date: "Thu", success: 61, warning: 10, error: 4, info: 9 },
  { date: "Fri", success: 55, warning: 18, error: 6, info: 11 },
  { date: "Sat", success: 38, warning: 5, error: 1, info: 6 },
  { date: "Sun", success: 42, warning: 7, error: 2, info: 7 },
]

const notificationsByType = [
  { name: "Success", value: 341, color: "#10b981" },
  { name: "Warning", value: 75, color: "#f59e0b" },
  { name: "Error", value: 23, color: "#ef4444" },
  { name: "Info", value: 63, color: "#3b82f6" },
]

export function NotificationsAnalyticsPanel() {
  const [filterType, setFilterType] = useState("all")

  const filteredNotifications = notifications.filter((notif) => filterType === "all" || notif.type === filterType)

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Notifications & Alerts</h2>
          <p className="text-muted-foreground">Monitor system events and configure alert rules</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Alert Rule
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="alert-rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Mark All as Read</Button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={notification.read ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                          {!notification.read && <Badge variant="default">New</Badge>}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notification.time}
                          </span>
                          <Button variant="ghost" size="sm">
                            Mark as Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alert-rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configure automated alerts based on system conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Switch checked={rule.enabled} />
                      <div className="flex-1">
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-muted-foreground">{rule.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{rule.triggered}</p>
                        <p className="text-xs text-muted-foreground">times triggered</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create New Alert Rule</CardTitle>
              <CardDescription>Set up custom conditions for automated notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input placeholder="e.g., High Error Rate" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Metric</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpu">CPU Usage</SelectItem>
                      <SelectItem value="memory">Memory Usage</SelectItem>
                      <SelectItem value="errors">Error Rate</SelectItem>
                      <SelectItem value="latency">Response Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">Greater than</SelectItem>
                      <SelectItem value="lt">Less than</SelectItem>
                      <SelectItem value="eq">Equal to</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Threshold</Label>
                  <Input type="number" placeholder="e.g., 80" />
                </div>
              </div>
              <Button>Create Alert Rule</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Trends</CardTitle>
                <CardDescription>Weekly notification volume by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={notificationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="success" fill="#10b981" stackId="a" />
                    <Bar dataKey="warning" fill="#f59e0b" stackId="a" />
                    <Bar dataKey="error" fill="#ef4444" stackId="a" />
                    <Bar dataKey="info" fill="#3b82f6" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications by Type</CardTitle>
                <CardDescription>Distribution of notification categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={notificationsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {notificationsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {notificationsByType.map((type) => (
              <Card key={type.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{type.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
