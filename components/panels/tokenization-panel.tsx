"use client"

import { useState, useMemo } from "react"
import {
  CreditCard,
  TrendingUp,
  Download,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Settings,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

export function TokenizationPanel({ widgets, onWidgetsChange }: any) {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h")

  const tokenData = useMemo(
    () => ({
      totalTokens: 1250000,
      currentCost: 45.67,
      quotaUsed: 65,
      quotaTotal: 2000000,
      forecastedMonthlyCost: 1234.56,
      trend: "+12%",
      balance: 5000,
      chartData: [
        { time: "00:00", tokens: 45000, cost: 4.5 },
        { time: "04:00", tokens: 52000, cost: 5.2 },
        { time: "08:00", tokens: 78000, cost: 7.8 },
        { time: "12:00", tokens: 95000, cost: 9.5 },
        { time: "16:00", tokens: 88000, cost: 8.8 },
        { time: "20:00", tokens: 67000, cost: 6.7 },
      ],
      byAgent: [
        { id: "1", name: "Agent Alpha", tokens: 450000, cost: 45 },
        { id: "2", name: "Agent Beta", tokens: 380000, cost: 38 },
        { id: "3", name: "Agent Gamma", tokens: 280000, cost: 28 },
        { id: "4", name: "Agent Delta", tokens: 140000, cost: 14 },
      ],
      byModel: [
        { name: "GPT-4", value: 35, color: "#8b5cf6" },
        { name: "Claude", value: 28, color: "#3b82f6" },
        { name: "Gemini", value: 22, color: "#10b981" },
        { name: "Other", value: 15, color: "#f59e0b" },
      ],
      quotas: [
        { name: "Production", used: 1300000, total: 2000000, status: "healthy" },
        { name: "Development", used: 450000, total: 500000, status: "warning" },
        { name: "Testing", used: 180000, total: 300000, status: "healthy" },
      ],
    }),
    [],
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            Tokenization & Usage Center
          </h2>
          <p className="text-muted-foreground mt-1">Monitor token consumption, costs, and manage quotas</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Top Up Credits
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tokens Used (24h)</p>
                <p className="text-3xl font-bold">{tokenData.totalTokens.toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {tokenData.trend}
                </p>
              </div>
              <PieChart className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Cost</p>
                <p className="text-3xl font-bold">${tokenData.currentCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">this hour</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quota Usage</p>
                <p className="text-3xl font-bold text-yellow-500">{tokenData.quotaUsed}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tokenData.quotaTotal - (tokenData.quotaTotal * tokenData.quotaUsed) / 100} remaining
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit Balance</p>
                <p className="text-3xl font-bold">${tokenData.balance.toFixed(2)}</p>
                <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Sufficient
                </p>
              </div>
              <CreditCard className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">Consumption Analytics</TabsTrigger>
          <TabsTrigger value="quotas">Quota Management</TabsTrigger>
          <TabsTrigger value="forecast">Budget Forecasting</TabsTrigger>
          <TabsTrigger value="live">Live Feed</TabsTrigger>
        </TabsList>

        {/* Consumption Analytics Tab */}
        <TabsContent value="consumption" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Consumption Graph</CardTitle>
                <CardDescription>Multi-line time series</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tokenData.chartData}>
                    <defs>
                      <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="tokens"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#tokenGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Estimation Dashboard</CardTitle>
                <CardDescription>Calculator + projection charts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tokenData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage by Agent</CardTitle>
                <CardDescription>Token consumption per agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenData.byAgent.map((agent: any) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{agent.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{agent.tokens.toLocaleString()} tokens</span>
                          <span className="font-semibold">${agent.cost.toFixed(2)}</span>
                        </div>
                      </div>
                      <Progress value={(agent.tokens / tokenData.totalTokens) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {((agent.tokens / tokenData.totalTokens) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Distribution</CardTitle>
                <CardDescription>Usage by AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={tokenData.byModel}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tokenData.byModel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quota Management Tab */}
        <TabsContent value="quotas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quota Utilization</CardTitle>
              <CardDescription>Progress bars + rings + gauges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tokenData.quotas.map((quota, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{quota.name}</h4>
                      <Badge variant={quota.status === "warning" ? "destructive" : "default"}>
                        {quota.status === "warning" ? "90% Used" : "Healthy"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {quota.used.toLocaleString()} / {quota.total.toLocaleString()} tokens
                    </div>
                  </div>
                  <Progress value={(quota.used / quota.total) * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{((quota.used / quota.total) * 100).toFixed(1)}% utilized</span>
                    <span>{(quota.total - quota.used).toLocaleString()} remaining</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Balance Tracker</CardTitle>
              <CardDescription>Digital counter + history graph</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-muted rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Available Credits</p>
                <p className="text-5xl font-bold">${tokenData.balance.toFixed(2)}</p>
                <p className="text-sm text-green-500 mt-2">Sufficient for ~110 hours at current rate</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={tokenData.chartData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="cost" stroke="#10b981" fillOpacity={1} fill="url(#balanceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Forecasting Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Projection</CardTitle>
                <CardDescription>Forecast line chart + confidence intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted rounded-lg text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Projected Monthly Cost</p>
                  <p className="text-4xl font-bold">${tokenData.forecastedMonthlyCost.toFixed(2)}</p>
                  <p className="text-sm text-green-500 mt-2">+8% increase from last month</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={tokenData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Forecasting</CardTitle>
                <CardDescription>Area chart + confidence bands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Current Month</span>
                    <span className="text-sm font-bold">$1,234.56</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Next Month (Projected)</span>
                    <span className="text-sm font-bold text-blue-500">$1,333.33</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Budget Limit</span>
                    <span className="text-sm font-bold text-green-500">$2,000.00</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tokenData.byAgent}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Feed Tab */}
        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Consumption Feed</CardTitle>
              <CardDescription>Live scroll + filter panel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { timestamp: "10:23:45", agentId: "Agent Alpha", tokens: 1250, cost: 0.0125, model: "GPT-4" },
                  { timestamp: "10:23:42", agentId: "Agent Beta", tokens: 890, cost: 0.0089, model: "Claude" },
                  { timestamp: "10:23:38", agentId: "Agent Gamma", tokens: 2100, cost: 0.021, model: "Gemini" },
                  { timestamp: "10:23:35", agentId: "Agent Delta", tokens: 1580, cost: 0.0158, model: "GPT-4" },
                  { timestamp: "10:23:30", agentId: "Agent Alpha", tokens: 950, cost: 0.0095, model: "Claude" },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg text-sm hover:bg-accent transition-colors"
                  >
                    <span className="font-mono text-xs text-muted-foreground w-20">{event.timestamp}</span>
                    <span className="font-medium w-32">{event.agentId}</span>
                    <Badge variant="outline" className="w-20">
                      {event.model}
                    </Badge>
                    <span className="text-primary font-semibold w-28">+{event.tokens} tokens</span>
                    <span className="text-muted-foreground w-24 text-right">${event.cost.toFixed(4)}</span>
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
