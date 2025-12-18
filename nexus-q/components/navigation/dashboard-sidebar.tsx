"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Coins,
  Network,
  MessageSquare,
  Calendar,
  Workflow,
  Plug,
  Bell,
  BarChart3,
  Shield,
  Activity,
  Zap,
  FileText,
  Database,
  Settings,
  Package,
  TestTube,
  Rocket,
  Code,
  Lock,
  Key,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "Dashboard Home", icon: Home },
  { id: "agents", label: "Agent Control Board", icon: Users },
  { id: "tokenization", label: "Tokenization Center", icon: Coins },
  { id: "runtime", label: "Runtime Map", icon: Network },
  { id: "messages", label: "Message Bus", icon: MessageSquare },
  { id: "scheduler", label: "Scheduler", icon: Calendar },
  { id: "workflow", label: "Workflow Builder", icon: Workflow },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "security", label: "Security", icon: Shield },
  { id: "health", label: "System Health", icon: Activity },
  { id: "optimization", label: "Optimization", icon: Zap },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "backup", label: "Backup", icon: Database },
  { id: "config", label: "Configurations", icon: Settings },
  { id: "admin", label: "Admin Center", icon: Users },
  { id: "extensions", label: "Extensions", icon: Package },
  { id: "testing", label: "Testing", icon: TestTube },
  { id: "deployment", label: "Deployment", icon: Rocket },
  { id: "development", label: "Development", icon: Code },
  { id: "governance", label: "Governance", icon: Lock },
  { id: "licensing", label: "Licensing", icon: Key },
  { id: "themes", label: "Themes", icon: Palette },
]

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`bg-white border-r border-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-[#4B6CB7]">Nexus Quantum</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start mb-1 ${activeTab === item.id ? "bg-[#4B6CB7] text-white" : ""}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
