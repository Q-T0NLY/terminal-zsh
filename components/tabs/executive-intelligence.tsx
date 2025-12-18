"use client"

import { useState, useEffect } from "react"

export function ExecutiveIntelligenceDashboard() {
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#E6EEF6] mb-2">Executive Intelligence Dashboard</h1>
          <p className="text-[#9CA3AF]">Real-time overview of business and system performance</p>
        </div>
        <div className="text-sm text-[#9CA3AF]">Auto-refresh: 5s {refreshCount > 0 && `(${refreshCount})`}</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Active Agents Counter */}
        <div className="col-span-4 bg-gradient-to-br from-[#6E63FF] to-[#FFD700] p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold text-white/80 mb-3">Active Agents Counter</h3>
          <div className="flex items-end justify-between mb-3">
            <p className="text-6xl font-bold text-white">12</p>
            <div className="flex gap-1 items-end h-16">
              {[8, 10, 7, 12, 9, 11, 10, 12].map((h, i) => (
                <div key={i} className="w-1.5 bg-white/60 rounded-t" style={{ height: `${(h / 12) * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white">
            <span>↑ 8.3%</span>
            <span className="text-white/70">vs last hour</span>
          </div>
        </div>
      </div>
    </div>
  )
}
