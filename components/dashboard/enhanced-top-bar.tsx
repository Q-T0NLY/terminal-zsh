"use client"

import { Search, Play, Pause, User, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Badge } from "@/components/ui/badge"

interface EnhancedTopBarProps {
  environment?: string
  onEnvironmentChange?: (env: string) => void
  healthStatus?: "healthy" | "degraded" | "unhealthy"
}

export function EnhancedTopBar({
  environment = "dev",
  onEnvironmentChange,
  healthStatus = "healthy",
}: EnhancedTopBarProps) {
  return (
    <div className="flex items-center justify-between border-b bg-card p-4">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">Nexus Quantum</h1>

        <Select value={environment} onValueChange={onEnvironmentChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dev">Development</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="prod">Production</SelectItem>
          </SelectContent>
        </Select>

        <Badge
          variant={healthStatus === "healthy" ? "default" : healthStatus === "degraded" ? "secondary" : "destructive"}
          className="gap-1"
        >
          <Activity className="h-3 w-3" />
          {healthStatus}
        </Badge>
      </div>

      <div className="flex flex-1 max-w-2xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search agents, workflows, or press / to focus..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Deploy
        </Button>
        <Button variant="outline" size="sm">
          <Pause className="h-4 w-4 mr-2" />
          Pause Auto-Execute
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Admin</DropdownMenuItem>
            <DropdownMenuItem>Operator</DropdownMenuItem>
            <DropdownMenuItem>Viewer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
