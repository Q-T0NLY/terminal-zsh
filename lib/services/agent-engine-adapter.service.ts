// Integration adapter between prompt optimizer and orchestrator
import { AgentPromptOptimizer, type AgentPromptOptimizationRequest } from "./agent-prompt-optimizer.service"
import { OrchestratorService, type AgentSpec, type AgentCapability, type AgentType } from "./orchestrator.service"
import { AgentRegistryService } from "./agent-registry.service"

export class AgentEngineAdapter {
  private promptOptimizer: AgentPromptOptimizer
  private orchestrator: OrchestratorService
  private registry: AgentRegistryService

  constructor() {
    this.promptOptimizer = new AgentPromptOptimizer()
    this.orchestrator = new OrchestratorService()
    this.registry = new AgentRegistryService()
  }

  async createAgentFromChat(prompt: string, agentType: AgentType, optimizationLevel: string) {
    // Step 1: Optimize the prompt
    const optimizationRequest: AgentPromptOptimizationRequest = {
      userPrompt: prompt,
      agentType,
      optimizationLevel: optimizationLevel as any,
      context: await this.getCreationContext(),
    }

    const optimized = await this.promptOptimizer.optimizeAgentCreationPrompt(optimizationRequest)

    // Step 2: Create agent specification
    const agentSpec = await this.buildAgentSpecification(optimized, agentType)

    // Step 3: Deploy agent through orchestrator
    const deploymentResult = await this.orchestrator.deployAgent(agentSpec)

    // Step 4: Register agent in registry
    await this.registry.registerAgent(agentSpec)

    // Step 5: Return combined result
    return {
      optimizedPrompt: optimized.optimizedPrompt,
      agentSpec,
      deployment: deploymentResult,
      confidence: optimized.confidence,
      estimatedPerformance: optimized.estimatedPerformance,
    }
  }

  private async buildAgentSpecification(optimized: any, agentType: AgentType): Promise<AgentSpec> {
    const capabilities: AgentCapability[] = (optimized.suggestedCapabilities || []).map(
      (name: string, index: number) => ({
        id: `cap-${index}`,
        name,
        description: `${name} capability`,
        inputs: [],
        outputs: [],
      }),
    )

    return {
      id: crypto.randomUUID(),
      name: this.generateAgentName(agentType),
      type: agentType,
      capabilities,
      config: {
        optimizationLevel: optimized.agentSpec.optimizationLevel,
        requirements: optimized.agentSpec.requirements,
        createdFromChat: true,
        confidence: optimized.confidence,
        creationTimestamp: new Date().toISOString(),
      },
    }
  }

  private generateAgentName(agentType: AgentType): string {
    const prefix = agentType.charAt(0).toUpperCase() + agentType.slice(1)
    const timestamp = Date.now().toString(36)
    return `${prefix}-Agent-${timestamp}`
  }

  private async getCreationContext() {
    return {
      preferences: {},
      existingAgents: [],
    }
  }
}
