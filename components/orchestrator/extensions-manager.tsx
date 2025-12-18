"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Settings, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Extension {
  id: string
  name: string
  version: string
  status: "active" | "inactive"
  category: string
  downloads: number
  description: string
}

export function ExtensionsManager() {
  const extensions: Extension[] = [
    {
      id: "ext-001",
      name: "Redis Connector",
      version: "2.1.0",
      status: "active",
      category: "Data Store",
      downloads: 1523,
      description: "Connect to Redis for caching and message queuing",
    },
    {
      id: "ext-002",
      name: "OpenAI Integration",
      version: "1.5.2",
      status: "active",
      category: "AI Model",
      downloads: 3421,
      description: "Access OpenAI models for text generation and embeddings",
    },
    {
      id: "ext-003",
      name: "Postgres Adapter",
      version: "3.0.1",
      status: "inactive",
      category: "Data Store",
      downloads: 892,
      description: "PostgreSQL database adapter with connection pooling",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Extensions Registry</CardTitle>
              <CardDescription>Modular extensions for enhanced functionality</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Build Extension
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search extensions..." />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {extensions.map((extension) => (
              <Card key={extension.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{extension.name}</CardTitle>
                      <CardDescription className="text-xs">v{extension.version}</CardDescription>
                    </div>
                    <Badge variant={extension.status === "active" ? "default" : "secondary"}>{extension.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{extension.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{extension.category}</span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {extension.downloads.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Settings className="mr-2 h-3 w-3" />
                      Configure
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
