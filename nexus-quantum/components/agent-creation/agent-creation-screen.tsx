"use client"

import { useState, useEffect } from "react"
import { Settings, Zap, Cpu, Users, Sparkles, Info, Play, Square } from "lucide-react"
import ModeSelectionCard from "./mode-selection-card"
import ParticleBackground from "./particle-background"
import Sidebar from "./sidebar"

const AgentCreationScreen = () => {
  const [mode, setMode] = useState<string | null>(null)
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)
  const [agentConfig, setAgentConfig] = useState({
    numberOfAgents: 1,
    agentType: "Base",
  })
  const [globalEfficiency, setGlobalEfficiency] = useState(75)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationResults, setSimulationResults] = useState<any>(null)

  const modeBase: Record<string, number> = { customize: 78, auto: 92, advanced: 85 }

  // Compute target efficiency
  const calculateEfficiency = (mode: string | null, config: typeof agentConfig) => {
    if (!mode) return 75
    let base = modeBase[mode] || 75
    base += (config.numberOfAgents - 1) * 2
    if (config.agentType === "Specialized") base += 5
    return Math.min(base, 100)
  }

  // Animate global efficiency
  useEffect(() => {
    const target = calculateEfficiency(mode, agentConfig)
    let current = globalEfficiency
    const interval = setInterval(() => {
      if (current < target) current += 1
      else if (current > target) current -= 1
      else clearInterval(interval)
      setGlobalEfficiency(current)
    }, 15)
    return () => clearInterval(interval)
  }, [mode, agentConfig])

  // Run simulation when configuration changes
  useEffect(() => {
    if (mode && isSimulationRunning) {
      const simulateAgentPerformance = () => {
        const complexity = agentConfig.agentType === "Specialized" ? 0.9 : 0.7
        const scalability = agentConfig.numberOfAgents * 0.15

        setSimulationResults({
          performanceScore: Math.min(100, globalEfficiency * complexity + scalability * 100),
          estimatedCompletion: Math.max(5, 30 - globalEfficiency * 0.25),
          reliability: Math.min(100, 80 + globalEfficiency * 0.2),
          costEfficiency: Math.max(20, 100 - agentConfig.numberOfAgents * 8),
        })
      }

      simulateAgentPerformance()
    }
  }, [mode, agentConfig, globalEfficiency, isSimulationRunning])

  const handleModeSelect = (selectedMode: string) => {
    setMode(selectedMode)
    setIsSimulationRunning(true)
  }

  const handleAgentChange = (field: string, value: any) => {
    setAgentConfig((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f111a] to-[#121420] text-white overflow-x-hidden flex font-sans">
      <ParticleBackground hoverActive={hoveredMode !== null} />

      <div className="flex-1 p-10 max-w-[1400px] mx-auto relative z-10">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="font-['Orbitron'] text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-3">
            Create Your Smart Agent
          </h1>
          <p className="text-lg text-gray-400">Choose your configuration. Watch AI adjust efficiency live!</p>

          <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/20 border border-purple-500 rounded-lg font-['Orbitron']">
              <Zap size={16} />
              <span className="text-xl font-bold text-purple-500">{globalEfficiency}%</span>
              <span>Live Efficiency</span>
            </div>

            <button
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
                isSimulationRunning
                  ? "bg-red-500/20 border-red-500 hover:bg-red-500/30 hover:shadow-[0_0_15px_#EF4444]"
                  : "bg-purple-500/20 border-purple-500 hover:bg-purple-500/30 hover:shadow-[0_0_15px_#8B5CF6]"
              }`}
              onClick={toggleSimulation}
            >
              {isSimulationRunning ? <Square size={14} /> : <Play size={14} />}
              {isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
            </button>
          </div>
        </header>

        {/* Simulation Results Banner */}
        {isSimulationRunning && simulationResults && (
          <div className="mb-8 p-4 border-l-4 border-green-500 bg-gray-800/60 backdrop-blur-md rounded-2xl animate-slideInDown">
            <div className="flex items-center gap-2 mb-3 font-semibold text-green-500">
              <Sparkles size={16} />
              <span>Live Simulation Results</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-md">
                <span className="text-sm">Performance Score</span>
                <span className="font-['Orbitron'] font-semibold text-green-500">
                  {simulationResults.performanceScore.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-md">
                <span className="text-sm">Est. Completion</span>
                <span className="font-['Orbitron'] font-semibold text-green-500">
                  {simulationResults.estimatedCompletion.toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-md">
                <span className="text-sm">Reliability</span>
                <span className="font-['Orbitron'] font-semibold text-green-500">
                  {simulationResults.reliability.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-md">
                <span className="text-sm">Cost Efficiency</span>
                <span className="font-['Orbitron'] font-semibold text-green-500">
                  {simulationResults.costEfficiency.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ModeSelectionCard
            mode="customize"
            title="Customize Agent"
            subtitle="Adjust key features with AI guidance"
            icon={<Settings />}
            color="blue"
            isHovered={hoveredMode === "customize"}
            onHover={setHoveredMode}
            onSelect={handleModeSelect}
            currentEfficiency={globalEfficiency}
            agentType={agentConfig.agentType}
            isSimulationRunning={isSimulationRunning}
          />
          <ModeSelectionCard
            mode="auto"
            title="Auto Generate Agent"
            subtitle="AI generates the optimal agent automatically"
            icon={<Zap />}
            color="green"
            isHovered={hoveredMode === "auto"}
            onHover={setHoveredMode}
            onSelect={handleModeSelect}
            currentEfficiency={globalEfficiency}
            agentType={agentConfig.agentType}
            isSimulationRunning={isSimulationRunning}
          />
          <ModeSelectionCard
            mode="advanced"
            title="Advanced Setup"
            subtitle="Full control with expert-level options"
            icon={<Cpu />}
            color="gray"
            isHovered={hoveredMode === "advanced"}
            onHover={setHoveredMode}
            onSelect={handleModeSelect}
            currentEfficiency={globalEfficiency}
            agentType={agentConfig.agentType}
            isSimulationRunning={isSimulationRunning}
          />
        </section>

        {/* Interactive Agent Strategy */}
        <section className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Users size={20} />
              Interactive Agent Strategy
            </h2>
            {isSimulationRunning && (
              <div className="flex items-center gap-1.5 text-sm text-red-500 font-semibold">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <div>
              <label className="block font-semibold mb-3">
                <span>Number of Agents: {agentConfig.numberOfAgents}</span>
                <div className="my-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={agentConfig.numberOfAgents}
                    onChange={(e) => handleAgentChange("numberOfAgents", Number.parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_#8B5CF6] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_10px_#8B5CF6]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
                <div className="text-xs text-amber-500 mt-1 px-2 py-1 bg-amber-500/10 rounded">
                  {agentConfig.numberOfAgents > 5
                    ? "⚠️ High scalability, increased cost"
                    : agentConfig.numberOfAgents > 2
                      ? "✓ Good balance of performance and cost"
                      : "💡 Cost-effective, limited parallel processing"}
                </div>
              </label>
            </div>

            <div>
              <label className="block font-semibold mb-3">
                <span>Agent Type</span>
                <select
                  value={agentConfig.agentType}
                  onChange={(e) => handleAgentChange("agentType", e.target.value)}
                  className="w-full mt-2 px-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white cursor-pointer transition-all focus:outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                >
                  <option value="Base">Base Agent</option>
                  <option value="Specialized">Specialized Agent</option>
                </select>
              </label>

              <div className="flex items-start gap-2 mt-3 px-3 py-3 bg-blue-500/10 rounded-lg text-sm text-blue-300">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                {agentConfig.agentType === "Base"
                  ? "Base Agent: Flexible, general-purpose. Perfect for exploratory tasks. Lower efficiency but higher adaptability."
                  : "Specialized Agent: Task-optimized, higher efficiency. Ideal for complex, specific tasks. Less flexible but more precise."}
              </div>

              {isSimulationRunning && (
                <div className="mt-3 px-2 py-2 bg-white/5 rounded-md">
                  <div className="flex justify-between items-center text-sm">
                    <span>Specialization Impact:</span>
                    <span
                      className={`font-semibold ${agentConfig.agentType === "Specialized" ? "text-green-500" : "text-gray-500"}`}
                    >
                      {agentConfig.agentType === "Specialized" ? "+15% Efficiency" : "+0% Efficiency"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Animated Efficiency */}
        <section className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Projected Efficiency: {globalEfficiency}%</h3>
            {isSimulationRunning && (
              <div className="text-sm px-2 py-1 bg-green-500/10 rounded-xl text-green-400">
                {globalEfficiency > 80 ? "📈 Excellent" : globalEfficiency > 65 ? "↗️ Good" : "➡️ Average"}
              </div>
            )}
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden my-4">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
              style={{ width: `${globalEfficiency}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-3">
            {isSimulationRunning ? (
              <>
                💡 Live Analysis:{" "}
                {globalEfficiency >= 90
                  ? "Peak performance! Agent is optimized for maximum throughput."
                  : globalEfficiency >= 75
                    ? "Strong configuration. Consider specialized agents for complex tasks."
                    : "Good baseline. Monitor real-time metrics for optimization opportunities."}
              </>
            ) : (
              "💡 Start simulation to see real-time performance analysis and recommendations."
            )}
          </div>
        </section>
      </div>

      {/* Enhanced Sidebar with Real-time Data */}
      <Sidebar
        agentConfig={agentConfig}
        efficiency={globalEfficiency}
        mode={mode}
        isSimulationRunning={isSimulationRunning}
      />
    </div>
  )
}

export default AgentCreationScreen
