"use client"
import { motion } from "framer-motion"
import { Users, Shield, Activity, Key, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", lastActive: "2 min ago" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Developer",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "inactive",
    lastActive: "2 days ago",
  },
]

const systemSettings = [
  { id: 1, name: "Auto-scaling", description: "Automatically scale resources based on demand", enabled: true },
  { id: 2, name: "Email Notifications", description: "Send email alerts for critical events", enabled: true },
  { id: 3, name: "Debug Mode", description: "Enable detailed logging for troubleshooting", enabled: false },
  { id: 4, name: "Maintenance Mode", description: "Put system in maintenance mode", enabled: false },
]

export function AdminCenterPanel() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Admin Center</h2>
          <p className="text-muted-foreground">System administration and configuration</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          <Shield className="mr-2 h-5 w-5" />
          Admin Access
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { icon: Users, label: "Total Users", value: "247", change: "+12" },
          { icon: Activity, label: "Active Sessions", value: "89", change: "+5" },
          { icon: Database, label: "Storage Used", value: "1.2 TB", change: "+0.3 TB" },
          { icon: Shield, label: "Security Score", value: "94%", change: "+2%" },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary">{stat.change}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and access</CardDescription>
                </div>
                <Button>Add User</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">Last active: {user.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure access levels for different roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Admin", "Developer", "Viewer"].map((role) => (
                  <div key={role} className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      {role}
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2 pl-6">
                      {[
                        "View Dashboard",
                        "Manage Agents",
                        "Edit Workflows",
                        "Access Analytics",
                        "Manage Users",
                        "System Settings",
                      ].map((permission) => (
                        <div key={permission} className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">{permission}</span>
                          <Switch
                            defaultChecked={
                              role === "Admin" ||
                              (role === "Developer" &&
                                permission !== "Manage Users" &&
                                permission !== "System Settings")
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Global system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">{setting.name}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Name</Label>
                <Input defaultValue="Nexus Quantum" />
              </div>

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="cet">Central European Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track system changes and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: "John Doe", action: "Updated system settings", time: "2 minutes ago", type: "config" },
                  { user: "Jane Smith", action: "Created new agent", time: "1 hour ago", type: "create" },
                  { user: "Bob Johnson", action: "Deleted workflow", time: "3 hours ago", type: "delete" },
                  { user: "John Doe", action: "Modified user permissions", time: "5 hours ago", type: "security" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          log.type === "delete"
                            ? "bg-red-500"
                            : log.type === "security"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          by {log.user} • {log.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{log.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
