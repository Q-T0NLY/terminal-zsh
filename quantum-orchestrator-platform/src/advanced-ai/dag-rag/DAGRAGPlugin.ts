import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../../registry/PluginInterface';
import { DAGRAGEngine } from './DAGRAGEngine';

/**
 * DAG/RAG++ Plugin - Wrapper for DAGRAGEngine to integrate with Universal Plugin Registry
 */
@Injectable()
export class DAGRAGPlugin extends BasePlugin {
  private readonly logger = new Logger(DAGRAGPlugin.name);

  constructor(private readonly engine: DAGRAGEngine) {
    super({
      id: 'dag-rag-plugin',
      name: 'DAG/RAG++ Engine',
      version: '1.0.0',
      category: PluginCategory.AI_MODELS,
      capabilities: [
        'rag',
        'dag-construction',
        'multi-strategy-search',
        'semantic-search',
        'keyword-search',
        'hybrid-search',
        'structured-search',
        'result-fusion',
        'query-decomposition',
        'embedding-generation',
      ],
      dependencies: [],
      config: {
        maxDocuments: 10000,
        cacheEnabled: true,
        fusionStrategies: ['linear', 'reciprocal_rank_fusion', 'weighted', 'neural'],
      },
    });
  }

  /**
   * Initialize the plugin
   */
  async init(): Promise<void> {
    await super.init();
    this.logger.log('DAG/RAG++ plugin initialized');
  }

  /**
   * Start the plugin
   */
  async start(): Promise<void> {
    await super.start();
    this.logger.log('DAG/RAG++ plugin started');
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('DAG/RAG++ plugin stopped');
  }

  /**
   * Destroy and cleanup plugin resources
   */
  async destroy(): Promise<void> {
    await super.destroy();
    this.logger.log('DAG/RAG++ plugin destroyed');
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();
    const stats = this.engine.getStats();

    return {
      ...baseHealth,
      status: PluginHealthStatus.HEALTHY,
      message: `DAG/RAG++ Engine: ${stats.documentsIndexed} documents indexed`,
      metrics: {
        ...baseHealth.metrics,
        documentsIndexed: stats.documentsIndexed,
        cacheSize: stats.cacheSize,
      },
    };
  }

  /**
   * Get the underlying engine instance
   */
  getEngine(): DAGRAGEngine {
    return this.engine;
  }
}
