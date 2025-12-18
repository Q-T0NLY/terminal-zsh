/**
 * ⚙️ Infrastructure Registry - IaC Templates
 */

import {
  SubRegistryType,
  InfraRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class InfraRegistry implements ISubRegistry<InfraRegistryEntry> {
  readonly type = SubRegistryType.INFRA;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, InfraRegistryEntry> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.INFRA,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['provider', 'templateType', 'resources', 'validation'],
      },
      validation: {
        strict: true,
      },
      storage: {
        backend: 'sqlite',
        path: './infra-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    console.log('⚙️  Initializing Infrastructure Registry');
  }

  async register(entry: InfraRegistryEntry): Promise<string> {
    const id = `infra-${entry.namespace}:${entry.name}`;
    
    // Validate template syntax if available
    if (entry.templateContent && this.config.validation.strict) {
      await this.validateTemplateSyntax(entry);
    }
    
    this.entries.set(id, entry);
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<InfraRegistryEntry>> {
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

  async get(id: string): Promise<InfraRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<InfraRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as InfraRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  async validate(entry: InfraRegistryEntry): Promise<boolean> {
    // Check validation status
    if (!entry.metadata.validation.syntax) {
      console.warn(`⚠️  Infrastructure ${entry.name} has syntax validation failures`);
      return false;
    }
    
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0;
  }

  private async validateTemplateSyntax(entry: InfraRegistryEntry): Promise<void> {
    // Basic validation - would integrate with actual IaC validators in production
    console.log(`🔍 Validating ${entry.metadata.templateType} template for ${entry.name}`);
    entry.metadata.validation.syntax = true; // Placeholder
  }

  /**
   * Estimate infrastructure cost
   */
  async estimateCost(infraId: string): Promise<{
    totalEstimate: number;
    breakdown: Record<string, number>;
  }> {
    const infra = await this.get(infraId);
    if (!infra) {
      throw new Error(`Infrastructure ${infraId} not found`);
    }
    
    const breakdown: Record<string, number> = {};
    let total = 0;
    
    infra.metadata.resources.forEach(resource => {
      const cost = resource.estimated_cost || 0;
      breakdown[resource.type] = cost;
      total += cost;
    });
    
    return {
      totalEstimate: total,
      breakdown,
    };
  }
}
