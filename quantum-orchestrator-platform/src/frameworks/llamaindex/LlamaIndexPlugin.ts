import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth } from '../../registry/PluginInterface';
import { IndexEngine } from './IndexEngine';
import { QueryEngine } from './QueryEngine';
import { MemoryVectorStore } from './MemoryVectorStore';
import { IndexConfig } from './LlamaIndexInterface';
import { v4 as uuidv4 } from 'uuid';

/**
 * LlamaIndex Plugin - Main plugin for LlamaIndex framework integration
 */
@Injectable()
export class LlamaIndexPlugin extends BasePlugin {
  private readonly logger = new Logger(LlamaIndexPlugin.name);
  private indexes = new Map<string, { engine: IndexEngine; query: QueryEngine }>();

  constructor() {
    super({
      id: 'llamaindex-plugin',
      name: 'LlamaIndex',
      version: '1.0.0',
      category: PluginCategory.AI_MODELS,
      capabilities: ['indexing', 'retrieval', 'rag', 'vector-search'],
      dependencies: [],
      config: {}
    });
  }

  async init(): Promise<void> {
    await super.init();
    this.logger.log('LlamaIndex plugin initialized');
  }

  async start(): Promise<void> {
    await super.start();
    this.logger.log('LlamaIndex plugin started');
  }

  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('LlamaIndex plugin stopped');
  }

  async destroy(): Promise<void> {
    this.indexes.clear();
    await super.destroy();
    this.logger.log('LlamaIndex plugin destroyed');
  }

  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();

    return {
      ...baseHealth,
      metrics: {
        ...baseHealth.metrics,
        activeIndexes: this.indexes.size
      }
    };
  }

  /**
   * Create a new index
   */
  createIndex(config: Partial<IndexConfig>): { engine: IndexEngine; query: QueryEngine } {
    const indexConfig: IndexConfig = {
      id: config.id || uuidv4(),
      name: config.name || 'Unnamed Index',
      embeddingModel: config.embeddingModel || 'openai-ada-002',
      chunkSize: config.chunkSize || 512,
      chunkOverlap: config.chunkOverlap || 50,
      vectorStore: config.vectorStore || 'memory'
    };

    const vectorStore = new MemoryVectorStore();
    const engine = new IndexEngine(indexConfig, vectorStore);
    const query = new QueryEngine(engine);

    this.indexes.set(indexConfig.id, { engine, query });
    this.logger.log(`Index ${indexConfig.id} created`);

    return { engine, query };
  }

  /**
   * Get index by ID
   */
  getIndex(id: string): { engine: IndexEngine; query: QueryEngine } | undefined {
    return this.indexes.get(id);
  }

  /**
   * Get all indexes
   */
  getAllIndexes(): Array<{ id: string; engine: IndexEngine; query: QueryEngine }> {
    return Array.from(this.indexes.entries()).map(([id, index]) => ({
      id,
      ...index
    }));
  }

  /**
   * Delete index
   */
  async deleteIndex(id: string): Promise<void> {
    const index = this.indexes.get(id);
    if (index) {
      await index.engine.vectorStore.clear();
      this.indexes.delete(id);
      this.logger.log(`Index ${id} deleted`);
    }
  }
}
