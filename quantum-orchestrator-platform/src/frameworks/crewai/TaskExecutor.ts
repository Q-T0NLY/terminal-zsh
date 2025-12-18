import { Injectable, Logger } from '@nestjs/common';
import { AgentManager, Agent } from './AgentManager';
import {
  CrewConfig,
  CrewExecutionMode,
  CrewStatus,
  CrewResult,
  Task,
  TaskResult,
} from './CrewAIInterface';

/**
 * Crew class - Represents a crew of agents working together
 */
export class Crew {
  private readonly logger = new Logger(Crew.name);
  public id: string;
  public name: string;
  public agents: Agent[];
  public tasks: Task[];
  public executionMode: CrewExecutionMode;
  private status: CrewStatus = CrewStatus.IDLE;

  constructor(config: CrewConfig, agentManager: AgentManager) {
    this.id = config.id;
    this.name = config.name;
    this.tasks = config.tasks;
    this.executionMode = config.executionMode;

    // Load agents
    this.agents = config.agents
      .map((agentId) => agentManager.getAgent(agentId))
      .filter((a) => a !== undefined) as Agent[];
  }

  /**
   * Execute all tasks in the crew
   */
  async execute(): Promise<CrewResult> {
    const startTime = Date.now();
    const results: TaskResult[] = [];

    this.logger.log(`Starting crew ${this.name} execution in ${this.executionMode} mode`);
    this.status = CrewStatus.RUNNING;

    try {
      if (this.executionMode === CrewExecutionMode.SEQUENTIAL) {
        // Sequential execution
        for (const task of this.tasks) {
          const result = await this.executeTask(task);
          results.push(result);

          if (!result.success) {
            this.logger.warn(`Task ${task.id} failed, continuing...`);
          }
        }
      } else {
        // Parallel execution
        const promises = this.tasks.map((task) => this.executeTask(task));
        const parallelResults = await Promise.all(promises);
        results.push(...parallelResults);
      }

      const executionTime = Date.now() - startTime;
      const allSuccessful = results.every((r) => r.success);

      this.status = allSuccessful ? CrewStatus.COMPLETED : CrewStatus.FAILED;

      this.logger.log(
        `Crew ${this.name} execution ${allSuccessful ? 'completed' : 'failed'} in ${executionTime}ms`,
      );

      return {
        success: allSuccessful,
        results,
        executionTime,
        status: this.status,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.status = CrewStatus.FAILED;

      this.logger.error(`Crew ${this.name} execution failed:`, error);

      return {
        success: false,
        results,
        executionTime,
        status: this.status,
      };
    }
  }

  /**
   * Execute a single task with appropriate agent
   */
  private async executeTask(task: Task): Promise<TaskResult> {
    // Find agent for task
    let agent: Agent | undefined;

    if (task.agent) {
      agent = this.agents.find((a) => a.id === task.agent);
    } else {
      // Auto-assign first available agent
      agent = this.agents[0];
    }

    if (!agent) {
      return {
        taskId: task.id,
        success: false,
        output: null,
        executionTime: 0,
        error: 'No agent available for task',
      };
    }

    return await agent.execute(task);
  }

  /**
   * Get crew status
   */
  getStatus(): CrewStatus {
    return this.status;
  }

  /**
   * Get crew configuration
   */
  getConfig(): CrewConfig {
    return {
      id: this.id,
      name: this.name,
      agents: this.agents.map((a) => a.id),
      tasks: this.tasks,
      executionMode: this.executionMode,
    };
  }
}

/**
 * Task Executor - Manages crew execution
 */
@Injectable()
export class TaskExecutor {
  private readonly logger = new Logger(TaskExecutor.name);
  private crews = new Map<string, Crew>();

  constructor(private readonly agentManager: AgentManager) {}

  /**
   * Create a new crew
   */
  createCrew(config: CrewConfig): Crew {
    const crew = new Crew(config, this.agentManager);
    this.crews.set(crew.id, crew);

    this.logger.log(`Crew ${crew.name} (${crew.id}) created`);

    return crew;
  }

  /**
   * Get crew by ID
   */
  getCrew(id: string): Crew | undefined {
    return this.crews.get(id);
  }

  /**
   * Get all crews
   */
  getAllCrews(): Crew[] {
    return Array.from(this.crews.values());
  }

  /**
   * Delete crew
   */
  deleteCrew(id: string): void {
    this.crews.delete(id);
    this.logger.log(`Crew ${id} deleted`);
  }

  /**
   * Execute crew
   */
  async executeCrew(id: string): Promise<CrewResult> {
    const crew = this.crews.get(id);

    if (!crew) {
      throw new Error(`Crew ${id} not found`);
    }

    return await crew.execute();
  }
}
