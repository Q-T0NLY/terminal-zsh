"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Play, Download, Zap, TestTube, Code2, Brain, Settings2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface ExtensionBuilderProps {
  onSave: (extension: any) => void
  onTest: (extension: any) => void
}

export function ExtensionBuilder({ onSave, onTest }: ExtensionBuilderProps) {
  const [extension, setExtension] = useState({
    name: "",
    description: "",
    type: "transformer",
    configuration: {},
    code: "",
    triggers: [],
    actions: [],
    aiConfig: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
      contentFilter: false,
      biasDetection: false,
      auditLogging: true,
    },
    components: [],
  })

  const [activeTab, setActiveTab] = useState("designer")
  const [isTesting, setIsTesting] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)

  const extensionTypes = [
    { id: "transformer", name: "Text Transformer", icon: "🔄" },
    { id: "generator", name: "Content Generator", icon: "🎨" },
    { id: "analyzer", name: "AI Analyzer", icon: "🔍" },
    { id: "enhancer", name: "Content Enhancer", icon: "⚡" },
    { id: "validator", name: "AI Validator", icon: "✅" },
    { id: "custom", name: "Custom Model", icon: "🧩" },
  ]

  const modelTypes = [
    { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
    { id: "gpt-3.5", name: "GPT-3.5", description: "Fast and efficient" },
    { id: "claude-2", name: "Claude 2", description: "Balanced performance" },
    { id: "custom", name: "Custom Model", description: "Your own model" },
  ]

  const handleTest = async () => {
    setIsTesting(true)
    await onTest(extension)
    setTimeout(() => setIsTesting(false), 2000)
  }

  const exportExtension = () => {
    const dataStr = JSON.stringify(extension, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${extension.name || "extension"}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="extension-builder space-y-6">
      {/* Builder Header */}
      <div className="builder-header flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Extension Builder
          </h3>
          <p className="text-muted-foreground">Create custom AI-powered extensions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
          >
            <Play size={14} />
            {isTesting ? "Testing..." : "Test Extension"}
          </button>
          <button
            onClick={() => onSave(extension)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save size={14} />
            Save Extension
          </button>
          <button
            onClick={exportExtension}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Builder Tabs */}
      <div className="builder-tabs flex gap-2 border-b border-border">
        <button
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "designer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("designer")}
        >
          🎨 Visual Designer
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "code"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("code")}
        >
          💻 Code Editor
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "ai"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("ai")}
        >
          🧠 AI Configuration
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "test"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("test")}
        >
          🧪 Test Suite
        </button>
      </div>

      {/* Builder Content */}
      <div className="builder-content">
        {activeTab === "designer" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Extension Name</Label>
                    <Input
                      value={extension.name}
                      onChange={(e) => setExtension({ ...extension, name: e.target.value })}
                      placeholder="My AI Extension"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Extension Type</Label>
                    <select
                      value={extension.type}
                      onChange={(e) => setExtension({ ...extension, type: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    >
                      {extensionTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={extension.description}
                    onChange={(e) => setExtension({ ...extension, description: e.target.value })}
                    placeholder="Describe what your extension does..."
                    rows={4}
                  />
                </div>

                <div className="p-6 border-2 border-dashed border-border rounded-lg text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-bold mb-2">Start Building Your Extension</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure your extension settings and AI model to get started
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "code" && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label>Extension Code</Label>
                <Textarea
                  value={extension.code}
                  onChange={(e) => setExtension({ ...extension, code: e.target.value })}
                  placeholder="// Write your extension code here..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "ai" && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Model Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelTypes.map((model) => (
                    <motion.div
                      key={model.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        extension.aiConfig.model === model.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setExtension({ ...extension, aiConfig: { ...extension.aiConfig, model: model.id } })
                      }
                    >
                      <div className="font-bold mb-1">{model.name}</div>
                      <div className="text-sm text-muted-foreground">{model.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Settings
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Temperature</Label>
                      <span className="text-sm text-muted-foreground">{extension.aiConfig.temperature}</span>
                    </div>
                    <Slider
                      value={[extension.aiConfig.temperature]}
                      onValueChange={([value]) =>
                        setExtension({ ...extension, aiConfig: { ...extension.aiConfig, temperature: value } })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={extension.aiConfig.maxTokens}
                      onChange={(e) =>
                        setExtension({
                          ...extension,
                          aiConfig: { ...extension.aiConfig, maxTokens: Number.parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Advanced AI Settings
                  </h4>
                  <button
                    onClick={() => setAdvancedMode(!advancedMode)}
                    className="text-sm text-primary hover:underline"
                  >
                    {advancedMode ? "Hide Advanced" : "Show Advanced"}
                  </button>
                </div>

                {advancedMode && (
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Top P</Label>
                        <span className="text-sm text-muted-foreground">{extension.aiConfig.topP}</span>
                      </div>
                      <Slider
                        value={[extension.aiConfig.topP]}
                        onValueChange={([value]) =>
                          setExtension({ ...extension, aiConfig: { ...extension.aiConfig, topP: value } })
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Frequency Penalty</Label>
                        <span className="text-sm text-muted-foreground">{extension.aiConfig.frequencyPenalty}</span>
                      </div>
                      <Slider
                        value={[extension.aiConfig.frequencyPenalty]}
                        onValueChange={([value]) =>
                          setExtension({ ...extension, aiConfig: { ...extension.aiConfig, frequencyPenalty: value } })
                        }
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Presence Penalty</Label>
                        <span className="text-sm text-muted-foreground">{extension.aiConfig.presencePenalty}</span>
                      </div>
                      <Slider
                        value={[extension.aiConfig.presencePenalty]}
                        onValueChange={([value]) =>
                          setExtension({ ...extension, aiConfig: { ...extension.aiConfig, presencePenalty: value } })
                        }
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold">🛡️ Safety & Compliance</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extension.aiConfig.contentFilter}
                      onChange={(e) =>
                        setExtension({
                          ...extension,
                          aiConfig: { ...extension.aiConfig, contentFilter: e.target.checked },
                        })
                      }
                      className="rounded"
                    />
                    <span>Enable Content Filtering</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extension.aiConfig.biasDetection}
                      onChange={(e) =>
                        setExtension({
                          ...extension,
                          aiConfig: { ...extension.aiConfig, biasDetection: e.target.checked },
                        })
                      }
                      className="rounded"
                    />
                    <span>Enable Bias Detection</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extension.aiConfig.auditLogging}
                      onChange={(e) =>
                        setExtension({
                          ...extension,
                          aiConfig: { ...extension.aiConfig, auditLogging: e.target.checked },
                        })
                      }
                      className="rounded"
                    />
                    <span>Enable Audit Logging</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "test" && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <TestTube className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-bold mb-2">Test Suite</h4>
                <p className="text-sm text-muted-foreground mb-4">Configure and run tests for your extension</p>
                <button
                  onClick={handleTest}
                  disabled={isTesting}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isTesting ? "Running Tests..." : "Run Test Suite"}
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ExtensionBuilder
