"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AutomationRule {
  id: string
  name: string
  trigger: {
    type: "schedule" | "event" | "webhook"
    config: any
  }
  conditions: Array<{
    field: string
    operator: string
    value: any
  }>
  actions: Array<{
    type: string
    config: any
  }>
}

export function AutomationBuilder() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null)
  const { toast } = useToast()

  function createNewRule() {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: "New Automation",
      trigger: {
        type: "event",
        config: {},
      },
      conditions: [],
      actions: [],
    }
    setEditingRule(newRule)
  }

  function saveRule() {
    if (!editingRule) return

    setRules((prev) => {
      const existing = prev.find((r) => r.id === editingRule.id)
      if (existing) {
        return prev.map((r) => (r.id === editingRule.id ? editingRule : r))
      }
      return [...prev, editingRule]
    })

    toast({
      title: "Automation Saved",
      description: "Your automation rule has been saved successfully.",
    })

    setEditingRule(null)
  }

  function deleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast({
      title: "Automation Deleted",
      description: "The automation rule has been deleted.",
    })
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Automation Builder
        </h2>
        <Button onClick={createNewRule}>
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Rules List */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Active Automations</h3>
          <div className="space-y-2">
            {rules.map((rule) => (
              <Card key={rule.id} className="p-3 hover:bg-accent cursor-pointer" onClick={() => setEditingRule(rule)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{rule.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteRule(rule.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {rule.trigger.type} → {rule.actions.length} action(s)
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Rule Editor */}
        {editingRule && (
          <Card className="p-4">
            <h3 className="font-medium mb-4">Edit Automation</h3>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Trigger Type</Label>
                <Select
                  value={editingRule.trigger.type}
                  onValueChange={(value: any) =>
                    setEditingRule({
                      ...editingRule,
                      trigger: { ...editingRule.trigger, type: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Schedule (Cron)</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea placeholder="Describe what this automation does..." rows={3} />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveRule} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingRule(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
