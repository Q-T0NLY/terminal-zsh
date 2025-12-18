import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServiceRegistry } from '../mesh/ServiceRegistry';
import { LangGraphPlugin } from '../frameworks/langgraph/LangGraphPlugin';
import { LlamaIndexPlugin } from '../frameworks/llamaindex/LlamaIndexPlugin';
import { CrewAIPlugin } from '../frameworks/crewai/CrewAIPlugin';
import { DAGRAGPlugin } from '../advanced-ai/dag-rag/DAGRAGPlugin';
import { PromptToolkitPlugin } from '../advanced-ai/prompt-toolkit/PromptToolkitPlugin';
import { ContextNLPFusionPlugin } from '../advanced-ai/nlp-fusion/ContextNLPFusionPlugin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service Mesh Initializer - Automatically registers all plugins as services on application startup
 */
@Injectable()
export class ServiceMeshInitializer implements OnModuleInit {
  private readonly logger = new Logger(ServiceMeshInitializer.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistry,
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
   * Initialize all services when the module starts
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Service Mesh with all available services...');

    const services = [
      // AI Framework Services
      {
        plugin: this.langGraphPlugin,
        name: 'LangGraph Service',
        endpoint: '/api/frameworks/langgraph',
        description: 'Graph-based AI workflow orchestration service',
      },
      {
        plugin: this.llamaIndexPlugin,
        name: 'LlamaIndex Service',
        endpoint: '/api/frameworks/llamaindex',
        description: 'Document indexing and RAG service',
      },
      {
        plugin: this.crewAIPlugin,
        name: 'CrewAI Service',
        endpoint: '/api/frameworks/crewai',
        description: 'Multi-agent collaboration service',
      },
      // Advanced AI Services
      {
        plugin: this.dagRAGPlugin,
        name: 'DAG/RAG++ Service',
        endpoint: '/api/advanced-ai/rag',
        description: 'Directed Acyclic Graph Retrieval-Augmented Generation service',
      },
      {
        plugin: this.promptToolkitPlugin,
        name: 'Prompt Toolkit Service',
        endpoint: '/api/advanced-ai/prompts',
        description: 'Advanced prompt engineering and optimization service',
      },
      {
        plugin: this.nlpFusionPlugin,
        name: 'NLP Fusion Service',
        endpoint: '/api/advanced-ai/nlp',
        description: 'Context fusion and NLP processing service',
      },
    ];

    let registeredCount = 0;
    let failedCount = 0;

    for (const { plugin, name, endpoint, description } of services) {
      try {
        const serviceId = await this.serviceRegistry.registerService({
          id: uuidv4(),
          name,
          version: plugin.version,
          endpoint,
          healthEndpoint: `${endpoint}/health`,
          metadata: {
            pluginId: plugin.id,
            category: plugin.category,
            capabilities: plugin.capabilities,
            description,
          },
          rateLimit: {
            maxRequests: 100,
            windowMs: 60000, // 1 minute
          },
        });

        this.logger.log(`✅ ${name} registered as service: ${serviceId}`);
        registeredCount++;
      } catch (error) {
        this.logger.error(`❌ Failed to register ${name} as service:`, error.message);
        failedCount++;
      }
    }

    this.logger.log(
      `Service registration complete: ${registeredCount} successful, ${failedCount} failed`
    );
  }
}
