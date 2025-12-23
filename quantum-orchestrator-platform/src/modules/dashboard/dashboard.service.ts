import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface AgentNode {
  id: string;
  name: string;
  type: string;
  position: { top: string; left: string };
  status: 'active' | 'inactive' | 'error';
  metrics?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  created: Date;
  nodes: AgentNode[];
  connections: any[];
  status: 'draft' | 'deployed' | 'running';
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private workflows: Map<string, Workflow> = new Map();
  private agents: Map<string, AgentNode> = new Map();

  getStatus(): { status: string; timestamp: Date; version: string } {
    return {
      status: 'operational',
      timestamp: new Date(),
      version: '1.0.0'
    };
  }

  createWorkflow(workflow: Partial<Workflow>): Workflow {
    const newWorkflow: Workflow = {
      id: uuidv4(),
      name: workflow.name || `Workflow-${Date.now()}`,
      created: new Date(),
      nodes: workflow.nodes || [],
      connections: workflow.connections || [],
      status: 'draft'
    };

    this.workflows.set(newWorkflow.id, newWorkflow);
    this.logger.log(`Workflow created: ${newWorkflow.id}`);

    return newWorkflow;
  }

  getWorkflow(id: string): Workflow | null {
    return this.workflows.get(id) || null;
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  deployWorkflow(id: string): boolean {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      return false;
    }

    workflow.status = 'deployed';
    this.logger.log(`Workflow deployed: ${id}`);

    // Initialize agents from workflow nodes
    workflow.nodes.forEach(node => {
      this.agents.set(node.id, {
        ...node,
        status: 'active',
        metrics: {
          requests: 0,
          errors: 0,
          latency: 0,
          throughput: 0
        }
      });
    });

    return true;
  }

  getWorkflowMetrics(id: string): Record<string, any> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      return {};
    }

    const metrics = {
      workflowId: id,
      name: workflow.name,
      status: workflow.status,
      nodeCount: workflow.nodes.length,
      activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
      metrics: {
        totalRequests: 0,
        successRate: 0,
        averageLatency: 0,
        throughput: 0
      }
    };

    // Aggregate node metrics
    workflow.nodes.forEach(node => {
      const agent = this.agents.get(node.id);
      if (agent?.metrics) {
        metrics.metrics.totalRequests += agent.metrics.requests || 0;
        metrics.metrics.averageLatency = (metrics.metrics.averageLatency + (agent.metrics.latency || 0)) / 2;
        metrics.metrics.throughput += agent.metrics.throughput || 0;
      }
    });

    return metrics;
  }
}
