"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Trash2, Settings, Sparkles } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateAgentDialog } from "./create-agent-dialog"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  type: "core" | "specialized" | "generative"
  status: "active" | "idle" | "stopped"
  tasks: number
  uptime: string
  capabilities: string[]
}

export function AgentRegistry() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-001",
      name: "Core Orchestrator",
      type: "core",
      status: "active",
      tasks: 45,
      uptime: "12h 34m",
      capabilities: ["routing", "scheduling", "coordination"],
    },
    {
      id: "agent-002",
      name: "Data Processor",
      type: "specialized",
      status: "active",
      tasks: 23,
      uptime: "8h 12m",
      capabilities: ["data-transform", "validation", "enrichment"],
    },
    {
      id: "agent-003",
      name: "Content Generator",
      type: "generative",
      status: "idle",
      tasks: 0,
      uptime: "2h 45m",
      capabilities: ["text-generation", "summarization", "translation"],
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "stopped":
        return "bg-red-500"
    }
  }

  const getTypeColor = (type: Agent["type"]) => {
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agent Registry</CardTitle>
              <CardDescription>Manage and monitor all active agents</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/create-agent">
                <Button variant="default" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Advanced Creation
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Quick Create
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Capabilities</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(agent.type)}>{agent.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`} />
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{agent.tasks}</TableCell>
                  <TableCell>{agent.uptime}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 2).map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        {agent.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAgentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
