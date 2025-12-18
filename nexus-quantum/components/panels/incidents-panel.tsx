"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, Users, Bell, X, Play } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "acknowledged" | "resolved"
  startedAt: string
  timeAgo: string
  acknowledgedAt?: string
  assignedTo?: string
  duration: string
  slaStatus: string
  impact: {
    services: number
    users: number
    cost: string
  }
  autoResolveSuggestions: string[]
  runbookSteps: Array<{
    title: string
    description: string
    completed: boolean
  }>
}

export function IncidentsPanel() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [view, setView] = useState<"active" | "resolved" | "all">("active")

  const incidents: Incident[] = [
    {
      id: "INC-001",
      title: "High Latency in Agent Orchestrator",
      description: "Agent response times exceeding 500ms threshold",
      severity: "high",
      status: "active",
      startedAt: "2025-01-10 14:23:00",
      timeAgo: "2h ago",
      duration: "2h 15m",
      slaStatus: "Within SLA",
      impact: {
        services: 3,
        users: 1250,
        cost: "$450/hr",
      },
      autoResolveSuggestions: [
        "Scale up orchestrator pods to 5 replicas",
        "Enable request caching for common queries",
        "Restart agent workers to clear memory leaks",
      ],
      runbookSteps: [
        { title: "Check system metrics", description: "Review CPU, memory, and network usage", completed: true },
        { title: "Analyze logs", description: "Search for error patterns in last 2 hours", completed: true },
        { title: "Scale resources", description: "Increase pod count to handle load", completed: false },
        { title: "Verify resolution", description: "Monitor latency for 15 minutes", completed: false },
      ],
    },
    {
      id: "INC-002",
      title: "Model Gateway Connection Timeout",
      description: "Intermittent timeouts connecting to LLM providers",
      severity: "critical",
      status: "active",
      startedAt: "2025-01-10 15:45:00",
      timeAgo: "45m ago",
      duration: "45m",
      slaStatus: "SLA at risk",
      assignedTo: "ops-team",
      impact: {
        services: 5,
        users: 3200,
        cost: "$1200/hr",
      },
      autoResolveSuggestions: [
        "Switch to backup LLM provider",
        "Increase connection timeout to 30s",
        "Enable circuit breaker pattern",
      ],
      runbookSteps: [
        { title: "Check provider status", description: "Verify external API availability", completed: true },
        { title: "Test connectivity", description: "Run connection diagnostics", completed: false },
        { title: "Failover to backup", description: "Switch to secondary provider", completed: false },
      ],
    },
  ]

  const stats = {
    active: incidents.filter((i) => i.status === "active").length,
    resolved24h: 12,
    mttr: "45m",
    sla: "98.5%",
  }

  const filteredIncidents = incidents.filter((incident) => {
    if (view === "all") return true
    return incident.status === view
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">🚨 Incidents & Alerts</h2>
          <p className="text-muted-foreground">Monitor, investigate, and resolve system incidents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Silence Alerts
          </Button>
          <Button>New Incident</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-red-500">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active Incidents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.resolved24h}</div>
            <div className="text-sm text-muted-foreground">Resolved (24h)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.mttr}</div>
            <div className="text-sm text-muted-foreground">Mean Time to Resolve</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-500">{stats.sla}</div>
            <div className="text-sm text-muted-foreground">SLA Compliance</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant={view === "active" ? "default" : "outline"} onClick={() => setView("active")}>
          Active ({stats.active})
        </Button>
        <Button variant={view === "resolved" ? "default" : "outline"} onClick={() => setView("resolved")}>
          Resolved
        </Button>
        <Button variant={view === "all" ? "default" : "outline"} onClick={() => setView("all")}>
          All Incidents
        </Button>
      </div>

      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onSelect={setSelectedIncident}
            isSelected={selectedIncident?.id === incident.id}
          />
        ))}
      </div>

      {selectedIncident && (
        <IncidentDetailsDialog incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      )}
    </div>
  )
}

function IncidentCard({
  incident,
  onSelect,
  isSelected,
}: {
  incident: Incident
  onSelect: (incident: Incident) => void
  isSelected: boolean
}) {
  const severityColors = {
    critical: "border-red-500 bg-red-500/5",
    high: "border-orange-500 bg-orange-500/5",
    medium: "border-yellow-500 bg-yellow-500/5",
    low: "border-blue-500 bg-blue-500/5",
  }

  return (
    <Card
      className={`cursor-pointer transition-all ${severityColors[incident.severity]} ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(incident)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">{incident.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={incident.severity === "critical" ? "destructive" : "secondary"}>{incident.severity}</Badge>
            <span className="text-sm text-muted-foreground">{incident.timeAgo}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{incident.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Started: {incident.startedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Assigned: {incident.assignedTo || "Unassigned"}</span>
          </div>
          {incident.acknowledgedAt && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Acknowledged</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!incident.acknowledgedAt && (
            <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
              Acknowledge
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
            Resolve
          </Button>
          <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
            Assign to Me
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function IncidentDetailsDialog({
  incident,
  onClose,
}: {
  incident: Incident
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{incident.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="runbook">Runbook</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Severity</div>
                <div className="font-medium capitalize">{incident.severity}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{incident.status}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium">{incident.duration}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">SLA Status</div>
                <div className="font-medium">{incident.slaStatus}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Impact Assessment</h4>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{incident.impact.services}</div>
                    <div className="text-sm text-muted-foreground">Affected Services</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{incident.impact.users}</div>
                    <div className="text-sm text-muted-foreground">Users Impacted</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{incident.impact.cost}</div>
                    <div className="text-sm text-muted-foreground">Cost Impact</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Auto-Resolve Suggestions</h4>
              <div className="space-y-2">
                {incident.autoResolveSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{suggestion}</span>
                    <Button size="sm">Apply</Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="runbook" className="space-y-4">
            <h4 className="font-semibold">Runbook Steps</h4>
            {incident.runbookSteps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground">{step.description}</div>
                  {step.completed ? (
                    <Badge className="mt-2" variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button size="sm" className="mt-2">
                      <Play className="h-3 w-3 mr-1" />
                      Execute
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="timeline">
            <p className="text-muted-foreground">Timeline view coming soon...</p>
          </TabsContent>

          <TabsContent value="communication">
            <p className="text-muted-foreground">Communication log coming soon...</p>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
          {!incident.acknowledgedAt && <Button>Acknowledge Incident</Button>}
          <Button variant="outline">Mark as Resolved</Button>
          <Button variant="outline">Escalate</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
