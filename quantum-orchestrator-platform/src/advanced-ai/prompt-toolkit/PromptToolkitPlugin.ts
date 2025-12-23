import { Injectable, Logger } from '@nestjs/common';
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../../registry/PluginInterface';
import { PromptToolkit } from './PromptToolkit';

/**
 * Prompt Toolkit Plugin - Wrapper for PromptToolkit to integrate with Universal Plugin Registry
 */
@Injectable()
export class PromptToolkitPlugin extends BasePlugin {
  private readonly logger = new Logger(PromptToolkitPlugin.name);

  constructor(private readonly toolkit: PromptToolkit) {
    super({
      id: 'prompt-toolkit-plugin',
      name: 'Advanced Prompt Toolkit',
      version: '1.0.0',
      category: PluginCategory.AI_MODELS,
      capabilities: [
        'prompt-engineering',
        'template-management',
        'prompt-optimization',
        'quality-analysis',
        'prompt-chaining',
        'few-shot-generation',
        'variable-substitution',
        'template-search',
      ],
      dependencies: [],
      config: {
        maxTemplates: 1000,
        optimizationEnabled: true,
        qualityMetrics: ['clarity', 'specificity', 'context', 'instructions'],
        prebuiltTemplates: [
          'code-explanation',
          'code-refactoring',
          'bug-fix',
          'test-generation',
          'creative-writing',
          'data-analysis',
          'chat-assistant',
          'structured-output',
        ],
      },
    });
  }

  /**
   * Initialize the plugin
   */
  async init(): Promise<void> {
    await super.init();
    this.logger.log('Prompt Toolkit plugin initialized');
  }

  /**
   * Start the plugin
   */
  async start(): Promise<void> {
    await super.start();
    this.logger.log('Prompt Toolkit plugin started');
  }

  /**
   * Stop the plugin
   */
  async stop(): Promise<void> {
    await super.stop();
    this.logger.log('Prompt Toolkit plugin stopped');
  }

  /**
   * Destroy and cleanup plugin resources
   */
  async destroy(): Promise<void> {
    await super.destroy();
    this.logger.log('Prompt Toolkit plugin destroyed');
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();
    const stats = this.toolkit.getStats();

    return {
      ...baseHealth,
      status: PluginHealthStatus.HEALTHY,
      message: `Prompt Toolkit: ${stats.totalTemplates} templates available`,
      metrics: {
        ...baseHealth.metrics,
        totalTemplates: stats.totalTemplates,
        categoryCounts: stats.categoryCounts,
        tagCounts: stats.tagCounts,
      },
    };
  }

  /**
   * Get the underlying toolkit instance
   */
  getToolkit(): PromptToolkit {
    return this.toolkit;
  }
}
