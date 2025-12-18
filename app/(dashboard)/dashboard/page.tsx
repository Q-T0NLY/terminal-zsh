"use client"

import {
  Bot,
  Zap,
  Activity,
  MessageSquare,
  Sparkles,
  Workflow,
  Code2,
  BookOpen,
  Database,
  Settings,
  Globe,
  TrendingUp,
  Cpu,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          AI Orchestration Platform
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive multimodal ensemble generative orchestrator with advanced features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2 from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +1 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +180 from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Items</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +23 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Platform Features
          </CardTitle>
          <CardDescription>Access all advanced orchestration capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/chat"
              className="flex items-center gap-3 p-4 rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent hover:border-cyan-500/60 hover:scale-105 transition-all"
            >
              <MessageSquare className="h-6 w-6 text-cyan-400" />
              <div>
                <div className="font-semibold">Multimodal Chat</div>
                <div className="text-xs text-muted-foreground">AI conversations with files, images, code</div>
              </div>
            </Link>

            <Link
              href="/agents"
              className="flex items-center gap-3 p-4 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-500/60 hover:scale-105 transition-all"
            >
              <Bot className="h-6 w-6 text-purple-400" />
              <div>
                <div className="font-semibold">Agent Builder</div>
                <div className="text-xs text-muted-foreground">Create & manage AI agents</div>
              </div>
            </Link>

            <Link
              href="/workflows"
              className="flex items-center gap-3 p-4 rounded-lg border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent hover:border-pink-500/60 hover:scale-105 transition-all"
            >
              <Workflow className="h-6 w-6 text-pink-400" />
              <div>
                <div className="font-semibold">Workflow Builder</div>
                <div className="text-xs text-muted-foreground">Visual node-based editor</div>
              </div>
            </Link>

            <Link
              href="/code"
              className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent hover:border-green-500/60 hover:scale-105 transition-all"
            >
              <Code2 className="h-6 w-6 text-green-400" />
              <div>
                <div className="font-semibold">Code Workspace</div>
                <div className="text-xs text-muted-foreground">Monaco editor with AI assist</div>
              </div>
            </Link>

            <Link
              href="/browser"
              className="flex items-center gap-3 p-4 rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent hover:border-blue-500/60 hover:scale-105 transition-all"
            >
              <Globe className="h-6 w-6 text-blue-400" />
              <div>
                <div className="font-semibold">Browser Panel</div>
                <div className="text-xs text-muted-foreground">Web scraping & AI analysis</div>
              </div>
            </Link>

            <Link
              href="/orchestrate"
              className="flex items-center gap-3 p-4 rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent hover:border-yellow-500/60 hover:scale-105 transition-all"
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <div>
                <div className="font-semibold">AI Orchestration</div>
                <div className="text-xs text-muted-foreground">Ensemble model routing</div>
              </div>
            </Link>

            <Link
              href="/knowledge"
              className="flex items-center gap-3 p-4 rounded-lg border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent hover:border-indigo-500/60 hover:scale-105 transition-all"
            >
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <div>
                <div className="font-semibold">Knowledge Base</div>
                <div className="text-xs text-muted-foreground">Semantic search & graph</div>
              </div>
            </Link>

            <Link
              href="/automation"
              className="flex items-center gap-3 p-4 rounded-lg border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent hover:border-orange-500/60 hover:scale-105 transition-all"
            >
              <Zap className="h-6 w-6 text-orange-400" />
              <div>
                <div className="font-semibold">Automation Engine</div>
                <div className="text-xs text-muted-foreground">Event triggers & scheduling</div>
              </div>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-500/30 bg-gradient-to-br from-gray-500/10 to-transparent hover:border-gray-500/60 hover:scale-105 transition-all"
            >
              <Settings className="h-6 w-6 text-gray-400" />
              <div>
                <div className="font-semibold">Settings</div>
                <div className="text-xs text-muted-foreground">Configure platform</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Live updates from your AI platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <Database className="h-4 w-4 text-cyan-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Platform initialized</p>
                <p className="text-xs text-muted-foreground">All systems operational and ready</p>
              </div>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                Active
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <Bot className="h-4 w-4 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI models loaded</p>
                <p className="text-xs text-muted-foreground">OpenAI, Anthropic, Gemini ready</p>
              </div>
              <Badge variant="outline" className="text-xs">
                1m ago
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Ensemble orchestration configured</p>
                <p className="text-xs text-muted-foreground">Voting, weighted, cascade strategies active</p>
              </div>
              <Badge variant="outline" className="text-xs">
                2m ago
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <Workflow className="h-4 w-4 text-pink-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Workflow engine online</p>
                <p className="text-xs text-muted-foreground">Visual node editor ready for building</p>
              </div>
              <Badge variant="outline" className="text-xs">
                3m ago
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
