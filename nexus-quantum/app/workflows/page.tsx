import WorkflowBuilder from "@/components/workflow/workflow-builder"

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Workflow Automation</h1>
          <p className="text-gray-400">Design, automate, and optimize agent workflows</p>
        </div>

        <WorkflowBuilder />
      </div>
    </div>
  )
}
