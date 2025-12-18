import MetricsDashboard from "@/components/observability/metrics-dashboard"

export default function ObservabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Observability Dashboard</h1>
          <p className="text-gray-400">Real-time system metrics, traces, and health monitoring</p>
        </div>

        <MetricsDashboard />
      </div>
    </div>
  )
}
