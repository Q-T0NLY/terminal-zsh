"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Webhook, Key, Settings, Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const integrations = [
  {
    id: 1,
    name: "Stripe",
    category: "Payments",
    status: "active",
    health: 98,
    requests: 15420,
    latency: 145,
    lastSync: "2 min ago",
    icon: "💳",
  },
  {
    id: 2,
    name: "Grok AI",
    category: "AI/ML",
    status: "active",
    health: 100,
    requests: 8932,
    latency: 89,
    lastSync: "1 min ago",
    icon: "🤖",
  },
  {
    id: 3,
    name: "Supabase",
    category: "Database",
    status: "warning",
    health: 85,
    requests: 23456,
    latency: 234,
    lastSync: "5 min ago",
    icon: "🗄️",
  },
  {
    id: 4,
    name: "SendGrid",
    category: "Email",
    status: "active",
    health: 95,
    requests: 3421,
    latency: 178,
    lastSync: "3 min ago",
    icon: "📧",
  },
  {
    id: 5,
    name: "Twilio",
    category: "SMS",
    status: "inactive",
    health: 0,
    requests: 0,
    latency: 0,
    lastSync: "Never",
    icon: "📱",
  },
]

const webhooks = [
  { id: 1, name: "Order Created", endpoint: "/api/webhooks/order", events: 1234, status: "active" },
  { id: 2, name: "Payment Success", endpoint: "/api/webhooks/payment", events: 892, status: "active" },
  { id: 3, name: "User Signup", endpoint: "/api/webhooks/user", events: 456, status: "paused" },
]

const apiUsageData = [
  { time: "00:00", requests: 1200, errors: 12 },
  { time: "04:00", requests: 800, errors: 8 },
  { time: "08:00", requests: 2400, errors: 15 },
  { time: "12:00", requests: 3200, errors: 25 },
  { time: "16:00", requests: 2800, errors: 18 },
  { time: "20:00", requests: 1600, errors: 10 },
]

const integrationsByCategory = [
  { name: "AI/ML", value: 35, color: "#3b82f6" },
  { name: "Database", value: 25, color: "#10b981" },
  { name: "Payments", value: 20, color: "#f59e0b" },
  { name: "Email", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#6b7280" },
]

export function IntegrationHubPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || integration.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Integration Hub</h2>
          <p className="text-muted-foreground">Manage API connections, webhooks, and third-party services</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Payments">Payments</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map((integration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.category}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          integration.status === "active"
                            ? "default"
                            : integration.status === "warning"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Health</span>
                        <span className="font-medium">{integration.health}%</span>
                      </div>
                      <Progress value={integration.health} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Requests</p>
                        <p className="font-semibold">{integration.requests.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Latency</p>
                        <p className="font-semibold">{integration.latency}ms</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last sync: {integration.lastSync}</span>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <CardDescription>Manage incoming webhook configurations</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Webhook className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{webhook.name}</p>
                        <p className="text-sm text-muted-foreground">{webhook.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{webhook.events.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">events received</p>
                      </div>
                      <Badge variant={webhook.status === "active" ? "default" : "secondary"}>{webhook.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage authentication keys for external services</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Production API Key", created: "2024-01-15", lastUsed: "2 hours ago", status: "active" },
                  { name: "Development API Key", created: "2024-02-01", lastUsed: "5 min ago", status: "active" },
                  { name: "Legacy API Key", created: "2023-11-20", lastUsed: "30 days ago", status: "inactive" },
                ].map((key, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Created {key.created} • Last used {key.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={key.status === "active" ? "default" : "secondary"}>{key.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Usage Over Time</CardTitle>
                <CardDescription>Request volume and error rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={apiUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrations by Category</CardTitle>
                <CardDescription>Distribution of active integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={integrationsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {integrationsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Performance</CardTitle>
              <CardDescription>Response times and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.slice(0, 4).map((integration) => (
                  <div key={integration.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{integration.icon}</span>
                        <span className="font-medium">{integration.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{integration.latency}ms avg</span>
                        <span className="font-medium">{integration.health}% uptime</span>
                      </div>
                    </div>
                    <Progress value={integration.health} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
