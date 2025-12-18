"use client"

import { Search, Play, Pause, User, Activity, Sparkles } from "lucide-react"
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
import { motion } from "framer-motion"

interface EnhancedTopBarProps {
  environment?: string
  onEnvironmentChange?: (env: string) => void
  healthStatus?: "healthy" | "degraded" | "unhealthy"
  onThemeGalleryOpen?: () => void
}

export function EnhancedTopBar({
  environment = "dev",
  onEnvironmentChange,
  healthStatus = "healthy",
  onThemeGalleryOpen,
}: EnhancedTopBarProps) {
  return (
    <motion.div
      className="relative flex items-center justify-between border-b bg-card/50 backdrop-blur-xl p-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex items-center gap-6">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary" />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Nexus Quantum
          </h1>
        </motion.div>

        <Select value={environment} onValueChange={onEnvironmentChange}>
          <SelectTrigger className="w-[140px] border-primary/20 hover:border-primary/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dev">Development</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="prod">Production</SelectItem>
          </SelectContent>
        </Select>

        <motion.div
          animate={{
            scale: healthStatus === "healthy" ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: healthStatus === "healthy" ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          <Badge
            variant={healthStatus === "healthy" ? "default" : healthStatus === "degraded" ? "secondary" : "destructive"}
            className="gap-1 relative overflow-hidden"
          >
            <Activity className="h-3 w-3" />
            {healthStatus}
            {healthStatus === "healthy" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            )}
          </Badge>
        </motion.div>
      </div>

      <div className="flex flex-1 max-w-2xl mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search agents, workflows, or press / to focus..."
            className="pl-10 border-primary/20 focus:border-primary/40 bg-background/50 backdrop-blur transition-all"
          />
          <motion.div
            className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity"
            style={{
              boxShadow: "0 0 20px rgba(102, 126, 234, 0.3)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 bg-transparent"
        >
          <Play className="h-4 w-4 mr-2" />
          Deploy
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 bg-transparent"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause Auto-Execute
        </Button>

        {onThemeGalleryOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onThemeGalleryOpen}
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/10 bg-transparent"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Themes
          </Button>
        )}

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-primary/20">
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
    </motion.div>
  )
}
