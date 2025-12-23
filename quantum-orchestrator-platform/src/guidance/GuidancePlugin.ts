import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../registry/PluginInterface';
import { GuidanceEngine } from './GuidanceEngine';

/**
 * Full Stack Guidance Plugin
 * xAI-powered intelligent assistance for system navigation, configuration, and operations
 */
@Injectable()
export class GuidancePlugin extends BasePlugin {
  private readonly logger = new Logger(GuidancePlugin.name);

  constructor(private readonly engine: GuidanceEngine) {
    super({
      id: 'guidance-plugin',
      name: 'Full Stack Guidance System',
      version: '1.0.0',
      category: PluginCategory.TOOLS,
      capabilities: [
        'intelligent-prompting',
        'navigation-assistance',
        'configuration-help',
        'troubleshooting-support',
        'automated-recommendations',
        'learning-tutorials',
        'context-aware-guidance',
        'xai-powered',
      ],
      dependencies: [],
      config: {
        xaiEnabled: !!process.env.XAI_API_KEY,
        fallbackEnabled: true,
        maxConversationHistory: 20,
        confidenceThreshold: 0.7,
      },
    });
  }

  /**
   * Initialize the plugin
   */
  async init(): Promise<void> {
    await super.init();
    this.logger.log('Full Stack Guidance plugin initialized');
    this.logger.log(`xAI ${this.config.xaiEnabled ? 'enabled' : 'disabled (using fallback)'}`);
  }

  /**
   * Start the plugin
   */
  async start(): Promise<void> {
    await super.start();
    this.logger.log('Full Stack Guidance plugin started and ready');
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('Full Stack Guidance plugin stopped');
  }

  /**
   * Destroy and cleanup plugin resources
   */
  async destroy(): Promise<void> {
    await super.destroy();
    this.logger.log('Full Stack Guidance plugin destroyed');
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
      message: `Guidance System: ${stats.totalConversations} conversations, ${stats.knowledgeBaseSize} plugins in knowledge base`,
      metrics: {
        ...baseHealth.metrics,
        totalConversations: stats.totalConversations,
        knowledgeBaseSize: stats.knowledgeBaseSize,
        xaiConfigured: stats.xaiConfigured,
      },
    };
  }

  /**
   * Get the underlying engine instance
   */
  getEngine(): GuidanceEngine {
    return this.engine;
  }
}
