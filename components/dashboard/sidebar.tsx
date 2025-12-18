"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Code2,
  Workflow,
  BookOpen,
  Settings,
  Sparkles,
  Database,
  Zap,
  Globe,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-cyan-400", emoji: "📊" },
  { name: "Chat", href: "/chat", icon: MessageSquare, color: "text-purple-400", emoji: "💬" },
  { name: "Agents", href: "/agents", icon: Bot, color: "text-pink-400", emoji: "🤖" },
  { name: "Code", href: "/code", icon: Code2, color: "text-green-400", emoji: "💻" },
  { name: "Workflows", href: "/workflows", icon: Workflow, color: "text-orange-400", emoji: "🔄" },
  { name: "Browser", href: "/browser", icon: Globe, color: "text-blue-400", emoji: "🌐" },
  { name: "Orchestrate", href: "/orchestrate", icon: Sparkles, color: "text-yellow-400", emoji: "✨" },
  { name: "Automation", href: "/automation", icon: Zap, color: "text-red-400", emoji: "⚡" },
  { name: "Knowledge", href: "/knowledge", icon: BookOpen, color: "text-indigo-400", emoji: "📚" },
  { name: "Settings", href: "/settings", icon: Settings, color: "text-gray-400", emoji: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 border-r border-border/50 bg-gradient-to-b from-card/80 via-card/50 to-card/30 backdrop-blur-xl shadow-2xl">
      <div className="flex h-full flex-col">
        {/* Header with glow effect */}
        <div className="border-b border-border/50 p-6 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Nexus
              </h1>
              <p className="text-xs text-muted-foreground">Orchestration Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation with enhanced styles */}
        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/50 hover:scale-105 hover:shadow-md",
                )}
              >
                {/* Glow effect on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isActive ? "opacity-0" : "from-accent/20 to-transparent",
                  )}
                />

                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300 relative z-10",
                    isActive
                      ? "scale-110 drop-shadow-glow"
                      : `${item.color} group-hover:scale-110 group-hover:rotate-12`,
                  )}
                />

                <span className="relative z-10 flex-1">{item.name}</span>

                <span className="text-lg relative z-10 group-hover:scale-125 transition-transform duration-300">
                  {item.emoji}
                </span>

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-l-full shadow-lg shadow-cyan-400/50" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer with status */}
        <div className="border-t border-border/50 p-4 bg-gradient-to-br from-green-500/10 via-transparent to-transparent">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-green-500/30 shadow-lg shadow-green-500/10">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-green-400">Database Online</div>
                <div className="text-[10px] text-muted-foreground">All systems operational</div>
              </div>
              <Database className="h-4 w-4 text-green-400" />
            </div>

            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-400 animate-pulse" />
                <span className="text-xs text-muted-foreground">Ready to orchestrate</span>
              </div>
              <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                v1.0
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
