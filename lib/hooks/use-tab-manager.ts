"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Tab {
  id: string
  name: string
  icon: string
  component: any
  custom?: boolean
  order?: number
  createdAt?: string
}

interface TabManagerState {
  tabs: Tab[]
  recentTabs: string[]
  initialized: boolean
  initializeTabs: (coreTabs: Tab[]) => void
  addTab: (tabData: Partial<Tab>) => Tab
  removeTab: (tabId: string) => void
  updateTab: (tabId: string, updates: Partial<Tab>) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
  duplicateTab: (tabId: string) => Tab | undefined
}

export const useTabManager = create<TabManagerState>()(
  persist(
    (set, get) => ({
      tabs: [],
      recentTabs: [],
      initialized: false,

      initializeTabs: (coreTabs) => {
        if (!get().initialized || get().tabs.length === 0) {
          set({ tabs: coreTabs, initialized: true })
        }
      },

      addTab: (tabData) => {
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          name: tabData.name || "New Tab",
          icon: tabData.icon || "📄",
          component: tabData.component,
          custom: true,
          createdAt: new Date().toISOString(),
          order: get().tabs.length,
          ...tabData,
        }

        set((state) => ({
          tabs: [...state.tabs, newTab],
          recentTabs: [newTab.id, ...state.recentTabs.slice(0, 9)],
        }))

        return newTab
      },

      removeTab: (tabId) => {
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== tabId),
          recentTabs: state.recentTabs.filter((id) => id !== tabId),
        }))
      },

      updateTab: (tabId, updates) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)),
        }))
      },

      reorderTabs: (fromIndex, toIndex) => {
        set((state) => {
          const newTabs = [...state.tabs]
          const [movedTab] = newTabs.splice(fromIndex, 1)
          newTabs.splice(toIndex, 0, movedTab)

          return {
            tabs: newTabs.map((tab, index) => ({ ...tab, order: index })),
          }
        })
      },

      duplicateTab: (tabId) => {
        const originalTab = get().tabs.find((tab) => tab.id === tabId)
        if (!originalTab) return

        const duplicatedTab: Tab = {
          ...originalTab,
          id: `tab-${Date.now()}`,
          name: `${originalTab.name} (Copy)`,
          custom: true,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          tabs: [...state.tabs, duplicatedTab],
        }))

        return duplicatedTab
      },
    }),
    {
      name: "tab-manager-storage",
    },
  ),
)

// Initialize with core tabs
export function initializeTabManager(coreTabs: Tab[]) {
  useTabManager.setState({ tabs: coreTabs })
}
