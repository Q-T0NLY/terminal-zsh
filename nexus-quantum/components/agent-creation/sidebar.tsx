"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts"

interface SidebarProps {
  agentConfig: {
    numberOfAgents: number
    agentType: string
  }
  efficiency: number
  mode: string | null
  isSimulationRunning?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ agentConfig, efficiency, mode }) => {
  const [simulationData, setSimulationData] = useState<any[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({})
  const [isSimulating, setIsSimulating] = useState(false)

  // Generate real-time simulation data
  useEffect(() => {
    if (!mode) return

    setIsSimulating(true)
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()

      const newDataPoint = {
        time: timestamp,
        efficiency: efficiency + (Math.random() * 10 - 5),
        responseTime: Math.max(100, 1000 - efficiency * 8 + (Math.random() * 200 - 100)),
        accuracy: Math.min(100, 85 + efficiency * 0.15 + (Math.random() * 10 - 5)),
        throughput: Math.min(100, agentConfig.numberOfAgents * 15 + (Math.random() * 20 - 10)),
        resourceUsage: Math.max(10, 30 + agentConfig.numberOfAgents * 5 + (Math.random() * 15 - 7)),
        taskComplexity: agentConfig.agentType === "Specialized" ? 85 : 60,
      }

      setSimulationData((prev) => {
        const newData = [...prev, newDataPoint].slice(-15)
        return newData
      })

      setPerformanceMetrics({
        avgResponseTime: newDataPoint.responseTime.toFixed(1) + "ms",
        successRate: newDataPoint.accuracy.toFixed(1) + "%",
        throughput: newDataPoint.throughput.toFixed(0) + "/min",
        resourceUtilization: newDataPoint.resourceUsage.toFixed(0) + "%",
      })
    }, 1500)

    return () => {
      clearInterval(interval)
      setIsSimulating(false)
    }
  }, [mode, efficiency, agentConfig])

  const performanceData = [
    { metric: "Response Time", value: performanceMetrics.avgResponseTime || "0ms", optimal: "< 500ms" },
    { metric: "Success Rate", value: performanceMetrics.successRate || "0%", optimal: "> 95%" },
    { metric: "Throughput", value: performanceMetrics.throughput || "0/min", optimal: "> 80/min" },
    { metric: "Resources", value: performanceMetrics.resourceUtilization || "0%", optimal: "< 70%" },
  ]

  return (
    <div className="w-80 bg-gray-900/95 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto sticky top-0 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-['Orbitron'] text-xl text-purple-500">Agent Dashboard</h3>
        <div
          className={`text-xs px-2 py-1 rounded-xl ${isSimulating ? "bg-green-500/30 text-green-400" : "bg-gray-700/30 text-gray-400"}`}
        >
          {isSimulating ? "🟢 Live" : "⚫ Idle"}
        </div>
      </div>

      {/* Real-time Performance Chart */}
      <div className="mb-5">
        <h4 className="text-xs mb-2 text-gray-300 font-semibold">Real-time Performance</h4>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={simulationData}>
            <defs>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} interval={2} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
            <Tooltip
              contentStyle={{
                background: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Area
              type="monotone"
              dataKey="efficiency"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorEfficiency)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {performanceData.map((metric, index) => (
          <div key={index} className="p-2 bg-white/5 rounded-md text-center">
            <div className="text-[0.7rem] text-gray-400 mb-1">{metric.metric}</div>
            <div className="font-['Orbitron'] text-sm font-semibold text-blue-500 mb-0.5">{metric.value}</div>
            <div className="text-[0.6rem] text-gray-600">{metric.optimal}</div>
          </div>
        ))}
      </div>

      {/* Resource Usage Chart */}
      <div className="mb-5">
        <h4 className="text-xs mb-2 text-gray-300 font-semibold">Resource Allocation</h4>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={simulationData.slice(-5)}>
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                background: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="resourceUsage" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Configuration Summary */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Agent Type</span>
          <span className={`font-semibold ${agentConfig.agentType === "Base" ? "text-blue-500" : "text-green-500"}`}>
            {agentConfig.agentType}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span>Agent Count</span>
          <span className="font-['Orbitron'] font-semibold text-purple-500">{agentConfig.numberOfAgents}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Mode</span>
          <span className="text-amber-500 font-semibold capitalize">{mode || "Not Selected"}</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
