import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ServiceRegistry } from './ServiceRegistry';
import {
  ServiceInvocationRequest,
  ServiceInvocationResponse,
  ServiceProtocol,
  LoadBalancingStrategy
} from './MeshInterface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service Mesh - Communication layer for service-to-service communication
 */
@Injectable()
export class ServiceMesh {
  private readonly logger = new Logger(ServiceMesh.name);
  private rateLimitCounters = new Map<string, { count: number; resetTime: number }>();
  private requestLogs: Array<{ serviceId: string; traceId: string; timestamp: Date; duration: number }> = [];

  constructor(private readonly serviceRegistry: ServiceRegistry) {}

  /**
   * Invoke a service
   */
  async invoke(
    serviceId: string,
    request: ServiceInvocationRequest
  ): Promise<ServiceInvocationResponse> {
    const startTime = Date.now();
    const traceId = uuidv4();

    this.logger.log(`[${traceId}] Invoking service ${serviceId} - ${request.method} ${request.endpoint}`);

    try {
      // Check circuit breaker
      if (!this.serviceRegistry.canInvoke(serviceId)) {
        throw new Error('Service circuit breaker is open');
      }

      // Check rate limit
      this.checkRateLimit(serviceId);

      // Discover service
      const service = await this.serviceRegistry.discover(serviceId);

      // Build URL
      const url = this.buildUrl(service.protocol, service.host, service.port, request.endpoint);

      // Add authentication headers
      const headers = {
        ...request.headers,
        'X-Trace-ID': traceId
      };

      if (service.apiKey) {
        headers['X-API-Key'] = service.apiKey;
      }

      // Make request
      const response = await axios({
        method: request.method.toLowerCase(),
        url,
        data: request.body,
        headers,
        timeout: request.timeout || 30000
      });

      const duration = Date.now() - startTime;

      // Log request
      this.logRequest(serviceId, traceId, duration);

      // Reset circuit breaker on success
      this.serviceRegistry.resetCircuitBreaker(serviceId);

      this.logger.log(`[${traceId}] Service invocation successful in ${duration}ms`);

      return {
        success: true,
        status: response.status,
        data: response.data,
        responseTime: duration,
        traceId
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      // Record failure in circuit breaker
      this.serviceRegistry.recordFailure(serviceId);

      // Log request
      this.logRequest(serviceId, traceId, duration);

      this.logger.error(`[${traceId}] Service invocation failed:`, error.message);

      return {
        success: false,
        status: error.response?.status || 500,
        error: error.message,
        responseTime: duration,
        traceId
      };
    }
  }

  /**
   * Route request with load balancing
   */
  async route(
    serviceName: string,
    request: ServiceInvocationRequest,
    strategy: LoadBalancingStrategy = { type: 'ROUND_ROBIN' }
  ): Promise<ServiceInvocationResponse> {
    const startTime = Date.now();

    try {
      // Get all instances of the service
      const allServices = await this.serviceRegistry.getAll();
      const instances = allServices.filter((s) => s.name === serviceName);

      if (instances.length === 0) {
        throw new Error(`No instances found for service ${serviceName}`);
      }

      // Select instance based on strategy
      const selectedInstance = this.selectInstance(instances, strategy);

      this.logger.log(`Routing to instance ${selectedInstance.id} using ${strategy.type} strategy`);

      // Invoke selected instance
      return await this.invoke(selectedInstance.id, request);
    } catch (error) {
      this.logger.error('Failed to route request:', error);
      throw error;
    }
  }

  /**
   * Check rate limit for service
   */
  private checkRateLimit(serviceId: string): void {
    const now = Date.now();
    const counter = this.rateLimitCounters.get(serviceId);

    if (!counter || now > counter.resetTime) {
      // Reset counter every minute
      this.rateLimitCounters.set(serviceId, {
        count: 1,
        resetTime: now + 60000 // 1 minute
      });
      return;
    }

    // Check if limit exceeded (default 100 req/min)
    if (counter.count >= 100) {
      throw new BadRequestException('Rate limit exceeded for service');
    }

    counter.count++;
  }

  /**
   * Build service URL
   */
  private buildUrl(
    protocol: ServiceProtocol,
    host: string,
    port: number,
    endpoint: string
  ): string {
    const protocolStr = protocol === ServiceProtocol.HTTPS ? 'https' : 'http';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${protocolStr}://${host}:${port}${cleanEndpoint}`;
  }

  /**
   * Select instance based on load balancing strategy
   */
  private selectInstance(instances: any[], strategy: LoadBalancingStrategy): any {
    switch (strategy.type) {
    case 'ROUND_ROBIN':
      // Simple round-robin selection
      const index = Math.floor(Math.random() * instances.length);
      return instances[index];

    case 'RANDOM':
      const randomIndex = Math.floor(Math.random() * instances.length);
      return instances[randomIndex];

    case 'LEAST_CONNECTIONS':
      // For simplicity, just return first instance
      // In production, track connection counts
      return instances[0];

    default:
      return instances[0];
    }
  }

  /**
   * Log request
   */
  private logRequest(serviceId: string, traceId: string, duration: number): void {
    this.requestLogs.push({
      serviceId,
      traceId,
      timestamp: new Date(),
      duration
    });

    // Keep only last 1000 logs
    if (this.requestLogs.length > 1000) {
      this.requestLogs = this.requestLogs.slice(-1000);
    }
  }

  /**
   * Get request logs
   */
  getRequestLogs(limit: number = 100): typeof this.requestLogs {
    return this.requestLogs.slice(-limit);
  }

  /**
   * Get mesh statistics
   */
  getStats(): {
    totalRequests: number;
    averageResponseTime: number;
    activeServices: number;
    } {
    const totalRequests = this.requestLogs.length;
    const averageResponseTime =
      this.requestLogs.reduce((sum, log) => sum + log.duration, 0) /
      (totalRequests || 1);

    return {
      totalRequests,
      averageResponseTime,
      activeServices: this.rateLimitCounters.size
    };
  }
}
