"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Trash2 } from "lucide-react"

interface InspectorPanelProps {
  selectedWidget: any | null
  onWidgetConfigure: (widget: any) => void
}

export function InspectorPanel({ selectedWidget, onWidgetConfigure }: InspectorPanelProps) {
  if (!selectedWidget) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Select a widget to configure</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedWidget.name}</h3>
          <Badge variant="secondary">{selectedWidget.type}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Widget Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="widget-name">Name</Label>
              <Input
                id="widget-name"
                value={selectedWidget.name}
                onChange={(e) =>
                  onWidgetConfigure({
                    ...selectedWidget,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-refresh">Refresh Interval (seconds)</Label>
              <Input
                id="widget-refresh"
                type="number"
                value={selectedWidget.config?.refreshInterval || 30}
                onChange={(e) =>
                  onWidgetConfigure({
                    ...selectedWidget,
                    config: {
                      ...selectedWidget.config,
                      refreshInterval: Number.parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Widget Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{new Date(selectedWidget.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>{selectedWidget.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tab:</span>
              <span>{selectedWidget.tabId}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button className="flex-1">Save Changes</Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
