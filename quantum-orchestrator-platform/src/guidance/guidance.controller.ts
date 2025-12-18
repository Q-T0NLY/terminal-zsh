import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GuidanceEngine, GuidanceRequest, GuidanceResponse, GuidanceContext, GuidanceAction } from './GuidanceEngine';
import { GetGuidanceDto, GetRecommendationsDto, ClearHistoryDto } from './dto/guidance.dto';

@ApiTags('guidance')
@Controller('api/guidance')
export class GuidanceController {
  constructor(private readonly guidanceEngine: GuidanceEngine) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get intelligent guidance for a query' })
  @ApiResponse({
    status: 200,
    description: 'Returns intelligent guidance response with actions, links, and automation suggestions',
  })
  async getGuidance(@Body() dto: GetGuidanceDto): Promise<GuidanceResponse> {
    const request: GuidanceRequest = {
      query: dto.query,
      context: dto.context as GuidanceContext,
      intent: dto.intent,
    };

    return await this.guidanceEngine.getGuidance(request);
  }

  @Post('recommendations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get recommended actions based on context' })
  @ApiResponse({
    status: 200,
    description: 'Returns recommended actions based on user context and system state',
  })
  async getRecommendedActions(
    @Body() context: GuidanceContext,
  ): Promise<GuidanceAction[]> {
    return await this.guidanceEngine.getRecommendedActions(context);
  }

  @Post('config-recommendations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get configuration recommendations for a plugin' })
  @ApiResponse({
    status: 200,
    description: 'Returns configuration recommendations and warnings',
  })
  async getConfigRecommendations(
    @Body() dto: GetRecommendationsDto,
  ): Promise<{
    recommendations: Array<{ field: string; value: any; reason: string }>;
    warnings: string[];
  }> {
    return await this.guidanceEngine.getConfigRecommendations(
      dto.pluginId,
      dto.currentConfig,
    );
  }

  @Delete('history/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear conversation history for a user' })
  @ApiResponse({
    status: 204,
    description: 'Conversation history cleared successfully',
  })
  async clearHistory(@Param('userId') userId: string): Promise<void> {
    this.guidanceEngine.clearHistory(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get guidance system statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns system statistics including conversation count and knowledge base size',
  })
  async getStats(): Promise<{
    totalConversations: number;
    knowledgeBaseSize: number;
    xaiConfigured: boolean;
  }> {
    return this.guidanceEngine.getStats();
  }
}
