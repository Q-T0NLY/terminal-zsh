"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Activity, Zap } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Model {
  id: string
  name: string
  provider: string
  type: "core" | "specialized" | "generative"
  status: "online" | "offline"
  requests: number
  latency: string
  cost: string
}

export function ModelGateway() {
  const models: Model[] = [
    {
      id: "model-001",
      name: "GPT-4",
      provider: "OpenAI",
      type: "generative",
      status: "online",
      requests: 1247,
      latency: "1.2s",
      cost: "$0.03/1K",
    },
    {
      id: "model-002",
      name: "Claude 3",
      provider: "Anthropic",
      type: "generative",
      status: "online",
      requests: 892,
      latency: "0.9s",
      cost: "$0.02/1K",
    },
    {
      id: "model-003",
      name: "Llama 3",
      provider: "Local",
      type: "specialized",
      status: "online",
      requests: 3421,
      latency: "0.3s",
      cost: "Free",
    },
  ]

  const getTypeColor = (type: Model["type"]) => {
    switch (type) {
      case "core":
        return "default"
      case "specialized":
        return "secondary"
      case "generative":
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,560</div>
            <p className="text-xs text-muted-foreground">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8s</div>
            <p className="text-xs text-muted-foreground">-5% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24.50</div>
            <p className="text-xs text-muted-foreground">Today's usage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Model Gateway</CardTitle>
              <CardDescription>Unified interface for all AI models and providers</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{model.name}</div>
                      <div className="text-xs text-muted-foreground">{model.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{model.provider}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(model.type)}>{model.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${model.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span className="capitalize">{model.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{model.requests.toLocaleString()}</TableCell>
                  <TableCell>{model.latency}</TableCell>
                  <TableCell>{model.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
