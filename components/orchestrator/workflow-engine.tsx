"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Workflow {
  id: string
  name: string
  status: "running" | "paused" | "completed" | "failed"
  steps: number
  progress: number
  lastRun: string
  executions: number
}

export function WorkflowEngine() {
  const workflows: Workflow[] = [
    {
      id: "wf-001",
      name: "Data Pipeline",
      status: "running",
      steps: 5,
      progress: 60,
      lastRun: "2 minutes ago",
      executions: 1247,
    },
    {
      id: "wf-002",
      name: "Content Generation",
      status: "paused",
      steps: 3,
      progress: 0,
      lastRun: "1 hour ago",
      executions: 89,
    },
    {
      id: "wf-003",
      name: "Model Training",
      status: "completed",
      steps: 8,
      progress: 100,
      lastRun: "5 minutes ago",
      executions: 34,
    },
  ]

  const getStatusColor = (status: Workflow["status"]) => {
    switch (status) {
      case "running":
        return "default"
      case "paused":
        return "secondary"
      case "completed":
        return "outline"
      case "failed":
        return "destructive"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflow Automation</CardTitle>
              <CardDescription>Self-optimizing workflows with adaptive execution</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">{workflow.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                  </TableCell>
                  <TableCell>{workflow.steps}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{workflow.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{workflow.lastRun}</TableCell>
                  <TableCell>{workflow.executions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        {workflow.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
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
    </div>
  )
}
