"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { GlowCard } from "@/components/ui/glow-card"
import { Separator } from "@/components/ui/separator"
import type { Agent, AIModel, AgentTemplate } from "@/types/database"

const agentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  model_id: z.string().min(1, "Model is required"),
  system_prompt: z.string().min(10, "System prompt must be at least 10 characters"),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(128000).optional(),
  is_active: z.boolean().default(true),
})

type AgentFormData = z.infer<typeof agentSchema>

interface AgentFormProps {
  agent?: Agent
  models: AIModel[]
  templates: AgentTemplate[]
  onSubmit: (data: AgentFormData) => Promise<void>
  onCancel?: () => void
}

export function AgentForm({ agent, models, templates, onSubmit, onCancel }: AgentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: agent?.name || "",
      description: agent?.description || "",
      type: agent?.type || "custom",
      model_id: agent?.model_id || "",
      system_prompt: agent?.system_prompt || "",
      temperature: agent?.config?.temperature || 0.7,
      max_tokens: agent?.config?.max_tokens || 2000,
      is_active: agent?.is_active ?? true,
    },
  })

  const handleFormSubmit = async (data: AgentFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setValue("type", template.type)
      setValue("system_prompt", template.system_prompt)
      if (template.default_config.temperature) {
        setValue("temperature", template.default_config.temperature)
      }
      if (template.default_config.max_tokens) {
        setValue("max_tokens", template.default_config.max_tokens)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <GlowCard glowColor="cyan">
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Start from Template (Optional)</Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <Label htmlFor="name">Agent Name *</Label>
            <Input id="name" {...register("name")} placeholder="My AI Agent" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="What does this agent do?" rows={3} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="type">Agent Type *</Label>
              <Input id="type" {...register("type")} placeholder="code, content, data, etc." />
              {errors.type && <p className="mt-1 text-xs text-destructive">{errors.type.message}</p>}
            </div>

            <div>
              <Label htmlFor="model_id">AI Model *</Label>
              <Select onValueChange={(value) => setValue("model_id", value)} value={watch("model_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model_id && <p className="mt-1 text-xs text-destructive">{errors.model_id.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="system_prompt">System Prompt *</Label>
            <Textarea
              id="system_prompt"
              {...register("system_prompt")}
              placeholder="You are a helpful assistant that..."
              rows={6}
              className="font-mono text-sm"
            />
            {errors.system_prompt && <p className="mt-1 text-xs text-destructive">{errors.system_prompt.message}</p>}
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                min="0"
                max="2"
                {...register("temperature", { valueAsNumber: true })}
              />
              <p className="mt-1 text-xs text-muted-foreground">Controls randomness (0-2)</p>
            </div>

            <div>
              <Label htmlFor="max_tokens">Max Tokens</Label>
              <Input
                id="max_tokens"
                type="number"
                step="100"
                min="1"
                max="128000"
                {...register("max_tokens", { valueAsNumber: true })}
              />
              <p className="mt-1 text-xs text-muted-foreground">Maximum response length</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active</Label>
              <p className="text-xs text-muted-foreground">Enable or disable this agent</p>
            </div>
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
          </div>
        </div>
      </GlowCard>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : agent ? "Update Agent" : "Create Agent"}
        </Button>
      </div>
    </form>
  )
}
