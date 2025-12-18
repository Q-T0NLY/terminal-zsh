"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DraggableWidget } from "@/components/widgets/draggable-widget"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function DraggableDashboardDemo() {
  const [widgets, setWidgets] = useState([
    { id: "1", position: { x: 20, y: 20 }, size: { width: 400, height: 300 } },
    { id: "2", position: { x: 440, y: 20 }, size: { width: 400, height: 300 } },
    { id: "3", position: { x: 20, y: 340 }, size: { width: 400, height: 300 } },
  ])

  const addWidget = () => {
    const newWidget = {
      id: String(widgets.length + 1),
      position: { x: 100 + widgets.length * 20, y: 100 + widgets.length * 20 },
      size: { width: 400, height: 300 },
    }
    setWidgets([...widgets, newWidget])
  }

  const updateWidgetPosition = (id: string, position: { x: number; y: number }) => {
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, position } : w)))
  }

  const updateWidgetSize = (id: string, size: { width: number; height: number }) => {
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, size } : w)))
  }

  return (
    <div className="relative h-screen bg-[#F5F7FA] p-6">
      <div className="mb-4">
        <Button onClick={addWidget} className="bg-[#4B6CB7] hover:bg-[#3a5a9a]">
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="relative h-[calc(100vh-120px)]">
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            initialPosition={widget.position}
            initialSize={widget.size}
            onPositionChange={(pos) => updateWidgetPosition(widget.id, pos)}
            onSizeChange={(size) => updateWidgetSize(widget.id, size)}
          >
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Sample Widget {widget.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This widget is draggable and resizable. Drag from the header to move, or drag the bottom-right corner
                  to resize.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-[#4B6CB7]/20 rounded" />
                  <div className="h-2 bg-[#4B6CB7]/20 rounded w-3/4" />
                  <div className="h-2 bg-[#4B6CB7]/20 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          </DraggableWidget>
        ))}
      </div>
    </div>
  )
}
