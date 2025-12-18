"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabCustomizer } from "./tab-customizer"

interface Tab {
  id: string
  name: string
  icon?: string
  component?: React.ComponentType<any>
}

interface TabManagerProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  onTabAdd?: (tab: Tab) => void
  onTabRemove?: (tabId: string) => void
  onTabEdit?: (tabId: string, updates: Partial<Tab>) => void
}

export function TabManager({ tabs = [], activeTab, onTabChange, onTabAdd, onTabRemove, onTabEdit }: TabManagerProps) {
  const [showTabCustomizer, setShowTabCustomizer] = useState(false)
  const [editingTab, setEditingTab] = useState<Tab | null>(null)

  const allTabs = Array.isArray(tabs) ? tabs : []

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">Navigation</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingTab({ id: "new", name: "" })
            setShowTabCustomizer(true)
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {allTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            onEdit={(tab) => {
              setEditingTab(tab)
              setShowTabCustomizer(true)
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showTabCustomizer && editingTab && (
          <TabCustomizer
            tab={editingTab}
            onSave={(newTab) => {
              if (editingTab.id === "new" && onTabAdd) {
                onTabAdd(newTab)
              } else if (onTabEdit) {
                onTabEdit(editingTab.id, newTab)
              }
              onTabChange(newTab.id)
              setShowTabCustomizer(false)
              setEditingTab(null)
            }}
            onClose={() => {
              setShowTabCustomizer(false)
              setEditingTab(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface TabItemProps {
  tab: Tab
  isActive: boolean
  onClick: () => void
  onEdit: (tab: Tab) => void
}

function TabItem({ tab, isActive, onClick, onEdit }: TabItemProps) {
  return (
    <motion.div
      className={`
        flex items-center justify-between p-3 rounded-lg cursor-pointer
        transition-colors group
        ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-foreground"}
      `}
      whileHover={{ x: 4 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm">{tab.name}</span>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(tab)
        }}
      >
        <Settings className="h-3 w-3" />
      </Button>
    </motion.div>
  )
}
