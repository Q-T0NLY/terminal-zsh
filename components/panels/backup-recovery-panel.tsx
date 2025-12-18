"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Database, HardDrive, Clock, CheckCircle2, AlertCircle, Play, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const backups = [
  {
    id: 1,
    name: "Full System Backup",
    type: "Full",
    date: "2024-01-15 03:00 AM",
    size: "45.2 GB",
    status: "completed",
    duration: "2h 15m",
  },
  {
    id: 2,
    name: "Incremental Backup",
    type: "Incremental",
    date: "2024-01-15 12:00 PM",
    size: "3.8 GB",
    status: "completed",
    duration: "18m",
  },
  {
    id: 3,
    name: "Database Backup",
    type: "Database",
    date: "2024-01-15 06:00 PM",
    size: "12.4 GB",
    status: "completed",
    duration: "45m",
  },
  {
    id: 4,
    name: "Configuration Backup",
    type: "Config",
    date: "2024-01-15 09:00 PM",
    size: "156 MB",
    status: "completed",
    duration: "3m",
  },
  {
    id: 5,
    name: "Scheduled Full Backup",
    type: "Full",
    date: "In Progress",
    size: "28.5 GB / 45 GB",
    status: "running",
    duration: "1h 20m elapsed",
  },
]

const backupSchedules = [
  { id: 1, name: "Daily Full Backup", frequency: "Daily at 3:00 AM", retention: "30 days", enabled: true },
  { id: 2, name: "Hourly Incremental", frequency: "Every hour", retention: "7 days", enabled: true },
  { id: 3, name: "Weekly Archive", frequency: "Sunday at 1:00 AM", retention: "1 year", enabled: true },
  { id: 4, name: "Database Snapshot", frequency: "Every 6 hours", retention: "14 days", enabled: false },
]

export function BackupRecoveryPanel() {
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Backup & Recovery</h2>
          <p className="text-muted-foreground">Manage system backups and disaster recovery</p>
        </div>
        <Button>
          <Play className="mr-2 h-4 w-4" />
          Start Backup
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">247</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2 TB</div>
            <p className="text-xs text-muted-foreground mt-1">of 5 TB capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.6%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Next Backup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground mt-1">Full system backup</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="backups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-6">
          <div className="space-y-3">
            {backups.map((backup) => (
              <motion.div key={backup.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Database className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{backup.name}</h4>
                            <Badge variant="outline">{backup.type}</Badge>
                            {backup.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : backup.status === "running" ? (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-sm text-blue-500">Running</span>
                              </div>
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>
                              <Clock className="inline h-3 w-3 mr-1" />
                              {backup.date}
                            </span>
                            <span>
                              <HardDrive className="inline h-3 w-3 mr-1" />
                              {backup.size}
                            </span>
                            <span>Duration: {backup.duration}</span>
                          </div>
                          {backup.status === "running" && (
                            <div className="mt-3">
                              <Progress value={63} />
                              <p className="text-xs text-muted-foreground mt-1">63% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {backup.status === "completed" && (
                          <>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Restore
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedules</CardTitle>
              <CardDescription>Automated backup configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-sm text-muted-foreground">{schedule.frequency}</p>
                      <p className="text-xs text-muted-foreground mt-1">Retention: {schedule.retention}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={schedule.enabled ? "default" : "secondary"}>
                        {schedule.enabled ? "Enabled" : "Disabled"}
                      </Badge>
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

        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Disaster Recovery</CardTitle>
              <CardDescription>Restore system from backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Backup</label>
                  <Select value={selectedBackup || ""} onValueChange={setSelectedBackup}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a backup to restore" />
                    </SelectTrigger>
                    <SelectContent>
                      {backups
                        .filter((b) => b.status === "completed")
                        .map((backup) => (
                          <SelectItem key={backup.id} value={backup.id.toString()}>
                            {backup.name} - {backup.date} ({backup.size})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Warning</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Restoring from backup will overwrite current system data. This action cannot be undone. Please
                        ensure you have a recent backup before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="destructive" disabled={!selectedBackup}>
                    Start Recovery
                  </Button>
                  <Button variant="outline">Test Recovery</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery Point Objective (RPO)</CardTitle>
              <CardDescription>Maximum acceptable data loss</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Current RPO</span>
                    <span className="font-medium">1 hour</span>
                  </div>
                  <Progress value={90} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Your current backup frequency ensures a maximum data loss of 1 hour in case of system failure.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Configure backup behavior and storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Storage Location</label>
                  <Select defaultValue="s3">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="local">Local Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Compression Level</label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Faster)</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium (Recommended)</SelectItem>
                      <SelectItem value="high">High (Smaller Size)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Encryption</label>
                  <Select defaultValue="aes256">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes256">AES-256 (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
