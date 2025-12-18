import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../../registry/PluginInterface';
import { GraphWorkflow } from './GraphWorkflow';
import { StateManager } from './StateManager';
import { WorkflowTemplate, WorkflowNode, WorkflowEdge } from './LangGraphInterface';
import { v4 as uuidv4 } from 'uuid';

/**
 * LangGraph Plugin - Main plugin for LangGraph framework integration
 */
@Injectable()
export class LangGraphPlugin extends BasePlugin {
  private readonly logger = new Logger(LangGraphPlugin.name);
  private workflows = new Map<string, GraphWorkflow>();
  private templates = new Map<string, WorkflowTemplate>();

  constructor(private readonly stateManager: StateManager) {
    super({
      id: 'langgraph-plugin',
      name: 'LangGraph',
      version: '1.0.0',
      category: PluginCategory.AI_MODELS,
      capabilities: ['workflow', 'graph', 'state-management', 'agent'],
      dependencies: [],
      config: {},
    });

    // Initialize default templates
    this.initializeTemplates();
  }

  /**
   * Initialize the plugin
   */
  async init(): Promise<void> {
    await super.init();
    this.logger.log('LangGraph plugin initialized');
  }

  /**
   * Start the plugin
   */
  async start(): Promise<void> {
    await super.start();
    this.logger.log('LangGraph plugin started');
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('LangGraph plugin stopped');
  }

  /**
   * Destroy the plugin
   */
  async destroy(): Promise<void> {
    // Clear all workflows
    this.workflows.clear();
    this.templates.clear();

    await super.destroy();
    this.logger.log('LangGraph plugin destroyed');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();

    return {
      ...baseHealth,
      metrics: {
        ...baseHealth.metrics,
        activeWorkflows: this.workflows.size,
        totalTemplates: this.templates.size,
      },
    };
  }

  /**
   * Create a new workflow
   */
  createWorkflow(id?: string): GraphWorkflow {
    const workflowId = id || uuidv4();
    const workflow = new GraphWorkflow(workflowId, this.stateManager);

    this.workflows.set(workflowId, workflow);
    this.logger.log(`Workflow ${workflowId} created`);

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(id: string): GraphWorkflow | undefined {
    return this.workflows.get(id);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): GraphWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(id: string): Promise<void> {
    this.workflows.delete(id);
    await this.stateManager.clearState(id);
    this.logger.log(`Workflow ${id} deleted`);
  }

  /**
   * Create workflow from template
   */
  createFromTemplate(templateId: string): GraphWorkflow {
    const template = this.templates.get(templateId);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const workflow = this.createWorkflow();

    // Add nodes from template
    for (const node of template.nodes) {
      workflow.addNode(node);
    }

    // Add edges from template
    for (const edge of template.edges) {
      workflow.addEdge(edge.from, edge.to, edge.condition);
    }

    // Set default state if exists
    if (template.defaultState) {
      workflow.state = { ...template.defaultState };
    }

    this.logger.log(`Workflow created from template ${templateId}`);

    return workflow;
  }

  /**
   * Register workflow template
   */
  registerTemplate(template: WorkflowTemplate): void {
    this.templates.set(template.id, template);
    this.logger.log(`Template ${template.id} registered`);
  }

  /**
   * Get all templates
   */
  getTemplates(): WorkflowTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Initialize default workflow templates
   */
  private initializeTemplates(): void {
    // Template 1: Simple Agent Workflow
    this.registerTemplate({
      id: 'simple-agent',
      name: 'Simple Agent Workflow',
      description: 'A basic agent workflow with input processing and response generation',
      nodes: [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          config: {},
        },
        {
          id: 'agent',
          type: 'agent',
          name: 'Agent',
          config: { model: 'gpt-4' },
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          config: {},
        },
      ],
      edges: [
        { id: 'start-agent', from: 'start', to: 'agent' },
        { id: 'agent-end', from: 'agent', to: 'end' },
      ],
    });

    // Template 2: RAG Workflow
    this.registerTemplate({
      id: 'rag-workflow',
      name: 'RAG Workflow',
      description: 'Retrieval-Augmented Generation workflow',
      nodes: [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          config: {},
        },
        {
          id: 'retrieval',
          type: 'tool',
          name: 'Document Retrieval',
          config: { tool: 'vector-search' },
        },
        {
          id: 'generation',
          type: 'agent',
          name: 'Response Generation',
          config: { model: 'gpt-4' },
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          config: {},
        },
      ],
      edges: [
        { id: 'start-retrieval', from: 'start', to: 'retrieval' },
        { id: 'retrieval-generation', from: 'retrieval', to: 'generation' },
        { id: 'generation-end', from: 'generation', to: 'end' },
      ],
    });

    // Template 3: Conditional Workflow
    this.registerTemplate({
      id: 'conditional-workflow',
      name: 'Conditional Workflow',
      description: 'Workflow with conditional branching',
      nodes: [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          config: {},
        },
        {
          id: 'decision',
          type: 'decision',
          name: 'Decision Point',
          config: {},
        },
        {
          id: 'path-a',
          type: 'agent',
          name: 'Path A',
          config: {},
        },
        {
          id: 'path-b',
          type: 'agent',
          name: 'Path B',
          config: {},
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          config: {},
        },
      ],
      edges: [
        { id: 'start-decision', from: 'start', to: 'decision' },
        {
          id: 'decision-a',
          from: 'decision',
          to: 'path-a',
          condition: (state) => state.condition === 'A',
        },
        {
          id: 'decision-b',
          from: 'decision',
          to: 'path-b',
          condition: (state) => state.condition === 'B',
        },
        { id: 'path-a-end', from: 'path-a', to: 'end' },
        { id: 'path-b-end', from: 'path-b', to: 'end' },
      ],
    });

    // Template 4: Multi-Agent Collaboration
    this.registerTemplate({
      id: 'multi-agent',
      name: 'Multi-Agent Collaboration',
      description: 'Multiple agents working together',
      nodes: [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          config: {},
        },
        {
          id: 'researcher',
          type: 'agent',
          name: 'Researcher Agent',
          config: { role: 'researcher' },
        },
        {
          id: 'analyst',
          type: 'agent',
          name: 'Analyst Agent',
          config: { role: 'analyst' },
        },
        {
          id: 'writer',
          type: 'agent',
          name: 'Writer Agent',
          config: { role: 'writer' },
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          config: {},
        },
      ],
      edges: [
        { id: 'start-researcher', from: 'start', to: 'researcher' },
        { id: 'researcher-analyst', from: 'researcher', to: 'analyst' },
        { id: 'analyst-writer', from: 'analyst', to: 'writer' },
        { id: 'writer-end', from: 'writer', to: 'end' },
      ],
    });

    // Template 5: Parallel Processing
    this.registerTemplate({
      id: 'parallel-processing',
      name: 'Parallel Processing',
      description: 'Parallel execution of multiple tasks',
      nodes: [
        {
          id: 'start',
          type: 'start',
          name: 'Start',
          config: {},
        },
        {
          id: 'parallel',
          type: 'parallel',
          name: 'Parallel Split',
          config: {},
        },
        {
          id: 'task-1',
          type: 'tool',
          name: 'Task 1',
          config: {},
        },
        {
          id: 'task-2',
          type: 'tool',
          name: 'Task 2',
          config: {},
        },
        {
          id: 'task-3',
          type: 'tool',
          name: 'Task 3',
          config: {},
        },
        {
          id: 'merge',
          type: 'tool',
          name: 'Merge Results',
          config: {},
        },
        {
          id: 'end',
          type: 'end',
          name: 'End',
          config: {},
        },
      ],
      edges: [
        { id: 'start-parallel', from: 'start', to: 'parallel' },
        { id: 'parallel-task-1', from: 'parallel', to: 'task-1' },
        { id: 'parallel-task-2', from: 'parallel', to: 'task-2' },
        { id: 'parallel-task-3', from: 'parallel', to: 'task-3' },
        { id: 'task-1-merge', from: 'task-1', to: 'merge' },
        { id: 'task-2-merge', from: 'task-2', to: 'merge' },
        { id: 'task-3-merge', from: 'task-3', to: 'merge' },
        { id: 'merge-end', from: 'merge', to: 'end' },
      ],
    });

    this.logger.log('Initialized 5 default workflow templates');
  }
}
