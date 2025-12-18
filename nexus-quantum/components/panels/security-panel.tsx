"use client"

import { useState } from "react"
import { Shield, Lock, AlertTriangle, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SecurityPanel({ widgets, onWidgetsChange }: any) {
  const [activeView, setActiveView] = useState("overview")

  const securityMetrics = {
    encryption: { status: "active", strength: "AES-256" },
    access: { status: "compliant", compliance: 98 },
    threats: { status: "protected", blocked: 127 },
    compliance: { status: "certified", score: "A+" },
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">🔒 Security & Audit Zone</h2>
          <p className="text-sm text-muted-foreground">Monitor security posture, access controls, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Run Security Scan</Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SecurityMetricCard
          icon={Shield}
          label="Quantum-Safe Encryption"
          status={securityMetrics.encryption.status}
          value={securityMetrics.encryption.strength}
        />
        <SecurityMetricCard
          icon={Lock}
          label="Access Control"
          status={securityMetrics.access.status}
          value={`${securityMetrics.access.compliance}% compliant`}
        />
        <SecurityMetricCard
          icon={AlertTriangle}
          label="Threat Detection"
          status={securityMetrics.threats.status}
          value={`${securityMetrics.threats.blocked} blocked`}
        />
        <SecurityMetricCard
          icon={FileText}
          label="Compliance"
          status={securityMetrics.compliance.status}
          value={securityMetrics.compliance.score}
        />
      </div>

      <div className="flex gap-2 border-b">
        {["overview", "access", "threats", "compliance", "audit"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeView === view
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <div>
        {activeView === "overview" && <SecurityOverview />}
        {activeView === "access" && <AccessMatrix />}
        {activeView === "threats" && <ThreatDetection />}
        {activeView === "compliance" && <ComplianceReports />}
        {activeView === "audit" && <AuditLogs />}
      </div>
    </div>
  )
}

const SecurityMetricCard = ({ icon: Icon, label, status, value }: any) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <CardTitle className="text-sm">{label}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1 capitalize">{status}</div>
    </CardContent>
  </Card>
)

const SecurityOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Security Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
          <div>
            <p className="font-semibold">System Status</p>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </div>
          <Shield className="h-8 w-8 text-green-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Last Scan</p>
            <p className="font-semibold">2 hours ago</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Vulnerabilities</p>
            <p className="font-semibold">0 Critical</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const AccessMatrix = () => (
  <Card>
    <CardHeader>
      <CardTitle>👥 Access Roles Matrix</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Permission</th>
              <th className="text-center p-2">Admin</th>
              <th className="text-center p-2">Developer</th>
              <th className="text-center p-2">Viewer</th>
            </tr>
          </thead>
          <tbody>
            {["Read Data", "Write Data", "Deploy", "Manage Users"].map((permission) => (
              <tr key={permission} className="border-b">
                <td className="p-2">{permission}</td>
                <td className="text-center p-2">
                  <input type="checkbox" defaultChecked />
                </td>
                <td className="text-center p-2">
                  <input type="checkbox" defaultChecked={permission !== "Manage Users"} />
                </td>
                <td className="text-center p-2">
                  <input type="checkbox" defaultChecked={permission === "Read Data"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
)

const ThreatDetection = () => (
  <Card>
    <CardHeader>
      <CardTitle>🛡️ Real-Time Threat Detection</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Active Threats</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold">127</div>
          <div className="text-sm text-muted-foreground">Blocked Today</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold">45ms</div>
          <div className="text-sm text-muted-foreground">Avg Response Time</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">No active threats detected. System is secure.</p>
    </CardContent>
  </Card>
)

const ComplianceReports = () => (
  <Card>
    <CardHeader>
      <CardTitle>Compliance Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {["GDPR", "SOC 2", "ISO 27001", "HIPAA"].map((standard) => (
          <div key={standard} className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-semibold">{standard}</p>
              <p className="text-sm text-muted-foreground">Compliant</p>
            </div>
            <div className="text-green-500 font-semibold">✓ Certified</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

const AuditLogs = () => (
  <Card>
    <CardHeader>
      <CardTitle>Audit Logs</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[
          { time: "10:23 AM", user: "admin@nexus.ai", action: "Updated security policy" },
          { time: "09:15 AM", user: "dev@nexus.ai", action: "Deployed new version" },
          { time: "08:45 AM", user: "system", action: "Automated security scan completed" },
        ].map((log, index) => (
          <div key={index} className="p-3 bg-muted rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{log.time}</span>
              <span className="text-xs text-muted-foreground">{log.user}</span>
            </div>
            <p className="mt-1">{log.action}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)
