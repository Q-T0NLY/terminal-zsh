import ExtensionBuilder from "@/components/extensions/extension-builder"

export default function ExtensionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Extensions Builder</h1>
          <p className="text-gray-400">Create custom capabilities and integrations for your agents</p>
        </div>

        <ExtensionBuilder />
      </div>
    </div>
  )
}
