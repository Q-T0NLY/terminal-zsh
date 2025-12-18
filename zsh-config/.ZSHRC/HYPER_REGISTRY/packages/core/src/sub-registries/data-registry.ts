/**
 * 📁 Data Registry - Lineage-tracked Data Assets
 */

import {
  SubRegistryType,
  DataRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class DataRegistry implements ISubRegistry<DataRegistryEntry> {
  readonly type = SubRegistryType.DATA;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, DataRegistryEntry> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.DATA,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['format', 'schema', 'lineage', 'quality'],
      },
      validation: {
        strict: true,
      },
      storage: {
        backend: 'sqlite',
        path: './data-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    console.log('📁 Initializing Data Registry');
  }

  async register(entry: DataRegistryEntry): Promise<string> {
    const id = `data-${entry.namespace}:${entry.name}`;
    
    // Track lineage
    entry.metadata.lineage.sources.forEach(source => {
      console.log(`📊 Dataset ${entry.name} sources from ${source}`);
    });
    
    this.entries.set(id, entry);
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<DataRegistryEntry>> {
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

  async get(id: string): Promise<DataRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<DataRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as DataRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  async validate(entry: DataRegistryEntry): Promise<boolean> {
    // Validate data quality metrics
    if (entry.metadata.quality) {
      const { completeness, accuracy, consistency } = entry.metadata.quality;
      if (completeness !== undefined && (completeness < 0 || completeness > 1)) {
        return false;
      }
    }
    
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0;
  }

  /**
   * Build lineage graph for a dataset
   */
  async buildLineageGraph(datasetId: string): Promise<{
    dataset: DataRegistryEntry;
    upstream: DataRegistryEntry[];
    downstream: DataRegistryEntry[];
  }> {
    const dataset = await this.get(datasetId);
    if (!dataset) {
      throw new Error(`Dataset ${datasetId} not found`);
    }
    
    const upstream: DataRegistryEntry[] = [];
    const downstream: DataRegistryEntry[] = [];
    
    // Find upstream sources
    for (const source of dataset.metadata.lineage.sources) {
      const sourceData = await this.get(source);
      if (sourceData) {
        upstream.push(sourceData);
      }
    }
    
    // Find downstream consumers
    for (const consumer of dataset.metadata.lineage.consumers) {
      const consumerData = await this.get(consumer);
      if (consumerData) {
        downstream.push(consumerData);
      }
    }
    
    return { dataset, upstream, downstream };
  }
}
