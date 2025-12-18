"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Layout, Save, Upload, Download, Grid3x3, Columns, LayoutGrid } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Dashboard {
  id: string
  name: string
  description: string
  refreshInterval: string
  access: string
  theme: string
  widgets: any[]
}

export function CustomDashboard() {
  const [layout, setLayout] = useState<"grid" | "freeform" | "single">("grid")
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "default",
      name: "Default Dashboard",
      description: "Main system overview",
      refreshInterval: "60",
      access: "private",
      theme: "default",
      widgets: [],
    },
  ])
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(dashboards[0])

  const widgetCategories = [
    {
      name: "Metrics",
      widgets: [
        { type: "metric", name: "Agent Count", icon: "📊" },
        { type: "metric", name: "Token Usage", icon: "🎯" },
        { type: "metric", name: "Cost Tracker", icon: "💰" },
      ],
    },
    {
      name: "Charts",
      widgets: [
        { type: "chart", name: "Line Chart", icon: "📈" },
        { type: "chart", name: "Bar Chart", icon: "📊" },
        { type: "chart", name: "Pie Chart", icon: "🥧" },
      ],
    },
    {
      name: "Visualizations",
      widgets: [
        { type: "viz", name: "Network Graph", icon: "🕸️" },
        { type: "viz", name: "Heatmap", icon: "🔥" },
        { type: "viz", name: "Timeline", icon: "⏱️" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">🎨 Custom Dashboard</h2>
          <p className="text-muted-foreground">Create and manage personalized dashboard views</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboards.map((dashboard) => (
                <Button
                  key={dashboard.id}
                  variant={currentDashboard?.id === dashboard.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentDashboard(dashboard)}
                >
                  {dashboard.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={layout === "grid" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLayout("grid")}
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={layout === "freeform" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLayout("freeform")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Free Form
              </Button>
              <Button
                variant={layout === "single" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setLayout("single")}
              >
                <Columns className="h-4 w-4 mr-2" />
                Single Column
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics">
                <TabsList className="w-full">
                  <TabsTrigger value="metrics" className="flex-1">
                    Metrics
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="flex-1">
                    Charts
                  </TabsTrigger>
                  <TabsTrigger value="viz" className="flex-1">
                    Viz
                  </TabsTrigger>
                </TabsList>
                {widgetCategories.map((category) => (
                  <TabsContent
                    key={category.name.toLowerCase()}
                    value={category.name.toLowerCase()}
                    className="space-y-2"
                  >
                    {category.widgets.map((widget) => (
                      <Button
                        key={widget.name}
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        size="sm"
                      >
                        <span className="mr-2">{widget.icon}</span>
                        {widget.name}
                      </Button>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>{currentDashboard?.name || "Select a Dashboard"}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDashboard ? (
                <div className={`dashboard-canvas ${layout}`}>
                  <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Drag widgets here to build your dashboard</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-muted-foreground">Select or create a dashboard to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {currentDashboard && (
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dashboard Name</Label>
                  <Input
                    value={currentDashboard.name}
                    onChange={(e) => {
                      const updated = { ...currentDashboard, name: e.target.value }
                      setCurrentDashboard(updated)
                      setDashboards(dashboards.map((d) => (d.id === updated.id ? updated : d)))
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={currentDashboard.description}
                    onChange={(e) => {
                      const updated = { ...currentDashboard, description: e.target.value }
                      setCurrentDashboard(updated)
                      setDashboards(dashboards.map((d) => (d.id === updated.id ? updated : d)))
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Refresh Interval</Label>
                  <Select
                    value={currentDashboard.refreshInterval}
                    onValueChange={(value) => {
                      const updated = { ...currentDashboard, refreshInterval: value }
                      setCurrentDashboard(updated)
                      setDashboards(dashboards.map((d) => (d.id === updated.id ? updated : d)))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Manual</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="900">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Access Control</Label>
                  <Select
                    value={currentDashboard.access}
                    onValueChange={(value) => {
                      const updated = { ...currentDashboard, access: value }
                      setCurrentDashboard(updated)
                      setDashboards(dashboards.map((d) => (d.id === updated.id ? updated : d)))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={currentDashboard.theme}
                    onValueChange={(value) => {
                      const updated = { ...currentDashboard, theme: value }
                      setCurrentDashboard(updated)
                      setDashboards(dashboards.map((d) => (d.id === updated.id ? updated : d)))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
