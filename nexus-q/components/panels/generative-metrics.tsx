"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Brain,
  DollarSign,
  Target,
  Clock,
  Sparkles,
  Heart,
} from "lucide-react"

export function GenerativeMetrics({ widgets, onWidgetsChange }: any) {
  const metrics = {
    agentSelfOptScore: 87.5,
    agentSelfOptTrend: 5.2,
    workflowConfidenceRate: 92.3,
    quantumCircuitEfficiency: 78.9,
    quantumEfficiencyTrend: 3.1,
    metaLearnerAccuracy: 94.7,
    modelCostPerToken: 0.00042,
    userContextPredictionAccuracy: 89.2,
    orchestratorDecisionLatency: 45,
    emotionalIntelligence: 89.5,
    creativityScore: 92.3,
    innovationIndex: 87.1,
    styleTransferFidelity: 94.8,
    multimodalCoherence: 91.2,
    featureQuality: 94.2,
    syntheticDataFidelity: 97.8,
  }

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.random() * 100,
    baseline: 75,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">📈 Generative System Metrics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Agent Self-Optimization Score */}
        <MetricCard
          title="Agent Self-Optimization Score"
          value={`${metrics.agentSelfOptScore}%`}
          trend={metrics.agentSelfOptTrend}
          icon={<Brain className="h-5 w-5" />}
          color="text-purple-500"
        />

        {/* Workflow Confidence */}
        <MetricCard
          title="Workflow Confidence Rate"
          value={`${metrics.workflowConfidenceRate}%`}
          trend={2.1}
          icon={<Target className="h-5 w-5" />}
          color="text-blue-500"
        />

        {/* Quantum Efficiency */}
        <MetricCard
          title="Quantum Circuit Efficiency"
          value={`${metrics.quantumCircuitEfficiency}%`}
          trend={metrics.quantumEfficiencyTrend}
          icon={<Zap className="h-5 w-5" />}
          color="text-yellow-500"
        />

        {/* Meta-Learner Accuracy */}
        <MetricCard
          title="Meta-Learner Accuracy"
          value={`${metrics.metaLearnerAccuracy}%`}
          trend={1.8}
          icon={<Activity className="h-5 w-5" />}
          color="text-green-500"
        />

        {/* Cost Per Token */}
        <MetricCard
          title="Model Cost Per Token"
          value={`$${metrics.modelCostPerToken}`}
          trend={-2.3}
          icon={<DollarSign className="h-5 w-5" />}
          color="text-emerald-500"
        />

        {/* Prediction Accuracy */}
        <MetricCard
          title="Context Prediction Accuracy"
          value={`${metrics.userContextPredictionAccuracy}%`}
          trend={4.2}
          icon={<Brain className="h-5 w-5" />}
          color="text-indigo-500"
        />

        {/* Decision Latency */}
        <MetricCard
          title="Orchestrator Decision Latency"
          value={`${metrics.orchestratorDecisionLatency}ms`}
          trend={-5.1}
          icon={<Clock className="h-5 w-5" />}
          color="text-cyan-500"
        />
      </div>

      {/* Creative AI Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Creative AI Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Emotional Intelligence"
              value={`${metrics.emotionalIntelligence}%`}
              trend={3.2}
              icon={<Heart className="h-5 w-5" />}
              color="text-red-500"
            />
            <MetricCard
              title="Creativity Score"
              value={`${metrics.creativityScore}%`}
              trend={5.1}
              icon={<Sparkles className="h-5 w-5" />}
              color="text-purple-500"
            />
            <MetricCard
              title="Innovation Index"
              value={`${metrics.innovationIndex}`}
              trend={4.3}
              icon={<TrendingUp className="h-5 w-5" />}
              color="text-pink-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* ML Optimization Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            ML Optimization Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Feature Quality"
              value={`${metrics.featureQuality}%`}
              trend={2.8}
              icon={<Zap className="h-5 w-5" />}
              color="text-yellow-500"
            />
            <MetricCard
              title="Synthetic Data Fidelity"
              value={`${metrics.syntheticDataFidelity}%`}
              trend={1.5}
              icon={<Activity className="h-5 w-5" />}
              color="text-cyan-500"
            />
            <MetricCard
              title="Style Transfer Fidelity"
              value={`${metrics.styleTransferFidelity}%`}
              trend={3.7}
              icon={<Target className="h-5 w-5" />}
              color="text-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Self-Optimization Trend (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="baseline" stroke="#64748b" fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { model: "GPT-4", accuracy: 94 },
                  { model: "Claude", accuracy: 92 },
                  { model: "Llama", accuracy: 88 },
                  { model: "Gemini", accuracy: 90 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: number
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, value, trend, icon, color }: MetricCardProps) {
  const isPositive = trend > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={color}>{icon}</div>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(trend)}%
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  )
}
