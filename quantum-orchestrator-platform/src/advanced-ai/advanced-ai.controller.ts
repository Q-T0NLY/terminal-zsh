import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { DAGRAGEngine } from './dag-rag/DAGRAGEngine';
import { PromptToolkit } from './prompt-toolkit/PromptToolkit';
import { ContextNLPFusion } from './nlp-fusion/ContextNLPFusion';
import {
  IndexDocumentsDto,
  GenerateRAGDto,
  MultiStrategySearchDto,
  FuseResultsDto,
  RenderTemplateDto,
  OptimizePromptDto,
  CreateTemplateDto,
  ExecuteChainDto,
  GenerateFewShotDto,
  SearchTemplatesDto,
  AddContextDto,
  ExtractFeaturesDto,
  FuseContextsDto,
} from './dto/advanced-ai.dto';

@Controller('api/advanced-ai')
export class AdvancedAIController {
  private readonly logger = new Logger(AdvancedAIController.name);

  constructor(
    private readonly dagRagEngine: DAGRAGEngine,
    private readonly promptToolkit: PromptToolkit,
    private readonly contextNlpFusion: ContextNLPFusion,
  ) {}

  // ============================================================================
  // DAG/RAG++ Endpoints
  // ============================================================================

  @Post('rag/index')
  @HttpCode(HttpStatus.OK)
  async indexDocuments(@Body() dto: IndexDocumentsDto) {
    this.logger.log(`Indexing ${dto.documents.length} documents`);
    
    // Map to proper Document format
    const documents = dto.documents.map(doc => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata || {},
    }));
    
    await this.dagRagEngine.indexDocuments(documents);

    return {
      success: true,
      message: `Indexed ${dto.documents.length} documents`,
    };
  }

  @Post('rag/generate')
  @HttpCode(HttpStatus.OK)
  async generateRAG(@Body() dto: GenerateRAGDto) {
    this.logger.log(`Generating RAG for query: ${dto.query}`);
    
    const result = await this.dagRagEngine.generate(dto.query, dto.topK || 5);

    return {
      success: true,
      data: result,
    };
  }

  @Post('rag/dag')
  @HttpCode(HttpStatus.OK)
  buildQueryDAG(@Body() dto: { query: string }) {
    this.logger.log(`Building query DAG for: ${dto.query}`);
    
    const dag = this.dagRagEngine.buildQueryDAG(dto.query);

    return {
      success: true,
      data: {
        nodes: dag,
        count: dag.length,
      },
    };
  }

  @Post('rag/search')
  @HttpCode(HttpStatus.OK)
  async multiStrategySearch(@Body() dto: MultiStrategySearchDto) {
    this.logger.log(`Multi-strategy search with ${dto.strategies.length} strategies`);
    
    const results = await this.dagRagEngine.multiStrategySearch(
      dto.query,
      dto.strategies,
      dto.topK || 5,
    );

    return {
      success: true,
      data: {
        results,
        count: results.length,
      },
    };
  }

  @Post('rag/fuse')
  @HttpCode(HttpStatus.OK)
  fuseResults(@Body() dto: FuseResultsDto) {
    this.logger.log(`Fusing results with strategy: ${dto.strategy}`);
    
    const fused = this.dagRagEngine.fuseResults(
      dto.results,
      dto.strategy,
      dto.topK || 5,
    );

    return {
      success: true,
      data: {
        results: fused,
        count: fused.length,
      },
    };
  }

  @Get('rag/stats')
  getRAGStats() {
    const stats = this.dagRagEngine.getStats();

    return {
      success: true,
      data: stats,
    };
  }

  @Post('rag/clear-cache')
  @HttpCode(HttpStatus.OK)
  clearRAGCache() {
    this.dagRagEngine.clearCache();

    return {
      success: true,
      message: 'Cache cleared',
    };
  }

  // ============================================================================
  // Prompt Toolkit Endpoints
  // ============================================================================

  @Get('prompts/templates')
  listTemplates(@Query() filters: { category?: string; tags?: string }) {
    const parsedFilters: { category?: string; tags?: string[] } = filters.tags
      ? { category: filters.category, tags: filters.tags.split(',') }
      : { category: filters.category };
    
    const templates = this.promptToolkit.listTemplates(parsedFilters);

    return {
      success: true,
      data: templates,
      count: templates.length,
    };
  }

  @Get('prompts/templates/:id')
  getTemplate(@Param('id') id: string) {
    const template = this.promptToolkit.getTemplate(id);

    if (!template) {
      return {
        success: false,
        message: `Template not found: ${id}`,
      };
    }

    return {
      success: true,
      data: template,
    };
  }

  @Post('prompts/templates')
  @HttpCode(HttpStatus.CREATED)
  createTemplate(@Body() dto: CreateTemplateDto) {
    this.logger.log(`Creating custom template: ${dto.name}`);
    
    const template = this.promptToolkit.createTemplate(dto);

    return {
      success: true,
      data: template,
    };
  }

  @Post('prompts/render')
  @HttpCode(HttpStatus.OK)
  renderTemplate(@Body() dto: RenderTemplateDto) {
    this.logger.log(`Rendering template: ${dto.templateId}`);
    
    try {
      const rendered = this.promptToolkit.renderTemplate(
        dto.templateId,
        dto.variables,
      );

      return {
        success: true,
        data: { rendered },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Rendering failed',
      };
    }
  }

  @Post('prompts/optimize')
  @HttpCode(HttpStatus.OK)
  async optimizePrompt(@Body() dto: OptimizePromptDto) {
    this.logger.log('Optimizing prompt');
    
    const result = await this.promptToolkit.optimizePrompt(dto.prompt);

    return {
      success: true,
      data: result,
    };
  }

  @Post('prompts/chain')
  @HttpCode(HttpStatus.OK)
  async executeChain(@Body() dto: ExecuteChainDto) {
    this.logger.log(`Executing chain with ${dto.steps.length} steps`);
    
    const result = await this.promptToolkit.executeChain(dto.steps);

    return {
      success: true,
      data: result,
    };
  }

  @Post('prompts/few-shot')
  @HttpCode(HttpStatus.OK)
  generateFewShot(@Body() dto: GenerateFewShotDto) {
    this.logger.log(`Generating few-shot examples for: ${dto.task}`);
    
    const examples = this.promptToolkit.generateFewShotExamples(
      dto.task,
      dto.count || 3,
    );

    return {
      success: true,
      data: {
        examples,
        count: examples.length,
      },
    };
  }

  @Post('prompts/search')
  @HttpCode(HttpStatus.OK)
  searchTemplates(@Body() dto: SearchTemplatesDto) {
    this.logger.log(`Searching templates: ${dto.query}`);
    
    const templates = this.promptToolkit.searchTemplates(dto.query);

    return {
      success: true,
      data: templates,
      count: templates.length,
    };
  }

  @Get('prompts/stats')
  getPromptStats() {
    const stats = this.promptToolkit.getStats();

    return {
      success: true,
      data: stats,
    };
  }

  // ============================================================================
  // NLP Fusion Endpoints
  // ============================================================================

  @Post('nlp/context')
  @HttpCode(HttpStatus.CREATED)
  addContext(@Body() dto: AddContextDto) {
    this.logger.log(`Adding context: ${dto.name}`);
    
    const context = this.contextNlpFusion.addContext({
      name: dto.name,
      content: dto.content,
      metadata: dto.metadata || {},
      weight: dto.weight ?? 1.0,
    });

    return {
      success: true,
      data: context,
    };
  }

  @Get('nlp/context')
  listContexts() {
    const contexts = this.contextNlpFusion.listContexts();

    return {
      success: true,
      data: contexts,
      count: contexts.length,
    };
  }

  @Get('nlp/context/:id')
  getContext(@Param('id') id: string) {
    const context = this.contextNlpFusion.getContext(id);

    if (!context) {
      return {
        success: false,
        message: `Context not found: ${id}`,
      };
    }

    return {
      success: true,
      data: context,
    };
  }

  @Delete('nlp/context/:id')
  removeContext(@Param('id') id: string) {
    const deleted = this.contextNlpFusion.removeContext(id);

    return {
      success: deleted,
      message: deleted ? 'Context removed' : 'Context not found',
    };
  }

  @Delete('nlp/context')
  clearContexts() {
    this.contextNlpFusion.clearContexts();

    return {
      success: true,
      message: 'All contexts cleared',
    };
  }

  @Post('nlp/features')
  @HttpCode(HttpStatus.OK)
  extractFeatures(@Body() dto: ExtractFeaturesDto) {
    this.logger.log('Extracting NLP features');
    
    const features = this.contextNlpFusion.extractFeatures(dto.text);

    return {
      success: true,
      data: features,
    };
  }

  @Post('nlp/fuse')
  @HttpCode(HttpStatus.OK)
  fuseContexts(@Body() dto: FuseContextsDto) {
    this.logger.log(`Fusing ${dto.sourceIds.length} contexts`);
    
    const fused = this.contextNlpFusion.fuseContexts(
      dto.sourceIds,
      dto.query,
      dto.maxTokens || 2000,
    );

    return {
      success: true,
      data: fused,
    };
  }

  @Get('nlp/stats')
  getNLPStats() {
    const stats = this.contextNlpFusion.getStats();

    return {
      success: true,
      data: stats,
    };
  }
}
