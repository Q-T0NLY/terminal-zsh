"use client"

import type React from "react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Widget {
  id: string
  tabId: string
  type: string
  name: string
  config?: any
}

interface AdvancedGridSystemProps {
  tabId: string
  widgets: Widget[]
  onWidgetsChange: (widgets: Widget[]) => void
  onWidgetAdd: (widget: Partial<Widget>) => void
  onWidgetRemove: (widgetId: string) => void
  onWidgetSelect?: (widget: Widget | null) => void
  children?: React.ReactNode
}

export function AdvancedGridSystem({
  tabId,
  widgets,
  onWidgetsChange,
  onWidgetAdd,
  onWidgetRemove,
  onWidgetSelect,
  children,
}: AdvancedGridSystemProps) {
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)
  const [gridMode, setGridMode] = useState<"free" | "columns" | "rows">("free")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  const handleDragStart = (event: any) => {
    const widget = widgets.find((w) => w.id === event.active.id)
    setActiveWidget(widget || null)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveWidget(null)

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id)
      const newIndex = widgets.findIndex((w) => w.id === over.id)

      onWidgetsChange(arrayMove(widgets, oldIndex, newIndex))
    }
  }

  return (
    <div className="advanced-grid-system h-full flex flex-col">
      {/* Grid Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <Button variant={gridMode === "free" ? "default" : "outline"} size="sm" onClick={() => setGridMode("free")}>
            Free Form
          </Button>
          <Button
            variant={gridMode === "columns" ? "default" : "outline"}
            size="sm"
            onClick={() => setGridMode("columns")}
          >
            Columns
          </Button>
          <Button variant={gridMode === "rows" ? "default" : "outline"} size="sm" onClick={() => setGridMode("rows")}>
            Rows
          </Button>
        </div>

        <Button size="sm" onClick={() => onWidgetAdd({ tabId, type: "metrics-card", name: "New Widget" })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`grid gap-4 ${
              gridMode === "free"
                ? "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
                : gridMode === "columns"
                  ? "grid-cols-4"
                  : "grid-cols-1"
            }`}
          >
            <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
              {widgets.map((widget) => (
                <SortableWidget
                  key={widget.id}
                  widget={widget}
                  onRemove={() => onWidgetRemove(widget.id)}
                  onSelect={() => onWidgetSelect?.(widget)}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeWidget && (
              <div className="bg-card border rounded-lg p-4 shadow-lg opacity-80">{activeWidget.name}</div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Tab Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

interface SortableWidgetProps {
  widget: Widget
  onRemove: () => void
  onSelect: () => void
}

function SortableWidget({ widget, onRemove, onSelect }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border rounded-lg p-4 cursor-move hover:shadow-lg transition-shadow"
      {...attributes}
      {...listeners}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{widget.name}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          ×
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">Type: {widget.type}</div>
    </div>
  )
}
