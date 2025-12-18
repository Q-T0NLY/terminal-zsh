import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { LangGraphPlugin } from './langgraph/LangGraphPlugin';
import { LlamaIndexPlugin } from './llamaindex/LlamaIndexPlugin';
import { CrewAIPlugin } from './crewai/CrewAIPlugin';
import {
  CreateGraphDto,
  AddNodeDto,
  AddEdgeDto,
  ExecuteGraphDto,
  CreateIndexDto,
  AddDocumentsDto,
  QueryIndexDto,
  CreateAgentDto,
  CreateCrewDto
} from './dto/frameworks.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Frameworks Controller - API endpoints for all AI framework integrations
 */
@Controller('api/frameworks')
export class FrameworksController {
  private readonly logger = new Logger(FrameworksController.name);

  constructor(
    private readonly langGraphPlugin: LangGraphPlugin,
    private readonly llamaIndexPlugin: LlamaIndexPlugin,
    private readonly crewAIPlugin: CrewAIPlugin
  ) {}

  // ========== LangGraph Endpoints ==========

  @Post('langgraph/graphs')
  async createGraph(@Body() dto: CreateGraphDto) {
    this.logger.log('Creating LangGraph workflow');

    let workflow;
    if (dto.templateId) {
      workflow = this.langGraphPlugin.createFromTemplate(dto.templateId);
    } else {
      workflow = this.langGraphPlugin.createWorkflow(dto.id);
    }

    return {
      success: true,
      data: workflow.getConfig()
    };
  }

  @Get('langgraph/graphs')
  async listGraphs() {
    const workflows = this.langGraphPlugin.getAllWorkflows();

    return {
      success: true,
      data: workflows.map((w) => w.getConfig()),
      count: workflows.length
    };
  }

  @Get('langgraph/graphs/:id')
  async getGraph(@Param('id') id: string) {
    const workflow = this.langGraphPlugin.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    return {
      success: true,
      data: workflow.getConfig()
    };
  }

  @Post('langgraph/graphs/:id/execute')
  async executeGraph(@Param('id') id: string, @Body() dto: ExecuteGraphDto) {
    this.logger.log(`Executing workflow ${id}`);

    const workflow = this.langGraphPlugin.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    const result = await workflow.execute(dto.input);

    return {
      success: result.success,
      data: result
    };
  }

  @Get('langgraph/graphs/:id/state')
  async getGraphState(@Param('id') id: string) {
    const workflow = this.langGraphPlugin.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    return {
      success: true,
      data: workflow.getState()
    };
  }

  @Post('langgraph/graphs/:id/nodes')
  async addNode(@Param('id') id: string, @Body() dto: AddNodeDto) {
    const workflow = this.langGraphPlugin.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    workflow.addNode({
      id: dto.id,
      type: dto.type,
      name: dto.name,
      config: dto.config || {}
    });

    return {
      success: true,
      data: workflow.getConfig()
    };
  }

  @Post('langgraph/graphs/:id/edges')
  async addEdge(@Param('id') id: string, @Body() dto: AddEdgeDto) {
    const workflow = this.langGraphPlugin.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow ${id} not found`);
    }

    workflow.addEdge(dto.from, dto.to);

    return {
      success: true,
      data: workflow.getConfig()
    };
  }

  @Get('langgraph/templates')
  async getGraphTemplates() {
    const templates = this.langGraphPlugin.getTemplates();

    return {
      success: true,
      data: templates,
      count: templates.length
    };
  }

  // ========== LlamaIndex Endpoints ==========

  @Post('llamaindex/indexes')
  async createIndex(@Body() dto: CreateIndexDto) {
    this.logger.log(`Creating index: ${dto.name}`);

    const { engine, query } = this.llamaIndexPlugin.createIndex(dto);

    return {
      success: true,
      data: {
        id: engine.id,
        config: engine.config,
        stats: engine.getStats()
      }
    };
  }

  @Get('llamaindex/indexes')
  async listIndexes() {
    const indexes = this.llamaIndexPlugin.getAllIndexes();

    return {
      success: true,
      data: indexes.map((idx) => ({
        id: idx.id,
        config: idx.engine.config,
        stats: idx.engine.getStats()
      })),
      count: indexes.length
    };
  }

  @Post('llamaindex/indexes/:id/documents')
  async addDocuments(@Param('id') id: string, @Body() dto: AddDocumentsDto) {
    this.logger.log(`Adding documents to index ${id}`);

    const index = this.llamaIndexPlugin.getIndex(id);

    if (!index) {
      throw new Error(`Index ${id} not found`);
    }

    await index.engine.addDocuments(
      dto.documents.map((doc) => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata || {}
      }))
    );

    await index.engine.buildIndex();

    return {
      success: true,
      data: index.engine.getStats()
    };
  }

  @Post('llamaindex/indexes/:id/query')
  async queryIndex(@Param('id') id: string, @Body() dto: QueryIndexDto) {
    this.logger.log(`Querying index ${id}: ${dto.query}`);

    const index = this.llamaIndexPlugin.getIndex(id);

    if (!index) {
      throw new Error(`Index ${id} not found`);
    }

    const result = await index.query.query(dto.query, dto.topK, dto.filter);

    return {
      success: true,
      data: result
    };
  }

  @Get('llamaindex/indexes/:id/stats')
  async getIndexStats(@Param('id') id: string) {
    const index = this.llamaIndexPlugin.getIndex(id);

    if (!index) {
      throw new Error(`Index ${id} not found`);
    }

    return {
      success: true,
      data: index.engine.getStats()
    };
  }

  @Delete('llamaindex/indexes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIndex(@Param('id') id: string) {
    await this.llamaIndexPlugin.deleteIndex(id);

    return {
      success: true
    };
  }

  // ========== CrewAI Endpoints ==========

  @Post('crewai/agents')
  async createAgent(@Body() dto: CreateAgentDto) {
    this.logger.log(`Creating agent: ${dto.role}`);

    const tools = this.crewAIPlugin.getDefaultTools();

    const agent = this.crewAIPlugin.agentManager.createAgent({
      id: dto.id || uuidv4(),
      role: dto.role,
      goal: dto.goal,
      backstory: dto.backstory,
      tools: tools,
      llmModel: dto.llmModel
    });

    return {
      success: true,
      data: {
        id: agent.id,
        role: agent.role,
        goal: agent.goal,
        backstory: agent.backstory,
        toolCount: agent.tools.length
      }
    };
  }

  @Get('crewai/agents')
  async listAgents() {
    const agents = this.crewAIPlugin.agentManager.getAllAgents();

    return {
      success: true,
      data: agents.map((a) => ({
        id: a.id,
        role: a.role,
        goal: a.goal,
        backstory: a.backstory
      })),
      count: agents.length
    };
  }

  @Post('crewai/crews')
  async createCrew(@Body() dto: CreateCrewDto) {
    this.logger.log(`Creating crew: ${dto.name}`);

    const crew = this.crewAIPlugin.taskExecutor.createCrew({
      id: dto.id || uuidv4(),
      name: dto.name,
      agents: dto.agents,
      tasks: dto.tasks,
      executionMode: dto.executionMode as any
    });

    return {
      success: true,
      data: crew.getConfig()
    };
  }

  @Post('crewai/crews/:id/execute')
  async executeCrew(@Param('id') id: string) {
    this.logger.log(`Executing crew ${id}`);

    const result = await this.crewAIPlugin.taskExecutor.executeCrew(id);

    return {
      success: result.success,
      data: result
    };
  }

  @Get('crewai/crews/:id/status')
  async getCrewStatus(@Param('id') id: string) {
    const crew = this.crewAIPlugin.taskExecutor.getCrew(id);

    if (!crew) {
      throw new Error(`Crew ${id} not found`);
    }

    return {
      success: true,
      data: {
        status: crew.getStatus(),
        config: crew.getConfig()
      }
    };
  }

  @Get('crewai/templates')
  async getCrewTemplates() {
    const templates = this.crewAIPlugin.getTemplates();

    return {
      success: true,
      data: templates,
      count: templates.length
    };
  }
}
