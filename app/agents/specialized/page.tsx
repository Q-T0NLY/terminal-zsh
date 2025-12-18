import { SpecializedAgentPanel } from "@/components/agents/specialized-agent-panel"

export default function SpecializedAgentsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Specialized Agents</h1>
        <p className="text-muted-foreground mt-2">
          Manage quantum, ML, and generative agents with advanced capabilities
        </p>
      </div>

      <SpecializedAgentPanel />
    </div>
  )
}
