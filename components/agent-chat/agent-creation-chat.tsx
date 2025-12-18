"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Zap, Brain, Sparkles } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant" | "system"
  timestamp: Date
  agentType?: string
  confidence?: number
  optimizedPrompt?: string
}

interface ChatState {
  messages: Message[]
  isProcessing: boolean
  currentAgentType: string
  optimizationLevel: "basic" | "advanced" | "maximal"
}

const AGENT_TYPES = [
  { id: "quantum", name: "Quantum Agent", icon: Zap, color: "from-purple-500 to-blue-500" },
  { id: "ml", name: "ML Agent", icon: Brain, color: "from-green-500 to-teal-500" },
  { id: "generative", name: "Generative Agent", icon: Sparkles, color: "from-orange-500 to-red-500" },
  { id: "hybrid", name: "Hybrid Agent", icon: Bot, color: "from-indigo-500 to-purple-500" },
]

const OPTIMIZATION_LEVELS = [
  { id: "basic", name: "Basic", description: "Standard prompt optimization" },
  { id: "advanced", name: "Advanced", description: "Enhanced with context awareness" },
  { id: "maximal", name: "Maximal", description: "Full optimization with multi-step reasoning" },
]

export default function AgentCreationChat() {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: "1",
        content:
          "Hello! I'm your Agent Creation Assistant. Describe the AI agent you'd like to build, and I'll help you create and optimize it.",
        role: "assistant",
        timestamp: new Date(),
        agentType: "system",
      },
    ],
    isProcessing: false,
    currentAgentType: "hybrid",
    optimizationLevel: "advanced",
  })

  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [state.messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || state.isProcessing) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
    }))

    setInputMessage("")

    try {
      const response = await fetch("/api/agents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputMessage,
          agentType: state.currentAgentType,
          optimizationLevel: state.optimizationLevel,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.optimizedPrompt,
        role: "assistant",
        timestamp: new Date(),
        agentType: state.currentAgentType,
        confidence: data.confidence,
        optimizedPrompt: data.optimizedPrompt,
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isProcessing: false,
      }))
    } catch (error) {
      console.error("[v0] Error creating agent:", error)
      setState((prev) => ({
        ...prev,
        isProcessing: false,
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 font-sans">
          Nexus Quantum Agent Creator
        </h1>
        <p className="text-gray-300 text-lg">
          Describe your AI agent and watch it come to life with advanced optimization
        </p>
      </div>

      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-center p-6 border-b border-gray-700 bg-gray-900/50 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-300 font-medium">Agent Type:</span>
            <div className="flex gap-2 flex-wrap">
              {AGENT_TYPES.map((agent) => {
                const Icon = agent.icon
                const isActive = state.currentAgentType === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => setState((prev) => ({ ...prev, currentAgentType: agent.id }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${agent.color} text-white shadow-lg`
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{agent.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-300 font-medium">Optimization:</span>
            <div className="flex gap-2">
              {OPTIMIZATION_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setState((prev) => ({ ...prev, optimizationLevel: level.id as any }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    state.optimizationLevel === level.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-800/30 to-gray-900/30">
          {state.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {state.isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-700/50 rounded-2xl p-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-gray-300">Creating your optimized agent...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/30">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your AI agent... (e.g., 'Create a quantum-enhanced ML agent for financial predictions')"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={1}
                  style={{ minHeight: "60px", maxHeight: "120px" }}
                />
                <div className="absolute right-3 bottom-3 text-gray-400 text-sm">{inputMessage.length}/1000</div>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || state.isProcessing}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <QuickPromptButton
                onClick={() => setInputMessage("Create a quantum agent for drug discovery with molecular optimization")}
              >
                Drug Discovery
              </QuickPromptButton>
              <QuickPromptButton
                onClick={() =>
                  setInputMessage("Build an ML agent for real-time fraud detection in financial transactions")
                }
              >
                Fraud Detection
              </QuickPromptButton>
              <QuickPromptButton
                onClick={() => setInputMessage("Create a generative agent for automated code review and optimization")}
              >
                Code Review
              </QuickPromptButton>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-400">24.7K</div>
          <div className="text-gray-400 text-sm">Agents Created</div>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-400">98.3%</div>
          <div className="text-gray-400 text-sm">Success Rate</div>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-purple-400">3.2s</div>
          <div className="text-gray-400 text-sm">Avg. Creation Time</div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3 max-w-3xl`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-purple-500 to-pink-500"
          }`}
        >
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
        </div>

        <div
          className={`rounded-2xl px-6 py-4 ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
              : "bg-gray-700/50 text-gray-100 rounded-bl-none border border-gray-600"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {!isUser && message.agentType && (
            <div className="mt-3 pt-3 border-t border-gray-600/50">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Agent Type:</span>
                  <span className="text-blue-300 font-medium capitalize">{message.agentType}</span>
                </div>
                {message.confidence && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-green-300 font-medium">{message.confidence}%</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-gray-300">{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickPromptButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs bg-gray-700/30 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-600/50 transition-colors"
    >
      {children}
    </button>
  )
}
