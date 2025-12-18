"use client"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { WidgetRenderer } from "./widget-renderer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Widget {
  id: string
  tabId: string
  type: string
  name: string
  config: any
}

interface WidgetGridProps {
  tabId: string
  widgets: Widget[]
  onWidgetsChange: (widgets: Widget[]) => void
}

export function WidgetGrid({ tabId, widgets, onWidgetsChange }: WidgetGridProps) {
  const tabWidgets = widgets.filter((w) => w.tabId === tabId)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = tabWidgets.findIndex((w) => w.id === active.id)
      const newIndex = tabWidgets.findIndex((w) => w.id === over.id)

      const reordered = arrayMove(tabWidgets, oldIndex, newIndex)
      const otherWidgets = widgets.filter((w) => w.tabId !== tabId)
      onWidgetsChange([...otherWidgets, ...reordered])
    }
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tabWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tabWidgets.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                onUpdate={(updates) => {
                  const updated = widgets.map((w) => (w.id === widget.id ? { ...w, ...updates } : w))
                  onWidgetsChange(updated)
                }}
                onRemove={() => {
                  onWidgetsChange(widgets.filter((w) => w.id !== widget.id))
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {tabWidgets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No widgets added yet</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      )}
    </div>
  )
}
