# Phase 1 Implementation Examples

This document provides complete, working examples for all Phase 1 features.

## Table of Contents

1. [Custom Plugin Example](#custom-plugin-example)
2. [Service Mesh Example](#service-mesh-example)
3. [LangGraph Workflow Example](#langgraph-workflow-example)
4. [LlamaIndex RAG Example](#llamaindex-rag-example)
5. [CrewAI Multi-Agent Example](#crewai-multi-agent-example)
6. [Integration Examples](#integration-examples)

---

## Custom Plugin Example

### Creating a Custom Analytics Plugin

```typescript
import { BasePlugin, PluginCategory, PluginHealth, PluginHealthStatus } from '../registry/PluginInterface';

export class AnalyticsPlugin extends BasePlugin {
  private events: any[] = [];
  private metricsCollector: NodeJS.Timeout | null = null;

  constructor() {
    super({
      id: 'analytics-plugin',
      name: 'Analytics',
      version: '1.0.0',
      category: PluginCategory.TOOLS,
      capabilities: ['event-tracking', 'metrics', 'analytics'],
      dependencies: [],
      config: {
        collectionInterval: 60000, // 1 minute
        maxEvents: 10000
      }
    });
  }

  async init() {
    await super.init();
    console.log('Analytics plugin initialized');
  }

  async start() {
    await super.start();
    
    // Start metrics collection
    this.metricsCollector = setInterval(() => {
      this.collectMetrics();
    }, this.config.collectionInterval);

    console.log('Analytics plugin started');
  }

  async stop() {
    await super.stop();
    
    // Stop metrics collection
    if (this.metricsCollector) {
      clearInterval(this.metricsCollector);
      this.metricsCollector = null;
    }

    console.log('Analytics plugin stopped');
  }

  async destroy() {
    // Save events before destroying
    await this.flushEvents();
    
    this.events = [];
    await super.destroy();
  }

  async healthCheck(): Promise<PluginHealth> {
    const baseHealth = await super.healthCheck();

    return {
      ...baseHealth,
      status: this.events.length < this.config.maxEvents 
        ? PluginHealthStatus.HEALTHY 
        : PluginHealthStatus.DEGRADED,
      metrics: {
        ...baseHealth.metrics,
        totalEvents: this.events.length,
        eventsPerMinute: this.calculateEventsPerMinute()
      }
    };
  }

  // Custom methods
  trackEvent(event: any) {
    this.events.push({
      ...event,
      timestamp: new Date()
    });

    // Prevent memory overflow
    if (this.events.length > this.config.maxEvents) {
      this.events = this.events.slice(-this.config.maxEvents);
    }
  }

  getMetrics() {
    return {
      totalEvents: this.events.length,
      eventsPerMinute: this.calculateEventsPerMinute(),
      uniqueEventTypes: new Set(this.events.map(e => e.type)).size
    };
  }

  private calculateEventsPerMinute(): number {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentEvents = this.events.filter(e => e.timestamp > oneMinuteAgo);
    return recentEvents.length;
  }

  private collectMetrics() {
    const metrics = this.getMetrics();
    console.log('Metrics collected:', metrics);
  }

  private async flushEvents() {
    // Save events to storage
    console.log(`Flushing ${this.events.length} events`);
    // Implement actual storage logic here
  }
}

// Usage
async function main() {
  const plugin = new AnalyticsPlugin();
  
  await plugin.init();
  await plugin.start();

  // Track some events
  plugin.trackEvent({ type: 'page_view', page: '/home' });
  plugin.trackEvent({ type: 'button_click', button: 'signup' });
  plugin.trackEvent({ type: 'api_call', endpoint: '/api/users' });

  // Check health
  const health = await plugin.healthCheck();
  console.log('Health:', health);

  // Get metrics
  const metrics = plugin.getMetrics();
  console.log('Metrics:', metrics);

  // Cleanup
  await plugin.stop();
  await plugin.destroy();
}
```

---

## Service Mesh Example

### Registering and Invoking Services

```typescript
import axios from 'axios';

async function serviceMeshExample() {
  const baseUrl = 'http://localhost:3000/api/mesh';

  // 1. Register a payment service
  const paymentService = await axios.post(`${baseUrl}/services`, {
    name: 'Payment Service',
    version: '1.0.0',
    protocol: 'HTTP',
    host: 'payment-service.local',
    port: 8080,
    endpoints: ['/process-payment', '/refund', '/get-status'],
    dependencies: [],
    apiKey: 'payment-secret-key'
  });

  console.log('Payment service registered:', paymentService.data);

  // 2. Register a notification service
  const notificationService = await axios.post(`${baseUrl}/services`, {
    name: 'Notification Service',
    version: '1.0.0',
    protocol: 'HTTP',
    host: 'notification.local',
    port: 8081,
    endpoints: ['/send-email', '/send-sms'],
    dependencies: [],
    rateLimit: 200 // 200 requests per minute
  });

  // 3. List all services
  const services = await axios.get(`${baseUrl}/services`);
  console.log('All services:', services.data);

  // 4. Get mesh topology
  const topology = await axios.get(`${baseUrl}/topology`);
  console.log('Mesh topology:', topology.data);

  // 5. Invoke payment service
  const paymentResult = await axios.post(
    `${baseUrl}/services/${paymentService.data.data.id}/invoke`,
    {
      method: 'POST',
      endpoint: '/process-payment',
      body: {
        amount: 99.99,
        currency: 'USD',
        customerId: 'cust-123'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('Payment result:', paymentResult.data);

  // 6. Check service health
  const health = await axios.get(
    `${baseUrl}/services/${paymentService.data.data.id}/health`
  );
  console.log('Service health:', health.data);

  // 7. Get mesh metrics
  const metrics = await axios.get(`${baseUrl}/metrics`);
  console.log('Mesh metrics:', metrics.data);
}
```

---

## LangGraph Workflow Example

### Building a RAG Workflow

```typescript
import axios from 'axios';

async function langGraphRAGExample() {
  const baseUrl = 'http://localhost:3000/api/frameworks/langgraph';

  // 1. Create workflow from RAG template
  const workflow = await axios.post(`${baseUrl}/graphs`, {
    templateId: 'rag-workflow'
  });

  const workflowId = workflow.data.data.id;
  console.log('Created workflow:', workflowId);

  // 2. Execute the RAG workflow
  const result = await axios.post(
    `${baseUrl}/graphs/${workflowId}/execute`,
    {
      input: {
        query: 'What are the best practices for API design?',
        context: {
          documentIds: ['doc1', 'doc2', 'doc3']
        }
      }
    }
  );

  console.log('Workflow execution result:', result.data.data);
  console.log('Output:', result.data.data.output);
  console.log('Execution time:', result.data.data.executionTime, 'ms');
  console.log('Nodes executed:', result.data.data.nodesExecuted);

  // 3. Get workflow state
  const state = await axios.get(`${baseUrl}/graphs/${workflowId}/state`);
  console.log('Current state:', state.data.data);
}

### Building a Custom Conditional Workflow

async function langGraphConditionalExample() {
  const baseUrl = 'http://localhost:3000/api/frameworks/langgraph';

  // 1. Create empty workflow
  const workflow = await axios.post(`${baseUrl}/graphs`);
  const workflowId = workflow.data.data.id;

  // 2. Add start node
  await axios.post(`${baseUrl}/graphs/${workflowId}/nodes`, {
    id: 'start',
    type: 'start',
    name: 'Start',
    config: {}
  });

  // 3. Add decision node
  await axios.post(`${baseUrl}/graphs/${workflowId}/nodes`, {
    id: 'classify',
    type: 'decision',
    name: 'Classify Request',
    config: {}
  });

  // 4. Add processing nodes for different paths
  await axios.post(`${baseUrl}/graphs/${workflowId}/nodes`, {
    id: 'process-urgent',
    type: 'agent',
    name: 'Urgent Handler',
    config: { priority: 'high' }
  });

  await axios.post(`${baseUrl}/graphs/${workflowId}/nodes`, {
    id: 'process-normal',
    type: 'agent',
    name: 'Normal Handler',
    config: { priority: 'normal' }
  });

  // 5. Add end node
  await axios.post(`${baseUrl}/graphs/${workflowId}/nodes`, {
    id: 'end',
    type: 'end',
    name: 'End',
    config: {}
  });

  // 6. Connect nodes
  await axios.post(`${baseUrl}/graphs/${workflowId}/edges`, {
    from: 'start',
    to: 'classify'
  });

  await axios.post(`${baseUrl}/graphs/${workflowId}/edges`, {
    from: 'classify',
    to: 'process-urgent'
  });

  await axios.post(`${baseUrl}/graphs/${workflowId}/edges`, {
    from: 'classify',
    to: 'process-normal'
  });

  await axios.post(`${baseUrl}/graphs/${workflowId}/edges`, {
    from: 'process-urgent',
    to: 'end'
  });

  await axios.post(`${baseUrl}/graphs/${workflowId}/edges`, {
    from: 'process-normal',
    to: 'end'
  });

  // 7. Execute workflow
  const result = await axios.post(
    `${baseUrl}/graphs/${workflowId}/execute`,
    {
      input: {
        requestType: 'urgent',
        data: { message: 'Critical system error' }
      }
    }
  );

  console.log('Conditional workflow result:', result.data);
}
```

---

## LlamaIndex RAG Example

### Building a Knowledge Base

```typescript
import axios from 'axios';

async function llamaIndexRAGExample() {
  const baseUrl = 'http://localhost:3000/api/frameworks/llamaindex';

  // 1. Create an index
  const index = await axios.post(`${baseUrl}/indexes`, {
    name: 'Product Documentation',
    embeddingModel: 'openai-ada-002',
    chunkSize: 512,
    chunkOverlap: 50
  });

  const indexId = index.data.data.id;
  console.log('Created index:', indexId);

  // 2. Add documents
  await axios.post(`${baseUrl}/indexes/${indexId}/documents`, {
    documents: [
      {
        id: 'api-guide',
        content: `
          API Guide: Our REST API provides access to all platform features.
          Authentication is done via API keys. Rate limits are 1000 requests per hour.
          All endpoints return JSON responses. Use POST /api/auth for authentication.
        `,
        metadata: {
          type: 'documentation',
          category: 'api',
          version: '2.0'
        }
      },
      {
        id: 'pricing',
        content: `
          Pricing: We offer three tiers - Starter ($29/month), Professional ($99/month),
          and Enterprise (custom pricing). All plans include 24/7 support.
          Enterprise plans include dedicated account managers and SLA guarantees.
        `,
        metadata: {
          type: 'documentation',
          category: 'pricing',
          version: '2.0'
        }
      },
      {
        id: 'security',
        content: `
          Security: All data is encrypted at rest and in transit using AES-256.
          We are SOC 2 Type II certified and GDPR compliant.
          Two-factor authentication is available for all users.
        `,
        metadata: {
          type: 'documentation',
          category: 'security',
          version: '2.0'
        }
      }
    ]
  });

  console.log('Documents added successfully');

  // 3. Query the index
  const query1 = await axios.post(`${baseUrl}/indexes/${indexId}/query`, {
    query: 'What are the pricing options?',
    topK: 3
  });

  console.log('\nQuery: What are the pricing options?');
  console.log('Results:', query1.data.data.results);
  console.log('Synthesized:', query1.data.data.synthesizedResponse);

  // 4. Query with metadata filter
  const query2 = await axios.post(`${baseUrl}/indexes/${indexId}/query`, {
    query: 'API authentication',
    topK: 2,
    filter: {
      category: 'api'
    }
  });

  console.log('\nQuery: API authentication (filtered)');
  console.log('Results:', query2.data.data.results);

  // 5. Get index statistics
  const stats = await axios.get(`${baseUrl}/indexes/${indexId}/stats`);
  console.log('\nIndex stats:', stats.data.data);
}
```

---

## CrewAI Multi-Agent Example

### Creating a Research Team

```typescript
import axios from 'axios';

async function crewAIResearchExample() {
  const baseUrl = 'http://localhost:3000/api/frameworks/crewai';

  // 1. Create agents
  const researcher = await axios.post(`${baseUrl}/agents`, {
    role: 'Senior Researcher',
    goal: 'Conduct thorough research on given topics',
    backstory: 'PhD researcher with 10 years of experience in data analysis and academic research',
    tools: ['web-search', 'file-read'],
    llmModel: 'gpt-4'
  });

  const analyst = await axios.post(`${baseUrl}/agents`, {
    role: 'Data Analyst',
    goal: 'Analyze research findings and extract insights',
    backstory: 'Expert data analyst specializing in business intelligence and statistical analysis',
    tools: ['calculator', 'text-analyzer']
  });

  const writer = await axios.post(`${baseUrl}/agents`, {
    role: 'Technical Writer',
    goal: 'Create clear, comprehensive reports',
    backstory: 'Professional technical writer with expertise in making complex topics accessible',
    tools: ['file-write']
  });

  console.log('Agents created');

  // 2. Create a crew
  const crew = await axios.post(`${baseUrl}/crews`, {
    name: 'AI Research Team',
    agents: [
      researcher.data.data.id,
      analyst.data.data.id,
      writer.data.data.id
    ],
    tasks: [
      {
        id: 'research-task',
        description: 'Research the latest developments in large language models',
        expectedOutput: 'Comprehensive research report with key findings and statistics',
        agent: researcher.data.data.id
      },
      {
        id: 'analysis-task',
        description: 'Analyze the research findings and identify trends',
        expectedOutput: 'Analysis report with insights, trends, and recommendations',
        agent: analyst.data.data.id
      },
      {
        id: 'writing-task',
        description: 'Write an executive summary of the research and analysis',
        expectedOutput: 'Professional executive summary suitable for stakeholders',
        agent: writer.data.data.id
      }
    ],
    executionMode: 'sequential'
  });

  console.log('Crew created:', crew.data.data);

  // 3. Execute the crew
  const result = await axios.post(
    `${baseUrl}/crews/${crew.data.data.id}/execute`
  );

  console.log('\nCrew execution completed');
  console.log('Success:', result.data.data.success);
  console.log('Execution time:', result.data.data.executionTime, 'ms');
  console.log('\nTask results:');
  
  result.data.data.results.forEach((taskResult, index) => {
    console.log(`\nTask ${index + 1}:`, taskResult.taskId);
    console.log('Success:', taskResult.success);
    console.log('Output:', taskResult.output);
    console.log('Execution time:', taskResult.executionTime, 'ms');
  });

  // 4. Check crew status
  const status = await axios.get(
    `${baseUrl}/crews/${crew.data.data.id}/status`
  );
  console.log('\nCrew status:', status.data.data);
}
```

---

## Integration Examples

### Example: End-to-End RAG System with All Frameworks

```typescript
async function fullRAGExample() {
  // 1. Create LlamaIndex for knowledge base
  const index = await axios.post('http://localhost:3000/api/frameworks/llamaindex/indexes', {
    name: 'Customer Support KB'
  });

  // 2. Add documents to index
  await axios.post(
    `http://localhost:3000/api/frameworks/llamaindex/indexes/${index.data.data.id}/documents`,
    {
      documents: [
        { id: 'faq1', content: 'FAQ content...' },
        { id: 'guide1', content: 'Guide content...' }
      ]
    }
  );

  // 3. Create CrewAI agents for processing
  const retriever = await axios.post('http://localhost:3000/api/frameworks/crewai/agents', {
    role: 'Information Retriever',
    goal: 'Find relevant information from knowledge base',
    backstory: 'Expert in information retrieval'
  });

  const responder = await axios.post('http://localhost:3000/api/frameworks/crewai/agents', {
    role: 'Customer Support Agent',
    goal: 'Provide helpful responses to customers',
    backstory: 'Experienced customer support specialist'
  });

  // 4. Create LangGraph workflow to orchestrate
  const workflow = await axios.post('http://localhost:3000/api/frameworks/langgraph/graphs');
  const workflowId = workflow.data.data.id;

  // Add workflow nodes
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
    id: 'start', type: 'start', name: 'Start', config: {}
  });
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
    id: 'retrieve', type: 'tool', name: 'Retrieve Docs', config: { indexId: index.data.data.id }
  });
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
    id: 'respond', type: 'agent', name: 'Generate Response', config: {}
  });
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
    id: 'end', type: 'end', name: 'End', config: {}
  });

  // Connect nodes
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/edges`, {
    from: 'start', to: 'retrieve'
  });
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/edges`, {
    from: 'retrieve', to: 'respond'
  });
  await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/edges`, {
    from: 'respond', to: 'end'
  });

  // 5. Execute end-to-end workflow
  const result = await axios.post(
    `http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/execute`,
    {
      input: {
        query: 'How do I reset my password?'
      }
    }
  );

  console.log('End-to-end RAG result:', result.data);
}
```

Run these examples:

```bash
# Install dependencies
npm install axios

# Run the examples
node examples.js
```
