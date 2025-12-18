import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth } from '../../registry/PluginInterface';
import { AgentManager } from './AgentManager';
import { TaskExecutor } from './TaskExecutor';
import { Tool, AgentConfig, CrewConfig, Task } from './CrewAIInterface';

/**
 * CrewAI Plugin - Main plugin for CrewAI framework integration
 */
@Injectable()
export class CrewAIPlugin extends BasePlugin {
  private readonly logger = new Logger(CrewAIPlugin.name);
  private templates = new Map<string, CrewConfig>();
  private defaultTools: Tool[] = [];

  constructor(
    public readonly agentManager: AgentManager,
    public readonly taskExecutor: TaskExecutor,
  ) {
    super({
      id: 'crewai-plugin',
      name: 'CrewAI',
      version: '1.0.0',
      category: PluginCategory.AI_MODELS,
      capabilities: ['agents', 'tasks', 'collaboration', 'roles'],
      dependencies: [],
      config: {},
    });

    this.initializeDefaultTools();
    this.initializeTemplates();
  }

  async init(): Promise<void> {
    await super.init();
    this.logger.log('CrewAI plugin initialized');
  }

  async start(): Promise<void> {
    await super.start();
    this.logger.log('CrewAI plugin started');
  }

  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('CrewAI plugin stopped');
  }

  async destroy(): Promise<void> {
    this.templates.clear();
    await super.destroy();
    this.logger.log('CrewAI plugin destroyed');
  }

  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();

    return {
      ...baseHealth,
      metrics: {
        ...baseHealth.metrics,
        totalAgents: this.agentManager.getAllAgents().length,
        totalCrews: this.taskExecutor.getAllCrews().length,
        totalTemplates: this.templates.size,
      },
    };
  }

  /**
   * Get crew templates
   */
  getTemplates(): CrewConfig[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): CrewConfig | undefined {
    return this.templates.get(id);
  }

  /**
   * Initialize default tools
   */
  private initializeDefaultTools(): void {
    this.defaultTools = [
      {
        name: 'web-search',
        description: 'Search the web for information',
        execute: async (input: any) => {
          return { results: [`Search results for: ${input.query}`] };
        },
      },
      {
        name: 'file-read',
        description: 'Read file contents',
        execute: async (input: any) => {
          return { content: `File content from: ${input.path}` };
        },
      },
      {
        name: 'file-write',
        description: 'Write content to file',
        execute: async (input: any) => {
          return { success: true, path: input.path };
        },
      },
      {
        name: 'calculator',
        description: 'Perform calculations',
        execute: async (input: any) => {
          return { result: eval(input.expression) };
        },
      },
      {
        name: 'text-analyzer',
        description: 'Analyze text content',
        execute: async (input: any) => {
          return {
            wordCount: input.text.split(' ').length,
            characterCount: input.text.length,
          };
        },
      },
    ];
  }

  /**
   * Initialize crew templates
   */
  private initializeTemplates(): void {
    // Template 1: Research Team
    this.templates.set('research-team', {
      id: 'research-team',
      name: 'Research Team',
      agents: [],
      tasks: [
        {
          id: 'research',
          description: 'Research the given topic thoroughly',
          expectedOutput: 'Comprehensive research findings',
        },
        {
          id: 'analyze',
          description: 'Analyze the research findings',
          expectedOutput: 'Detailed analysis report',
        },
        {
          id: 'report',
          description: 'Create a summary report',
          expectedOutput: 'Final research report',
        },
      ],
      executionMode: 'sequential' as any,
    });

    // Template 2: Content Creation
    this.templates.set('content-creation', {
      id: 'content-creation',
      name: 'Content Creation Team',
      agents: [],
      tasks: [
        {
          id: 'ideation',
          description: 'Generate content ideas',
          expectedOutput: 'List of content ideas',
        },
        {
          id: 'writing',
          description: 'Write the content',
          expectedOutput: 'Draft content',
        },
        {
          id: 'editing',
          description: 'Edit and refine content',
          expectedOutput: 'Polished final content',
        },
      ],
      executionMode: 'sequential' as any,
    });

    // Template 3: Data Analysis
    this.templates.set('data-analysis', {
      id: 'data-analysis',
      name: 'Data Analysis Team',
      agents: [],
      tasks: [
        {
          id: 'collect',
          description: 'Collect and validate data',
          expectedOutput: 'Clean dataset',
        },
        {
          id: 'analyze',
          description: 'Analyze data patterns',
          expectedOutput: 'Analysis results',
        },
        {
          id: 'visualize',
          description: 'Create data visualizations',
          expectedOutput: 'Charts and graphs',
        },
        {
          id: 'insights',
          description: 'Generate insights and recommendations',
          expectedOutput: 'Actionable insights',
        },
      ],
      executionMode: 'sequential' as any,
    });

    // Template 4: Code Review
    this.templates.set('code-review', {
      id: 'code-review',
      name: 'Code Review Team',
      agents: [],
      tasks: [
        {
          id: 'static-analysis',
          description: 'Perform static code analysis',
          expectedOutput: 'Code quality metrics',
        },
        {
          id: 'security-review',
          description: 'Review for security vulnerabilities',
          expectedOutput: 'Security assessment',
        },
        {
          id: 'best-practices',
          description: 'Check adherence to best practices',
          expectedOutput: 'Best practices report',
        },
      ],
      executionMode: 'parallel' as any,
    });

    // Template 5: Customer Support
    this.templates.set('customer-support', {
      id: 'customer-support',
      name: 'Customer Support Team',
      agents: [],
      tasks: [
        {
          id: 'triage',
          description: 'Triage customer inquiry',
          expectedOutput: 'Issue classification',
        },
        {
          id: 'research',
          description: 'Research solution',
          expectedOutput: 'Potential solutions',
        },
        {
          id: 'response',
          description: 'Craft customer response',
          expectedOutput: 'Customer-ready response',
        },
      ],
      executionMode: 'sequential' as any,
    });

    this.logger.log('Initialized 5 default crew templates');
  }

  /**
   * Get default tools
   */
  getDefaultTools(): Tool[] {
    return [...this.defaultTools];
  }
}
