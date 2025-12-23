/**
 * LangGraph Framework Interfaces and Types
 */

export enum WorkflowStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED',
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'agent' | 'tool' | 'decision' | 'parallel';
  name: string;
  config: Record<string, any>;
  handler?: (input: any, state: WorkflowState) => Promise<any>;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  condition?: (state: WorkflowState) => boolean;
  label?: string;
}

export interface WorkflowState {
  [key: string]: any;
}

export interface WorkflowResult {
  success: boolean;
  output: any;
  state: WorkflowState;
  executionTime: number;
  nodesExecuted: string[];
  error?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  defaultState?: WorkflowState;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startTime: Date;
  endTime?: Date;
  currentNode?: string;
  state: WorkflowState;
  result?: WorkflowResult;
}
