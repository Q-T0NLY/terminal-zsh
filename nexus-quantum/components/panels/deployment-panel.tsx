"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, Scale, AlertTriangle, RotateCcw } from "lucide-react"

export function DeploymentPanel({ widgets, onWidgetsChange }: any) {
  const components = [
    {
      name: "Orchestrator",
      status: "healthy",
      secrets: ["API keys", "OPA tokens"],
      monitoring: "Prometheus heartbeat",
      slo: "99.5% uptime",
      actions: [
        { label: "Restart Agents", variant: "secondary" as const, icon: RefreshCw },
        { label: "Scale Up", variant: "outline" as const, icon: Scale },
      ],
    },
    {
      name: "Agents",
      status: "degraded",
      secrets: ["Model keys", "Encryption"],
      monitoring: "Latency, task queue",
      slo: "<200ms avg",
      actions: [
        { label: "Notify Operator", variant: "default" as const, icon: AlertTriangle },
        { label: "Auto-scale", variant: "secondary" as const, icon: Scale },
      ],
    },
    {
      name: "Model Gateway",
      status: "healthy",
      secrets: ["LLM tokens"],
      monitoring: "GPU utilization",
      slo: "90% utilization cap",
      actions: [{ label: "Reallocate Pods", variant: "secondary" as const, icon: RefreshCw }],
    },
    {
      name: "Dashboard",
      status: "healthy",
      secrets: ["JWT secret"],
      monitoring: "Frontend health",
      slo: "<1% error rate",
      actions: [{ label: "Rollback", variant: "destructive" as const, icon: RotateCcw }],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">🚀 Deployment & Operations</h2>
        <div className="flex gap-2">
          <Button variant="outline">Run Health Check</Button>
          <Button variant="outline">Deploy Canary</Button>
          <Button variant="destructive">Emergency Rollback</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((component) => (
          <Card key={component.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{component.name}</CardTitle>
                <StatusBadge status={component.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Secrets:</span>
                  <span className="font-medium">{component.secrets.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monitoring:</span>
                  <span className="font-medium">{component.monitoring}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SLO:</span>
                  <span className="font-medium">{component.slo}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {component.actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button key={action.label} variant={action.variant} size="sm">
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    healthy: { icon: CheckCircle, color: "bg-green-500/10 text-green-500", label: "Healthy" },
    degraded: { icon: AlertTriangle, color: "bg-yellow-500/10 text-yellow-500", label: "Degraded" },
    unhealthy: { icon: AlertCircle, color: "bg-red-500/10 text-red-500", label: "Unhealthy" },
  }

  const componentConfig = config[status] || config.healthy
  const Icon = componentConfig.icon

  return (
    <Badge className={componentConfig.color}>
      <Icon className="h-3 w-3 mr-1" />
      {componentConfig.label}
    </Badge>
  )
}
