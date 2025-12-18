/**
 * CrewAI Framework Interfaces and Types
 */

export interface Tool {
  name: string;
  description: string;
  execute: (input: any) => Promise<any>;
}

export interface AgentConfig {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools: Tool[];
  llmModel?: string;
}

export interface AgentMemory {
  shortTerm: any[];
  longTerm: Map<string, any>;
}

export interface Task {
  id: string;
  description: string;
  expectedOutput: string;
  agent?: string;
  context?: any;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  output: any;
  executionTime: number;
  error?: string;
}

export enum CrewExecutionMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
}

export enum CrewStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CrewConfig {
  id: string;
  name: string;
  agents: string[];
  tasks: Task[];
  executionMode: CrewExecutionMode;
}

export interface CrewResult {
  success: boolean;
  results: TaskResult[];
  executionTime: number;
  status: CrewStatus;
}
