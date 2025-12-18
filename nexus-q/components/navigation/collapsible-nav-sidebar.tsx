"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Bot,
  DollarSign,
  Map,
  MessageSquare,
  Calendar,
  Workflow,
  Plug,
  Bell,
  BarChart3,
  Shield,
  Activity,
  Sparkles,
  FileText,
  Database,
  Settings,
  Crown,
  Package,
  TestTube,
  Rocket,
  Code,
  Lock,
  FileKey,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  id: string
  name: string
  icon: any
  badge?: string | number
  section?: string
}

const NAV_ITEMS: NavItem[] = [
  // Core Operations
  { id: "home", name: "Dashboard Home", icon: Home, section: "Core" },
  { id: "agents", name: "Agent Control Board", icon: Bot, badge: "12", section: "Core" },
  { id: "tokenization", name: "Tokenization Center", icon: DollarSign, section: "Core" },
  { id: "orchestrator", name: "Orchestrator Runtime", icon: Map, section: "Core" },

  // Communication & Scheduling
  { id: "message-bus", name: "Message Bus & Events", icon: MessageSquare, section: "Communication" },
  { id: "scheduler", name: "Scheduler & Jobs", icon: Calendar, section: "Communication" },
  { id: "notifications", name: "Notifications Center", icon: Bell, badge: 3, section: "Communication" },

  // Development
  { id: "workflows", name: "Workflow Builder", icon: Workflow, section: "Development" },
  { id: "integrations", name: "Integration Hub", icon: Plug, section: "Development" },
  { id: "extensions", name: "Extensions Registry", icon: Package, section: "Development" },
  { id: "testing", name: "Testing & Debugging", icon: TestTube, section: "Development" },
  { id: "deployment", name: "Deployment & Lifecycle", icon: Rocket, section: "Development" },
  { id: "dev-management", name: "Development Hub", icon: Code, section: "Development" },

  // Analytics & Monitoring
  { id: "analytics", name: "Analytics & Insights", icon: BarChart3, section: "Analytics" },
  { id: "system-health", name: "System Health", icon: Activity, section: "Analytics" },
  { id: "predictive", name: "Predictive Optimization", icon: Sparkles, section: "Analytics" },

  // Security & Compliance
  { id: "security", name: "Security & Audit", icon: Shield, section: "Security" },
  { id: "governance", name: "Security Governance", icon: Lock, section: "Security" },
  { id: "licensing", name: "Licensing & Entitlement", icon: FileKey, section: "Security" },

  // Administration
  { id: "reports", name: "Reports Center", icon: FileText, section: "Admin" },
  { id: "backup", name: "Backup & Recovery", icon: Database, section: "Admin" },
  { id: "config", name: "System Configuration", icon: Settings, section: "Admin" },
  { id: "admin", name: "Admin Center", icon: Crown, section: "Admin" },
  { id: "themes", name: "Theme Management", icon: Palette, section: "Admin" },
]

interface CollapsibleNavSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  defaultCollapsed?: boolean
}

export function CollapsibleNavSidebar({
  activeTab,
  onTabChange,
  defaultCollapsed = false,
}: CollapsibleNavSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [expandedSections, setExpandedSections] = useState<string[]>(["Core", "Development"])

  const sections = Array.from(new Set(NAV_ITEMS.map((item) => item.section).filter(Boolean)))

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <motion.div
      className={cn(
        "h-full bg-background/95 backdrop-blur-xl border-r border-border/50 flex flex-col",
        "transition-all duration-300 ease-in-out",
      )}
      animate={{
        width: isCollapsed ? "80px" : "280px",
      }}
      initial={false}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.h2
              className="font-semibold text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              Navigation
            </motion.h2>
          )}
        </AnimatePresence>

        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 shrink-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {sections.map((section) => {
          const sectionItems = NAV_ITEMS.filter((item) => item.section === section)
          const isExpanded = expandedSections.includes(section)

          return (
            <div key={section} className="space-y-1">
              {/* Section Header */}
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group"
                >
                  <span>{section}</span>
                  <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                </button>
              )}

              {/* Section Items */}
              <AnimatePresence initial={false}>
                {(isCollapsed || isExpanded) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {sectionItems.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.id

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => onTabChange(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                            "hover:bg-accent/50 group relative",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                          )}
                          whileHover={{ x: isCollapsed ? 0 : 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-foreground",
                            )}
                          />

                          <AnimatePresence mode="wait">
                            {!isCollapsed && (
                              <motion.div
                                className="flex items-center justify-between flex-1 min-w-0"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <span className="text-sm font-medium truncate">{item.name}</span>
                                {item.badge && (
                                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto shrink-0">
                                    {item.badge}
                                  </Badge>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Tooltip for collapsed state */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                              {item.name}
                              {item.badge && (
                                <Badge variant="outline" className="ml-2">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              className="text-xs text-muted-foreground space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between">
                <span>Active Agents:</span>
                <span className="font-semibold text-green-500">12</span>
              </div>
              <div className="flex justify-between">
                <span>System Load:</span>
                <span className="font-semibold text-blue-500">45%</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
