"use client"

import { useState, useMemo } from "react"
import { CreditCard, TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"

export function TokenizationPanel({ widgets, onWidgetsChange }: any) {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h")
  const [view, setView] = useState<"overview" | "breakdown" | "forecast">("overview")

  const tokenData = useMemo(
    () => ({
      totalTokens: 1250000,
      currentCost: 45.67,
      quotaUsed: 65,
      quotaTotal: 2000000,
      forecastedMonthlyCost: 1234.56,
      trend: "+12%",
      chartData: [
        { time: "00:00", tokens: 45000 },
        { time: "04:00", tokens: 52000 },
        { time: "08:00", tokens: 78000 },
        { time: "12:00", tokens: 95000 },
        { time: "16:00", tokens: 88000 },
        { time: "20:00", tokens: 67000 },
      ],
      byAgent: [
        { id: "1", name: "Agent Alpha", tokens: 450000 },
        { id: "2", name: "Agent Beta", tokens: 380000 },
        { id: "3", name: "Agent Gamma", tokens: 280000 },
        { id: "4", name: "Agent Delta", tokens: 140000 },
      ],
    }),
    [],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">💰 Tokenization & Usage</h2>
          <p className="text-sm text-muted-foreground">Monitor token consumption, costs, and manage quotas</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Top Up Credits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Tokens Used (24h)" value={tokenData.totalTokens.toLocaleString()} trend={tokenData.trend} />
        <StatCard label="Current Cost" value={`$${tokenData.currentCost.toFixed(2)}`} subtitle="this hour" />
        <StatCard
          label="Quota Usage"
          value={`${tokenData.quotaUsed}%`}
          variant={tokenData.quotaUsed > 80 ? "warning" : "default"}
        />
        <StatCard label="Forecasted Monthly" value={`$${tokenData.forecastedMonthlyCost.toFixed(2)}`} trend="+8%" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["overview", "breakdown", "forecast"] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "default" : "outline"}
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["1h", "24h", "7d", "30d"] as const).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {view === "overview" && <TokenOverview data={tokenData} />}
      {view === "breakdown" && <TokenBreakdown data={tokenData} />}
      {view === "forecast" && <CostForecast data={tokenData} />}

      <LiveTokenFeed />
    </div>
  )
}

const StatCard = ({ label, value, trend, subtitle, variant = "default" }: any) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${variant === "warning" ? "text-yellow-500" : ""}`}>{value}</div>
      {trend && (
        <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </div>
      )}
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </CardContent>
  </Card>
)

const TokenOverview = ({ data }: any) => (
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Token Usage Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.chartData}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#tokenGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Usage by Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.byAgent.map((agent: any) => (
            <div key={agent.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{agent.name}</span>
                <span className="text-muted-foreground">{agent.tokens.toLocaleString()} tokens</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(agent.tokens / data.totalTokens) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {((agent.tokens / data.totalTokens) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

const TokenBreakdown = ({ data }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Token Breakdown by Model</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.byAgent}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip />
          <Bar dataKey="tokens" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

const CostForecast = ({ data }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Cost Forecast</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="p-6 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">Projected Monthly Cost</p>
          <p className="text-4xl font-bold">${data.forecastedMonthlyCost.toFixed(2)}</p>
          <p className="text-sm text-green-500 mt-2">8% increase from last month</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Line type="monotone" dataKey="tokens" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)

const LiveTokenFeed = () => {
  const liveFeed = [
    { timestamp: "10:23:45", agentId: "Agent Alpha", tokens: 1250, cost: 0.0125 },
    { timestamp: "10:23:42", agentId: "Agent Beta", tokens: 890, cost: 0.0089 },
    { timestamp: "10:23:38", agentId: "Agent Gamma", tokens: 2100, cost: 0.021 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Token Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {liveFeed.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
              <span className="font-mono text-xs text-muted-foreground">{event.timestamp}</span>
              <span className="font-medium">{event.agentId}</span>
              <span className="text-primary">+{event.tokens} tokens</span>
              <span className="text-muted-foreground">${event.cost.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
