import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceMetadata, ServiceStatus, CircuitBreakerState, CircuitBreakerConfig } from './MeshInterface';
import { ServiceEntity } from '../entities/service.entity';
import axios from 'axios';

/**
 * Service Registry - Service discovery and management
 */
@Injectable()
export class ServiceRegistry {
  private readonly logger = new Logger(ServiceRegistry.name);
  private serviceCache = new Map<string, ServiceMetadata>();
  private circuitBreakers = new Map<string, { state: CircuitBreakerState; failures: number; lastAttempt?: Date }>();

  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>
  ) {}

  /**
   * Register a service
   */
  async register(metadata: Partial<ServiceMetadata>): Promise<ServiceMetadata> {
    const startTime = Date.now();

    try {
      // Generate ID if not provided
      const id = metadata.id || this.generateServiceId(metadata.name!);

      const completeMetadata: ServiceMetadata = {
        id,
        name: metadata.name!,
        version: metadata.version!,
        description: metadata.description,
        protocol: metadata.protocol!,
        host: metadata.host!,
        port: metadata.port!,
        endpoints: metadata.endpoints || [],
        dependencies: metadata.dependencies || [],
        health: {
          status: ServiceStatus.HEALTHY,
          timestamp: new Date(),
          lastCheck: new Date()
        },
        apiKey: metadata.apiKey,
        rateLimit: metadata.rateLimit || 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      const entity = this.serviceRepository.create(completeMetadata);
      await this.serviceRepository.save(entity);

      // Update cache
      this.serviceCache.set(id, completeMetadata);

      // Initialize circuit breaker
      this.circuitBreakers.set(id, {
        state: CircuitBreakerState.CLOSED,
        failures: 0
      });

      const duration = Date.now() - startTime;
      this.logger.log(`Service ${id} registered in ${duration}ms`);

      return completeMetadata;
    } catch (error) {
      this.logger.error('Failed to register service:', error);
      throw error;
    }
  }

  /**
   * Discover a service by ID or name
   */
  async discover(idOrName: string): Promise<ServiceMetadata> {
    const startTime = Date.now();

    try {
      // Check cache first
      if (this.serviceCache.has(idOrName)) {
        const duration = Date.now() - startTime;
        this.logger.debug(`Service ${idOrName} discovered from cache in ${duration}ms`);
        return this.serviceCache.get(idOrName)!;
      }

      // Search database
      const entity = await this.serviceRepository.findOne({
        where: [{ id: idOrName }, { name: idOrName }]
      });

      if (!entity) {
        throw new NotFoundException(`Service ${idOrName} not found`);
      }

      const metadata = this.entityToMetadata(entity);

      // Update cache
      this.serviceCache.set(metadata.id, metadata);

      const duration = Date.now() - startTime;
      this.logger.debug(`Service ${idOrName} discovered from DB in ${duration}ms`);

      return metadata;
    } catch (error) {
      this.logger.error(`Failed to discover service ${idOrName}:`, error);
      throw error;
    }
  }

  /**
   * Get all services
   */
  async getAll(): Promise<ServiceMetadata[]> {
    try {
      const entities = await this.serviceRepository.find();
      return entities.map((e) => this.entityToMetadata(e));
    } catch (error) {
      this.logger.error('Failed to get all services:', error);
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async get(id: string): Promise<ServiceMetadata | null> {
    try {
      const entity = await this.serviceRepository.findOne({ where: { id } });
      return entity ? this.entityToMetadata(entity) : null;
    } catch (error) {
      this.logger.error(`Failed to get service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update service
   */
  async update(id: string, updates: Partial<ServiceMetadata>): Promise<void> {
    try {
      await this.serviceRepository.update({ id }, updates as any);
      this.serviceCache.delete(id);
      this.logger.log(`Service ${id} updated`);
    } catch (error) {
      this.logger.error(`Failed to update service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Unregister a service
   */
  async unregister(id: string): Promise<void> {
    try {
      await this.serviceRepository.delete({ id });
      this.serviceCache.delete(id);
      this.circuitBreakers.delete(id);
      this.logger.log(`Service ${id} unregistered`);
    } catch (error) {
      this.logger.error(`Failed to unregister service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Perform health check on service
   */
  async healthCheck(id: string): Promise<ServiceMetadata> {
    const startTime = Date.now();

    try {
      const service = await this.discover(id);
      const healthEndpoint = `${service.protocol.toLowerCase()}://${service.host}:${service.port}/health`;

      try {
        const response = await axios.get(healthEndpoint, { timeout: 5000 });
        const responseTime = Date.now() - startTime;

        service.health = {
          status: ServiceStatus.HEALTHY,
          message: 'Service is healthy',
          timestamp: new Date(),
          responseTime,
          lastCheck: new Date()
        };

        // Reset circuit breaker on successful health check
        this.resetCircuitBreaker(id);
      } catch (error) {
        service.health = {
          status: ServiceStatus.UNHEALTHY,
          message: `Health check failed: ${error.message}`,
          timestamp: new Date(),
          lastCheck: new Date()
        };

        // Update circuit breaker
        this.recordFailure(id);
      }

      // Update in database
      await this.update(id, { health: service.health });

      return service;
    } catch (error) {
      this.logger.error(`Health check failed for service ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get circuit breaker state for a service
   */
  getCircuitBreakerState(id: string): CircuitBreakerState {
    const breaker = this.circuitBreakers.get(id);
    return ((breaker?.state) != null) || CircuitBreakerState.CLOSED;
  }

  /**
   * Check if circuit breaker allows request
   */
  canInvoke(id: string): boolean {
    const breaker = this.circuitBreakers.get(id);

    if (!breaker) {
      return true;
    }

    if (breaker.state === CircuitBreakerState.OPEN) {
      // Check if enough time has passed to attempt reset
      const resetTimeout = 30000; // 30 seconds
      if (breaker.lastAttempt && Date.now() - breaker.lastAttempt.getTime() > resetTimeout) {
        breaker.state = CircuitBreakerState.HALF_OPEN;
        return true;
      }
      return false;
    }

    return true;
  }

  /**
   * Record circuit breaker failure
   */
  recordFailure(id: string): void {
    const breaker = this.circuitBreakers.get(id);

    if (!breaker) {
      return;
    }

    breaker.failures++;
    breaker.lastAttempt = new Date();

    const threshold = 5;
    if (breaker.failures >= threshold) {
      breaker.state = CircuitBreakerState.OPEN;
      this.logger.warn(`Circuit breaker opened for service ${id}`);
    }
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(id: string): void {
    const breaker = this.circuitBreakers.get(id);

    if (breaker) {
      breaker.state = CircuitBreakerState.CLOSED;
      breaker.failures = 0;
      breaker.lastAttempt = undefined;
    }
  }

  /**
   * Generate service ID
   */
  private generateServiceId(name: string): string {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `svc-${normalized}-${timestamp}`;
  }

  /**
   * Convert entity to metadata
   */
  private entityToMetadata(entity: ServiceEntity): ServiceMetadata {
    return {
      id: entity.id,
      name: entity.name,
      version: entity.version,
      description: entity.description,
      protocol: entity.protocol,
      host: entity.host,
      port: entity.port,
      endpoints: entity.endpoints,
      dependencies: entity.dependencies,
      health: entity.health,
      apiKey: entity.apiKey,
      rateLimit: entity.rateLimit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
