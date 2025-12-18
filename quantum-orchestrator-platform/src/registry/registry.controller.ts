import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger
} from '@nestjs/common';
import { UniversalRegistry } from './UniversalRegistry';
import { BasePlugin, PluginCategory } from './PluginInterface';
import {
  RegisterPluginDto,
  UpdatePluginDto,
  SearchPluginDto,
  ListPluginsDto
} from './dto/plugin.dto';

/**
 * Registry Controller - API endpoints for plugin management
 */
@Controller('api/registry')
export class RegistryController {
  private readonly logger = new Logger(RegistryController.name);

  constructor(private readonly registry: UniversalRegistry) {}

  /**
   * POST /api/registry/plugins - Register plugin
   */
  @Post('plugins')
  @HttpCode(HttpStatus.CREATED)
  async registerPlugin(@Body() dto: RegisterPluginDto) {
    this.logger.log(`Registering plugin: ${dto.name}`);

    // Create a simple plugin instance for basic registration
    class SimplePlugin extends BasePlugin {
      constructor(metadata: any) {
        super(metadata);
      }
    }

    const pluginInstance = new SimplePlugin({
      id: dto.id,
      name: dto.name,
      version: dto.version,
      category: dto.category,
      capabilities: dto.capabilities,
      dependencies: dto.dependencies || [],
      config: dto.config || {}
    });

    const metadata = await this.registry.registerPlugin(
      {
        ...dto,
        dependencies: dto.dependencies || [],
        config: dto.config || {}
      },
      pluginInstance
    );

    return {
      success: true,
      data: metadata
    };
  }

  /**
   * GET /api/registry/plugins - List plugins
   */
  @Get('plugins')
  async listPlugins(@Query() query: ListPluginsDto) {
    this.logger.log('Listing plugins');

    const plugins = await this.registry.listPlugins({
      category: query.category,
      enabled: query.enabled
    });

    return {
      success: true,
      data: plugins,
      count: plugins.length
    };
  }

  /**
   * GET /api/registry/plugins/:id - Get plugin details
   */
  @Get('plugins/:id')
  async getPlugin(@Param('id') id: string) {
    this.logger.log(`Getting plugin: ${id}`);

    const plugin = await this.registry.getPlugin(id);

    return {
      success: true,
      data: plugin
    };
  }

  /**
   * PUT /api/registry/plugins/:id - Update plugin
   */
  @Put('plugins/:id')
  async updatePlugin(
    @Param('id') id: string,
    @Body() dto: UpdatePluginDto
  ) {
    this.logger.log(`Updating plugin: ${id}`);

    const updated = await this.registry.updatePlugin(id, dto);

    return {
      success: true,
      data: updated
    };
  }

  /**
   * DELETE /api/registry/plugins/:id - Unregister plugin
   */
  @Delete('plugins/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unregisterPlugin(@Param('id') id: string) {
    this.logger.log(`Unregistering plugin: ${id}`);

    await this.registry.unregisterPlugin(id);

    return {
      success: true
    };
  }

  /**
   * POST /api/registry/plugins/:id/enable - Enable plugin
   */
  @Post('plugins/:id/enable')
  async enablePlugin(@Param('id') id: string) {
    this.logger.log(`Enabling plugin: ${id}`);

    await this.registry.enablePlugin(id);

    return {
      success: true,
      message: `Plugin ${id} enabled`
    };
  }

  /**
   * POST /api/registry/plugins/:id/disable - Disable plugin
   */
  @Post('plugins/:id/disable')
  async disablePlugin(@Param('id') id: string) {
    this.logger.log(`Disabling plugin: ${id}`);

    await this.registry.disablePlugin(id);

    return {
      success: true,
      message: `Plugin ${id} disabled`
    };
  }

  /**
   * GET /api/registry/plugins/:id/health - Health check
   */
  @Get('plugins/:id/health')
  async healthCheck(@Param('id') id: string) {
    this.logger.log(`Health check for plugin: ${id}`);

    const health = await this.registry.healthCheck(id);

    return {
      success: true,
      data: health
    };
  }

  /**
   * GET /api/registry/categories - List categories
   */
  @Get('categories')
  async listCategories() {
    this.logger.log('Listing categories');

    const categories = await this.registry.listCategories();

    return {
      success: true,
      data: categories
    };
  }

  /**
   * POST /api/registry/search - Search plugins
   */
  @Post('search')
  async searchPlugins(@Body() dto: SearchPluginDto) {
    this.logger.log('Searching plugins');

    const plugins = await this.registry.searchPlugins({
      name: dto.name,
      category: dto.category,
      capabilities: dto.capabilities
    });

    return {
      success: true,
      data: plugins,
      count: plugins.length
    };
  }

  /**
   * GET /api/registry/stats - Get registry statistics
   */
  @Get('stats')
  async getStats() {
    this.logger.log('Getting registry stats');

    const stats = await this.registry.getStats();

    return {
      success: true,
      data: stats
    };
  }
}
