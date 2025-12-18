"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bot,
  Workflow,
  Settings,
  FileText,
  Zap,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Copy,
  Eye,
  Edit,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Command {
  id: string
  name: string
  description?: string
  icon: any
  category: string
  shortcut?: string
  action: () => void
}

interface EnhancedCommandPaletteProps {
  onNavigate?: (tabId: string) => void
  onAction?: (actionId: string) => void
}

export function EnhancedCommandPalette({ onNavigate, onAction }: EnhancedCommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-home",
        name: "Go to Dashboard Home",
        icon: Search,
        category: "Navigation",
        action: () => onNavigate?.("home"),
      },
      {
        id: "nav-agents",
        name: "Go to Agent Control Board",
        icon: Bot,
        category: "Navigation",
        action: () => onNavigate?.("agents"),
      },
      {
        id: "nav-workflows",
        name: "Go to Workflow Builder",
        icon: Workflow,
        category: "Navigation",
        action: () => onNavigate?.("workflows"),
      },
      {
        id: "nav-analytics",
        name: "Go to Analytics & Insights",
        icon: FileText,
        category: "Navigation",
        action: () => onNavigate?.("analytics"),
      },
      {
        id: "nav-settings",
        name: "Go to System Configuration",
        icon: Settings,
        category: "Navigation",
        action: () => onNavigate?.("config"),
      },

      // Actions
      {
        id: "action-create-agent",
        name: "Create New Agent",
        icon: Plus,
        category: "Actions",
        shortcut: "⌘N",
        action: () => onAction?.("create-agent"),
      },
      {
        id: "action-start-workflow",
        name: "Start Workflow",
        icon: Play,
        category: "Actions",
        shortcut: "⌘R",
        action: () => onAction?.("start-workflow"),
      },
      {
        id: "action-pause-system",
        name: "Pause System",
        icon: Pause,
        category: "Actions",
        action: () => onAction?.("pause-system"),
      },
      {
        id: "action-refresh",
        name: "Refresh All Data",
        icon: RefreshCw,
        category: "Actions",
        shortcut: "⌘⇧R",
        action: () => onAction?.("refresh"),
      },

      // Quick Actions
      {
        id: "quick-deploy",
        name: "Deploy to Production",
        icon: Zap,
        category: "Quick Actions",
        action: () => onAction?.("deploy"),
      },
      {
        id: "quick-export",
        name: "Export Dashboard Data",
        icon: Download,
        category: "Quick Actions",
        action: () => onAction?.("export"),
      },
      {
        id: "quick-import",
        name: "Import Configuration",
        icon: Upload,
        category: "Quick Actions",
        action: () => onAction?.("import"),
      },

      // Management
      {
        id: "manage-delete",
        name: "Delete Selected Items",
        icon: Trash2,
        category: "Management",
        action: () => onAction?.("delete"),
      },
      {
        id: "manage-duplicate",
        name: "Duplicate Current View",
        icon: Copy,
        category: "Management",
        action: () => onAction?.("duplicate"),
      },
      {
        id: "manage-preview",
        name: "Preview Changes",
        icon: Eye,
        category: "Management",
        action: () => onAction?.("preview"),
      },
      {
        id: "manage-edit",
        name: "Edit Configuration",
        icon: Edit,
        category: "Management",
        action: () => onAction?.("edit"),
      },
    ],
    [onNavigate, onAction],
  )

  const filteredCommands = useMemo(() => {
    if (!search) return commands

    const searchLower = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.category.toLowerCase().includes(searchLower),
    )
  }, [search, commands])

  const categories = useMemo(() => {
    const cats = new Map<string, Command[]>()
    filteredCommands.forEach((cmd) => {
      if (!cats.has(cmd.category)) {
        cats.set(cmd.category, [])
      }
      cats.get(cmd.category)!.push(cmd)
    })
    return cats
  }, [filteredCommands])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }

      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const cmd = filteredCommands[selectedIndex]
        if (cmd) {
          cmd.action()
          setOpen(false)
          setSearch("")
          setSelectedIndex(0)
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, selectedIndex, filteredCommands])

  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
            <Input
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              autoFocus
            />
            <Badge variant="outline" className="ml-2 shrink-0">
              ⌘K
            </Badge>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No results found for "{search}"</div>
            ) : (
              <div className="space-y-4">
                {Array.from(categories.entries()).map(([category, cmds]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
                    <div className="space-y-1">
                      {cmds.map((cmd, idx) => {
                        const globalIndex = filteredCommands.indexOf(cmd)
                        const isSelected = globalIndex === selectedIndex
                        const Icon = cmd.icon

                        return (
                          <motion.button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action()
                              setOpen(false)
                              setSearch("")
                              setSelectedIndex(0)
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                              isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                            )}
                            whileHover={{ x: 4 }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          >
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{cmd.name}</div>
                              {cmd.description && (
                                <div className="text-xs text-muted-foreground truncate">{cmd.description}</div>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <Badge variant="secondary" className="shrink-0 text-xs">
                                {cmd.shortcut}
                              </Badge>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="h-5 px-1.5">
                  ↑↓
                </Badge>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="h-5 px-1.5">
                  ↵
                </Badge>
                Select
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="h-5 px-1.5">
                  Esc
                </Badge>
                Close
              </span>
            </div>
            <span>{filteredCommands.length} results</span>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
