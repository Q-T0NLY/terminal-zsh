import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  WorkflowNode,
  WorkflowEdge,
  WorkflowState,
  WorkflowResult,
  WorkflowStatus,
} from './LangGraphInterface';
import { StateManager } from './StateManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * Graph Workflow - Workflow execution engine for LangGraph
 */
@Injectable()
export class GraphWorkflow {
  private readonly logger = new Logger(GraphWorkflow.name);
  public id: string;
  public nodes: Map<string, WorkflowNode>;
  public edges: Map<string, WorkflowEdge>;
  public state: WorkflowState;
  private status: WorkflowStatus = WorkflowStatus.IDLE;

  constructor(
    id: string,
    private readonly stateManager: StateManager,
  ) {
    this.id = id;
    this.nodes = new Map();
    this.edges = new Map();
    this.state = {};
  }

  /**
   * Add a node to the workflow
   */
  addNode(node: WorkflowNode): void {
    this.nodes.set(node.id, node);
    this.logger.log(`Node ${node.id} added to workflow ${this.id}`);
  }

  /**
   * Add an edge between nodes
   */
  addEdge(from: string, to: string, condition?: (state: WorkflowState) => boolean): void {
    const edge: WorkflowEdge = {
      id: `${from}-${to}`,
      from,
      to,
      condition,
    };

    this.edges.set(edge.id, edge);
    this.logger.log(`Edge ${edge.id} added to workflow ${this.id}`);
  }

  /**
   * Execute the workflow
   */
  async execute(input: any): Promise<WorkflowResult> {
    const startTime = Date.now();
    const nodesExecuted: string[] = [];

    this.logger.log(`Starting workflow execution: ${this.id}`);
    this.status = WorkflowStatus.RUNNING;

    try {
      // Initialize state with input
      this.state = { ...input };

      // Save initial state
      await this.stateManager.saveState(this.id, this.state);

      // Find start node
      const startNode = Array.from(this.nodes.values()).find(
        (n) => n.type === 'start',
      );

      if (!startNode) {
        throw new Error('No start node found in workflow');
      }

      // Execute workflow starting from start node
      const output = await this.executeNode(startNode, nodesExecuted);

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      const result: WorkflowResult = {
        success: true,
        output,
        state: this.state,
        executionTime,
        nodesExecuted,
      };

      this.status = WorkflowStatus.COMPLETED;
      this.logger.log(
        `Workflow ${this.id} completed in ${executionTime}ms, executed ${nodesExecuted.length} nodes`,
      );

      return result;
    } catch (error) {
      this.status = WorkflowStatus.FAILED;
      const executionTime = Date.now() - startTime;

      this.logger.error(`Workflow ${this.id} failed:`, error);

      return {
        success: false,
        output: null,
        state: this.state,
        executionTime,
        nodesExecuted,
        error: error.message,
      };
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    nodesExecuted: string[],
  ): Promise<any> {
    this.logger.debug(`Executing node ${node.id} (${node.type})`);
    nodesExecuted.push(node.id);

    let output: any;

    // Execute node based on type
    switch (node.type) {
      case 'start':
        output = this.state;
        break;

      case 'end':
        return this.state;

      case 'agent':
      case 'tool':
        if (node.handler) {
          output = await node.handler(this.state, this.state);
          // Update state with output
          this.state = { ...this.state, ...output };
        } else {
          output = this.state;
        }
        break;

      case 'decision':
        // Decision nodes don't produce output, just route flow
        output = this.state;
        break;

      case 'parallel':
        // Execute parallel branches (simplified - execute sequentially for now)
        output = this.state;
        break;

      default:
        output = this.state;
    }

    // Save state after node execution
    await this.stateManager.saveState(this.id, this.state);

    // Find next nodes to execute
    const nextNodes = await this.getNextNodes(node.id);

    // Execute next nodes
    for (const nextNode of nextNodes) {
      output = await this.executeNode(nextNode, nodesExecuted);
    }

    return output;
  }

  /**
   * Get next nodes to execute based on edges
   */
  private async getNextNodes(nodeId: string): Promise<WorkflowNode[]> {
    const nextNodes: WorkflowNode[] = [];

    // Find all edges from this node
    const outgoingEdges = Array.from(this.edges.values()).filter(
      (e) => e.from === nodeId,
    );

    for (const edge of outgoingEdges) {
      // Check condition if exists
      if (edge.condition) {
        if (!edge.condition(this.state)) {
          continue;
        }
      }

      const nextNode = this.nodes.get(edge.to);
      if (nextNode) {
        nextNodes.push(nextNode);
      }
    }

    return nextNodes;
  }

  /**
   * Get current workflow state
   */
  getState(): WorkflowState {
    return { ...this.state };
  }

  /**
   * Get workflow status
   */
  getStatus(): WorkflowStatus {
    return this.status;
  }

  /**
   * Pause workflow execution
   */
  pause(): void {
    this.status = WorkflowStatus.PAUSED;
    this.logger.log(`Workflow ${this.id} paused`);
  }

  /**
   * Resume workflow execution
   */
  resume(): void {
    if (this.status === WorkflowStatus.PAUSED) {
      this.status = WorkflowStatus.RUNNING;
      this.logger.log(`Workflow ${this.id} resumed`);
    }
  }

  /**
   * Get workflow configuration
   */
  getConfig(): {
    id: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    status: WorkflowStatus;
  } {
    return {
      id: this.id,
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      status: this.status,
    };
  }
}
