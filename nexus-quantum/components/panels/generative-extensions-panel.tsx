"use client"

import { useState, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import { Zap, Plus, Code, Brain, Sparkles, Palette, Upload, Play, TestTube } from "lucide-react"
import { ExtensionsRegistry } from "@/components/extensions/extensions-registry"
import { ExtensionBuilder } from "@/components/extensions/extension-builder"
import { ExtensionPlayground } from "@/components/extensions/extension-playground"
import { ExtensionDetailsPanel } from "@/components/extensions/extension-details-panel"
import { useGenerativeExtensions } from "@/lib/hooks/use-generative-extensions"

export function GenerativeExtensionsPanel() {
  const [activeView, setActiveView] = useState<"registry" | "builder" | "playground">("registry")
  const [selectedExtension, setSelectedExtension] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")

  const { extensions, createExtension, testExtension, deployExtension, updateExtension, importExtension } =
    useGenerativeExtensions()

  const categories = [
    { id: "all", name: "All Extensions", icon: Zap },
    { id: "transformers", name: "Text Transformers", icon: Brain },
    { id: "generators", name: "Content Generators", icon: Sparkles },
    { id: "analyzers", name: "AI Analyzers", icon: Code },
    { id: "integrations", name: "API Integrations", icon: Palette },
    { id: "custom", name: "Custom Models", icon: Plus },
  ]

  const filteredExtensions = useMemo(
    () =>
      extensions.filter(
        (ext) =>
          ext.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (category === "all" || ext.category === category),
      ),
    [extensions, searchTerm, category],
  )

  return (
    <div className="generative-extensions-panel h-full flex flex-col">
      {/* Panel Header */}
      <div className="panel-header border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Generative Extensions Registry
            </h2>
            <p className="text-muted-foreground mt-1">
              Discover, build, and manage AI-powered extensions for your orchestration system
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => setActiveView("builder")}
            >
              <Plus size={16} />
              New Extension
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => importExtension()}
            >
              <Upload size={16} />
              Import
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => setActiveView("playground")}
            >
              <Play size={16} />
              Playground
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="extensions-nav flex gap-2 p-4 border-b border-border">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeView === "registry" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          }`}
          onClick={() => setActiveView("registry")}
        >
          <Zap size={16} />
          Extension Registry
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeView === "builder" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          }`}
          onClick={() => setActiveView("builder")}
        >
          <Code size={16} />
          Extension Builder
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeView === "playground" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          }`}
          onClick={() => setActiveView("playground")}
        >
          <TestTube size={16} />
          AI Playground
        </button>
      </div>

      {/* Content Area */}
      <div className="extensions-content flex-1 overflow-auto p-6">
        {activeView === "registry" && (
          <ExtensionsRegistry
            extensions={filteredExtensions}
            categories={categories}
            searchTerm={searchTerm}
            category={category}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategory}
            onExtensionSelect={setSelectedExtension}
            onTestExtension={testExtension}
            onDeployExtension={deployExtension}
          />
        )}

        {activeView === "builder" && <ExtensionBuilder onSave={createExtension} onTest={testExtension} />}

        {activeView === "playground" && (
          <ExtensionPlayground extensions={extensions} onExtensionSelect={setSelectedExtension} />
        )}
      </div>

      {/* Extension Details Panel */}
      <AnimatePresence>
        {selectedExtension && (
          <ExtensionDetailsPanel
            extension={selectedExtension}
            onClose={() => setSelectedExtension(null)}
            onUpdate={(updates) => updateExtension(selectedExtension.id, updates)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
