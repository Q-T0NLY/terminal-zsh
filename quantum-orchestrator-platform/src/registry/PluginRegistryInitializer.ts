import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UniversalRegistry } from '../registry/UniversalRegistry';
import { LangGraphPlugin } from '../frameworks/langgraph/LangGraphPlugin';
import { LlamaIndexPlugin } from '../frameworks/llamaindex/LlamaIndexPlugin';
import { CrewAIPlugin } from '../frameworks/crewai/CrewAIPlugin';
import { DAGRAGPlugin } from '../advanced-ai/dag-rag/DAGRAGPlugin';
import { PromptToolkitPlugin } from '../advanced-ai/prompt-toolkit/PromptToolkitPlugin';
import { ContextNLPFusionPlugin } from '../advanced-ai/nlp-fusion/ContextNLPFusionPlugin';
import { IPlugin } from './PluginInterface';

interface PluginInfo {
  plugin: IPlugin;
  name: string;
}

/**
 * Plugin Registry Initializer - Automatically registers all plugins on application startup
 */
@Injectable()
export class PluginRegistryInitializer implements OnModuleInit {
  private readonly logger = new Logger(PluginRegistryInitializer.name);

  constructor(
    private readonly registry: UniversalRegistry,
    // AI Framework Plugins
    private readonly langGraphPlugin: LangGraphPlugin,
    private readonly llamaIndexPlugin: LlamaIndexPlugin,
    private readonly crewAIPlugin: CrewAIPlugin,
    // Advanced AI Plugins
    private readonly dagRAGPlugin: DAGRAGPlugin,
    private readonly promptToolkitPlugin: PromptToolkitPlugin,
    private readonly nlpFusionPlugin: ContextNLPFusionPlugin,
  ) {}

  /**
   * Get all available plugins
   */
  private getPlugins(): PluginInfo[] {
    return [
      // AI Framework Plugins
      { plugin: this.langGraphPlugin, name: 'LangGraph' },
      { plugin: this.llamaIndexPlugin, name: 'LlamaIndex' },
      { plugin: this.crewAIPlugin, name: 'CrewAI' },
      // Advanced AI System Plugins
      { plugin: this.dagRAGPlugin, name: 'DAG/RAG++' },
      { plugin: this.promptToolkitPlugin, name: 'Prompt Toolkit' },
      { plugin: this.nlpFusionPlugin, name: 'NLP Fusion' },
    ];
  }

  /**
   * Initialize all plugins when the module starts
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Universal Plugin Registry with all available plugins...');

    const plugins = this.getPlugins();
    let registeredCount = 0;
    let failedCount = 0;

    for (const { plugin, name } of plugins) {
      try {
        await this.registry.registerPlugin(
          {
            id: plugin.id,
            name: plugin.name,
            version: plugin.version,
            category: plugin.category,
            capabilities: plugin.capabilities,
            dependencies: plugin.dependencies,
            config: plugin.config,
          },
          plugin
        );

        this.logger.log(`✅ ${name} plugin registered successfully`);
        registeredCount++;
      } catch (error) {
        // If plugin already exists, that's okay - just log it
        if (error.status === 409) {
          this.logger.debug(`${name} plugin already registered, skipping...`);
          registeredCount++;
        } else {
          this.logger.error(`❌ Failed to register ${name} plugin:`, error.message);
          failedCount++;
        }
      }
    }

    this.logger.log(
      `Plugin registration complete: ${registeredCount} successful, ${failedCount} failed`
    );

    // Start all registered plugins
    await this.startAllPlugins();
  }

  /**
   * Start all registered plugins
   */
  private async startAllPlugins(): Promise<void> {
    this.logger.log('Starting all registered plugins...');

    const plugins = this.getPlugins();
    let startedCount = 0;
    let failedCount = 0;

    for (const { plugin, name } of plugins) {
      try {
        await plugin.init();
        await plugin.start();
        this.logger.log(`✅ ${name} plugin started`);
        startedCount++;
      } catch (error) {
        this.logger.error(`❌ Failed to start ${name} plugin:`, error.message);
        failedCount++;
      }
    }

    this.logger.log(
      `Plugin startup complete: ${startedCount} started successfully, ${failedCount} failed`
    );
  }
}
