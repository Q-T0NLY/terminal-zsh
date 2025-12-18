"use client"

import { useState } from "react"
import { Play, Download, Zap, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ExtensionPlaygroundProps {
  extensions: any[]
  onExtensionSelect: (extension: any) => void
}

export function ExtensionPlayground({ extensions, onExtensionSelect }: ExtensionPlaygroundProps) {
  const [selectedExtension, setSelectedExtension] = useState<any>(null)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [metrics, setMetrics] = useState({
    executionTime: 0,
    tokensUsed: 0,
    qualityScore: 0,
  })

  const runExtension = async () => {
    if (!selectedExtension || !input) return

    setIsRunning(true)
    // Simulate extension execution
    setTimeout(() => {
      setOutput(`Processed output from ${selectedExtension.name}:\n\n${input.toUpperCase()}`)
      setMetrics({
        executionTime: Math.floor(Math.random() * 500) + 100,
        tokensUsed: Math.floor(Math.random() * 2000) + 500,
        qualityScore: Math.floor(Math.random() * 30) + 70,
      })
      setIsRunning(false)
    }, 1500)
  }

  return (
    <div className="extension-playground space-y-6">
      <div className="playground-header">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Extension Playground
        </h3>
        <p className="text-muted-foreground">Test and experiment with generative extensions in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Extension Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold mb-4">Available Extensions</h4>
              <div className="space-y-2">
                {extensions.slice(0, 10).map((extension) => (
                  <button
                    key={extension.id}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedExtension?.id === extension.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    }`}
                    onClick={() => setSelectedExtension(extension)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{extension.icon}</span>
                      <span className="font-medium text-sm">{extension.name}</span>
                    </div>
                    <p className="text-xs opacity-80 line-clamp-2">{extension.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input/Output Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">Input</h4>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
                rows={8}
                className="mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={runExtension}
                  disabled={!selectedExtension || isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Play size={14} />
                  {isRunning ? "Running..." : "Run Extension"}
                </button>
                <button
                  onClick={() => setInput("")}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Clear
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold mb-2">Output</h4>
              <div className="min-h-[200px] p-4 bg-accent rounded-lg whitespace-pre-wrap font-mono text-sm">
                {output || "Run the extension to see output..."}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    /* download logic */
                  }}
                  disabled={!output}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => setOutput("")}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Clear
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold mb-4">Performance Metrics</h4>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Execution Time</span>
                    <span className="font-bold">{metrics.executionTime}ms</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min(metrics.executionTime / 5, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tokens Used</span>
                    <span className="font-bold">{metrics.tokensUsed}</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(metrics.tokensUsed / 20, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span className="font-bold">{metrics.qualityScore}%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${metrics.qualityScore}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h5 className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI Suggestions
                </h5>
                <div className="text-sm text-muted-foreground">
                  Run an extension to get AI-powered optimization suggestions
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
