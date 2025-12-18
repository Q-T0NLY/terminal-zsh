import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServiceRegistry } from '../mesh/ServiceRegistry';
import { ServiceProtocol } from '../mesh/MeshInterface';
import { LangGraphPlugin } from '../frameworks/langgraph/LangGraphPlugin';
import { LlamaIndexPlugin } from '../frameworks/llamaindex/LlamaIndexPlugin';
import { CrewAIPlugin } from '../frameworks/crewai/CrewAIPlugin';
import { DAGRAGPlugin } from '../advanced-ai/dag-rag/DAGRAGPlugin';
import { PromptToolkitPlugin } from '../advanced-ai/prompt-toolkit/PromptToolkitPlugin';
import { ContextNLPFusionPlugin } from '../advanced-ai/nlp-fusion/ContextNLPFusionPlugin';
import { GuidancePlugin } from '../guidance/GuidancePlugin';

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
    // Guidance Plugin
    private readonly guidancePlugin: GuidancePlugin,
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
        description: 'Graph-based AI workflow orchestration service',
        endpoints: ['/graphs', '/graphs/:id', '/graphs/:id/execute', '/graphs/:id/state', '/graphs/:id/nodes', '/graphs/:id/edges'],
      },
      {
        plugin: this.llamaIndexPlugin,
        name: 'LlamaIndex Service',
        description: 'Document indexing and RAG service',
        endpoints: ['/indexes', '/indexes/:id', '/indexes/:id/documents', '/indexes/:id/query', '/indexes/:id/stats'],
      },
      {
        plugin: this.crewAIPlugin,
        name: 'CrewAI Service',
        description: 'Multi-agent collaboration service',
        endpoints: ['/agents', '/tasks', '/crews', '/crews/:id/execute', '/crews/:id/status'],
      },
      // Advanced AI Services
      {
        plugin: this.dagRAGPlugin,
        name: 'DAG/RAG++ Service',
        description: 'Directed Acyclic Graph Retrieval-Augmented Generation service',
        endpoints: ['/rag/index', '/rag/generate', '/rag/dag', '/rag/search', '/rag/fuse', '/rag/stats'],
      },
      {
        plugin: this.promptToolkitPlugin,
        name: 'Prompt Toolkit Service',
        description: 'Advanced prompt engineering and optimization service',
        endpoints: ['/prompts/templates', '/prompts/render', '/prompts/optimize', '/prompts/chain', '/prompts/few-shot', '/prompts/search'],
      },
      {
        plugin: this.nlpFusionPlugin,
        name: 'NLP Fusion Service',
        description: 'Context fusion and NLP processing service',
        endpoints: ['/nlp/context', '/nlp/features', '/nlp/fuse', '/nlp/stats'],
      },
      // Guidance Service
      {
        plugin: this.guidancePlugin,
        name: 'Full Stack Guidance Service',
        description: 'xAI-powered intelligent assistance for navigation, configuration, and operations',
        endpoints: ['/guidance', '/guidance/recommendations', '/guidance/config-recommendations', '/guidance/history/:userId', '/guidance/stats'],
      },
    ];

    let registeredCount = 0;
    let failedCount = 0;

    for (const { plugin, name, description, endpoints } of services) {
      try {
        const serviceId = await this.serviceRegistry.register({
          name,
          version: plugin.version,
          description,
          protocol: ServiceProtocol.HTTP,
          host: 'localhost',
          port: 3000,
          endpoints,
          dependencies: plugin.dependencies,
          rateLimit: 100, // 100 requests per minute
        });

        this.logger.log(`✅ ${name} registered as service: ${serviceId.id}`);
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
