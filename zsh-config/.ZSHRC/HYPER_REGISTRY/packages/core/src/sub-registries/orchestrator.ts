/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║                           HYPER REGISTRY - SUB-REGISTRY ORCHESTRATOR                                                                                      ║
 * ║                    Intelligent Routing and Management for Multi-Domain Registry System                                                                   ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
 * ║  FILE: orchestrator.ts                                                                                                                                    ║
 * ║  PURPOSE: Route operations to appropriate sub-registries, manage cross-registry queries                                                                  ║
 * ║  MODULE: @hyper-registry/core/sub-registries                                                                                                              ║
 * ║  LAYER: Orchestration                                                                                                                                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
 * ║  CREATED: 2024-12-16                                                                                                                                      ║
 * ║  VERSION: 1.0.0                                                                                                                                           ║
 * ║  AUTHOR: NEXUSPRO AI STUDIO                                                                                                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */

import {
  SubRegistryType,
  SubRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
  PluginRegistryEntry,
  ServiceRegistryEntry,
  MLModelRegistryEntry,
  DataRegistryEntry,
  InfraRegistryEntry,
  SecurityRegistryEntry,
} from '../models/sub-registry';

/**
 * Sub-registry interface that all specialized registries implement
 */
export interface ISubRegistry<T extends SubRegistryEntry = SubRegistryEntry> {
  readonly type: SubRegistryType;
  readonly config: SubRegistryConfig;
  
  /**
   * Initialize the sub-registry
   */
  initialize(): Promise<void>;
  
  /**
   * Register a new entry
   */
  register(entry: T): Promise<string>;
  
  /**
   * Query entries
   */
  query(query: SubRegistryQuery): Promise<SubRegistryResult<T>>;
  
  /**
   * Get entry by ID
   */
  get(id: string): Promise<T | null>;
  
  /**
   * Update entry
   */
  update(id: string, entry: Partial<T>): Promise<boolean>;
  
  /**
   * Delete entry
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Validate entry against sub-registry rules
   */
  validate(entry: T): Promise<boolean>;
  
  /**
   * Health check
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Sub-registry orchestrator manages all specialized registries
 */
export class SubRegistryOrchestrator {
  private registries: Map<SubRegistryType, ISubRegistry> = new Map();
  private initialized = false;

  /**
   * Register a sub-registry
   */
  registerSubRegistry<T extends SubRegistryEntry>(registry: ISubRegistry<T>): void {
    if (this.registries.has(registry.type)) {
      throw new Error(`Sub-registry of type ${registry.type} already registered`);
    }
    this.registries.set(registry.type, registry as ISubRegistry);
  }

  /**
   * Initialize all registered sub-registries
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const initPromises = Array.from(this.registries.values()).map(registry =>
      registry.initialize()
    );

    await Promise.all(initPromises);
    this.initialized = true;
  }

  /**
   * Route entry registration to appropriate sub-registry
   */
  async register(entry: SubRegistryEntry): Promise<string> {
    const registryType = entry.metadata.type;
    const registry = this.registries.get(registryType);

    if (!registry) {
      throw new Error(`No sub-registry registered for type: ${registryType}`);
    }

    // Validate entry
    const isValid = await registry.validate(entry);
    if (!isValid) {
      throw new Error(`Entry validation failed for type: ${registryType}`);
    }

    return registry.register(entry);
  }

  /**
   * Query across one or more sub-registries
   */
  async query(query: SubRegistryQuery): Promise<SubRegistryResult> {
    // If type specified, query single registry
    if (query.type) {
      const registry = this.registries.get(query.type);
      if (!registry) {
        throw new Error(`No sub-registry registered for type: ${query.type}`);
      }
      return registry.query(query);
    }

    // Query all registries and merge results
    const queryPromises = Array.from(this.registries.values()).map(registry =>
      registry.query(query)
    );

    const results = await Promise.all(queryPromises);

    // Merge results
    const mergedEntries = results.flatMap(r => r.entries);
    const total = results.reduce((sum, r) => sum + r.total, 0);

    // Apply pagination to merged results
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const paginatedEntries = mergedEntries.slice(offset, offset + limit);

    return {
      entries: paginatedEntries,
      total,
      offset,
      limit,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Get entry by ID from appropriate sub-registry
   */
  async get(type: SubRegistryType, id: string): Promise<SubRegistryEntry | null> {
    const registry = this.registries.get(type);
    if (!registry) {
      throw new Error(`No sub-registry registered for type: ${type}`);
    }
    return registry.get(id);
  }

  /**
   * Update entry in appropriate sub-registry
   */
  async update(
    type: SubRegistryType,
    id: string,
    entry: Partial<SubRegistryEntry>
  ): Promise<boolean> {
    const registry = this.registries.get(type);
    if (!registry) {
      throw new Error(`No sub-registry registered for type: ${type}`);
    }
    return registry.update(id, entry);
  }

  /**
   * Delete entry from appropriate sub-registry
   */
  async delete(type: SubRegistryType, id: string): Promise<boolean> {
    const registry = this.registries.get(type);
    if (!registry) {
      throw new Error(`No sub-registry registered for type: ${type}`);
    }
    return registry.delete(id);
  }

  /**
   * Health check across all sub-registries
   */
  async healthCheck(): Promise<Record<SubRegistryType, boolean>> {
    const healthPromises = Array.from(this.registries.entries()).map(
      async ([type, registry]) => {
        const healthy = await registry.healthCheck();
        return [type, healthy] as const;
      }
    );

    const results = await Promise.all(healthPromises);
    return Object.fromEntries(results) as Record<SubRegistryType, boolean>;
  }

  /**
   * Get statistics across all sub-registries
   */
  async getStatistics(): Promise<
    Record<
      SubRegistryType,
      {
        total: number;
        byNamespace: Record<string, number>;
        byVersion: Record<string, number>;
      }
    >
  > {
    const statsPromises = Array.from(this.registries.entries()).map(
      async ([type, registry]) => {
        const result = await registry.query({ limit: 0 });
        
        // Get breakdown by namespace and version
        const allEntries = await registry.query({ limit: 10000 });
        const byNamespace: Record<string, number> = {};
        const byVersion: Record<string, number> = {};

        allEntries.entries.forEach(entry => {
          const ns = entry.namespace || 'default';
          const ver = entry.metadata.version;

          byNamespace[ns] = (byNamespace[ns] || 0) + 1;
          byVersion[ver] = (byVersion[ver] || 0) + 1;
        });

        return [
          type,
          {
            total: result.total,
            byNamespace,
            byVersion,
          },
        ] as const;
      }
    );

    const results = await Promise.all(statsPromises);
    return Object.fromEntries(results) as any;
  }

  /**
   * Cross-registry dependency analysis
   */
  async analyzeDependencies(id: string, type: SubRegistryType): Promise<{
    dependencies: SubRegistryEntry[];
    dependents: SubRegistryEntry[];
  }> {
    const entry = await this.get(type, id);
    if (!entry) {
      throw new Error(`Entry ${id} not found in registry ${type}`);
    }

    const dependencies: SubRegistryEntry[] = [];
    const dependents: SubRegistryEntry[] = [];

    // TODO: Implement dependency resolution based on entry metadata
    // This will analyze cross-references between different registry types
    // For example:
    // - Services depend on Plugins
    // - ML Models depend on Data
    // - Infrastructure depends on Services
    // - Security scans reference all types

    return { dependencies, dependents };
  }

  /**
   * Export registry contents for backup/migration
   */
  async export(): Promise<Record<SubRegistryType, SubRegistryEntry[]>> {
    const exportPromises = Array.from(this.registries.entries()).map(
      async ([type, registry]) => {
        const result = await registry.query({ limit: 100000 });
        return [type, result.entries] as const;
      }
    );

    const results = await Promise.all(exportPromises);
    return Object.fromEntries(results) as Record<SubRegistryType, SubRegistryEntry[]>;
  }

  /**
   * Import registry contents from backup
   */
  async import(data: Record<SubRegistryType, SubRegistryEntry[]>): Promise<void> {
    for (const [type, entries] of Object.entries(data)) {
      const registry = this.registries.get(type as SubRegistryType);
      if (!registry) {
        console.warn(`No registry for type ${type}, skipping import`);
        continue;
      }

      for (const entry of entries) {
        try {
          await registry.register(entry);
        } catch (error) {
          console.error(`Failed to import entry:`, error);
        }
      }
    }
  }
}

/**
 * Global orchestrator instance
 */
export const orchestrator = new SubRegistryOrchestrator();
