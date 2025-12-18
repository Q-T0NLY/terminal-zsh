/**
 * Service Mesh Interfaces and Types
 */

export enum ServiceStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
  OFFLINE = 'OFFLINE',
}

export enum ServiceProtocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  GRPC = 'GRPC',
  WEBSOCKET = 'WEBSOCKET',
}

export interface ServiceHealth {
  status: ServiceStatus;
  message?: string;
  timestamp: Date;
  responseTime?: number;
  lastCheck: Date;
}

export interface ServiceMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  protocol: ServiceProtocol;
  host: string;
  port: number;
  endpoints: string[];
  dependencies: string[];
  health: ServiceHealth;
  apiKey?: string;
  rateLimit: number; // requests per minute
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceMetrics {
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime?: Date;
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  threshold: number; // number of failures before opening
  timeout: number; // timeout in ms
  resetTimeout: number; // time before attempting reset in ms
}

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface LoadBalancingStrategy {
  type: 'ROUND_ROBIN' | 'RANDOM' | 'LEAST_CONNECTIONS';
}

export interface ServiceInvocationRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ServiceInvocationResponse {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  responseTime: number;
  traceId: string;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: 'service' | 'plugin';
  status: ServiceStatus;
  metadata: Record<string, any>;
}

export interface TopologyEdge {
  source: string;
  target: string;
  type: 'depends_on' | 'calls' | 'communicates_with';
  weight?: number;
}

export interface MeshTopology {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  timestamp: Date;
}
