export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-white">NEXUS AI Orchestrator</h1>
        <p className="text-xl text-gray-300">Next-Generation Multimodal AI Orchestration Platform</p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/dashboard"
            className="px-8 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            Launch Dashboard
          </a>
          <a
            href="/test"
            className="px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
          >
            Test Page
          </a>
        </div>
      </div>
    </div>
  )
}
