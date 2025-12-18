import { Injectable, Logger } from '@nestjs/common';
import { AgentConfig, Tool, Task, TaskResult, AgentMemory } from './CrewAIInterface';

/**
 * Agent class for CrewAI
 */
export class Agent {
  private readonly logger = new Logger(Agent.name);
  public id: string;
  public role: string;
  public goal: string;
  public backstory: string;
  public tools: Tool[];
  public llmModel: string;
  public memory: AgentMemory;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.role = config.role;
    this.goal = config.goal;
    this.backstory = config.backstory;
    this.tools = config.tools || [];
    this.llmModel = config.llmModel || 'gpt-4';
    this.memory = {
      shortTerm: [],
      longTerm: new Map(),
    };
  }

  /**
   * Execute a task
   */
  async execute(task: Task): Promise<TaskResult> {
    const startTime = Date.now();

    this.logger.log(`Agent ${this.role} executing task: ${task.description}`);

    try {
      // Store task context in short-term memory
      this.memory.shortTerm.push({
        task: task.description,
        timestamp: new Date(),
      });

      // Simulate task execution (in production, call actual LLM)
      const output = await this.processTask(task);

      // Store result in long-term memory
      this.memory.longTerm.set(task.id, {
        result: output,
        timestamp: new Date(),
      });

      const executionTime = Date.now() - startTime;

      return {
        taskId: task.id,
        success: true,
        output,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      this.logger.error(`Agent ${this.role} failed to execute task:`, error);

      return {
        taskId: task.id,
        success: false,
        output: null,
        executionTime,
        error: error.message,
      };
    }
  }

  /**
   * Process task with available tools
   */
  private async processTask(task: Task): Promise<any> {
    // Simple task processing (in production, use actual LLM)
    const output = {
      agent: this.role,
      task: task.description,
      result: `Task completed by ${this.role}: ${task.expectedOutput}`,
      toolsUsed: this.tools.map((t) => t.name),
      timestamp: new Date(),
    };

    // Execute relevant tools if needed
    for (const tool of this.tools) {
      if (task.description.toLowerCase().includes(tool.name.toLowerCase())) {
        try {
          const toolResult = await tool.execute(task.context || {});
          output.result += `\nTool ${tool.name} output: ${JSON.stringify(toolResult)}`;
        } catch (error) {
          this.logger.warn(`Tool ${tool.name} execution failed:`, error);
        }
      }
    }

    return output;
  }

  /**
   * Get agent's memory
   */
  getMemory(): AgentMemory {
    return {
      shortTerm: [...this.memory.shortTerm],
      longTerm: new Map(this.memory.longTerm),
    };
  }

  /**
   * Clear agent's memory
   */
  clearMemory(): void {
    this.memory.shortTerm = [];
    this.memory.longTerm.clear();
  }
}

/**
 * Agent Manager - Manages multiple agents
 */
@Injectable()
export class AgentManager {
  private readonly logger = new Logger(AgentManager.name);
  private agents = new Map<string, Agent>();

  /**
   * Create and register an agent
   */
  createAgent(config: AgentConfig): Agent {
    const agent = new Agent(config);
    this.agents.set(agent.id, agent);

    this.logger.log(`Agent ${agent.role} (${agent.id}) created`);

    return agent;
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Delete agent
   */
  deleteAgent(id: string): void {
    this.agents.delete(id);
    this.logger.log(`Agent ${id} deleted`);
  }

  /**
   * Get agents by role
   */
  getAgentsByRole(role: string): Agent[] {
    return Array.from(this.agents.values()).filter((a) => a.role === role);
  }
}
