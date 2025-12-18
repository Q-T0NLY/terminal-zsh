"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Cpu, Database } from "lucide-react"

export function SystemStatusWidget() {
  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3">System Status</h4>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm">Agents</span>
            </div>
            <span className="text-sm font-medium">12 Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span className="text-sm">CPU</span>
            </div>
            <span className="text-sm font-medium">45%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Memory</span>
            </div>
            <span className="text-sm font-medium">2.1 GB</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
