import { Injectable, Logger } from '@nestjs/common';
import { ServiceRegistry } from './ServiceRegistry';
import { MeshTopology, TopologyNode, TopologyEdge, ServiceStatus } from './MeshInterface';
import { UniversalRegistry } from '../registry/UniversalRegistry';

/**
 * Mesh Topology - Topology management and visualization
 */
@Injectable()
export class MeshTopology {
  private readonly logger = new Logger(MeshTopology.name);

  constructor(
    private readonly serviceRegistry: ServiceRegistry,
    private readonly pluginRegistry: UniversalRegistry,
  ) {}

  /**
   * Get current mesh topology
   */
  async getTopology(): Promise<MeshTopology> {
    const startTime = Date.now();

    try {
      const nodes: TopologyNode[] = [];
      const edges: TopologyEdge[] = [];

      // Get all services
      const services = await this.serviceRegistry.getAll();

      // Add service nodes
      for (const service of services) {
        nodes.push({
          id: service.id,
          name: service.name,
          type: 'service',
          status: service.health.status,
          metadata: {
            version: service.version,
            protocol: service.protocol,
            host: service.host,
            port: service.port,
            rateLimit: service.rateLimit,
          },
        });

        // Add dependency edges
        for (const dep of service.dependencies) {
          edges.push({
            source: service.id,
            target: dep,
            type: 'depends_on',
          });
        }
      }

      // Get all plugins
      const plugins = await this.pluginRegistry.listPlugins();

      // Add plugin nodes
      for (const plugin of plugins) {
        nodes.push({
          id: plugin.id,
          name: plugin.name,
          type: 'plugin',
          status: plugin.enabled ? ServiceStatus.HEALTHY : ServiceStatus.OFFLINE,
          metadata: {
            version: plugin.version,
            category: plugin.category,
            capabilities: plugin.capabilities,
          },
        });

        // Add dependency edges
        for (const dep of plugin.dependencies) {
          edges.push({
            source: plugin.id,
            target: dep,
            type: 'depends_on',
          });
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Generated topology with ${nodes.length} nodes and ${edges.length} edges in ${duration}ms`);

      return {
        nodes,
        edges,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to generate topology:', error);
      throw error;
    }
  }

  /**
   * Get dependency graph for a specific service or plugin
   */
  async getDependencyGraph(id: string): Promise<{
    node: TopologyNode;
    dependencies: TopologyNode[];
    dependents: TopologyNode[];
  }> {
    try {
      const topology = await this.getTopology();

      // Find the node
      const node = topology.nodes.find((n) => n.id === id);
      if (!node) {
        throw new Error(`Node ${id} not found`);
      }

      // Find dependencies (nodes that this node depends on)
      const dependencyEdges = topology.edges.filter(
        (e) => e.source === id && e.type === 'depends_on',
      );
      const dependencies = dependencyEdges
        .map((e) => topology.nodes.find((n) => n.id === e.target))
        .filter((n) => n !== undefined) as TopologyNode[];

      // Find dependents (nodes that depend on this node)
      const dependentEdges = topology.edges.filter(
        (e) => e.target === id && e.type === 'depends_on',
      );
      const dependents = dependentEdges
        .map((e) => topology.nodes.find((n) => n.id === e.source))
        .filter((n) => n !== undefined) as TopologyNode[];

      return {
        node,
        dependencies,
        dependents,
      };
    } catch (error) {
      this.logger.error(`Failed to get dependency graph for ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get service metrics across the mesh
   */
  async getMetrics(): Promise<{
    totalServices: number;
    totalPlugins: number;
    healthyServices: number;
    unhealthyServices: number;
    totalDependencies: number;
  }> {
    try {
      const topology = await this.getTopology();

      const services = topology.nodes.filter((n) => n.type === 'service');
      const plugins = topology.nodes.filter((n) => n.type === 'plugin');

      return {
        totalServices: services.length,
        totalPlugins: plugins.length,
        healthyServices: services.filter((n) => n.status === ServiceStatus.HEALTHY).length,
        unhealthyServices: services.filter((n) => n.status !== ServiceStatus.HEALTHY).length,
        totalDependencies: topology.edges.filter((e) => e.type === 'depends_on').length,
      };
    } catch (error) {
      this.logger.error('Failed to get metrics:', error);
      throw error;
    }
  }

  /**
   * Detect circular dependencies
   */
  async detectCircularDependencies(): Promise<string[][]> {
    try {
      const topology = await this.getTopology();
      const cycles: string[][] = [];
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      const findCycle = (nodeId: string, path: string[]): boolean => {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        path.push(nodeId);

        // Get dependencies
        const dependencies = topology.edges
          .filter((e) => e.source === nodeId && e.type === 'depends_on')
          .map((e) => e.target);

        for (const dep of dependencies) {
          if (!visited.has(dep)) {
            if (findCycle(dep, [...path])) {
              return true;
            }
          } else if (recursionStack.has(dep)) {
            // Cycle detected
            const cycleStart = path.indexOf(dep);
            cycles.push(path.slice(cycleStart));
            return true;
          }
        }

        recursionStack.delete(nodeId);
        return false;
      };

      for (const node of topology.nodes) {
        if (!visited.has(node.id)) {
          findCycle(node.id, []);
        }
      }

      return cycles;
    } catch (error) {
      this.logger.error('Failed to detect circular dependencies:', error);
      throw error;
    }
  }
}
