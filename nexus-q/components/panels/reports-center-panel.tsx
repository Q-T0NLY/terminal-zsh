"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Calendar, Plus, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const reports = [
  {
    id: 1,
    name: "System Performance Report",
    type: "Performance",
    generated: "2024-01-15",
    size: "2.4 MB",
    format: "PDF",
    status: "ready",
  },
  {
    id: 2,
    name: "Agent Activity Summary",
    type: "Analytics",
    generated: "2024-01-14",
    size: "1.8 MB",
    format: "PDF",
    status: "ready",
  },
  {
    id: 3,
    name: "Security Audit Log",
    type: "Security",
    generated: "2024-01-13",
    size: "3.2 MB",
    format: "CSV",
    status: "ready",
  },
  {
    id: 4,
    name: "Cost Analysis Report",
    type: "Financial",
    generated: "2024-01-12",
    size: "1.5 MB",
    format: "XLSX",
    status: "ready",
  },
  {
    id: 5,
    name: "Monthly Executive Summary",
    type: "Executive",
    generated: "In Progress",
    size: "-",
    format: "PDF",
    status: "generating",
  },
]

const reportTemplates = [
  { id: 1, name: "Daily Operations", description: "Daily system operations and metrics", schedule: "Daily at 9 AM" },
  { id: 2, name: "Weekly Performance", description: "Weekly performance analysis", schedule: "Monday at 8 AM" },
  { id: 3, name: "Monthly Summary", description: "Comprehensive monthly report", schedule: "1st of month" },
  { id: 4, name: "Security Audit", description: "Security events and compliance", schedule: "Weekly" },
]

export function ReportsCenterPanel() {
  const [filterType, setFilterType] = useState("all")

  const filteredReports = reports.filter((report) => filterType === "all" || report.type === filterType)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Reports Center</h2>
          <p className="text-muted-foreground">Generate, schedule, and manage system reports</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredReports.map((report) => (
              <motion.div key={report.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h4 className="font-semibold">{report.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline">{report.type}</Badge>
                            <span className="text-sm text-muted-foreground">Generated: {report.generated}</span>
                            <span className="text-sm text-muted-foreground">{report.size}</span>
                            <Badge variant="secondary">{report.format}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.status === "ready" ? (
                          <>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Badge variant="secondary">Generating...</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-configured report templates for common use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {template.schedule}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox />
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">Next run: {template.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>Build a custom report with specific metrics and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input placeholder="e.g., Q1 Performance Analysis" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                      <SelectItem value="quarter">Last quarter</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Generate Report</Button>
                <Button variant="outline">Save as Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
