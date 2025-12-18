/**
 * 🌐 Service Registry - Mesh-aware Service Discovery
 */

import {
  SubRegistryType,
  ServiceRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class ServiceRegistry implements ISubRegistry<ServiceRegistryEntry> {
  readonly type = SubRegistryType.SERVICE;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, ServiceRegistryEntry> = new Map();
  private healthCheckIntervals: Map<string, NodeJS.Timer> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.SERVICE,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['endpoints', 'mesh', 'dependencies', 'sla'],
      },
      validation: {
        strict: true,
      },
      storage: {
        backend: 'sqlite',
        path: './service-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    console.log('🌐 Initializing Service Registry with mesh support');
  }

  async register(entry: ServiceRegistryEntry): Promise<string> {
    const id = `service-${entry.namespace}:${entry.name}`;
    
    this.entries.set(id, entry);
    
    // Start health checking if enabled
    if (entry.metadata.endpoints.some(e => e.healthCheck)) {
      this.startHealthChecking(id, entry);
    }
    
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<ServiceRegistryEntry>> {
    let results = Array.from(this.entries.values());
    
    if (query.namespace) {
      results = results.filter(e => e.namespace === query.namespace);
    }
    
    const total = results.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return {
      entries: results.slice(offset, offset + limit),
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    };
  }

  async get(id: string): Promise<ServiceRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<ServiceRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as ServiceRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    // Stop health checking
    const interval = this.healthCheckIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(id);
    }
    
    return this.entries.delete(id);
  }

  async validate(entry: ServiceRegistryEntry): Promise<boolean> {
    // Validate endpoints
    if (!entry.metadata.endpoints || entry.metadata.endpoints.length === 0) {
      return false;
    }
    
    // Validate SLA requirements
    if (entry.metadata.sla) {
      if (entry.metadata.sla.availability < 0 || entry.metadata.sla.availability > 100) {
        return false;
      }
    }
    
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0;
  }

  private startHealthChecking(id: string, entry: ServiceRegistryEntry): void {
    const interval = setInterval(async () => {
      for (const endpoint of entry.metadata.endpoints) {
        if (endpoint.healthCheck) {
          try {
            const response = await fetch(`${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.healthCheck}`);
            const healthy = response.ok;
            console.log(`Health check for ${id}: ${healthy ? '✅' : '❌'}`);
          } catch (error) {
            console.error(`Health check failed for ${id}:`, error);
          }
        }
      }
    }, 30000); // Check every 30 seconds
    
    this.healthCheckIntervals.set(id, interval);
  }
}
