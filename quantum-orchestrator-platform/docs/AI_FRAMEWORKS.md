# AI Frameworks Integration Guide

## Overview

The Enterprise AI Development Platform integrates three powerful AI frameworks:
1. **LangGraph** - Workflow and agent orchestration
2. **LlamaIndex** - Document indexing and RAG
3. **CrewAI** - Multi-agent collaboration

## LangGraph Integration

### Overview

LangGraph provides a powerful workflow engine for building complex AI agent workflows with state management.

**Capabilities:**
- `workflow` - Workflow execution
- `graph` - Graph-based orchestration
- `state-management` - Persistent state
- `agent` - Agent coordination

### Creating Workflows

```typescript
// Create a new workflow
const response = await axios.post('http://localhost:3000/api/frameworks/langgraph/graphs', {
  id: 'my-workflow'
});

const workflowId = response.data.data.id;
```

### Adding Nodes

```typescript
// Add nodes to the workflow
await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
  id: 'start',
  type: 'start',
  name: 'Start',
  config: {}
});

await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
  id: 'agent',
  type: 'agent',
  name: 'AI Agent',
  config: { model: 'gpt-4' }
});

await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/nodes`, {
  id: 'end',
  type: 'end',
  name: 'End',
  config: {}
});
```

### Adding Edges

```typescript
// Connect nodes
await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/edges`, {
  from: 'start',
  to: 'agent'
});

await axios.post(`http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/edges`, {
  from: 'agent',
  to: 'end'
});
```

### Executing Workflows

```typescript
// Execute the workflow
const result = await axios.post(
  `http://localhost:3000/api/frameworks/langgraph/graphs/${workflowId}/execute`,
  {
    input: {
      query: 'What is the weather today?',
      context: {}
    }
  }
);

console.log('Result:', result.data.data.output);
console.log('Execution time:', result.data.data.executionTime, 'ms');
```

### Using Templates

```typescript
// List available templates
const templates = await axios.get('http://localhost:3000/api/frameworks/langgraph/templates');

// Create from template
const workflow = await axios.post('http://localhost:3000/api/frameworks/langgraph/graphs', {
  templateId: 'rag-workflow'
});
```

### Available Templates

1. **simple-agent** - Basic agent workflow
2. **rag-workflow** - Retrieval-Augmented Generation
3. **conditional-workflow** - Conditional branching
4. **multi-agent** - Multi-agent collaboration
5. **parallel-processing** - Parallel task execution

### Best Practices

- Use state management for complex workflows
- Add conditional edges for decision points
- Monitor execution time and optimize bottlenecks
- Use templates as starting points
- Keep workflows modular and reusable

---

## LlamaIndex Integration

### Overview

LlamaIndex provides document indexing, vector search, and RAG capabilities.

**Capabilities:**
- `indexing` - Document indexing
- `retrieval` - Vector search
- `rag` - Retrieval-Augmented Generation
- `vector-search` - Semantic search

### Creating an Index

```typescript
// Create a new index
const response = await axios.post('http://localhost:3000/api/frameworks/llamaindex/indexes', {
  name: 'My Document Index',
  embeddingModel: 'openai-ada-002',
  chunkSize: 512,
  chunkOverlap: 50
});

const indexId = response.data.data.id;
```

### Adding Documents

```typescript
// Add documents to the index
await axios.post(
  `http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/documents`,
  {
    documents: [
      {
        id: 'doc1',
        content: 'Your document content here...',
        metadata: {
          source: 'web',
          category: 'documentation'
        }
      },
      {
        id: 'doc2',
        content: 'Another document...',
        metadata: {
          source: 'api',
          category: 'tutorial'
        }
      }
    ]
  }
);
```

### Querying the Index

```typescript
// Query for relevant documents
const results = await axios.post(
  `http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/query`,
  {
    query: 'How do I use the API?',
    topK: 5,
    filter: {
      category: 'documentation'
    }
  }
);

console.log('Results:', results.data.data.results);
console.log('Synthesized response:', results.data.data.synthesizedResponse);
```

### Query Strategies

#### Vector Search

```typescript
const results = await axios.post(
  `http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/query`,
  {
    query: 'machine learning',
    topK: 10
  }
);
```

#### Hybrid Search (Vector + Keyword)

```typescript
// Implement hybrid search by combining vector search with filters
const results = await axios.post(
  `http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/query`,
  {
    query: 'machine learning',
    topK: 10,
    filter: {
      source: 'documentation',
      year: '2024'
    }
  }
);
```

#### Metadata Filtering

```typescript
const results = await axios.post(
  `http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/query`,
  {
    query: 'tutorial',
    filter: {
      category: 'tutorial',
      difficulty: 'beginner'
    }
  }
);
```

### Document Chunking Strategies

The index engine supports three chunking strategies:

1. **FIXED_SIZE** (default) - Fixed-size chunks with overlap
2. **SENTENCE** - Sentence-based chunking
3. **SEMANTIC** - Semantic similarity-based chunking

Configure chunking when creating an index:

```typescript
{
  chunkSize: 512,        // Characters per chunk
  chunkOverlap: 50       // Overlap between chunks
}
```

### Vector Store Configuration

Currently supports in-memory vector store. Extensible to:
- **Pinecone**
- **Weaviate**
- **Chroma**
- **FAISS**

### Best Practices

- Chunk documents appropriately (512-1024 chars)
- Use metadata for filtering
- Monitor index size and performance
- Regularly update embeddings
- Use appropriate top-k values (3-10)

---

## CrewAI Integration

### Overview

CrewAI enables multi-agent collaboration with role-based agents working together on tasks.

**Capabilities:**
- `agents` - Agent management
- `tasks` - Task execution
- `collaboration` - Multi-agent collaboration
- `roles` - Role-based agents

### Creating Agents

```typescript
// Create a researcher agent
const researcher = await axios.post('http://localhost:3000/api/frameworks/crewai/agents', {
  role: 'Researcher',
  goal: 'Research comprehensive information on given topics',
  backstory: 'Expert researcher with years of experience in data gathering and analysis',
  tools: ['web-search', 'file-read'],
  llmModel: 'gpt-4'
});

// Create an analyst agent
const analyst = await axios.post('http://localhost:3000/api/frameworks/crewai/agents', {
  role: 'Analyst',
  goal: 'Analyze data and provide insights',
  backstory: 'Senior data analyst specializing in business intelligence',
  tools: ['calculator', 'text-analyzer']
});

// Create a writer agent
const writer = await axios.post('http://localhost:3000/api/frameworks/crewai/agents', {
  role: 'Writer',
  goal: 'Create well-written reports and documents',
  backstory: 'Professional writer with expertise in technical documentation',
  tools: ['file-write']
});
```

### Composing Crews

```typescript
// Create a crew
const crew = await axios.post('http://localhost:3000/api/frameworks/crewai/crews', {
  name: 'Research Team',
  agents: [
    researcher.data.data.id,
    analyst.data.data.id,
    writer.data.data.id
  ],
  tasks: [
    {
      id: 'research',
      description: 'Research the topic of AI safety',
      expectedOutput: 'Comprehensive research findings'
    },
    {
      id: 'analyze',
      description: 'Analyze the research findings',
      expectedOutput: 'Analysis report with insights'
    },
    {
      id: 'write',
      description: 'Write a final report',
      expectedOutput: 'Professional research report'
    }
  ],
  executionMode: 'sequential'
});
```

### Task Orchestration

#### Sequential Execution

```typescript
{
  executionMode: 'sequential'  // Tasks execute one after another
}
```

#### Parallel Execution

```typescript
{
  executionMode: 'parallel'  // Tasks execute simultaneously
}
```

### Executing Crews

```typescript
// Execute the crew
const result = await axios.post(
  `http://localhost:3000/api/frameworks/crewai/crews/${crew.data.data.id}/execute`
);

console.log('Crew execution:', result.data.data);
console.log('Results:', result.data.data.results);
```

### Available Tools

1. **web-search** - Search the web
2. **file-read** - Read files
3. **file-write** - Write to files
4. **calculator** - Perform calculations
5. **text-analyzer** - Analyze text

### Crew Templates

1. **research-team** - Research and analysis
2. **content-creation** - Content creation workflow
3. **data-analysis** - Data analysis team
4. **code-review** - Code review team
5. **customer-support** - Customer support team

### Best Practices

- Assign clear roles and goals to agents
- Use sequential execution for dependent tasks
- Use parallel execution for independent tasks
- Provide relevant tools to each agent
- Monitor task execution time
- Use crew templates as starting points

---

## Framework Comparison

| Feature | LangGraph | LlamaIndex | CrewAI |
|---------|-----------|------------|--------|
| **Primary Use Case** | Workflow orchestration | Document search & RAG | Multi-agent collaboration |
| **Best For** | Complex workflows | Knowledge bases | Team-based tasks |
| **State Management** | ✅ Built-in | ❌ Not applicable | ✅ Agent memory |
| **Conditional Logic** | ✅ Yes | ❌ No | ✅ Task-based |
| **Parallel Execution** | ✅ Yes | ❌ No | ✅ Yes |
| **Document Processing** | ❌ Limited | ✅ Advanced | ❌ Via tools |
| **Vector Search** | ❌ No | ✅ Yes | ❌ No |
| **Agent Collaboration** | ✅ Via workflow | ❌ No | ✅ Advanced |
| **Templates** | 5 workflows | N/A | 5 crew templates |

---

## Integration Examples

### Example 1: RAG with LangGraph + LlamaIndex

```typescript
// 1. Create LlamaIndex for document storage
const index = await axios.post('http://localhost:3000/api/frameworks/llamaindex/indexes', {
  name: 'Knowledge Base'
});

// 2. Add documents
await axios.post(`http://localhost:3000/api/frameworks/llamaindex/indexes/${index.data.data.id}/documents`, {
  documents: [/* your documents */]
});

// 3. Create LangGraph workflow with RAG
const workflow = await axios.post('http://localhost:3000/api/frameworks/langgraph/graphs', {
  templateId: 'rag-workflow'
});

// 4. Execute RAG workflow
const result = await axios.post(
  `http://localhost:3000/api/frameworks/langgraph/graphs/${workflow.data.data.id}/execute`,
  {
    input: {
      query: 'What is our pricing model?',
      indexId: index.data.data.id
    }
  }
);
```

### Example 2: Multi-Agent Research with CrewAI + LlamaIndex

```typescript
// 1. Create research agents
const agents = await Promise.all([
  axios.post('http://localhost:3000/api/frameworks/crewai/agents', { role: 'Researcher', ... }),
  axios.post('http://localhost:3000/api/frameworks/crewai/agents', { role: 'Analyst', ... })
]);

// 2. Create crew
const crew = await axios.post('http://localhost:3000/api/frameworks/crewai/crews', {
  name: 'Research Crew',
  agents: agents.map(a => a.data.data.id),
  tasks: [/* research tasks */],
  executionMode: 'sequential'
});

// 3. Execute crew and store results in LlamaIndex
const crewResult = await axios.post(
  `http://localhost:3000/api/frameworks/crewai/crews/${crew.data.data.id}/execute`
);

// 4. Index the results for future queries
await axios.post(`http://localhost:3000/api/frameworks/llamaindex/indexes/${indexId}/documents`, {
  documents: [{
    id: 'research-1',
    content: crewResult.data.data.results.map(r => r.output).join('\n'),
    metadata: { type: 'research', date: new Date() }
  }]
});
```

## Performance Targets

- **LangGraph:** < 500ms per node execution (excluding LLM time)
- **LlamaIndex:** < 200ms query time (excluding LLM synthesis)
- **CrewAI:** < 1s per task execution (excluding LLM time)

## Troubleshooting

### LangGraph Issues

- **Workflow not executing:** Check all nodes are connected
- **State not persisting:** Verify StateManager is configured
- **Slow execution:** Optimize node handlers and reduce dependencies

### LlamaIndex Issues

- **Poor search results:** Adjust chunk size or embedding model
- **Out of memory:** Use external vector store instead of in-memory
- **Slow queries:** Reduce top-k or add metadata filters

### CrewAI Issues

- **Tasks failing:** Check agent tools are available
- **Slow execution:** Use parallel mode for independent tasks
- **Agent errors:** Verify agent goals and backstories are clear
