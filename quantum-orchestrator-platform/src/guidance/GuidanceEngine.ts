/**
 * Full Stack Guidance Engine
 * Powered by xAI to provide intelligent assistance for system navigation,
 * configuration, operation, and setup with automated recommendations
 */

import { Injectable, Logger } from '@nestjs/common';

export interface GuidanceContext {
  userId?: string;
  currentSection?: string;
  currentPlugin?: string;
  currentService?: string;
  userRole?: 'developer' | 'admin' | 'operator' | 'user';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  systemState?: {
    registeredPlugins?: number;
    activeServices?: number;
    systemHealth?: string;
  };
  userHistory?: {
    lastActions?: string[];
    preferences?: Record<string, any>;
  };
}

export interface GuidanceRequest {
  query: string;
  context?: GuidanceContext;
  intent?: 'navigation' | 'configuration' | 'troubleshooting' | 'learning' | 'automation';
}

export interface GuidanceResponse {
  type: 'suggestion' | 'instruction' | 'automation' | 'warning' | 'info';
  title: string;
  message: string;
  actions?: GuidanceAction[];
  links?: GuidanceLink[];
  code?: CodeExample[];
  automations?: AutomationTask[];
  relatedTopics?: string[];
  confidence: number;
  timestamp: Date;
}

export interface GuidanceAction {
  id: string;
  label: string;
  description: string;
  endpoint?: string;
  method?: string;
  payload?: any;
  automated?: boolean;
}

export interface GuidanceLink {
  title: string;
  url: string;
  type: 'docs' | 'api' | 'example' | 'tutorial';
}

export interface CodeExample {
  language: string;
  code: string;
  description: string;
  executable?: boolean;
}

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  steps: AutomationStep[];
  estimatedTime?: string;
  dependencies?: string[];
}

export interface AutomationStep {
  order: number;
  action: string;
  endpoint?: string;
  params?: any;
  validation?: string;
}

export interface SystemKnowledge {
  plugins: PluginKnowledge[];
  workflows: WorkflowKnowledge[];
  bestPractices: BestPractice[];
  commonIssues: CommonIssue[];
}

export interface PluginKnowledge {
  id: string;
  name: string;
  category: string;
  capabilities: string[];
  useCases: string[];
  examples: string[];
}

export interface WorkflowKnowledge {
  id: string;
  name: string;
  description: string;
  steps: string[];
  plugins: string[];
}

export interface BestPractice {
  id: string;
  category: string;
  title: string;
  description: string;
  dos: string[];
  donts: string[];
}

export interface CommonIssue {
  id: string;
  symptom: string;
  causes: string[];
  solutions: string[];
  prevention: string[];
}

@Injectable()
export class GuidanceEngine {
  private readonly logger = new Logger(GuidanceEngine.name);
  private knowledgeBase: SystemKnowledge;
  private xaiApiKey: string;
  private xaiBaseUrl = 'https://api.x.ai/v1';
  private conversationHistory: Map<string, Array<{ role: string; content: string }>> = new Map();

  constructor() {
    this.xaiApiKey = process.env.XAI_API_KEY || '';
    this.initializeKnowledgeBase();
  }

  /**
   * Initialize the knowledge base with system information
   */
  private initializeKnowledgeBase(): void {
    this.knowledgeBase = {
      plugins: [
        {
          id: 'langgraph-plugin',
          name: 'LangGraph',
          category: 'AI_MODELS',
          capabilities: ['workflow', 'graph', 'state-management', 'agent'],
          useCases: [
            'Building AI agent workflows',
            'Creating RAG pipelines',
            'Implementing conditional logic flows',
            'Multi-agent orchestration',
            'Parallel task execution',
          ],
          examples: [
            'Creating a simple agent workflow',
            'Building a RAG pipeline with document retrieval',
            'Implementing conditional branching',
          ],
        },
        {
          id: 'llamaindex-plugin',
          name: 'LlamaIndex',
          category: 'AI_MODELS',
          capabilities: ['indexing', 'retrieval', 'rag', 'vector-search'],
          useCases: [
            'Indexing and searching documents',
            'Building RAG applications',
            'Semantic search implementation',
            'Knowledge base creation',
          ],
          examples: ['Document indexing example', 'RAG query example'],
        },
        {
          id: 'crewai-plugin',
          name: 'CrewAI',
          category: 'AI_MODELS',
          capabilities: ['agents', 'tasks', 'collaboration', 'roles'],
          useCases: [
            'Multi-agent collaboration',
            'Task delegation and orchestration',
            'Role-based AI systems',
          ],
          examples: ['Multi-agent research team', 'Content creation crew'],
        },
        {
          id: 'dag-rag-plugin',
          name: 'DAG/RAG++',
          category: 'AI_MODELS',
          capabilities: [
            'rag',
            'dag-construction',
            'multi-strategy-search',
            'semantic-search',
            'keyword-search',
            'hybrid-search',
          ],
          useCases: [
            'Advanced RAG with query decomposition',
            'Multi-strategy document retrieval',
            'Complex query answering',
          ],
          examples: ['DAG-based RAG pipeline', 'Multi-strategy search'],
        },
        {
          id: 'prompt-toolkit-plugin',
          name: 'Prompt Toolkit',
          category: 'AI_MODELS',
          capabilities: [
            'prompt-engineering',
            'template-management',
            'prompt-optimization',
            'quality-analysis',
          ],
          useCases: [
            'Prompt engineering and optimization',
            'Template management',
            'Quality analysis of prompts',
          ],
          examples: ['Prompt optimization', 'Template rendering'],
        },
        {
          id: 'nlp-fusion-plugin',
          name: 'NLP Fusion',
          category: 'PROCESSORS',
          capabilities: [
            'nlp-processing',
            'context-fusion',
            'named-entity-recognition',
            'sentiment-analysis',
          ],
          useCases: [
            'Text analysis and NLP processing',
            'Multi-source context fusion',
            'Named entity recognition',
          ],
          examples: ['Text analysis', 'Context fusion'],
        },
      ],
      workflows: [
        {
          id: 'setup-rag-pipeline',
          name: 'Set Up RAG Pipeline',
          description: 'Complete workflow for setting up a Retrieval-Augmented Generation pipeline',
          steps: [
            '1. Create a new LlamaIndex index',
            '2. Upload and index documents',
            '3. Configure LangGraph workflow',
            '4. Connect index to workflow',
            '5. Test the pipeline',
          ],
          plugins: ['llamaindex-plugin', 'langgraph-plugin'],
        },
        {
          id: 'configure-multi-agent',
          name: 'Configure Multi-Agent System',
          description: 'Set up a multi-agent collaboration system',
          steps: [
            '1. Define agent roles',
            '2. Create tasks for each agent',
            '3. Configure collaboration mode',
            '4. Set up agent tools',
            '5. Test agent interactions',
          ],
          plugins: ['crewai-plugin'],
        },
      ],
      bestPractices: [
        {
          id: 'plugin-security',
          category: 'Security',
          title: 'Plugin Security Best Practices',
          description: 'Follow these practices to ensure plugin security',
          dos: [
            'Enable plugin sandboxing',
            'Set resource limits (CPU, memory)',
            'Validate plugin checksums',
            'Review plugin permissions',
            'Use API key authentication',
          ],
          donts: [
            "Don't disable security features",
            "Don't run untrusted plugins without sandboxing",
            "Don't expose sensitive credentials in plugin configs",
          ],
        },
        {
          id: 'performance-optimization',
          category: 'Performance',
          title: 'Performance Optimization',
          description: 'Optimize system performance',
          dos: [
            'Enable caching for frequently accessed data',
            'Use appropriate chunk sizes for document indexing',
            'Set reasonable rate limits',
            'Monitor plugin health regularly',
          ],
          donts: [
            "Don't index very large documents without chunking",
            "Don't disable circuit breakers",
          ],
        },
      ],
      commonIssues: [
        {
          id: 'plugin-not-starting',
          symptom: 'Plugin fails to start',
          causes: [
            'Missing dependencies',
            'Configuration errors',
            'Insufficient resources',
            'Port conflicts',
          ],
          solutions: [
            'Check plugin dependencies are registered',
            'Validate configuration against schema',
            'Increase resource limits',
            'Check for port availability',
          ],
          prevention: [
            'Always validate configuration before registration',
            'Register dependencies before dependent plugins',
          ],
        },
      ],
    };
  }

  /**
   * Process a guidance request using xAI
   */
  async getGuidance(request: GuidanceRequest): Promise<GuidanceResponse> {
    this.logger.log(`Processing guidance request: ${request.query}`);

    try {
      if (!this.xaiApiKey) {
        this.logger.warn('XAI_API_KEY not configured, using fallback guidance');
        return this.getFallbackGuidance(request);
      }

      // Build context for xAI
      const systemPrompt = this.buildSystemPrompt(request.context);
      const userMessage = this.buildUserMessage(request);

      // Get or create conversation history
      const userId = request.context?.userId || 'anonymous';
      if (!this.conversationHistory.has(userId)) {
        this.conversationHistory.set(userId, []);
      }
      const history = this.conversationHistory.get(userId)!;

      // Add user message to history
      history.push({ role: 'user', content: userMessage });

      // Keep only last 10 exchanges
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      // Call xAI API
      const xaiResponse = await this.callXAI(systemPrompt, history);

      // Add assistant response to history
      history.push({ role: 'assistant', content: xaiResponse });

      // Parse and structure the response
      const guidanceResponse = this.parseXAIResponse(xaiResponse, request);

      return guidanceResponse;
    } catch (error: any) {
      this.logger.error(`Error processing guidance request: ${error.message}`);

      // Fallback to rule-based guidance
      return this.getFallbackGuidance(request);
    }
  }

  /**
   * Build system prompt with knowledge base
   */
  private buildSystemPrompt(context?: GuidanceContext): string {
    return `You are an intelligent Full Stack Guidance System for an Enterprise AI Development Platform.

Your role is to help users navigate, configure, operate, and set up the system with intelligent recommendations and automations.

**System Components:**
- Universal Plugin Registry: Manages 6 AI plugins (LangGraph, LlamaIndex, CrewAI, DAG/RAG++, Prompt Toolkit, NLP Fusion)
- Service Mesh: Handles service discovery, load balancing, and circuit breaking
- AI Framework Integrations: LangGraph, LlamaIndex, CrewAI
- Advanced AI Systems: DAG/RAG++, Prompt Toolkit, NLP Fusion

**Available Plugins:**
${this.knowledgeBase.plugins.map(p => `- ${p.name} (${p.id}): ${p.capabilities.join(', ')}`).join('\n')}

**Common Workflows:**
${this.knowledgeBase.workflows.map(w => `- ${w.name}: ${w.description}`).join('\n')}

**User Context:**
${context ? JSON.stringify(context, null, 2) : 'No context provided'}

**Your Capabilities:**
1. Navigation: Guide users to the right features and APIs
2. Configuration: Help configure plugins and services with optimal settings
3. Troubleshooting: Diagnose and resolve issues
4. Learning: Explain concepts and provide tutorials
5. Automation: Suggest and create automation tasks

**Response Format:**
Provide clear, actionable guidance with:
- Step-by-step instructions
- Code examples when relevant
- API endpoints to use
- Configuration recommendations
- Potential automation opportunities
- Related documentation links

Be concise, practical, and developer-friendly.`;
  }

  /**
   * Build user message with context
   */
  private buildUserMessage(request: GuidanceRequest): string {
    let message = request.query;

    if (request.intent) {
      message = `[Intent: ${request.intent}] ${message}`;
    }

    if (request.context?.currentPlugin) {
      message += `\n\nCurrent Plugin: ${request.context.currentPlugin}`;
    }

    if (request.context?.experienceLevel) {
      message += `\n\nExperience Level: ${request.context.experienceLevel}`;
    }

    return message;
  }

  /**
   * Call xAI API
   */
  private async callXAI(
    systemPrompt: string,
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const response = await fetch(`${this.xaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.xaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`XAI API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse xAI response into structured guidance
   */
  private parseXAIResponse(xaiResponse: string, request: GuidanceRequest): GuidanceResponse {
    // Extract different sections from the response
    const actions = this.extractActions(xaiResponse);
    const code = this.extractCode(xaiResponse);
    const links = this.extractLinks(xaiResponse);

    // Determine response type
    let type: GuidanceResponse['type'] = 'suggestion';
    if (xaiResponse.toLowerCase().includes('warning') || xaiResponse.toLowerCase().includes('caution')) {
      type = 'warning';
    } else if (xaiResponse.toLowerCase().includes('automat')) {
      type = 'automation';
    } else if (xaiResponse.toLowerCase().includes('step') || xaiResponse.toLowerCase().includes('how to')) {
      type = 'instruction';
    }

    return {
      type,
      title: this.extractTitle(xaiResponse, request.query),
      message: xaiResponse,
      actions,
      links,
      code,
      automations: this.extractAutomations(xaiResponse),
      relatedTopics: this.extractRelatedTopics(xaiResponse),
      confidence: 0.85,
      timestamp: new Date(),
    };
  }

  /**
   * Extract actions from response
   */
  private extractActions(response: string): GuidanceAction[] {
    const actions: GuidanceAction[] = [];
    
    // Simple pattern matching for API calls
    const apiPattern = /(GET|POST|PUT|DELETE)\s+(\/api\/[^\s]+)/gi;
    let match;
    let actionId = 1;

    while ((match = apiPattern.exec(response)) !== null) {
      actions.push({
        id: `action-${actionId++}`,
        label: `${match[1]} ${match[2]}`,
        description: `Call ${match[1]} endpoint`,
        endpoint: match[2],
        method: match[1],
        automated: false,
      });
    }

    return actions;
  }

  /**
   * Extract code examples from response
   */
  private extractCode(response: string): CodeExample[] {
    const code: CodeExample[] = [];
    const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockPattern.exec(response)) !== null) {
      code.push({
        language: match[1] || 'text',
        code: match[2].trim(),
        description: 'Code example',
        executable: match[1] === 'bash' || match[1] === 'javascript' || match[1] === 'typescript',
      });
    }

    return code;
  }

  /**
   * Extract links from response
   */
  private extractLinks(response: string): GuidanceLink[] {
    const links: GuidanceLink[] = [];
    
    // Look for /api/ paths as documentation links
    const apiPaths = response.match(/\/api\/[\w\-\/]+/g) || [];
    apiPaths.forEach((path) => {
      links.push({
        title: `API: ${path}`,
        url: path,
        type: 'api',
      });
    });

    return links;
  }

  /**
   * Extract automation tasks from response
   */
  private extractAutomations(response: string): AutomationTask[] {
    const automations: AutomationTask[] = [];
    
    // Look for numbered steps that could be automated
    const stepsPattern = /\d+\.\s+(.+?)(?=\n\d+\.|\n\n|$)/gs;
    const matches = response.match(stepsPattern);

    if (matches && matches.length > 2) {
      const steps: AutomationStep[] = matches.map((step, index) => ({
        order: index + 1,
        action: step.trim(),
      }));

      automations.push({
        id: 'auto-1',
        name: 'Automated Workflow',
        description: 'Execute all steps automatically',
        steps,
        estimatedTime: `${steps.length * 2}s`,
      });
    }

    return automations;
  }

  /**
   * Extract related topics
   */
  private extractRelatedTopics(response: string): string[] {
    const topics: string[] = [];
    
    // Extract plugin names mentioned
    this.knowledgeBase.plugins.forEach((plugin) => {
      if (response.includes(plugin.name) || response.includes(plugin.id)) {
        topics.push(plugin.name);
      }
    });

    return [...new Set(topics)];
  }

  /**
   * Extract or generate title
   */
  private extractTitle(response: string, query: string): string {
    // Look for a title in the first line
    const firstLine = response.split('\n')[0];
    if (firstLine.length < 100) {
      return firstLine.replace(/^[#*\s]+/, '').trim();
    }

    // Generate from query
    return query.length > 50 ? query.substring(0, 50) + '...' : query;
  }

  /**
   * Fallback guidance when xAI is not available
   */
  private getFallbackGuidance(request: GuidanceRequest): GuidanceResponse {
    const query = request.query.toLowerCase();

    // Simple keyword matching
    if (query.includes('setup') || query.includes('configure') || query.includes('start')) {
      return this.getSetupGuidance(request);
    } else if (query.includes('plugin')) {
      return this.getPluginGuidance(request);
    } else if (query.includes('service') || query.includes('mesh')) {
      return this.getServiceGuidance(request);
    } else if (query.includes('error') || query.includes('issue') || query.includes('problem')) {
      return this.getTroubleshootingGuidance(request);
    } else {
      return this.getGeneralGuidance(request);
    }
  }

  /**
   * Get setup guidance
   */
  private getSetupGuidance(request: GuidanceRequest): GuidanceResponse {
    return {
      type: 'instruction',
      title: 'System Setup Guide',
      message: `**Welcome to the Enterprise AI Development Platform!**

Here's how to get started:

1. **Check Registered Plugins**: GET /api/registry/plugins
2. **View Available Services**: GET /api/mesh/services
3. **Check System Health**: GET /api/registry/plugins/:id/health

**Quick Start Workflows:**

**Set up RAG Pipeline:**
1. Create LlamaIndex index: POST /api/frameworks/llamaindex/indexes
2. Upload documents: POST /api/frameworks/llamaindex/indexes/:id/documents
3. Create LangGraph workflow: POST /api/frameworks/langgraph/graphs
4. Query your data: POST /api/frameworks/llamaindex/indexes/:id/query

**Configure Multi-Agent System:**
1. Create agents: POST /api/frameworks/crewai/agents
2. Define tasks: POST /api/frameworks/crewai/tasks
3. Create crew: POST /api/frameworks/crewai/crews
4. Execute: POST /api/frameworks/crewai/crews/:id/execute

All 6 AI plugins are pre-registered and ready to use!`,
      actions: [
        {
          id: 'check-plugins',
          label: 'Check Registered Plugins',
          description: 'View all registered plugins',
          endpoint: '/api/registry/plugins',
          method: 'GET',
        },
        {
          id: 'check-services',
          label: 'Check Services',
          description: 'View all services in mesh',
          endpoint: '/api/mesh/services',
          method: 'GET',
        },
      ],
      links: [
        {
          title: 'Universal Registry Guide',
          url: '/docs/UNIVERSAL_REGISTRY.md',
          type: 'docs',
        },
        {
          title: 'AI Frameworks Guide',
          url: '/docs/AI_FRAMEWORKS.md',
          type: 'docs',
        },
      ],
      confidence: 0.9,
      timestamp: new Date(),
    };
  }

  /**
   * Get plugin guidance
   */
  private getPluginGuidance(request: GuidanceRequest): GuidanceResponse {
    return {
      type: 'info',
      title: 'Plugin System Overview',
      message: `**Available Plugins:**

1. **LangGraph** - Workflow orchestration with state management
2. **LlamaIndex** - Document indexing and RAG
3. **CrewAI** - Multi-agent collaboration
4. **DAG/RAG++** - Advanced RAG with query decomposition
5. **Prompt Toolkit** - Prompt engineering and optimization
6. **NLP Fusion** - Multi-source context and NLP processing

**Plugin Operations:**

- List all plugins: GET /api/registry/plugins
- Get plugin details: GET /api/registry/plugins/:id
- Check health: GET /api/registry/plugins/:id/health
- Enable plugin: POST /api/registry/plugins/:id/enable
- Disable plugin: POST /api/registry/plugins/:id/disable

All plugins are automatically registered and started on application launch.`,
      actions: [
        {
          id: 'list-plugins',
          label: 'List All Plugins',
          description: 'Get all registered plugins',
          endpoint: '/api/registry/plugins',
          method: 'GET',
        },
      ],
      confidence: 0.95,
      timestamp: new Date(),
    };
  }

  /**
   * Get service guidance
   */
  private getServiceGuidance(request: GuidanceRequest): GuidanceResponse {
    return {
      type: 'info',
      title: 'Service Mesh Overview',
      message: `**Service Mesh Features:**

- Service discovery with health monitoring
- Load balancing (round-robin, random, least-connections)
- Circuit breaker pattern (5-failure threshold, 30s reset)
- Rate limiting (100 req/min per service, configurable)
- Request routing with <1ms overhead

**Service Operations:**

- List services: GET /api/mesh/services
- Get service details: GET /api/mesh/services/:id
- Check health: GET /api/mesh/services/:id/health
- Invoke service: POST /api/mesh/services/:id/invoke
- View topology: GET /api/mesh/topology
- Get metrics: GET /api/mesh/metrics

All 6 AI systems are registered as services in the mesh.`,
      actions: [
        {
          id: 'list-services',
          label: 'List All Services',
          description: 'Get all registered services',
          endpoint: '/api/mesh/services',
          method: 'GET',
        },
        {
          id: 'view-topology',
          label: 'View Topology',
          description: 'See service mesh topology',
          endpoint: '/api/mesh/topology',
          method: 'GET',
        },
      ],
      confidence: 0.95,
      timestamp: new Date(),
    };
  }

  /**
   * Get troubleshooting guidance
   */
  private getTroubleshootingGuidance(request: GuidanceRequest): GuidanceResponse {
    return {
      type: 'suggestion',
      title: 'Troubleshooting Guide',
      message: `**Common Issues and Solutions:**

**Plugin Not Starting:**
- Check dependencies: GET /api/registry/plugins/:id
- Verify configuration is valid
- Check resource limits (CPU: 80%, Memory: 512MB)
- Review logs for error messages

**Service Unavailable:**
- Check circuit breaker status
- Verify rate limits aren't exceeded
- Check service health: GET /api/mesh/services/:id/health
- Review mesh topology for issues

**Performance Issues:**
- Enable caching for frequently accessed data
- Adjust chunk sizes for document indexing
- Monitor plugin health metrics
- Check rate limit configurations

**Diagnostic Commands:**
- Plugin health: GET /api/registry/plugins/:id/health
- Service metrics: GET /api/mesh/metrics
- System logs: GET /api/mesh/logs`,
      actions: [
        {
          id: 'check-health',
          label: 'Check System Health',
          description: 'View health of all plugins',
          endpoint: '/api/registry/plugins',
          method: 'GET',
        },
        {
          id: 'view-metrics',
          label: 'View Metrics',
          description: 'Check service mesh metrics',
          endpoint: '/api/mesh/metrics',
          method: 'GET',
        },
      ],
      confidence: 0.8,
      timestamp: new Date(),
    };
  }

  /**
   * Get general guidance
   */
  private getGeneralGuidance(request: GuidanceRequest): GuidanceResponse {
    return {
      type: 'info',
      title: 'How Can I Help?',
      message: `I'm your Full Stack Guidance System, powered by xAI. I can help you with:

**Navigation:**
- Find the right APIs and features
- Understand system architecture
- Locate documentation

**Configuration:**
- Set up plugins and services
- Optimize performance settings
- Configure security options

**Operations:**
- Monitor system health
- Troubleshoot issues
- Manage plugins and services

**Learning:**
- Understand AI frameworks
- Learn best practices
- Follow tutorials and examples

**Automation:**
- Create automated workflows
- Set up CI/CD pipelines
- Configure auto-scaling

**Try asking me:**
- "How do I set up a RAG pipeline?"
- "What plugins are available?"
- "How do I configure the service mesh?"
- "I'm getting an error with plugin X"
- "Show me examples of using LangGraph"

What would you like help with?`,
      relatedTopics: [
        'Universal Plugin Registry',
        'Service Mesh',
        'AI Frameworks',
        'Configuration',
        'Troubleshooting',
      ],
      confidence: 0.7,
      timestamp: new Date(),
    };
  }

  /**
   * Get recommended actions based on context
   */
  async getRecommendedActions(context: GuidanceContext): Promise<GuidanceAction[]> {
    const actions: GuidanceAction[] = [];

    // Recommend based on experience level
    if (context.experienceLevel === 'beginner') {
      actions.push({
        id: 'tutorial',
        label: 'Start Tutorial',
        description: 'Interactive tutorial for beginners',
        automated: false,
      });
    }

    // Recommend based on system state
    if (context.systemState?.registeredPlugins === 0) {
      actions.push({
        id: 'init-plugins',
        label: 'Initialize Plugins',
        description: 'Register and start all plugins',
        automated: true,
      });
    }

    // Recommend based on current section
    if (context.currentSection === 'rag') {
      actions.push({
        id: 'setup-rag',
        label: 'Set Up RAG Pipeline',
        description: 'Automated RAG pipeline setup',
        automated: true,
      });
    }

    return actions;
  }

  /**
   * Get configuration recommendations
   */
  async getConfigRecommendations(
    pluginId: string,
    currentConfig: any,
  ): Promise<{
    recommendations: Array<{ field: string; value: any; reason: string }>;
    warnings: string[];
  }> {
    const plugin = this.knowledgeBase.plugins.find((p) => p.id === pluginId);

    if (!plugin) {
      return { recommendations: [], warnings: [] };
    }

    const recommendations: Array<{ field: string; value: any; reason: string }> = [];
    const warnings: string[] = [];

    // Provide optimal defaults
    recommendations.push({
      field: 'enabled',
      value: true,
      reason: 'Enable plugin for use',
    });

    return { recommendations, warnings };
  }

  /**
   * Clear conversation history for a user
   */
  clearHistory(userId: string): void {
    this.conversationHistory.delete(userId);
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalConversations: number;
    knowledgeBaseSize: number;
    xaiConfigured: boolean;
  } {
    return {
      totalConversations: this.conversationHistory.size,
      knowledgeBaseSize: this.knowledgeBase.plugins.length,
      xaiConfigured: !!this.xaiApiKey,
    };
  }
}
