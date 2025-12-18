"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Tab {
  id: string
  name: string
  icon?: string
}

interface TabCustomizerProps {
  tab: Tab
  onSave: (tab: Tab) => void
  onClose: () => void
}

export function TabCustomizer({ tab, onSave, onClose }: TabCustomizerProps) {
  const [name, setName] = useState(tab.name)
  const [icon, setIcon] = useState(tab.icon || "📄")

  const handleSave = () => {
    onSave({
      ...tab,
      id: tab.id === "new" ? `custom-${Date.now()}` : tab.id,
      name,
      icon,
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tab.id === "new" ? "Create New Tab" : "Edit Tab"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tab-name">Tab Name</Label>
            <Input id="tab-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter tab name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tab-icon">Icon (emoji)</Label>
            <Input
              id="tab-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📄"
              maxLength={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
