/**
 * 🧠 ML Model Registry - Version-controlled ML Models
 */

import {
  SubRegistryType,
  MLModelRegistryEntry,
  SubRegistryConfig,
  SubRegistryQuery,
  SubRegistryResult,
} from '../models/sub-registry';
import { ISubRegistry } from './orchestrator';

export class MLModelRegistry implements ISubRegistry<MLModelRegistryEntry> {
  readonly type = SubRegistryType.ML_MODEL;
  readonly config: SubRegistryConfig;
  
  private entries: Map<string, MLModelRegistryEntry> = new Map();
  
  constructor(config?: Partial<SubRegistryConfig>) {
    this.config = {
      type: SubRegistryType.ML_MODEL,
      enabled: true,
      indexing: {
        enabled: true,
        fields: ['framework', 'modelType', 'metrics', 'lineage'],
      },
      validation: {
        strict: true,
      },
      storage: {
        backend: 'sqlite',
        path: './ml-model-registry.db',
      },
      ...config,
    };
  }

  async initialize(): Promise<void> {
    console.log('🧠 Initializing ML Model Registry');
  }

  async register(entry: MLModelRegistryEntry): Promise<string> {
    const id = `ml-model-${entry.namespace}:${entry.name}:${entry.metadata.version}`;
    
    // Track lineage
    if (entry.metadata.lineage.parentModel) {
      console.log(`📊 Model ${entry.name} derived from ${entry.metadata.lineage.parentModel}`);
    }
    
    this.entries.set(id, entry);
    return id;
  }

  async query(query: SubRegistryQuery): Promise<SubRegistryResult<MLModelRegistryEntry>> {
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

  async get(id: string): Promise<MLModelRegistryEntry | null> {
    return this.entries.get(id) || null;
  }

  async update(id: string, entry: Partial<MLModelRegistryEntry>): Promise<boolean> {
    const existing = this.entries.get(id);
    if (!existing) return false;
    
    this.entries.set(id, { ...existing, ...entry } as MLModelRegistryEntry);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  async validate(entry: MLModelRegistryEntry): Promise<boolean> {
    // Validate metrics exist
    if (!entry.metadata.metrics || Object.keys(entry.metadata.metrics).length === 0) {
      console.warn(`⚠️  ML Model ${entry.name} has no metrics`);
    }
    
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return this.entries.size >= 0;
  }

  /**
   * Compare models by metrics
   */
  async compareModels(modelIds: string[]): Promise<{
    models: MLModelRegistryEntry[];
    comparison: Record<string, number[]>;
  }> {
    const models = await Promise.all(modelIds.map(id => this.get(id)));
    const validModels = models.filter((m): m is MLModelRegistryEntry => m !== null);
    
    const comparison: Record<string, number[]> = {};
    const metricKeys = new Set<string>();
    
    validModels.forEach(model => {
      Object.keys(model.metadata.metrics).forEach(k => metricKeys.add(k));
    });
    
    metricKeys.forEach(metric => {
      comparison[metric] = validModels.map(m => m.metadata.metrics[metric as keyof typeof m.metadata.metrics] as number || 0);
    });
    
    return { models: validModels, comparison };
  }
}
