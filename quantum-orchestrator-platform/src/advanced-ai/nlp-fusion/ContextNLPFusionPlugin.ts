import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../../registry/PluginInterface';
import { ContextNLPFusion } from './ContextNLPFusion';

/**
 * Context/NLP Fusion Plugin - Wrapper for ContextNLPFusion to integrate with Universal Plugin Registry
 */
@Injectable()
export class ContextNLPFusionPlugin extends BasePlugin {
  private readonly logger = new Logger(ContextNLPFusionPlugin.name);

  constructor(private readonly fusion: ContextNLPFusion) {
    super({
      id: 'nlp-fusion-plugin',
      name: 'Context/NLP Fusion Engine',
      version: '1.0.0',
      category: PluginCategory.PROCESSORS,
      capabilities: [
        'nlp-processing',
        'context-fusion',
        'named-entity-recognition',
        'keyword-extraction',
        'sentiment-analysis',
        'topic-modeling',
        'text-summarization',
        'multi-source-aggregation',
        'relevance-ranking',
        'token-management',
      ],
      dependencies: [],
      config: {
        maxContextSources: 100,
        maxTokens: 8000,
        defaultTokenLimit: 4000,
        nlpFeatures: [
          'entities',
          'keywords',
          'sentiment',
          'topics',
          'summary',
        ],
      },
    });
  }

  /**
   * Initialize the plugin
   */
  async init(): Promise<void> {
    await super.init();
    this.logger.log('Context/NLP Fusion plugin initialized');
  }

  /**
   * Start the plugin
   */
  async start(): Promise<void> {
    await super.start();
    this.logger.log('Context/NLP Fusion plugin started');
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('Context/NLP Fusion plugin stopped');
  }

  /**
   * Destroy and cleanup plugin resources
   */
  async destroy(): Promise<void> {
    await super.destroy();
    this.logger.log('Context/NLP Fusion plugin destroyed');
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();
    const stats = this.fusion.getStats();

    return {
      ...baseHealth,
      status: PluginHealthStatus.HEALTHY,
      message: `NLP Fusion: ${stats.totalContexts} context sources`,
      metrics: {
        ...baseHealth.metrics,
        totalContexts: stats.totalContexts,
        totalTokens: stats.totalTokens,
        avgWeight: stats.avgWeight,
      },
    };
  }

  /**
   * Get the underlying fusion instance
   */
  getFusion(): ContextNLPFusion {
    return this.fusion;
  }
}
