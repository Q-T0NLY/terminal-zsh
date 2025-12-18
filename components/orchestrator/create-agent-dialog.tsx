"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const capabilities = [
  { id: "routing", label: "Task Routing" },
  { id: "scheduling", label: "Scheduling" },
  { id: "data-transform", label: "Data Transformation" },
  { id: "validation", label: "Validation" },
  { id: "text-generation", label: "Text Generation" },
  { id: "summarization", label: "Summarization" },
  { id: "translation", label: "Translation" },
  { id: "analysis", label: "Analysis" },
]

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])

  const toggleCapability = (capabilityId: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capabilityId) ? prev.filter((id) => id !== capabilityId) : [...prev, capabilityId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>Configure a new agent with specific capabilities and parameters</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input id="name" placeholder="e.g., Data Processor Agent" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core Agent</SelectItem>
                <SelectItem value="specialized">Specialized Agent</SelectItem>
                <SelectItem value="generative">Generative Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the agent's purpose and functionality" rows={3} />
          </div>

          <div className="grid gap-3">
            <Label>Capabilities</Label>
            <div className="grid grid-cols-2 gap-3">
              {capabilities.map((capability) => (
                <div key={capability.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={capability.id}
                    checked={selectedCapabilities.includes(capability.id)}
                    onCheckedChange={() => toggleCapability(capability.id)}
                  />
                  <label
                    htmlFor={capability.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {capability.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="memory">Memory Limit (MB)</Label>
              <Input id="memory" type="number" placeholder="512" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input id="timeout" type="number" placeholder="30" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
