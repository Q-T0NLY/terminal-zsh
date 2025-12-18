import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ServiceRegistry } from './ServiceRegistry';
import { ServiceMesh } from './ServiceMesh';
import { MeshTopology } from './MeshTopology';
import { RegisterServiceDto, InvokeServiceDto } from './dto/service.dto';

/**
 * Mesh Controller - API endpoints for service mesh management
 */
@Controller('api/mesh')
export class MeshController {
  private readonly logger = new Logger(MeshController.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistry,
    private readonly serviceMesh: ServiceMesh,
    private readonly meshTopology: MeshTopology,
  ) {}

  /**
   * POST /api/mesh/services - Register service
   */
  @Post('services')
  @HttpCode(HttpStatus.CREATED)
  async registerService(@Body() dto: RegisterServiceDto) {
    this.logger.log(`Registering service: ${dto.name}`);

    const metadata = await this.serviceRegistry.register({
      ...dto,
      endpoints: dto.endpoints || [],
      dependencies: dto.dependencies || [],
    });

    return {
      success: true,
      data: metadata,
    };
  }

  /**
   * GET /api/mesh/services - List services
   */
  @Get('services')
  async listServices() {
    this.logger.log('Listing services');

    const services = await this.serviceRegistry.getAll();

    return {
      success: true,
      data: services,
      count: services.length,
    };
  }

  /**
   * GET /api/mesh/services/:id - Get service details
   */
  @Get('services/:id')
  async getService(@Param('id') id: string) {
    this.logger.log(`Getting service: ${id}`);

    const service = await this.serviceRegistry.discover(id);

    return {
      success: true,
      data: service,
    };
  }

  /**
   * GET /api/mesh/services/:id/health - Service health check
   */
  @Get('services/:id/health')
  async healthCheck(@Param('id') id: string) {
    this.logger.log(`Health check for service: ${id}`);

    const service = await this.serviceRegistry.healthCheck(id);

    return {
      success: true,
      data: service.health,
    };
  }

  /**
   * POST /api/mesh/services/:id/invoke - Invoke service
   */
  @Post('services/:id/invoke')
  async invokeService(
    @Param('id') id: string,
    @Body() dto: InvokeServiceDto,
  ) {
    this.logger.log(`Invoking service: ${id} - ${dto.method} ${dto.endpoint}`);

    const response = await this.serviceMesh.invoke(id, {
      method: dto.method,
      endpoint: dto.endpoint,
      body: dto.body,
      headers: dto.headers,
      timeout: dto.timeout,
    });

    return {
      success: response.success,
      data: response,
    };
  }

  /**
   * GET /api/mesh/topology - Get mesh topology
   */
  @Get('topology')
  async getTopology() {
    this.logger.log('Getting mesh topology');

    const topology = await this.meshTopology.getTopology();

    return {
      success: true,
      data: topology,
    };
  }

  /**
   * GET /api/mesh/topology/:id/dependencies - Get dependency graph
   */
  @Get('topology/:id/dependencies')
  async getDependencyGraph(@Param('id') id: string) {
    this.logger.log(`Getting dependency graph for: ${id}`);

    const graph = await this.meshTopology.getDependencyGraph(id);

    return {
      success: true,
      data: graph,
    };
  }

  /**
   * GET /api/mesh/metrics - Get mesh metrics
   */
  @Get('metrics')
  async getMetrics() {
    this.logger.log('Getting mesh metrics');

    const topologyMetrics = await this.meshTopology.getMetrics();
    const meshStats = this.serviceMesh.getStats();

    return {
      success: true,
      data: {
        ...topologyMetrics,
        ...meshStats,
      },
    };
  }

  /**
   * GET /api/mesh/logs - Get request logs
   */
  @Get('logs')
  async getRequestLogs() {
    this.logger.log('Getting request logs');

    const logs = this.serviceMesh.getRequestLogs();

    return {
      success: true,
      data: logs,
      count: logs.length,
    };
  }
}
