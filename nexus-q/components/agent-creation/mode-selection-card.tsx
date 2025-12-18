"use client"

import type React from "react"
import AnimatedAgentPreview from "./animated-agent-preview"

interface ModeSelectionCardProps {
  mode: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: "blue" | "green" | "gray"
  isHovered: boolean
  onHover: (mode: string | null) => void
  onSelect: (mode: string) => void
  currentEfficiency: number
  agentType: string
  isSimulationRunning: boolean
}

const ModeSelectionCard: React.FC<ModeSelectionCardProps> = ({
  mode,
  title,
  subtitle,
  icon,
  color,
  isHovered,
  onHover,
  onSelect,
  currentEfficiency,
  agentType,
  isSimulationRunning,
}) => {
  const colors = {
    blue: "#3B82F6",
    green: "#10B981",
    gray: "#6B7280",
  }
  const colorSet = colors[color]

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden ${
        isHovered ? "transform -translate-y-2" : ""
      } ${isSimulationRunning ? "before:absolute before:top-0 before:left-0 before:w-full before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-green-500 before:to-transparent before:animate-shimmer" : ""}`}
      style={{
        boxShadow: isHovered ? `0 0 20px ${colorSet}40` : "none",
      }}
      onMouseEnter={() => onHover(mode)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(mode)}
    >
      <div className="text-center">
        <div className="text-5xl mb-4" style={{ color: colorSet }}>
          {icon}
        </div>
        <h3 className="font-['Orbitron'] text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-5">{subtitle}</p>

        {isSimulationRunning && (
          <div className="flex items-center justify-center gap-1.5 mb-3 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400">Live Simulation</span>
          </div>
        )}

        <button
          className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: colorSet }}
        >
          {mode === "auto" ? "Auto-Generate" : "Select Mode"}
        </button>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-md p-4 flex flex-col justify-center animate-fadeIn">
          <AnimatedAgentPreview efficiency={currentEfficiency} agentType={agentType} isActive={isSimulationRunning} />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Efficiency</span>
              <span className="font-semibold text-purple-400">{currentEfficiency}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Simulation Status</span>
              <span>{isSimulationRunning ? "🟢 Active" : "⚫ Idle"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Recommended Use</span>
              <span className="text-gray-400">
                {mode === "customize" ? "Fine-tuning" : mode === "auto" ? "Quick setup" : "Expert configuration"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModeSelectionCard
