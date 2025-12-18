"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Widget {
  id: string
  tabId: string
  type: string
  name: string
  icon?: string
  config?: any
  data?: any
  order?: number
}

interface WidgetManagerState {
  widgets: Widget[]
  addWidget: (widget: Partial<Widget>) => Widget
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void
  reorderWidgets: (tabId: string, fromIndex: number, toIndex: number) => void
}

export const useWidgetManager = create<WidgetManagerState>()(
  persist(
    (set, get) => ({
      widgets: [],

      addWidget: (widgetData) => {
        const newWidget: Widget = {
          id: `widget-${Date.now()}`,
          tabId: widgetData.tabId || "control",
          type: widgetData.type || "metrics-card",
          name: widgetData.name || "New Widget",
          icon: widgetData.icon,
          config: widgetData.config || {},
          data: widgetData.data || {},
          order: get().widgets.filter((w) => w.tabId === widgetData.tabId).length,
          ...widgetData,
        }

        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }))

        return newWidget
      },

      removeWidget: (widgetId) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== widgetId),
        }))
      },

      updateWidget: (widgetId, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)),
        }))
      },

      reorderWidgets: (tabId, fromIndex, toIndex) => {
        set((state) => {
          const tabWidgets = state.widgets.filter((w) => w.tabId === tabId)
          const otherWidgets = state.widgets.filter((w) => w.tabId !== tabId)

          const [movedWidget] = tabWidgets.splice(fromIndex, 1)
          tabWidgets.splice(toIndex, 0, movedWidget)

          return {
            widgets: [...otherWidgets, ...tabWidgets.map((w, index) => ({ ...w, order: index }))],
          }
        })
      },
    }),
    {
      name: "widget-manager-storage",
    },
  ),
)
